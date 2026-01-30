'use client';

import Link from 'next/link';
import { Episode } from '@/lib/types';

interface EpisodeListProps {
    episodes: Episode[];
    animeId: string;
    currentEpisodeId?: string;
}

export default function EpisodeList({ episodes, animeId, currentEpisodeId }: EpisodeListProps) {
    if (episodes.length === 0) {
        return (
            <div className="text-center py-8 text-[var(--text-muted)]">
                No episodes available
            </div>
        );
    }

    // Group episodes into ranges for better navigation
    const EPISODES_PER_PAGE = 50;
    const totalPages = Math.ceil(episodes.length / EPISODES_PER_PAGE);

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[var(--text-primary)]">
                    Episodes
                </h3>
                <span className="text-sm text-[var(--text-muted)]">
                    {episodes.length} total
                </span>
            </div>

            {/* Episode Grid */}
            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-1.5">
                {episodes.map((episode) => {
                    const isCurrent = episode.id === currentEpisodeId;

                    return (
                        <Link
                            key={episode.id}
                            href={`/watch/${animeId}?ep=${episode.id}&num=${episode.number}`}
                            className={`
                flex items-center justify-center py-2.5 rounded text-sm font-medium transition-colors
                ${isCurrent
                                    ? 'bg-[var(--accent)] text-white'
                                    : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-white border border-[var(--border)]'
                                }
                ${episode.isFiller ? 'opacity-60' : ''}
              `}
                            title={episode.title}
                        >
                            {episode.number}
                        </Link>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-4 text-xs text-[var(--text-muted)]">
                <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-[var(--accent)]" />
                    Current
                </span>
                {episodes.some(ep => ep.isFiller) && (
                    <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded bg-[var(--bg-card)] opacity-60 border border-[var(--border)]" />
                        Filler
                    </span>
                )}
            </div>
        </div>
    );
}
