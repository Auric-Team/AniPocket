import { useState, useEffect } from 'react';

export interface WatchHistoryItem {
    id: string; // anime id
    title: string;
    image: string;
    episodeId: string;
    episodeNumber: number;
    timestamp: number;
}

export function useWatchHistory() {
    const [history, setHistory] = useState<WatchHistoryItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('anipocket_watch_history');
        if (stored) {
            try {
                setTimeout(() => setHistory(JSON.parse(stored)), 0);
            } catch (error) {
                console.error('Failed to parse watch history');
            }
        }
        setTimeout(() => setIsLoaded(true), 0);
    }, []);

    const addToHistory = (item: Omit<WatchHistoryItem, 'timestamp'>) => {
        setHistory(prev => {
            const filtered = prev.filter(h => h.id !== item.id);
            const newHistory = [{ ...item, timestamp: Date.now() }, ...filtered].slice(0, 20); // Keep last 20 shows
            localStorage.setItem('anipocket_watch_history', JSON.stringify(newHistory));
            return newHistory;
        });
    };

    const removeFromHistory = (id: string) => {
        setHistory(prev => {
            const newHistory = prev.filter(h => h.id !== id);
            localStorage.setItem('anipocket_watch_history', JSON.stringify(newHistory));
            return newHistory;
        });
    };

    return { history, isLoaded, addToHistory, removeFromHistory };
}
