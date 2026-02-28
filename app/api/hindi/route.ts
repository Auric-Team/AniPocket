import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const TATAKAI_API_BASE = "http://localhost:4000/api/v1/animelok";

export async function GET(req: NextRequest) {
    const title = req.nextUrl.searchParams.get('title');
    const ep = req.nextUrl.searchParams.get('ep') || '1';
    
    if (!title) return NextResponse.json({ error: 'Missing title' }, { status: 400 });

    let slug: string | null = null;

    try {
        const searchRes = await fetch(`${TATAKAI_API_BASE}/search?q=${encodeURIComponent(title)}`);
        if (searchRes.ok) {
            const searchData = await searchRes.json();
            if (searchData?.data?.animes && searchData.data.animes.length > 0) {
                slug = searchData.data.animes[0].id;
            }
        }
    } catch (e) {
        console.error("Tatakai search failed", e);
    }

    if (!slug) {
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Predict the animelok.site slug for the anime "${title}". Animelok slugs are usually lowercase, hyphenated, and sometimes include the anilist id at the end, but predicting just the name part is fine if you don't know the id. For example, 'naruto-shippuden'. Only output the slug, nothing else.`,
            });
            slug = response.text?.trim() || null;
        } catch (e) {
            console.error("Gemini failed", e);
        }
    }

    if (!slug) return NextResponse.json({ error: 'Could not find anime' }, { status: 404 });

    try {
        const watchRes = await fetch(`${TATAKAI_API_BASE}/watch/${slug}?ep=${ep}`);
        if (!watchRes.ok) {
             return NextResponse.json({ error: 'Episode request failed' }, { status: watchRes.status });
        }
        const watchData = await watchRes.json();

        if (!watchData?.data?.servers || watchData.data.servers.length === 0) {
             return NextResponse.json({ error: 'No servers found' }, { status: 404 });
        }

        const servers = watchData.data.servers;
        
        // Strictly prioritize "Multi" server (which contains Hindi) and avoid "Abyess"
        let selectedServer = servers.find((s: any) => 
            s.name?.toLowerCase() === "multi" || s.tip?.toLowerCase() === "multi"
        );

        // Fallback to any Hindi server that is NOT Abyess
        if (!selectedServer) {
            selectedServer = servers.find((s: any) => 
                s.language?.toLowerCase().includes("hindi") && !s.tip?.toLowerCase().includes("abyess")
            );
        }

        // Ultimate fallback to whatever Hindi server is available
        if (!selectedServer) {
             selectedServer = servers.find((s: any) => s.language?.toLowerCase().includes("hindi"));
        }

        if (!selectedServer && servers.length > 0) {
            selectedServer = servers[0];
        }

        if (!selectedServer || !selectedServer.url) {
             return NextResponse.json({ error: 'No valid server url found' }, { status: 404 });
        }

        // Return the exact URL from Animelok without any proxying or M3U8 overrides
        return NextResponse.json({ url: selectedServer.url, isM3U8: selectedServer.isM3U8 });
    } catch (e) {
        console.error("Tatakai watch failed", e);
        return NextResponse.json({ error: 'Failed to fetch episode data', details: String(e) }, { status: 500 });
    }
}