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

    const scroll = (direction: 'left' | 'right') => {
        if (listRef.current) {
            const scrollAmount = direction === 'left' ? -350 : 350;
            listRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    if (!animeList || animeList.length === 0) return null;

    return (
        <div className="w-full relative px-0 md:px-2">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl md:text-2xl font-bold text-zinc-100 tracking-tight flex items-center gap-2 font-outfit">
                    Trending Now
                </h2>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => scroll('left')}
                        className="w-10 h-10 rounded-full bg-[#18181b] hover:bg-[#FFB000] hover:text-[#09090b] flex items-center justify-center text-zinc-100 transition-all duration-300 border border-white/5 shadow-md"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="w-10 h-10 rounded-full bg-[#18181b] hover:bg-[#FFB000] hover:text-[#09090b] flex items-center justify-center text-zinc-100 transition-all duration-300 border border-white/5 shadow-md"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>
            </div>

            <div className="relative group/slider">
                {/* Scroll Buttons */}
                <div className="absolute -left-4 top-1/2 -translate-y-1/2 z-40 opacity-0 group-hover/slider:opacity-100 transition-opacity hidden md:block">
                    <button onClick={() => scroll('left')} className="w-12 h-12 bg-[#09090b]/80 hover:bg-[#FFB000] text-white hover:text-black rounded-full flex items-center justify-center backdrop-blur shadow-xl border border-white/10 transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                </div>
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 z-40 opacity-0 group-hover/slider:opacity-100 transition-opacity hidden md:block">
                    <button onClick={() => scroll('right')} className="w-12 h-12 bg-[#09090b]/80 hover:bg-[#FFB000] text-white hover:text-black rounded-full flex items-center justify-center backdrop-blur shadow-xl border border-white/10 transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>

                {/* Ultra Clean Horizontal Scroll */}
                <div
                    ref={listRef}
                    className="flex overflow-x-auto gap-4 md:gap-5 pb-6 pt-2 snap-x scrollbar-hide px-2 md:px-0"
                >
                    {animeList.slice(0, 10).map((anime, index) => (
                        <Link
                            key={anime.id}
                            href={`/watch/${anime.id}`}
                            className="relative flex-shrink-0 w-[140px] md:w-[170px] snap-start group outline-none flex flex-col gap-2"
                        >
                            {/* Standard Clean Poster */}
                            <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#27272a] shadow-[0_4px_20px_rgba(0,0,0,0.5)] border border-white/5 group-hover:border-[#FFB000]/50 group-hover:shadow-[0_0_30px_rgba(255,176,0,0.15)] transition-all duration-500">
                                <Image
                                    src={anime.image}
                                    alt={anime.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                    unoptimized
                                />

                                {/* Electric Top-Left Rank Badge */}
                                <div className="absolute top-0 left-0 bg-gradient-to-br from-[#FFB000] to-[#FF5E00] text-[#09090b] font-black text-sm px-3.5 py-1.5 rounded-br-xl z-30 font-outfit shadow-[0_4px_10px_rgba(255,176,0,0.3)]">
                                    #{index + 1}
                                </div>

                                {/* Dark gradient overlay at bottom for text contrast */}
                                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent opacity-60 z-10" />

                                {/* Hover Play Button */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 hidden md:block" />
                                <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex">
                                    <div className="w-14 h-14 bg-gradient-to-r from-[#FFB000] to-[#FF5E00] text-[#09090b] rounded-full flex items-center justify-center scale-90 group-hover:scale-100 transition-transform duration-500 shadow-xl">
                                        <svg className="w-6 h-6 ml-1 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                    </div>
                                </div>
                            </div>

                            {/* Clean Text Box */}
                            <div className="px-1">
                                <h3 className="text-[15px] font-semibold text-[#f4f4f5] line-clamp-2 leading-snug group-hover:text-[#FFB000] transition-colors duration-300">
                                    {anime.title}
                                </h3>
                                <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[12px] font-medium text-[#a1a1aa]">
                                    <span>{anime.type || 'TV'}</span>
                                    <span className="w-1 h-1 rounded-full bg-[#52525b]" />
                                    <span>HD</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
