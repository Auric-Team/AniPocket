export function getEmbedUrl(episodeId: string, language: 'sub' | 'dub' | 'hindi' = 'sub', animeTitle?: string, episodeNumber?: number): string {
    if (language === 'hindi') {
        return '';
    }
    
    return `/api/source?episodeId=${episodeId}&type=${language}`;
}
