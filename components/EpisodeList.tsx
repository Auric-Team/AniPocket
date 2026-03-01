'use client';

import { useRouter } from 'next/navigation';
import { Episode } from '@/lib/types';
import { useState, useMemo, useEffect } from 'react';

interface EpisodeListProps {
    episodes: Episode[];
    animeId: string;
    currentEpisodeId?: string;
}

export default function EpisodeList({ episodes, animeId, currentEpisodeId }: EpisodeListProps) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [rangeIndex, setRangeIndex] = useState(0);
    const CHUNK_SIZE = 100;

    const episodeChunks = useMemo(() => {
        const chunks = [];
        for (let i = 0; i < episodes.length; i += CHUNK_SIZE) {
            chunks.push(episodes.slice(i, i + CHUNK_SIZE));
        }
        return chunks;
    }, [episodes]);

    const filteredEpisodes = useMemo(() => {
        if (searchQuery) {
            return episodes.filter(ep =>
                ep.number.toString().includes(searchQuery) ||
                ep.title?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        return episodeChunks[rangeIndex] || [];
    }, [episodes, episodeChunks, rangeIndex, searchQuery]);

    useEffect(() => {
        if (currentEpisodeId && !searchQuery) {
            const index = episodes.findIndex(ep => ep.id === currentEpisodeId);
            if (index !== -1) {
                const newRange = Math.floor(index / CHUNK_SIZE);
                if (newRange !== rangeIndex) setRangeIndex(newRange);
            }
        }
    }, [currentEpisodeId, episodes, rangeIndex, searchQuery]);

    const handleEpisodeSelect = (epId: string, epNum: number) => {
        // Switching back to router.push for SPA premium-ness (no full page reload)
        // We ensure state updates correctly by using the 'key' prop on VideoPlayer in the parent
        const url = `/watch/${animeId}?ep=${encodeURIComponent(epId)}&num=${epNum}`;
        router.push(url, { scroll: false });
    };

    if (episodes.length === 0) return <div className="p-8 text-center text-zinc-500 font-outfit uppercase tracking-widest text-[10px]">No episodes.</div>;

    return (
        <div className="flex flex-col h-full bg-[#0a0a0f]">
            <div className="p-4 space-y-4">
                <div className="relative group">
                    <input
                        type="text"
                        placeholder="Search episode..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#18181b] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-rose-500/50 transition-all placeholder:text-zinc-600"
                    />
                </div>

                {!searchQuery && episodeChunks.length > 1 && (
                    <div className="flex flex-wrap gap-2">
                        {episodeChunks.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setRangeIndex(idx)}
                                className={`px-2.5 py-1 text-[10px] font-black rounded uppercase tracking-tighter transition-all ${
                                    rangeIndex === idx ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'bg-[#18181b] text-zinc-500 hover:text-zinc-300'
                                }`}
                            >
                                {idx * CHUNK_SIZE + 1}-{Math.min((idx + 1) * CHUNK_SIZE, episodes.length)}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pb-20">
                {filteredEpisodes.map((episode) => {
                    const isCurrent = episode.id === currentEpisodeId;
                    return (
                        <button
                            key={episode.id}
                            onClick={() => handleEpisodeSelect(episode.id, episode.number)}
                            className={`w-full flex items-center px-5 py-4 border-l-[3px] transition-all text-left group ${
                                isCurrent ? 'bg-rose-500/10 border-rose-500' : 'border-transparent hover:bg-white/[0.03] hover:border-white/10'
                            }`}
                        >
                            <span className={`text-xs font-black w-10 shrink-0 tracking-tighter ${isCurrent ? 'text-rose-500' : 'text-zinc-600 group-hover:text-zinc-400'}`}>
                                {episode.number.toString().padStart(2, '0')}
                            </span>
                            <span className={`text-[13px] font-bold truncate ${isCurrent ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'}`}>
                                {episode.title || `Episode ${episode.number}`}
                            </span>
                            {episode.isFiller && (
                                <span className="ml-auto text-[8px] font-black bg-zinc-800 text-rose-500 px-1.5 py-0.5 rounded uppercase tracking-widest">Filler</span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
