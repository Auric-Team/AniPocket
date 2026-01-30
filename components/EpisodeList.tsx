'use client';

import Link from 'next/link';
import { Episode } from '@/lib/types';
import { useState, useMemo } from 'react';

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

    if (episodes.length === 0) {
        return (
            <div className="text-center py-8 text-[var(--text-muted)]">
                No episodes available
            </div>
        );
    }

    // Auto-select the correct range based on current episode
    useMemo(() => {
        if (currentEpisodeId && !searchQuery) {
            const index = episodes.findIndex(ep => ep.id === currentEpisodeId);
            if (index !== -1) {
                const newRange = Math.floor(index / CHUNK_SIZE);
                if (newRange !== rangeIndex) {
                    setRangeIndex(newRange);
                }
            }
        }
    }, [currentEpisodeId, episodes, rangeIndex, searchQuery]); // Correct dependencies

    return (
        <div className="flex flex-col h-full">
            <div className="flex flex-col gap-3 mb-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-[var(--text-primary)]">
                        Episodes
                    </h3>
                    <span className="text-xs font-mono text-[var(--text-muted)] bg-[var(--bg-secondary)] px-2 py-1 rounded">
                        {episodes.length} Total
                    </span>
                </div>

                {/* Search */}
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Search episode..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] outline-none transition-colors"
                    />
                    <svg className="w-4 h-4 absolute right-3 top-2.5 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

                {/* Range Selector */}
                {!searchQuery && episodeChunks.length > 1 && (
                    <div className="flex flex-wrap gap-2">
                        {episodeChunks.map((_, idx) => {
                            const start = idx * CHUNK_SIZE + 1;
                            const end = Math.min((idx + 1) * CHUNK_SIZE, episodes.length);
                            return (
                                <button
                                    key={idx}
                                    onClick={() => setRangeIndex(idx)}
                                    className={`px-2 py-1 text-xs font-medium rounded transition-colors border ${
                                        rangeIndex === idx
                                            ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                                            : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--text-muted)]'
                                    }`}
                                >
                                    {start}-{end}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Episode Grid - Scrollable Area */}
            <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[var(--border)] scrollbar-track-transparent custom-scrollbar" style={{ maxHeight: '500px' }}>
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-4 lg:grid-cols-5 gap-2">
                    {filteredEpisodes?.map((episode) => {
                        const isCurrent = episode.id === currentEpisodeId;

                        return (
                            <Link
                                key={episode.id}
                                href={`/watch/${animeId}?ep=${episode.id}&num=${episode.number}`}
                                className={`
                                    group flex flex-col items-center justify-center p-2 rounded text-center transition-all duration-200 border
                                    ${isCurrent
                                        ? 'bg-[var(--accent)] border-[var(--accent)] text-white shadow-[0_0_10px_rgba(99,102,241,0.4)]'
                                        : 'bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:border-[var(--accent)] hover:text-white'
                                    }
                                    ${episode.isFiller ? 'opacity-70 grayscale' : ''}
                                `}
                                title={episode.title}
                            >
                                <span className="text-sm font-bold">{episode.number}</span>
                                <span className="text-[10px] truncate w-full opacity-60 group-hover:opacity-100">
                                    {episode.isFiller ? 'Filler' : 'Ep'}
                                </span>
                            </Link>
                        );
                    })}
                </div>
                
                {filteredEpisodes && filteredEpisodes.length === 0 && (
                    <div className="text-center py-8 text-[var(--text-muted)] text-sm">
                        No episodes found matching "{searchQuery}"
                    </div>
                )}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[var(--border)] text-xs text-[var(--text-muted)]">
                <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                    Playing
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[var(--bg-hover)] border border-[var(--border)]" />
                    Regular
                </span>
                {episodes.some(ep => ep.isFiller) && (
                    <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-gray-500 opacity-50" />
                        Filler
                    </span>
                )}
            </div>
        </div>
    );
}