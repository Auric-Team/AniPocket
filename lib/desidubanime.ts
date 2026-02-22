import axios from 'axios';
import * as cheerio from 'cheerio';

const DESIDUB_URL = 'https://www.desidubanime.me';
const PROXY_BASE = 'https://cors.eu.org';

const client = axios.create({
    timeout: 15000,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
});

function proxyUrl(path: string): string {
    return `${PROXY_BASE}/${DESIDUB_URL}${path}`;
}

export interface DesiDubResult {
    title: string;
    slug: string;
    url: string;
}

export async function searchDesiDub(query: string): Promise<DesiDubResult[]> {
    try {
        const searchQuery = query
            .toLowerCase()
            .replace(/season\s*\d+/gi, '')
            .replace(/part\s*\d+/gi, '')
            .replace(/[^a-z0-9\s]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

        console.log(`[DesiDub] Searching for: ${searchQuery}`);
        
        const { data } = await client.get(proxyUrl(`/search/${encodeURIComponent(searchQuery)}/`));
        const $ = cheerio.load(data);
        const results: DesiDubResult[] = [];

        $('.anime-list .anime-item, .post-item, article, .grid-item').each((_, el) => {
            const $el = $(el);
            const $link = $el.find('a').first();
            const href = $link.attr('href') || '';
            const title = $link.attr('title') || $link.text().trim() || $el.find('.title, .anime-title').text().trim();
            
            if (href && title) {
                let slug = '';
                if (href.includes('/anime/')) {
                    slug = href.split('/anime/')[1]?.replace(/\/$/, '') || '';
                } else {
                    slug = href.split('/').filter(Boolean).pop() || '';
                }
                
                if (slug) {
                    results.push({
                        title,
                        slug,
                        url: href.startsWith('http') ? href : `${DESIDUB_URL}${href}`,
                    });
                }
            }
        });

        if (results.length === 0) {
            $('a[href*="/anime/"]').each((_, el) => {
                const $link = $(el);
                const href = $link.attr('href') || '';
                const title = $link.text().trim();
                
                if (href && title && !href.includes('/tag/') && !href.includes('/genre/')) {
                    const slug = href.split('/anime/')[1]?.replace(/\/$/, '') || '';
                    if (slug && !results.find(r => r.slug === slug)) {
                        results.push({
                            title,
                            slug,
                            url: href.startsWith('http') ? href : `${DESIDUB_URL}${href}`,
                        });
                    }
                }
            });
        }

        console.log(`[DesiDub] Found ${results.length} results`);
        return results;
    } catch (error) {
        console.error('[DesiDub] Search error:', error);
        return [];
    }
}

export async function getDesiDubEpisodeUrl(animeTitle: string, episodeNumber: number): Promise<string | null> {
    try {
        const results = await searchDesiDub(animeTitle);
        
        if (results.length === 0) {
            console.log('[DesiDub] No results found');
            return null;
        }

        const normalizedTitle = animeTitle.toLowerCase().replace(/[^a-z0-9]/g, '');
        
        const bestMatch = results.find(r => {
            const normalizedResult = r.title.toLowerCase().replace(/[^a-z0-9]/g, '');
            return normalizedResult.includes(normalizedTitle) || normalizedTitle.includes(normalizedResult);
        }) || results[0];

        console.log(`[DesiDub] Best match: ${bestMatch.title} (${bestMatch.slug})`);

        const episodeUrl = `${DESIDUB_URL}/anime/${bestMatch.slug}/episode-${episodeNumber}/`;
        console.log(`[DesiDub] Episode URL: ${episodeUrl}`);
        
        return episodeUrl;
    } catch (error) {
        console.error('[DesiDub] Error getting episode URL:', error);
        return null;
    }
}

export async function getDesiDubEmbedUrl(animeTitle: string, episodeNumber: number): Promise<string> {
    const directUrl = await getDesiDubEpisodeUrl(animeTitle, episodeNumber);
    
    if (directUrl) {
        return `${PROXY_BASE}/${directUrl}`;
    }
    
    const searchSlug = animeTitle
        .toLowerCase()
        .replace(/season\s*\d+/gi, '')
        .replace(/part\s*\d+/gi, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

    return `${PROXY_BASE}/${DESIDUB_URL}/anime/${searchSlug}/episode-${episodeNumber}/`;
}

export function getDesiDubDirectEmbed(animeTitle: string, episodeNumber: number): string {
    const cleanTitle = animeTitle
        .toLowerCase()
        .replace(/season\s*\d+/gi, '')
        .replace(/part\s*\d+/gi, '')
        .replace(/the\s+/gi, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .trim();

    return `https://www.desidubanime.me/anime/${cleanTitle}/episode-${episodeNumber}/`;
}
