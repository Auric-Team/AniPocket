import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import * as cheerio from 'cheerio';

// Embedded Animelok API Logic
const BASE_URL = "https://animelok.site";
const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

async function fetchHtml(url: string, retries = 3): Promise<string> {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, {
                headers: {
                    "User-Agent": USER_AGENT,
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
                    "Referer": BASE_URL,
                    "Origin": BASE_URL,
                },
                signal: AbortSignal.timeout(30000),
            });
            if (response.ok) return await response.text();
        } catch (error) {
            if (i < retries - 1) await new Promise(r => setTimeout(r, 1000));
        }
    }
    throw new Error("Failed to fetch HTML");
}

async function fetchApi(url: string): Promise<any> {
    try {
        const response = await fetch(url, {
            headers: {
                "User-Agent": USER_AGENT,
                "Accept": "application/json, text/plain, */*",
                "Referer": BASE_URL,
                "Origin": BASE_URL,
                "X-Requested-With": "XMLHttpRequest",
            },
            signal: AbortSignal.timeout(15000),
        });
        if (!response.ok) return null;
        const text = await response.text();
        if (!text.trim().startsWith("{")) {
            const firstBrace = text.indexOf('{');
            const lastBrace = text.lastIndexOf('}');
            if (firstBrace !== -1 && lastBrace !== -1) {
                return JSON.parse(text.substring(firstBrace, lastBrace + 1));
            }
        }
        return JSON.parse(text);
    } catch {
        return null;
    }
}

async function searchAnimelok(query: string): Promise<string | null> {
    try {
        const html = await fetchHtml(`${BASE_URL}/search?keyword=${encodeURIComponent(query)}`);
        const $ = cheerio.load(html);
        const firstLink = $("a[href^='/anime/']").first();
        const url = firstLink.attr("href");
        if (url) {
            return url.split("/").pop() || null;
        }
    } catch (e) {
        console.error("Animelok search failed", e);
    }
    return null;
}

export async function GET(req: NextRequest) {
    const title = req.nextUrl.searchParams.get('title');
    const ep = req.nextUrl.searchParams.get('ep') || '1';
    
    if (!title) return NextResponse.json({ error: 'Missing title' }, { status: 400 });

    // Step 1: Find the slug natively on Animelok
    let slug = await searchAnimelok(title);

    // Step 2: Fallback to Gemini AI prediction if native search fails
    if (!slug) {
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Predict the animelok.site slug for the anime "${title}". Animelok slugs are usually lowercase, hyphenated, and sometimes include the anilist id at the end, but predicting just the name part is fine if you don't know the id. For example, 'naruto-shippuden'. Only output the slug, nothing else.`,
            });
            slug = response.text?.trim() || null;
            
            // Validate the guessed slug actually exists by checking search again with it
            if (slug) {
                 const queryFallback = slug.replace(/-/g, " ");
                 const realSlug = await searchAnimelok(queryFallback);
                 if (realSlug) slug = realSlug;
            }
        } catch (e) {
            console.error("Gemini failed", e);
        }
    }

    if (!slug) return NextResponse.json({ error: 'Could not find anime' }, { status: 404 });

    // Step 3: Fetch episode servers
    try {
        let apiData = await fetchApi(`${BASE_URL}/api/anime/${slug}/episodes/${ep}`);
        
        if (!apiData || !apiData.episode) return NextResponse.json({ error: 'No episode found' }, { status: 404 });

        let rawServers = apiData.episode.servers || [];
        
        if (typeof rawServers === 'string') {
            try {
                const firstBrace = rawServers.indexOf('[');
                const lastBrace = rawServers.lastIndexOf(']');
                if (firstBrace !== -1 && lastBrace !== -1) {
                    rawServers = JSON.parse(rawServers.substring(firstBrace, lastBrace + 1));
                } else {
                    rawServers = [];
                }
            } catch {
                rawServers = [];
            }
        }

        // If no servers found natively, force a dub check
        if (rawServers.length === 0) {
            const dubData = await fetchApi(`${BASE_URL}/api/anime/${slug}/episodes/${ep}?lang=dub`);
            rawServers = dubData?.episode?.servers || [];
            if (typeof rawServers === 'string') {
                try {
                    const firstBrace = rawServers.indexOf('[');
                    const lastBrace = rawServers.lastIndexOf(']');
                    if (firstBrace !== -1 && lastBrace !== -1) {
                        rawServers = JSON.parse(rawServers.substring(firstBrace, lastBrace + 1));
                    }
                } catch { rawServers = []; }
            }
        }

        // Step 4: Parse servers
        const parsedServers = rawServers.map((s: any) => {
            let language = s.languages?.[0] || s.language || "";
            const langCode = s.langCode || "";

            if (langCode.includes("HIN") || s.name?.toLowerCase().includes("cloud") || s.tip?.toLowerCase().includes("cloud")) {
                language = "Hindi";
            }
            if (!language || language.trim() === "") language = "Other";

            let url = s.url;
            let isM3U8 = s.isM3U8 || (typeof url === "string" && url.toLowerCase().includes(".m3u8"));

            if (typeof url === 'string' && url.trim().startsWith('[')) {
                try {
                    const jsonUrl = JSON.parse(url);
                    if (Array.isArray(jsonUrl) && jsonUrl.length > 0) {
                        url = jsonUrl[0].url || url;
                        isM3U8 = true;
                    }
                } catch (e) {}
            }

            return {
                name: s.name,
                url: url,
                language: language,
                tip: s.tip,
                isM3U8: isM3U8
            };
        }).filter((s: any) => s.url);

        // Step 5: Filter for Multi / Hindi
        // Strictly prioritize "Multi" server (which contains Hindi) and avoid "Abyess"
        let selectedServer = parsedServers.find((s: any) => 
            s.name?.toLowerCase() === "multi" || s.tip?.toLowerCase() === "multi"
        );

        // Fallback to any Hindi server that is NOT Abyess
        if (!selectedServer) {
            selectedServer = parsedServers.find((s: any) => 
                s.language?.toLowerCase().includes("hindi") && !s.tip?.toLowerCase().includes("abyess")
            );
        }

        // Ultimate fallback
        if (!selectedServer) {
             selectedServer = parsedServers.find((s: any) => s.language?.toLowerCase().includes("hindi"));
        }

        if (!selectedServer && parsedServers.length > 0) {
            selectedServer = parsedServers[0];
        }

        if (!selectedServer || !selectedServer.url) {
             return NextResponse.json({ error: 'No valid server url found' }, { status: 404 });
        }

        return NextResponse.json({ url: selectedServer.url, isM3U8: selectedServer.isM3U8 });
    } catch (e) {
        console.error("Animelok scrape failed", e);
        return NextResponse.json({ error: 'Failed to fetch episode data', details: String(e) }, { status: 500 });
    }
}