import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const url = req.nextUrl.searchParams.get('url');
    if (!url) return NextResponse.json({ error: 'Missing url' }, { status: 400 });

    try {
        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Referer": "https://animelok.site/",
                "Origin": "https://animelok.site"
            }
        });

        if (!response.ok) {
            console.warn(`[Proxy] Fetch failed with status ${response.status} for ${url}`);
        }

        const body = await response.arrayBuffer();
        const contentType = response.headers.get("Content-Type") || (url.endsWith(".m3u8") ? "application/vnd.apple.mpegurl" : "video/mp2t");

        return new NextResponse(body, {
            status: response.status,
            headers: {
                "Content-Type": contentType,
                "Access-Control-Allow-Origin": "*",
                "Cache-Control": "public, max-age=3600"
            }
        });
    } catch (e) {
        console.error(`[Proxy] Error for ${url}:`, e);
        return NextResponse.json({ error: 'Proxy failed', details: String(e) }, { status: 500 });
    }
}