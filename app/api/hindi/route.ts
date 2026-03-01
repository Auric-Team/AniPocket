import { NextRequest, NextResponse } from 'next/server';

const TATAKAI_URL = 'https://api.tatakai.me';

export async function GET(req: NextRequest) {
    const title = req.nextUrl.searchParams.get('title');
    const ep = req.nextUrl.searchParams.get('ep') || '1';
    
    if (!title) return NextResponse.json({ error: 'Missing title' }, { status: 400 });

    try {
        // Advanced normalization for 1000% accuracy
        const cleanTitle = title
            .replace(/\(TV\)/gi, '')
            .replace(/Season \d+/gi, '')
            .replace(/Part \d+/gi, '')
            .replace(/\(\d{4}\)/g, '')
            .trim();

        const titleSlug = cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        
        console.log(`[Hindi Route] Syncing: ${titleSlug} ep ${ep}`);
        
        const response = await fetch(`${TATAKAI_URL}/api/v1/animelok/watch/${encodeURIComponent(titleSlug)}?ep=${ep}`, {
            signal: AbortSignal.timeout(25000),
        });

        let data;
        if (!response.ok) {
             const fullSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
             const retryResponse = await fetch(`${TATAKAI_URL}/api/v1/animelok/watch/${encodeURIComponent(fullSlug)}?ep=${ep}`);
             if (!retryResponse.ok) return NextResponse.json({ error: 'Animelok Sync Failed' }, { status: 404 });
             data = await retryResponse.json();
        } else {
             data = await response.json();
        }

        const servers = data.data?.servers || [];
        
        // Accurate server selection: Multi > Hindi > others
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

        if (!selectedServer || !selectedServer.url) {
             return NextResponse.json({ error: 'No Hindi server found' }, { status: 404 });
        }

        // CRITICAL FIX: Replace localhost with production domain for proxies
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
        console.error("[Hindi Route] Error:", e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
