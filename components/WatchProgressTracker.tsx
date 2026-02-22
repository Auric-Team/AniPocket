'use client';

import { useEffect } from 'react';
import { useWatchHistory } from '@/hooks/useWatchHistory';

interface Props {
    animeId: string;
    animeTitle: string;
    animeImage: string;
    episodeId: string;
    episodeNumber: number;
}

export default function WatchProgressTracker({ animeId, animeTitle, animeImage, episodeId, episodeNumber }: Props) {
    const { addToHistory } = useWatchHistory();

    useEffect(() => {
        if (animeId && episodeId) {
            addToHistory({
                id: animeId,
                title: animeTitle,
                image: animeImage,
                episodeId,
                episodeNumber
            });
        }
    }, [animeId, episodeId, animeTitle, animeImage, episodeNumber, addToHistory]);

    return null; // This is purely logical, no UI
}
