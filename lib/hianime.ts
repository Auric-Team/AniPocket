// HiAnime.to data provider - 100% realtime data via proxy
import axios from 'axios';
import * as cheerio from 'cheerio';
import { Anime, AnimeDetails, Episode } from './types';

// Proxy configuration
const PROXY_BASE = 'https://vercel-proxy-kappa-nine.vercel.app';
const HIANIME_URL = 'https://hianime.to';

// Helper to create proxied URL
function proxyUrl(path: string): string {
    return `${PROXY_BASE}/?url=${encodeURIComponent(`${HIANIME_URL}${path}`)}`;
}

// Helper to convert any HiAnime image URL to a 300x400 poster
function toPosterUrl(url: string): string {
    if (!url) return '';
    // Replace any dimension pattern (e.g., 1366x768, 1920x1080) with 300x400
    return url.replace(/\/thumbnail\/\d+x\d+\//, '/thumbnail/300x400/');
}

// Create axios client
const client = axios.create({
    timeout: 30000,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
});

// Helper to parse standard anime items (Grid view)
function parseAnimeItems($: cheerio.CheerioAPI, selector: string): Anime[] {
    const anime: Anime[] = [];
    $(selector).each((_, el) => {
        const $el = $(el);
        const $link = $el.find('.film-poster a').first();
        const $img = $el.find('.film-poster img').first();
        const href = $link.attr('href') || '';
        const id = href.split('/').pop()?.split('?')[0] || '';

        if (id && !anime.find(a => a.id === id)) {
            anime.push({
                id,
                title: $link.attr('title') || $img.attr('alt') || $el.find('.film-name').text().trim() || 'Unknown',
                image: $img.attr('data-src') || $img.attr('src') || '',
                type: $el.find('.fdi-type').text().trim() || 'TV',
                episodes: {
                    sub: parseInt($el.find('.tick-sub').text()) || undefined,
                    dub: parseInt($el.find('.tick-dub').text()) || undefined,
                },
            });
        }
    });
    return anime;
}

// 1. Spotlight (Hero Slider)
export async function getSpotlightAnime(): Promise<Anime[]> {
    try {
        console.log('[AniPocket] Fetching Spotlight...');
        const { data } = await client.get(proxyUrl('/home'));
        const $ = cheerio.load(data);
        const anime: Anime[] = [];

        $('#slider .swiper-slide').each((_, el) => {
            const $el = $(el);
            const $content = $el.find('.deslide-item-content');
            const $img = $el.find('.film-poster-img');

            const watchLink = $content.find('.desi-buttons a').last().attr('href');
            const id = watchLink?.split('/').pop()?.split('?')[0] || '';

            if (id) {
                const subText = $content.find('.tick-sub').text().trim();
                const dubText = $content.find('.tick-dub').text().trim();
                const bannerImage = $img.attr('data-src') || $img.attr('src') || '';

                // Use robust regex replacer
                const posterImage = toPosterUrl(bannerImage);

                anime.push({
                    id,
                    title: $content.find('.desi-head-title').text().trim(),
                    image: bannerImage,
                    poster: posterImage,
                    synopsis: $content.find('.desi-description').text().trim(),
                    type: $content.find('.scd-item').first().text().trim() || 'TV',
                    episodes: {
                        sub: parseInt(subText) || undefined,
                        dub: parseInt(dubText) || undefined,
                    },
                });
            }
        });
        return anime;
    } catch (error) {
        console.error('[AniPocket] Error fetching spotlight:', error);
        return [];
    }
}

// 2. Trending (Ranked List #trending-home)
export async function getTrendingAnime(): Promise<Anime[]> {
    try {
        console.log('[AniPocket] Fetching Trending...');
        const { data } = await client.get(proxyUrl('/home'));
        const $ = cheerio.load(data);
        const anime: Anime[] = [];

        $('#trending-home .swiper-slide').each((i, el) => {
            const $el = $(el);

            // FIX: The anchor tag IS the .film-poster element, not a child of it
            let $link = $el.find('.film-poster');
            if ($link.length === 0 || !$link.is('a')) {
                // Fallback: try finding 'a' inside if structure changes
                $link = $el.find('.film-poster a');
            }

            const $img = $el.find('img'); // Just find any img inside

            const id = $link.attr('href')?.split('/').pop()?.split('?')[0] || '';

            const rank = parseInt($el.find('.number span').text().trim()) || i + 1;
            const title = $el.find('.film-title').text().trim() || $el.find('.dynamic-name').text().trim();
            const image = $img.attr('data-src') || $img.attr('src') || '';

            if (id) {
                anime.push({
                    id,
                    title,
                    image,
                    rank: rank,
                    type: 'TV'
                });
            }
        });

        console.log(`[AniPocket] Found ${anime.length} trending items`);
        return anime;
    } catch (error) {
        console.error('[AniPocket] Error fetching trending:', error);
        return [];
    }
}

// 3. Latest Episodes
export async function getLatestEpisodeAnime(): Promise<Anime[]> {
    try {
        console.log('[AniPocket] Fetching Latest Episodes...');
        const { data } = await client.get(proxyUrl('/home'));
        const $ = cheerio.load(data);
        return parseAnimeItems($, '.film_list-wrap .flw-item').slice(0, 24);
    } catch (error) {
        return [];
    }
}

// 4. Top Airing
export async function getTopAiringAnime(): Promise<Anime[]> {
    try {
        console.log('[AniPocket] Fetching Top Airing...');
        const { data } = await client.get(proxyUrl('/top-airing'));
        const $ = cheerio.load(data);
        return parseAnimeItems($, '.film_list-wrap .flw-item');
    } catch (error) {
        return [];
    }
}

// 5. Most Popular
export async function getMostPopularAnime(): Promise<Anime[]> {
    try {
        console.log('[AniPocket] Fetching Most Popular...');
        const { data } = await client.get(proxyUrl('/most-popular'));
        const $ = cheerio.load(data);
        return parseAnimeItems($, '.film_list-wrap .flw-item');
    } catch (error) {
        return [];
    }
}

// 6. Most Favorite
export async function getMostFavoriteAnime(): Promise<Anime[]> {
    try {
        console.log('[AniPocket] Fetching Most Favorite...');
        const { data } = await client.get(proxyUrl('/most-favorite'));
        const $ = cheerio.load(data);
        return parseAnimeItems($, '.film_list-wrap .flw-item');
    } catch (error) {
        return [];
    }
}

// 7. Latest Completed
export async function getLatestCompletedAnime(): Promise<Anime[]> {
    try {
        console.log('[AniPocket] Fetching Latest Completed...');
        const { data } = await client.get(proxyUrl('/completed'));
        const $ = cheerio.load(data);
        return parseAnimeItems($, '.film_list-wrap .flw-item');
    } catch (error) {
        return [];
    }
}

// Generic: Get anime by category
export async function getAnimeByCategory(category: string): Promise<Anime[]> {
    try {
        const path = category.startsWith('/') ? category : `/${category}`;
        console.log(`[AniPocket] Fetching category: ${path}`);
        const { data } = await client.get(proxyUrl(path));
        const $ = cheerio.load(data);
        return parseAnimeItems($, '.film_list-wrap .flw-item');
    } catch (error) {
        console.error(`[AniPocket] Error fetching category ${category}:`, error);
        return [];
    }
}

// Search anime
export async function searchAnimeFromSite(query: string): Promise<Anime[]> {
    try {
        console.log(`[AniPocket] Searching for: ${query}`);
        const { data } = await client.get(proxyUrl(`/search?keyword=${encodeURIComponent(query)}`));
        const $ = cheerio.load(data);
        return parseAnimeItems($, '.film_list-wrap .flw-item');
    } catch (error) {
        return [];
    }
}

// Get anime details
export async function getAnimeDetails(animeId: string): Promise<AnimeDetails | null> {
    try {
        console.log(`[AniPocket] Getting details for: ${animeId}`);
        const { data: pageData } = await client.get(proxyUrl(`/${animeId}`));
        const $ = cheerio.load(pageData);

        const title = $('.anisc-detail .film-name').text().trim() || $('h2.film-name').text().trim() || 'Unknown';
        const image = $('.film-poster img').attr('src') || '';
        const synopsis = $('.film-description .text').text().trim() || '';

        const genres: string[] = [];
        // FIX: Wrap push in curly braces to avoid returning number
        $('.item-list a[href*="/genre/"]').each((_, el) => {
            genres.push($(el).text().trim());
        });

        const statusText = $('.item-list').text();
        const status = statusText.includes('Airing') ? 'Ongoing' : 'Completed';

        const subCount = parseInt($('.film-stats .tick .tick-item.tick-sub').text().trim()) || 0;
        const dubCount = parseInt($('.film-stats .tick .tick-item.tick-dub').text().trim()) || 0;

        const dataId = $('[data-id]').first().attr('data-id') || $('.film-buttons a[data-id]').attr('data-id') || '';

        let episodes: Episode[] = [];
        if (dataId) {
            const ajaxUrl = `${PROXY_BASE}/?url=${encodeURIComponent(`${HIANIME_URL}/ajax/v2/episode/list/${dataId}`)}`;
            const { data: epData } = await client.get(ajaxUrl);
            const epHtml = typeof epData === 'string' ? epData : epData.html || '';
            const $eps = cheerio.load(epHtml);

            $eps('.ep-item, a.ep-item').each((_, el) => {
                const $ep = $eps(el);
                const epId = $ep.attr('data-id') || $ep.attr('href')?.match(/ep=(\d+)/)?.[1] || '';
                const epNum = parseInt($ep.attr('data-number') || $ep.text().trim() || '0');
                const epTitle = $ep.attr('title') || `Episode ${epNum}`;
                const isFiller = $ep.hasClass('ssl-item-filler');

                if (epId && epNum > 0) {
                    episodes.push({ id: epId, number: epNum, title: epTitle, isFiller });
                }
            });
            episodes.sort((a, b) => a.number - b.number);
        }

        return {
            id: animeId,
            title,
            image,
            synopsis,
            genres,
            status,
            type: 'TV',
            episodeList: episodes,
            episodes: { sub: subCount, dub: dubCount },
            totalEpisodes: episodes.length,
        };
    } catch (error) {
        console.error('[AniPocket] Error fetching details:', error);
        return null;
    }
}

// Check episode server availability
export async function getEpisodeServers(episodeId: string): Promise<{ sub: boolean; dub: boolean }> {
    try {
        const ajaxUrl = `${PROXY_BASE}/?url=${encodeURIComponent(`${HIANIME_URL}/ajax/v2/episode/servers?episodeId=${episodeId}`)}`;
        const { data } = await client.get(ajaxUrl);
        const html = typeof data === 'string' ? data : data.html || '';
        const $ = cheerio.load(html);

        const sub = $('.item.server-item[data-type="sub"]').length > 0;
        const dub = $('.item.server-item[data-type="dub"]').length > 0;

        return { sub, dub };
    } catch (error) {
        console.error('[AniPocket] Error fetching servers:', error);
        return { sub: false, dub: false };
    }
}
