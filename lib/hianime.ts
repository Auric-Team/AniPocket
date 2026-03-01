import { Anime, AnimeDetails, Episode, AdvancedSearchFilters, PageResult } from './types';

const API_BASE = 'https://api.tatakai.me/api/v1/hianime';

function mapAnime(item: any): Anime {
    if (!item) return {} as Anime;
    
    // The API structure varies between home, search, and category
    const stats = item.stats || {};
    const episodes = item.episodes || stats.episodes || {};

    return {
        id: item.id || item.animeId || '',
        title: item.name || item.title || 'Unknown',
        image: item.poster || item.image || '',
        type: item.type || 'TV',
        episodes: {
            sub: parseInt(episodes.sub) || 0,
            dub: parseInt(episodes.dub) || 0,
        },
        synopsis: item.description || item.synopsis || '',
        rank: item.rank,
    };
}

export async function getSpotlightAnime(): Promise<Anime[]> {
    try {
        const res = await fetch(`${API_BASE}/home`, { next: { revalidate: 3600 } });
        const data = await res.json();
        return data.data?.spotlightAnimes?.map(mapAnime) || [];
    } catch (error) { return []; }
}

export async function getTrendingAnime(): Promise<Anime[]> {
    try {
        const res = await fetch(`${API_BASE}/home`, { next: { revalidate: 3600 } });
        const data = await res.json();
        return data.data?.trendingAnimes?.map(mapAnime) || [];
    } catch (error) { return []; }
}

export async function getLatestEpisodeAnime(): Promise<Anime[]> {
    try {
        const res = await fetch(`${API_BASE}/home`, { next: { revalidate: 3600 } });
        const data = await res.json();
        return data.data?.latestEpisodeAnimes?.map(mapAnime) || [];
    } catch (error) { return []; }
}

export async function getTopAiringAnime(): Promise<Anime[]> {
    try {
        const res = await fetch(`${API_BASE}/home`, { next: { revalidate: 3600 } });
        const data = await res.json();
        return data.data?.topAiringAnimes?.map(mapAnime) || [];
    } catch (error) { return []; }
}

export async function getMostPopularAnime(): Promise<Anime[]> {
    try {
        const res = await fetch(`${API_BASE}/category/most-popular`, { next: { revalidate: 3600 } });
        const data = await res.json();
        return data.data?.animes?.map(mapAnime) || [];
    } catch (error) { return []; }
}

export async function getMostFavoriteAnime(): Promise<Anime[]> {
    try {
        const res = await fetch(`${API_BASE}/category/most-favorite`, { next: { revalidate: 3600 } });
        const data = await res.json();
        return data.data?.animes?.map(mapAnime) || [];
    } catch (error) { return []; }
}

export async function getLatestCompletedAnime(): Promise<Anime[]> {
    try {
        const res = await fetch(`${API_BASE}/category/completed`, { next: { revalidate: 3600 } });
        const data = await res.json();
        return data.data?.animes?.map(mapAnime) || [];
    } catch (error) { return []; }
}

export async function searchAnime(query: string): Promise<Anime[]> {
    try {
        const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        return data.data?.animes?.map(mapAnime) || [];
    } catch (error) { return []; }
}

export async function getAdvancedSearchAnime(filters: AdvancedSearchFilters): Promise<PageResult<Anime>> {
    try {
        const queryParams = new URLSearchParams();
        if (filters.keyword) queryParams.append('q', filters.keyword);
        if (filters.type) queryParams.append('type', filters.type);
        if (filters.status) queryParams.append('status', filters.status);
        if (filters.sort) queryParams.append('sort', filters.sort);
        if (filters.genres) queryParams.append('genres', filters.genres);
        if (filters.page) queryParams.append('page', filters.page.toString());

        const res = await fetch(`${API_BASE}/search?${queryParams.toString()}`);
        const data = await res.json();
        
        return {
            animes: data.data?.animes?.map(mapAnime) || [],
            totalPages: data.data?.totalPages || 1,
            hasNextPage: data.data?.hasNextPage || false,
            currentPage: data.data?.currentPage || filters.page || 1
        };
    } catch (error) {
        return { animes: [], totalPages: 1, hasNextPage: false, currentPage: filters.page || 1 };
    }
}

export async function getAnimeDetails(animeId: string): Promise<AnimeDetails | null> {
    try {
        const fetchWithRetry = async (url: string) => {
            const res = await fetch(url, { cache: 'no-store' });
            return await res.json();
        };

        let infoData = await fetchWithRetry(`${API_BASE}/anime/${animeId}`);
        
        // Smart ID Recovery Logic for Glitched Links
        if (infoData.status === 404 || !infoData.data?.anime) {
             const cleanName = animeId.split('-').filter(s => isNaN(Number(s))).join(' ');
             const searchRes = await fetch(`${API_BASE}/search?q=${encodeURIComponent(cleanName || animeId)}`);
             const searchData = await searchRes.json();
             
             if (searchData.data?.animes?.length > 0) {
                 const bestMatch = searchData.data.animes[0].id;
                 infoData = await fetchWithRetry(`${API_BASE}/anime/${bestMatch}`);
                 animeId = bestMatch;
             }
        }

        const epData = await fetchWithRetry(`${API_BASE}/anime/${animeId}/episodes`);

        if (infoData.status !== 200 || !infoData.data?.anime) return null;

        const info = infoData.data.anime.info;
        const moreInfo = infoData.data.anime.moreInfo;
        const stats = info.stats || {};
        const episodes = epData.data?.episodes?.map((ep: any) => ({
            id: ep.episodeId,
            number: ep.number,
            title: ep.title,
            isFiller: ep.isFiller
        })) || [];

        return {
            id: info.id || animeId,
            title: info.name,
            image: info.poster,
            synopsis: info.description,
            genres: moreInfo.genres || [],
            status: moreInfo.status,
            type: moreInfo.type,
            episodeList: episodes,
            episodes: {
                sub: parseInt(stats.episodes?.sub) || 0,
                dub: parseInt(stats.episodes?.dub) || 0
            },
            totalEpisodes: episodes.length,
        };
    } catch (error) {
        console.error('[HiAnime Error]', error);
        return null;
    }
}

export async function getEpisodeServers(episodeId: string): Promise<{ sub: boolean; dub: boolean; hindi: boolean }> {
    try {
        const res = await fetch(`${API_BASE}/episode/servers?animeEpisodeId=${encodeURIComponent(episodeId)}`, { cache: 'no-store' });
        const data = await res.json();
        
        if (data.status !== 200 || !data.data) {
             return { sub: true, dub: true, hindi: true }; // Assume true to avoid disabling buttons on glitch
        }
        
        return {
            sub: data.data.sub?.length > 0,
            dub: data.data.dub?.length > 0,
            hindi: true
        };
    } catch (error) {
        return { sub: true, dub: true, hindi: true };
    }
}
