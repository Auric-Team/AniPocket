import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const episodeId = request.nextUrl.searchParams.get('episodeId');
    const type = (request.nextUrl.searchParams.get('type') || 'sub') as 'sub' | 'dub';

    if (!episodeId) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    try {
        // Extract the numeric part (data-id) from the Tatakai episodeId
        // Example: "one-piece-100?ep=107149" -> "107149"
        const match = episodeId.match(/[?&]ep=(\d+)/);
        const numericId = match ? match[1] : episodeId;
        
        console.log(`[Source] Redirecting Zoro: ${numericId} (${type})`);

        // Use the most stable embed provider for Zoro/HiAnime content
        // This handles sub/dub and servers perfectly
        const embedUrl = `https://megaplay.buzz/stream/s-2/${numericId}/${type}?autoplay=1`;
        
        return NextResponse.redirect(embedUrl);
    } catch (e) {
        return NextResponse.redirect(`https://megaplay.buzz/stream/s-2/${episodeId}/${type}?autoplay=1`);
    }
}
