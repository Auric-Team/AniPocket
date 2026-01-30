'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Anime } from '@/lib/types';

interface TrendingListProps {
    animeList: Anime[];
}

export default function TrendingList({ animeList }: TrendingListProps) {
    if (!animeList || animeList.length === 0) return null;

    return (
        <div className="w-full">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-1.5 h-10 bg-gradient-to-b from-[var(--accent)] to-purple-600 rounded-full shadow-[0_0_15px_var(--accent)]"/>
                <h2 className="text-3xl font-bold text-white tracking-wide">Trending Now</h2>
            </div>
            
            <div className="relative group/list">
                {/* Horizontal Scroll Container */}
                <div className="flex overflow-x-auto gap-8 pb-12 pt-4 px-4 scrollbar-hide snap-x">
                    {animeList.map((anime, index) => (
                        <Link 
                            key={anime.id} 
                            href={`/anime/${anime.id}`}
                            className="relative flex-shrink-0 w-[240px] snap-start group cursor-pointer"
                        >
                            {/* Huge Rank Number (Behind Card) */}
                            <div className="absolute -left-10 bottom-0 text-[10rem] leading-[0.8] font-black italic text-transparent z-0 select-none transition-transform duration-500 group-hover:-translate-x-2 group-hover:scale-105"
                                 style={{ 
                                     WebkitTextStroke: '2px rgba(255,255,255,0.1)',
                                     textShadow: '0 0 30px rgba(0,0,0,0.5)'
                                 }}>
                                {(index + 1).toString().padStart(2, '0')}
                            </div>

                            {/* Card Container */}
                            <div className="relative aspect-[2/3] rounded-2xl overflow-hidden z-10 bg-[var(--bg-secondary)] shadow-2xl transition-all duration-500 ease-out transform group-hover:-translate-y-4 group-hover:shadow-[0_20px_40px_rgba(99,102,241,0.4)] ml-8 border border-white/5 group-hover:border-[var(--accent)]/50">
                                <Image
                                    src={anime.image}
                                    alt={anime.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    unoptimized
                                />
                                
                                {/* Glass Overlay on Hover */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                    <h3 className="text-lg font-bold text-white leading-tight line-clamp-2 mb-2 text-glow">
                                        {anime.title}
                                    </h3>
                                    <div className="flex items-center gap-2 text-xs font-medium text-gray-300">
                                        <span className="px-2 py-0.5 bg-white/20 backdrop-blur-md rounded">{anime.type || 'TV'}</span>
                                        <span className="text-[var(--accent)]">•</span>
                                        <span className="text-green-400">HD</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
                
                {/* Scroll Fade Masks */}
                <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-[var(--bg-primary)] to-transparent pointer-events-none z-20" />
                <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-[var(--bg-primary)] to-transparent pointer-events-none z-20" />
            </div>
        </div>
    );
}
