import { NextRequest, NextResponse } from 'next/server';

const TATAKAI_URL = 'https://api.tatakai.me';

export async function GET(req: NextRequest) {
    const title = req.nextUrl.searchParams.get('title');
    const ep = req.nextUrl.searchParams.get('ep') || '1';
    
    if (!title) return NextResponse.json({ error: 'Missing title' }, { status: 400 });

    try {
        const cleanTitle = title
            .replace(/\(TV\)/gi, '')
            .replace(/Season \d+/gi, '')
            .replace(/Part \d+/gi, '')
            .replace(/\(\d{4}\)/g, '')
            .trim();

        const titleSlug = cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        
        // 1. Initial attempt with cleaned title
        let response = await fetch(`${TATAKAI_URL}/api/v1/animelok/watch/${encodeURIComponent(titleSlug)}?ep=${ep}`, {
            signal: AbortSignal.timeout(25000),
        });

        let data;
        if (!response.ok) {
             // 2. Fallback with raw title slug
             const fullSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
             response = await fetch(`${TATAKAI_URL}/api/v1/animelok/watch/${encodeURIComponent(fullSlug)}?ep=${ep}`);
             if (!response.ok) return NextResponse.json({ error: 'Sync failed' }, { status: 404 });
        }
        
        data = await response.json();
        const servers = data.data?.servers || [];
        
        // Accurate selection
        let selectedServer = servers.find((s: any) => 
            (s.name?.toLowerCase() === "multi" || s.tip?.toLowerCase() === "multi") && !s.tip?.toLowerCase().includes("abyess")
        );

        if (!selectedServer) {
            selectedServer = servers.find((s: any) => 
                s.language?.toLowerCase().includes("hindi") && !s.tip?.toLowerCase().includes("abyess")
            );
        }

        if (!selectedServer) selectedServer = servers.find((s: any) => s.language?.toLowerCase().includes("hindi"));
        if (!selectedServer && servers.length > 0) selectedServer = servers[0];

        if (!selectedServer || !selectedServer.url) return NextResponse.json({ error: 'Source not found' }, { status: 404 });

        // Correct localhost URLs from hosted API
        let finalUrl = selectedServer.url;
        if (finalUrl.includes('localhost:4000')) {
            finalUrl = finalUrl.replace(/http:\/\/localhost:4000/g, TATAKAI_URL);
        }

        return NextResponse.json({ 
            url: finalUrl, 
            isM3U8: selectedServer.isM3U8,
            title: data.data?.animeTitle || title
        });
    } catch (e) {
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}
