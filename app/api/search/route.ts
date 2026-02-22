import { NextRequest, NextResponse } from 'next/server';
import { searchAnime } from '@/lib/hianime';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query) {
        return NextResponse.json({ error: 'Missing query parameter' }, { status: 400 });
    }

    try {
        const results = await searchAnime(query);
        return NextResponse.json(results);
    } catch (error) {
        console.error('API Search Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
