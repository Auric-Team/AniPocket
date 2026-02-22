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
        
        return `https://letsembed.cc/embed/anime/?id=${slug}/${episodeNumber}?al=hindi&autoplay=1`;
    }
    
    return `https://letsembed.cc/embed/anime/${episodeId}?al=hindi&autoplay=1`;
}

export function extractEpisodeId(url: string): string | null {
    const match = url.match(/[?&]ep=(\d+)/);
    return match ? match[1] : null;
}

export const HINDI_SOURCES = {
    letsembed: (slug: string, ep: number) => `https://letsembed.cc/embed/anime/?id=${slug}/${ep}?al=hindi&autoplay=1`,
    vidsrc: (id: string, ep: number) => `https://vidsrc.xyz/embed/anime/${id}/${ep}?al=hindi&autoplay=1`,
    izarime: (slug: string, ep: number) => `https://2embed.org/embed/anime/${slug}/${ep}?server=hindi&autoplay=1`,
};
