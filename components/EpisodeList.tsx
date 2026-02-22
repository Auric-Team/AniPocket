'use client';

import Link from 'next/link';
import { Episode } from '@/lib/types';
import { useState, useMemo, useEffect } from 'react';

interface EpisodeListProps {
    episodes: Episode[];
    animeId: string;
    currentEpisodeId?: string;
}

export default function EpisodeList({ episodes, animeId, currentEpisodeId }: EpisodeListProps) {
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

    // Filter episodes if searching
    const filteredEpisodes = useMemo(() => {
        if (!searchQuery) return episodeChunks[rangeIndex];
        return episodes.filter(ep =>
            ep.number.toString().includes(searchQuery) ||
            ep.title?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [episodes, episodeChunks, rangeIndex, searchQuery]);

    useEffect(() => {
        if (currentEpisodeId && !searchQuery) {
            const index = episodes.findIndex(ep => ep.id === currentEpisodeId);
            if (index !== -1) {
                const newRange = Math.floor(index / CHUNK_SIZE);
                if (newRange !== rangeIndex) {
                    setTimeout(() => setRangeIndex(newRange), 0);
                }
            }
        }
    }, [currentEpisodeId, episodes, rangeIndex, searchQuery]);

    if (episodes.length === 0) {
        return (
            <div className="text-center py-8 text-[#aaaaaa] text-sm">
                No episodes available
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-[#242428]">
            <div className="flex flex-col gap-3 mb-2 p-3 bg-[#1e1e24] shadow-sm">
                {/* Search - HiAnime Style Exact */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Number of Ep"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#111] border-none rounded px-3 py-2 text-sm text-[white] outline-none placeholder-[#666]"
                    />
                    <svg className="w-4 h-4 absolute right-3 top-2.5 text-[#666]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

                {/* Range Selector */}
                {!searchQuery && episodeChunks.length > 1 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {episodeChunks.map((_, idx) => {
                            const start = idx * CHUNK_SIZE + 1;
                            const end = Math.min((idx + 1) * CHUNK_SIZE, episodes.length);
                            return (
                                <button
                                    key={idx}
                                    onClick={() => setRangeIndex(idx)}
                                    className={`px-3 py-1.5 text-xs font-semibold tracking-wide rounded transition-colors ${rangeIndex === idx
                                        ? 'bg-white text-black'
                                        : 'bg-[#3b3b42] text-white hover:bg-white hover:text-black'
                                        }`}
                                >
                                    EPS: {start.toString().padStart(3, '0')}-{end.toString().padStart(3, '0')}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Episode List - Scrolling Dense Vertical rows */}
            <div className="flex-1 overflow-y-auto w-full custom-scrollbar pb-4">
                <div className="flex flex-col">
                    {filteredEpisodes?.map((episode, idx) => {
                        const isCurrent = episode.id === currentEpisodeId;
                        const isEven = idx % 2 === 0;

                        return (
                            <Link
                                key={episode.id}
                                href={`/watch/${animeId}?ep=${episode.id}&num=${episode.number}`}
                                className={`
                                    w-full flex items-center px-4 py-2 hover:bg-[#ffffff14] transition-colors
                                    ${isCurrent ? 'bg-[#ffffff14] text-[var(--accent)] border-l-2 border-[var(--accent)]' : 'text-[#aaaaaa] border-l-2 border-transparent'}
                                    ${!isCurrent && isEven ? 'bg-[#2b2b31]' : ''}
                                `}
                                title={episode.title}
                            >
                                <span className="text-[14px] font-bold w-12 shrink-0">
                                    {episode.number}
                                </span>
                                <span className={`text-[13px] font-medium truncate w-full ${isCurrent ? 'text-white' : 'text-[#f9f9f9] group-hover:text-white'}`}>
                                    {episode.title || `Episode ${episode.number}`}
                                </span>
                            </Link>
                        );
                    })}
                </div>

                {filteredEpisodes && filteredEpisodes.length === 0 && (
                    <div className="text-center py-8 text-[#888] text-sm">
                        No episodes found.
                    </div>
                )}
            </div>
        </div>
    );
}