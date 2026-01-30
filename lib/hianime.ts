// HiAnime.to data provider - 100% realtime data via proxy
import axios from 'axios';
import * as cheerio from 'cheerio';
import { Anime, AnimeDetails, Episode } from './types';

// Proxy configuration - use ?url= format
const PROXY_BASE = 'https://proxy.animo.qzz.io';
const HIANIME_URL = 'https://hianime.to';

// Helper to create proxied URL
function proxyUrl(path: string): string {
    return `${PROXY_BASE}/?url=${encodeURIComponent(`${HIANIME_URL}${path}`)}`;
}

// Create axios client
const client = axios.create({
    timeout: 30000, // 30 seconds for proxy
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
});

// Get trending anime from homepage - REAL DATA
export async function getTrendingAnime(): Promise<Anime[]> {
    console.log('[AniPocket] Fetching trending from HiAnime via proxy...');

    const { data } = await client.get(proxyUrl('/home'));
    const $ = cheerio.load(data);
    const anime: Anime[] = [];

    // Parse all anime from the page
    $('.film_list-wrap .flw-item').each((_, el) => {
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

    console.log(`[AniPocket] Found ${anime.length} anime`);
    return anime.slice(0, 24);
}

// Search anime - REAL DATA  
export async function searchAnimeFromSite(query: string): Promise<Anime[]> {
    console.log(`[AniPocket] Searching for: ${query}`);

    const { data } = await client.get(proxyUrl(`/search?keyword=${encodeURIComponent(query)}`));
    const $ = cheerio.load(data);
    const anime: Anime[] = [];

    $('.film_list-wrap .flw-item').each((_, el) => {
        const $el = $(el);
        const $link = $el.find('.film-poster a').first();
        const $img = $el.find('.film-poster img').first();
        const href = $link.attr('href') || '';
        const id = href.split('/').pop()?.split('?')[0] || '';

        if (id) {
            anime.push({
                id,
                title: $link.attr('title') || $img.attr('alt') || 'Unknown',
                image: $img.attr('data-src') || $img.attr('src') || '',
                type: $el.find('.fdi-type').text().trim() || 'TV',
                episodes: {
                    sub: parseInt($el.find('.tick-sub').text()) || undefined,
                    dub: parseInt($el.find('.tick-dub').text()) || undefined,
                },
            });
        }
    });

    console.log(`[AniPocket] Found ${anime.length} results`);
    return anime;
}

// Get anime details with REAL episode list
export async function getAnimeDetails(animeId: string): Promise<AnimeDetails | null> {
    console.log(`[AniPocket] Getting details for: ${animeId}`);

    // Get anime info page
    const { data: pageData } = await client.get(proxyUrl(`/${animeId}`));
    const $ = cheerio.load(pageData);

    const title = $('.anisc-detail .film-name').text().trim() ||
        $('h2.film-name').text().trim() || 'Unknown';
    const image = $('.film-poster img').attr('src') || '';
    const synopsis = $('.film-description .text').text().trim() || '';

    // Get genres
    const genres: string[] = [];
    $('.item-list a[href*="/genre/"]').each((_, el) => {
        genres.push($(el).text().trim());
    });

    // Get status
    const statusText = $('.item-list').text();
    const status = statusText.includes('Airing') ? 'Ongoing' : 'Completed';

    // Get sub/dub counts
    const subCount = parseInt($('.film-stats .tick .tick-item.tick-sub').text().trim()) || 0;
    const dubCount = parseInt($('.film-stats .tick .tick-item.tick-dub').text().trim()) || 0;

    // Get data-id for episode AJAX call
    const dataId = $('[data-id]').first().attr('data-id') ||
        $('.film-buttons a[data-id]').attr('data-id') || '';

    console.log(`[AniPocket] Found data-id: ${dataId}`);

    // Fetch episodes via AJAX
    let episodes: Episode[] = [];

    if (dataId) {
        const ajaxUrl = `${PROXY_BASE}/?url=${encodeURIComponent(`${HIANIME_URL}/ajax/v2/episode/list/${dataId}`)}`;
        const { data: epData } = await client.get(ajaxUrl);

        // Parse the HTML from AJAX response
        const epHtml = typeof epData === 'string' ? epData : epData.html || '';
        const $eps = cheerio.load(epHtml);

        $eps('.ep-item, a.ep-item').each((_, el) => {
            const $ep = $eps(el);
            const epId = $ep.attr('data-id') || $ep.attr('href')?.match(/ep=(\d+)/)?.[1] || '';
            const epNum = parseInt($ep.attr('data-number') || $ep.text().trim() || '0');
            const epTitle = $ep.attr('title') || `Episode ${epNum}`;
            const isFiller = $ep.hasClass('ssl-item-filler');

            if (epId && epNum > 0) {
                episodes.push({
                    id: epId,
                    number: epNum,
                    title: epTitle,
                    isFiller,
                });
            }
        });

        // Sort episodes
        episodes.sort((a, b) => a.number - b.number);
    }

    console.log(`[AniPocket] Found ${episodes.length} episodes`);

    return {
        id: animeId,
        title,
        image,
        synopsis,
        genres,
        status,
        type: 'TV',
        episodeList: episodes,
        episodes: {
            sub: subCount,
            dub: dubCount,
        },
        totalEpisodes: episodes.length,
    };
}
