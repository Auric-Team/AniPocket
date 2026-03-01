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

    // Split episodes into chunks of 100
    const episodeChunks = useMemo(() => {
        const chunks = [];
        for (let i = 0; i < episodes.length; i += CHUNK_SIZE) {
            chunks.push(episodes.slice(i, i + CHUNK_SIZE));
        }
        return chunks;
    }, [episodes]);

    // Filtered list based on search or chunk
    const filteredEpisodes = useMemo(() => {
        if (searchQuery) {
            return episodes.filter(ep =>
                ep.number.toString().includes(searchQuery) ||
                ep.title?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        return episodeChunks[rangeIndex] || [];
    }, [episodes, episodeChunks, rangeIndex, searchQuery]);

    // Auto-select correct range based on current episode
    useEffect(() => {
        if (currentEpisodeId && !searchQuery) {
            const index = episodes.findIndex(ep => ep.id === currentEpisodeId);
            if (index !== -1) {
                const newRange = Math.floor(index / CHUNK_SIZE);
                if (newRange !== rangeIndex) setRangeIndex(newRange);
            }
        }
    }, [currentEpisodeId, episodes, rangeIndex, searchQuery]);

    const handleEpisodeClick = (epId: string, epNum: number) => {
        // Robust navigation using router.push to ensure URL updates correctly
        const url = `/watch/${animeId}?ep=${encodeURIComponent(epId)}&num=${epNum}`;
        router.push(url, { scroll: false });
    };

    if (episodes.length === 0) {
        return (
            <div className="text-center py-12 text-[#aaaaaa] text-sm font-medium">
                No episodes found for this series.
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-[#0a0a0f]">
            <div className="p-4 bg-[#13131c] space-y-4 shadow-xl relative z-20">
                {/* Search Box */}
                <div className="relative group">
                    <input
                        type="text"
                        placeholder="Jump to episode..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#1c1c28] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#f43f5e]/50 focus:bg-[#1c1c28] transition-all placeholder-[#555]"
                    />
                    <svg className="w-4 h-4 absolute right-4 top-3 text-[#555] group-focus-within:text-[#f43f5e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

                {/* Range Selector */}
                {!searchQuery && episodeChunks.length > 1 && (
                    <div className="flex flex-wrap gap-2">
                        {episodeChunks.map((_, idx) => {
                            const start = idx * CHUNK_SIZE + 1;
                            const end = Math.min((idx + 1) * CHUNK_SIZE, episodes.length);
                            const isActive = rangeIndex === idx;
                            return (
                                <button
                                    key={idx}
                                    onClick={() => setRangeIndex(idx)}
                                    className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all ${
                                        isActive ? 'bg-[#f43f5e] text-white shadow-lg shadow-rose-500/20' : 'bg-[#1c1c28] text-[#aaaaaa] hover:text-white border border-white/5'
                                    }`}
                                >
                                    {start}-{end}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Episode List Scrollable Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pb-6">
                <div className="flex flex-col">
                    {filteredEpisodes.map((episode, idx) => {
                        const isCurrent = episode.id === currentEpisodeId;
                        const isEven = idx % 2 === 0;

                        return (
                            <button
                                key={episode.id}
                                onClick={() => handleEpisodeClick(episode.id, episode.number)}
                                className={`
                                    w-full flex items-center px-5 py-3 hover:bg-white/5 transition-all text-left group
                                    ${isCurrent ? 'bg-[#f43f5e]/10 border-l-4 border-[#f43f5e]' : 'border-l-4 border-transparent'}
                                    ${!isCurrent && isEven ? 'bg-[#13131c]/30' : ''}
                                `}
                            >
                                <span className={`text-sm font-bold w-12 shrink-0 ${isCurrent ? 'text-[#f43f5e]' : 'text-[#555]'}`}>
                                    {episode.number.toString().padStart(2, '0')}
                                </span>
                                <span className={`text-[13px] font-medium truncate flex-1 ${isCurrent ? 'text-white' : 'text-[#aaaaaa] group-hover:text-white'}`}>
                                    {episode.title || `Episode ${episode.number}`}
                                </span>
                                {episode.isFiller && (
                                    <span className="text-[9px] font-bold bg-[#3b3b42] text-[#f43f5e] px-1.5 py-0.5 rounded ml-2">FILLER</span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {filteredEpisodes.length === 0 && (
                    <div className="text-center py-20 opacity-30">
                        <svg className="w-12 h-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <p className="text-sm">No episodes found</p>
                    </div>
                )}
            </div>
        </div>
    );
}
