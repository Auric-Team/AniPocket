// MegaPlay.buzz video embed URL generator
// Supports Sub, Dub via MegaPlay and Hindi via multiple alternative sources

export function getEmbedUrl(episodeId: string, language: 'sub' | 'dub' | 'hindi' = 'sub', animeTitle?: string, episodeNumber?: number): string {
    if (language === 'hindi') {
        return getHindiEmbedUrl(episodeId, animeTitle, episodeNumber);
    }
    return `https://megaplay.buzz/stream/s-2/${episodeId}/${language}?autoplay=1`;
}

function getHindiEmbedUrl(episodeId: string, animeTitle?: string, episodeNumber?: number): string {
    if (animeTitle && episodeNumber) {
        const slug = animeTitle
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
        
        return `https://2embed.org/embed/anime/${slug}/${episodeNumber}?server=hindi`;
    }
    
    return `https://2embed.org/embed/anime/${episodeId}?server=hindi&autoplay=1`;
}

export function getHindiEmbedUrlAlternative(animeTitle: string, episodeNumber: number): string {
    const slug = animeTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    
    return `https://2embed.org/embed/anime/${slug}/${episodeNumber}?server=hindi&autoplay=1`;
}

export function extractEpisodeId(url: string): string | null {
    const match = url.match(/[?&]ep=(\d+)/);
    return match ? match[1] : null;
}

export const HINDI_SOURCES = {
    '2embed': (slug: string, ep: number) => `https://2embed.org/embed/anime/${slug}/${ep}?server=hindi`,
    'vidsrc': (id: string) => `https://vidsrc.xyz/embed/anime/${id}?al=hindi`,
    'autoembed': (slug: string, ep: number) => `https://anime.autoembed.cc/embed/${slug}-episode-${ep}`,
};
