import { Anime, AnimeDetails, Episode, AdvancedSearchFilters, PageResult } from './types';

const API_BASE = 'https://api.tatakai.me/api/v1/hianime';

function mapAnime(item: any): Anime {
    if (!item) return {} as Anime;
    return {
        id: item.id || item.animeId || '',
        title: item.name || item.title || 'Unknown',
        image: item.poster || item.image || '',
        type: item.type || 'TV',
        episodes: {
            sub: item.episodes?.sub || (item.stats?.episodes?.sub !== undefined ? parseInt(item.stats.episodes.sub) : undefined),
            dub: item.episodes?.dub || (item.stats?.episodes?.dub !== undefined ? parseInt(item.stats.episodes.dub) : undefined),
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

export async function getAnimeByCategory(category: string): Promise<Anime[]> {
    try {
        const res = await fetch(`${API_BASE}/category/${category.replace(/^\//, '')}`, { next: { revalidate: 3600 } });
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
        const [infoRes, epRes] = await Promise.all([
            fetch(`${API_BASE}/anime/${animeId}`, { cache: 'no-store' }),
            fetch(`${API_BASE}/anime/${animeId}/episodes`, { cache: 'no-store' })
        ]);

        const infoJson = await infoRes.json();
        const epJson = await epRes.json();

        if (infoJson.status !== 200 || !infoJson.data?.anime) return null;

        const info = infoJson.data.anime.info;
        const moreInfo = infoJson.data.anime.moreInfo;
        const episodes = epJson.data?.episodes?.map((ep: any) => ({
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
                sub: parseInt(info.stats?.episodes?.sub) || 0,
                dub: parseInt(info.stats?.episodes?.dub) || 0
            },
            totalEpisodes: episodes.length,
        };
    } catch (error) { return null; }
}

export async function getEpisodeServers(episodeId: string): Promise<{ sub: boolean; dub: boolean; hindi: boolean }> {
    try {
        const res = await fetch(`${API_BASE}/episode/servers?animeEpisodeId=${encodeURIComponent(episodeId)}`, { cache: 'no-store' });
        const data = await res.json();
        if (data.status !== 200 || !data.data) return { sub: true, dub: false, hindi: true };
        return {
            sub: data.data.sub?.length > 0,
            dub: data.data.dub?.length > 0,
            hindi: true
        };
    } catch (error) { return { sub: true, dub: false, hindi: true }; }
}
