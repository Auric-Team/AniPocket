'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Anime } from '@/lib/types';
import { useRef } from 'react';

interface TrendingListProps {
    animeList: Anime[];
}

export default function TrendingList({ animeList }: TrendingListProps) {
    const listRef = useRef<HTMLDivElement>(null);

    // Scroll helper
    const scroll = (direction: 'left' | 'right') => {
        if (listRef.current) {
            const scrollAmount = direction === 'left' ? -300 : 300;
            listRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    if (!animeList || animeList.length === 0) return null;

    return (
        <div className="w-full relative">
            <div className="flex items-center justify-between mb-4 px-4 md:px-2">
                <h2 className="text-xl font-bold text-white tracking-wide">
                    Trending
                </h2>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => scroll('left')}
                        className="w-8 h-8 rounded bg-[#1e1e24] hover:text-[var(--accent)] flex items-center justify-center text-[#aaaaaa] transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="w-8 h-8 rounded bg-[#1e1e24] hover:text-[var(--accent)] flex items-center justify-center text-[#aaaaaa] transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>
            </div>

            <div className="relative group">
                {/* Horizontal Scroll Container */}
                <div
                    ref={listRef}
                    className="flex overflow-x-auto gap-4 pb-6 pt-2 px-4 md:px-0 scrollbar-hide snap-x"
                >
                    {animeList.map((anime, index) => (
                        <Link
                            key={anime.id}
                            href={`/watch/${anime.id}`}
                            className="relative flex-shrink-0 w-[180px] lg:w-[220px] snap-start hover:opacity-80 transition-opacity"
                        >
                            {/* HiAnime specific Trending Layout: Large number overlapping a landscape poster */}
                            <div className="flex items-end">
                                <div className="text-4xl md:text-5xl lg:text-7xl font-bold text-transparent mr-2 md:mr-3 transform translate-y-1 lg:translate-y-2 opacity-50 transition-all font-mono"
                                    style={{ WebkitTextStroke: '2px var(--accent)' }}>
                                    {(index + 1).toString().padStart(2, '0')}
                                </div>

                                <div className="flex-1 flex flex-col gap-2">
                                    <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-[#242428]">
                                        <Image
                                            src={anime.image}
                                            alt={anime.title}
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    </div>
                                    <h3 className="text-[13px] font-semibold text-[#f9f9f9] line-clamp-2 leading-tight">
                                        {anime.title}
                                    </h3>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
