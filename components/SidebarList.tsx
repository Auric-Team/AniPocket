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
    if (!animeList || animeList.length === 0) return null;

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white tracking-wide">
                    {title}
                </h2>
            </div>

            <div className="bg-[var(--bg-secondary)] rounded-tl-none rounded-tr-lg rounded-b-lg">
                {/* HiAnime Top Tab styling mock */}
                <div className="flex border-b border-[#2b2b31]">
                    <button className="px-4 py-2 text-sm font-semibold text-[var(--accent)] border-b-2 border-[var(--accent)] bg-[#2b2b31]/50">Today</button>
                    <button className="px-4 py-2 text-sm font-medium text-[#aaaaaa] hover:text-white transition-colors">Week</button>
                    <button className="px-4 py-2 text-sm font-medium text-[#aaaaaa] hover:text-white transition-colors">Month</button>
                </div>

                <div className="flex flex-col">
                    {animeList.slice(0, 5).map((anime, index) => (
                        <Link
                            key={anime.id}
                            href={`/watch/${anime.id}`}
                            className="group flex flex-col md:flex-row items-center p-3 border-b border-[#2b2b31] last:border-0 hover:bg-[#ffffff05] transition-colors"
                        >
                            {/* HiAnime Flat Bold Numbers */}
                            <div className="w-10 shrink-0 flex items-center justify-center border-r border-[#2b2b31] mr-3">
                                <span className={`text-xl font-bold ${index === 0 ? 'text-[var(--accent)]' :
                                    index === 1 ? 'text-[#3db4f2]' :
                                        index === 2 ? 'text-[#f3be53]' : 'text-white'
                                    }`}>
                                    {index + 1}
                                </span>
                            </div>

                            <div className="flex items-center w-full gap-3">
                                {/* Thin Poster */}
                                <div className="relative w-12 h-16 shrink-0 rounded bg-[#242428] overflow-hidden">
                                    <Image
                                        src={anime.image}
                                        alt={anime.title}
                                        fill
                                        className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                        unoptimized
                                    />
                                </div>

                                {/* Stacked Meta Data */}
                                <div className="flex flex-col min-w-0 flex-1 justify-center">
                                    <h4 className="text-sm font-semibold text-[#f9f9f9] group-hover:text-[var(--accent)] transition-colors line-clamp-1 mb-1.5">
                                        {anime.title}
                                    </h4>

                                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium text-[#888]">
                                        <div className="flex items-center gap-1 bg-[#242428] px-1.5 rounded text-[#aaaaaa]">
                                            <svg className="w-3 h-3 text-[#aaaaaa]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5 5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" /></svg>
                                            {Math.floor(Math.random() * 90) + 10}K
                                        </div>
                                        {anime.episodes?.sub && (
                                            <div className="flex items-center gap-0.5 text-xs">
                                                <span className="bg-[var(--badge-sub)] text-black px-1 rounded-sm leading-tight flex items-center">
                                                    <svg className="w-3 h-3 mr-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12z" /></svg>
                                                    {anime.episodes.sub}
                                                </span>
                                            </div>
                                        )}
                                        <div className="w-1 h-1 bg-[#888] rounded-full mx-1" />
                                        <span>{anime.type || 'TV'}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}