'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Anime } from '@/lib/types';

interface SidebarListProps {
    title: string;
    animeList: Anime[];
    viewAllLink?: string;
}

export default function SidebarList({ title, animeList, viewAllLink }: SidebarListProps) {
    return (
        <div className="bg-[var(--bg-card)]/50 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-5 border-b border-white/5 flex justify-between items-center bg-white/5">
                <h3 className="text-lg font-bold text-white tracking-wide">{title}</h3>
                {viewAllLink && (
                    <Link 
                        href={viewAllLink} 
                        className="text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors uppercase tracking-wider"
                    >
                        View All
                    </Link>
                )}
            </div>
            <div className="flex flex-col">
                {animeList.slice(0, 5).map((anime, index) => (
                    <Link 
                        key={anime.id} 
                        href={`/anime/${anime.id}`}
                        className="group flex gap-4 p-4 hover:bg-white/5 transition-all duration-300 border-b border-white/5 last:border-0 relative overflow-hidden"
                    >
                        {/* Hover Highlight Line */}
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--accent)] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />

                        {/* Rank Number */}
                        <div className={`flex items-center justify-center w-6 flex-shrink-0 text-lg font-black italic ${
                            index < 3 ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'
                        }`}>
                            {index + 1}
                        </div>

                        {/* Poster */}
                        <div className="relative w-12 h-16 flex-shrink-0 rounded-lg overflow-hidden shadow-lg group-hover:shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-shadow">
                            <Image
                                src={anime.image}
                                alt={anime.title}
                                fill
                                className="object-cover"
                                unoptimized
                            />
                        </div>

                        {/* Info */}
                        <div className="flex flex-col justify-center min-w-0 flex-1">
                            <h4 className="text-sm font-semibold text-gray-200 line-clamp-1 group-hover:text-white transition-colors group-hover:translate-x-1 duration-300">
                                {anime.title}
                            </h4>
                            <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] mt-1.5">
                                <span className="flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M4 6h16v12H4z"/></svg>
                                    {anime.type || 'TV'}
                                </span>
                                <span className="w-1 h-1 bg-[var(--border)] rounded-full" />
                                {anime.episodes?.sub && (
                                    <span className="flex items-center gap-1 text-gray-400">
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
                                        {anime.episodes.sub}
                                    </span>
                                )}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}