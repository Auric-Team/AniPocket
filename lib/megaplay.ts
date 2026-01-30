// MegaPlay.buzz video embed URL generator

/**
 * Generate megaplay.buzz embed URL for an episode
 * @param episodeId - The hianime episode ID (from ?ep= parameter)
 * @param language - 'sub' for subtitles, 'dub' for dubbed
 */
export function getEmbedUrl(episodeId: string, language: 'sub' | 'dub' = 'sub'): string {
    return `https://megaplay.buzz/stream/s-2/${episodeId}/${language}?autoplay=1`;
}

/**
 * Extract episode ID from a hianime URL
 * Example: https://hianime.do/watch/jujutsu-kaisen-20401?ep=162345 → 162345
 */
export function extractEpisodeId(url: string): string | null {
    const match = url.match(/[?&]ep=(\d+)/);
    return match ? match[1] : null;
}
