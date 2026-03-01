import axios from 'axios';
import { Anime, AnimeDetails, Episode, AdvancedSearchFilters, PageResult } from './types';

const API_BASE = 'https://api.tatakai.me/api/v1/hianime';

const client = axios.create({
    timeout: 30000,
});

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
        const { data } = await client.get(`${API_BASE}/home`);
        if (data.status !== 200 || !data.data?.spotlightAnimes) return [];
        return data.data.spotlightAnimes.map(mapAnime);
    } catch (error) {
        console.error('[AniPocket] Error fetching spotlight:', error);
        return [];
    }
}

export async function getTrendingAnime(): Promise<Anime[]> {
    try {
        const { data } = await client.get(`${API_BASE}/home`);
        if (data.status !== 200 || !data.data?.trendingAnimes) return [];
        return data.data.trendingAnimes.map(mapAnime);
    } catch (error) {
        console.error('[AniPocket] Error fetching trending:', error);
        return [];
    }
}

export async function getLatestEpisodeAnime(): Promise<Anime[]> {
    try {
        const { data } = await client.get(`${API_BASE}/home`);
        if (data.status !== 200 || !data.data?.latestEpisodeAnimes) return [];
        return data.data.latestEpisodeAnimes.map(mapAnime);
    } catch (error) {
        return [];
    }
}

export async function getTopAiringAnime(): Promise<Anime[]> {
    try {
        const { data } = await client.get(`${API_BASE}/home`);
        if (data.status !== 200 || !data.data?.topAiringAnimes) return [];
        return data.data.topAiringAnimes.map(mapAnime);
    } catch (error) {
        return [];
    }
}

export async function getMostPopularAnime(): Promise<Anime[]> {
    try {
        const { data } = await client.get(`${API_BASE}/category/most-popular`);
        if (data.status !== 200 || !data.data?.animes) return [];
        return data.data.animes.map(mapAnime);
    } catch (error) {
        return [];
    }
}

export async function getMostFavoriteAnime(): Promise<Anime[]> {
    try {
        const { data } = await client.get(`${API_BASE}/category/most-favorite`);
        if (data.status !== 200 || !data.data?.animes) return [];
        return data.data.animes.map(mapAnime);
    } catch (error) {
        return [];
    }
}

export async function getLatestCompletedAnime(): Promise<Anime[]> {
    try {
        const { data } = await client.get(`${API_BASE}/category/completed`);
        if (data.status !== 200 || !data.data?.animes) return [];
        return data.data.animes.map(mapAnime);
    } catch (error) {
        return [];
    }
}

export async function getAnimeByCategory(category: string): Promise<Anime[]> {
    try {
        const cleanCategory = category.replace(/^\//, '');
        const { data } = await client.get(`${API_BASE}/category/${cleanCategory}`);
        if (data.status !== 200 || !data.data?.animes) return [];
        return data.data.animes.map(mapAnime);
    } catch (error) {
        return [];
    }
}

export async function searchAnime(query: string): Promise<Anime[]> {
    try {
        const { data } = await client.get(`${API_BASE}/search?q=${encodeURIComponent(query)}`);
        if (data.status !== 200 || !data.data?.animes) return [];
        return data.data.animes.map(mapAnime);
    } catch (error) {
        return [];
    }
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

        const { data } = await client.get(`${API_BASE}/search?${queryParams.toString()}`);
        if (data.status !== 200 || !data.data?.animes) {
            return { animes: [], totalPages: 1, hasNextPage: false, currentPage: filters.page || 1 };
        }
        
        return {
            animes: data.data.animes.map(mapAnime),
            totalPages: data.data.totalPages || 1,
            hasNextPage: data.data.hasNextPage || false,
            currentPage: data.data.currentPage || 1
        };
    } catch (error) {
        return { animes: [], totalPages: 1, hasNextPage: false, currentPage: filters.page || 1 };
    }
}

export async function getAnimeDetails(animeId: string): Promise<AnimeDetails | null> {
    try {
        const [infoRes, epRes] = await Promise.all([
            client.get(`${API_BASE}/anime/${animeId}`),
            client.get(`${API_BASE}/anime/${animeId}/episodes`)
        ]);

        if (infoRes.data.status !== 200 || !infoRes.data.data?.anime) return null;

        const info = infoRes.data.data.anime.info;
        const moreInfo = infoRes.data.data.anime.moreInfo;
        const episodes = epRes.data.data?.episodes?.map((ep: any) => ({
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
            genres: moreInfo.genres,
            status: moreInfo.status,
            type: moreInfo.type,
            episodeList: episodes,
            episodes: {
                sub: parseInt(info.stats?.episodes?.sub) || 0,
                dub: parseInt(info.stats?.episodes?.dub) || 0
            },
            totalEpisodes: episodes.length,
        };
    } catch (error) {
        console.error('[AniPocket] Error fetching details:', error);
        return null;
    }
}

export async function getEpisodeServers(episodeId: string): Promise<{ sub: boolean; dub: boolean; hindi: boolean }> {
    try {
        const { data } = await client.get(`${API_BASE}/episode/servers?animeEpisodeId=${encodeURIComponent(episodeId)}`);
        if (data.status !== 200 || !data.data) return { sub: true, dub: false, hindi: true };
        const servers = data.data;
        
        return {
            sub: servers.sub?.length > 0,
            dub: servers.dub?.length > 0,
            hindi: true
        };
    } catch (error) {
        return { sub: true, dub: false, hindi: true };
    }
}
