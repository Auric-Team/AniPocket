// TypeScript interfaces for Anime data

export interface Anime {
    id: string;
    title: string;
    image: string; // Used as banner for spotlight, or poster for others
    poster?: string; // Specific vertical poster (derived from banner for spotlight)
    rank?: number; // Rank for trending list
    type?: string;
    episodes?: {
        sub?: number;
        dub?: number;
    };
    duration?: string;
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

export interface AdvancedSearchFilters {
    keyword?: string;
    type?: string;
    status?: string;
    sort?: string;
    genres?: string;
    page?: number;
}

export interface PageResult<T> {
    animes: T[];
    totalPages: number;
    hasNextPage: boolean;
    currentPage: number;
}