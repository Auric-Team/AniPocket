// TypeScript interfaces for Anime data

export interface Anime {
    id: string;
    title: string;
    image: string;
    type?: string;
    episodes?: {
        sub?: number;
        dub?: number;
    };
    rating?: string;
    synopsis?: string;
    genres?: string[];
    status?: string;
    aired?: string;
}

export interface Episode {
    id: string;
    number: number;
    title: string;
    isFiller?: boolean;
}

export interface AnimeDetails extends Anime {
    episodeList: Episode[];
    totalEpisodes: number;
}

export interface SearchResult {
    results: Anime[];
    hasNextPage: boolean;
    currentPage: number;
}
