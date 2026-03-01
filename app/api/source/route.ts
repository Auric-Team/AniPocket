import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const episodeId = request.nextUrl.searchParams.get('episodeId');
    const type = (request.nextUrl.searchParams.get('type') || 'sub') as 'sub' | 'dub';

    if (!episodeId) return NextResponse.json({ error: 'Missing episodeId' }, { status: 400 });

    try {
        // We use megaplay.buzz which is a reliable wrapper for HiAnime/Zoro streams.
        // It provides the best UI and handles multiple servers/subtitles internally.
        const embedUrl = `https://megaplay.buzz/stream/s-2/${encodeURIComponent(episodeId)}/${type}?autoplay=1`;
        return NextResponse.redirect(embedUrl);
    } catch (e) {
        return NextResponse.redirect(`https://megaplay.buzz/stream/s-2/${episodeId}/${type}?autoplay=1`);
    }
}
