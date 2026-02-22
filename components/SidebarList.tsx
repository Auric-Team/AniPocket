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

            <div className="bg-[#18181b] rounded-xl border border-white/5 overflow-hidden shadow-lg">
                <div className="flex border-b border-white/5">
                    <button className="flex-1 py-3 text-sm font-bold text-[#FFB000] border-b-2 border-[#FFB000] bg-[#27272a]/50 transition-colors">Today</button>
                    <button className="flex-1 py-3 text-sm font-medium text-[#a1a1aa] hover:text-[#f4f4f5] transition-colors">Week</button>
                    <button className="flex-1 py-3 text-sm font-medium text-[#a1a1aa] hover:text-[#f4f4f5] transition-colors">Month</button>
                </div>

                <div className="flex flex-col">
                    {animeList.slice(0, 5).map((anime, index) => (
                        <Link
                            key={anime.id}
                            href={`/watch/${anime.id}`}
                            className="group flex flex-col md:flex-row items-center p-3 border-b border-white/5 last:border-0 hover:bg-[#ffffff05] transition-colors"
                        >
                            <div className="w-10 shrink-0 flex items-center justify-center mr-2">
                                <span className={`text-2xl font-black font-outfit ${index === 0 ? 'text-[#FFB000]' :
                                    index === 1 ? 'text-[#FF5E00]' :
                                        index === 2 ? 'text-[#e5c786]' : 'text-zinc-600'
                                    }`}>
                                    {index + 1}
                                </span>
                            </div>

                            <div className="flex items-center w-full gap-3">
                                {/* Thin Poster */}
                                <div className="relative w-14 h-20 shrink-0 rounded-md bg-[#27272a] overflow-hidden shadow-sm">
                                    <Image
                                        src={anime.image}
                                        alt={anime.title}
                                        fill
                                        className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                                        unoptimized
                                    />
                                </div>

                                {/* Stacked Meta Data */}
                                <div className="flex flex-col min-w-0 flex-1 justify-center">
                                    <h4 className="text-[15px] font-semibold text-[#f4f4f5] group-hover:text-[#FFB000] transition-colors line-clamp-2 leading-snug mb-1.5">
                                        {anime.title}
                                    </h4>

                                    <div className="flex flex-wrap items-center gap-2 text-[12px] font-medium text-[#a1a1aa]">
                                        <span>{anime.type || 'TV'}</span>
                                        <span className="w-1 h-1 rounded-full bg-[#52525b]" />

                                        {(anime.episodes?.sub || anime.episodes?.dub) && (
                                            <div className="flex items-center gap-1.5">
                                                {anime.episodes.sub && (
                                                    <div className="flex items-center text-[#ffdd95]">
                                                        <span className="font-bold border border-[#ffdd95]/30 bg-[#ffdd95]/10 px-1 rounded text-[10px]">SUB</span>
                                                        <span className="ml-1 text-[#f4f4f5]">{anime.episodes.sub}</span>
                                                    </div>
                                                )}
                                                {anime.episodes.dub && (
                                                    <div className="flex items-center text-[#e3b5cd]">
                                                        <span className="font-bold border border-[#e3b5cd]/30 bg-[#e3b5cd]/10 px-1 rounded text-[10px]">DUB</span>
                                                        <span className="ml-1 text-[#f4f4f5]">{anime.episodes.dub}</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
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