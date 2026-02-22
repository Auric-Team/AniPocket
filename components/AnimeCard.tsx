'use client';

import Link from 'next/link';
import { Anime } from '@/lib/types';
import PlaceholderImage from './PlaceholderImage';

interface AnimeCardProps {
    anime: Anime;
    index?: number;
}

export default function AnimeCard({ anime }: AnimeCardProps) {
    return (
        <div className="w-full">
            <Link href={`/watch/${anime.id}`} className="block group">
                {/* Image Container - Ultimate Premium Hover */}
                <div className="relative aspect-[3/4] bg-[#27272a] rounded-xl overflow-hidden mb-3 shadow-[0_4px_20px_rgba(0,0,0,0.5)] border border-white/5 group-hover:border-[#FFB000]/50 group-hover:shadow-[0_0_30px_rgba(255,176,0,0.15)] transition-all duration-500">
                    <PlaceholderImage
                        src={anime.image}
                        alt={anime.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />

                    {/* Dark gradient overlay at bottom for text contrast if needed */}
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent opacity-60" />

                    {/* Clean Hover Play Button */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 hidden md:block" />
                    <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex">
                        <div className="w-14 h-14 bg-gradient-to-r from-[#FFB000] to-[#FF5E00] text-[#09090b] rounded-full flex items-center justify-center scale-90 group-hover:scale-100 transition-transform duration-500 shadow-xl">
                            <svg className="w-6 h-6 ml-1 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                        </div>
                    </div>

                    {/* Top Right Badges */}
                    <div className="absolute top-0 right-0 z-30 flex flex-col items-end">
                        {/* E.g., rating, or other tags if we had them */}
                    </div>
                </div>

                {/* Title & Unified Metadata */}
                <div className="px-1">
                    <h3 className="font-semibold text-[15px] text-[#f4f4f5] line-clamp-2 leading-snug group-hover:text-[#FFB000] transition-colors duration-300">
                        {anime.title}
                    </h3>
                    <div className="flex items-center text-[#aaaaaa] text-xs font-medium gap-1.5">
                        <span>{anime.type || 'TV'}</span>
                        <div className="w-1 h-1 bg-[#aaaaaa] rounded-full" />
                        <span>24m</span>
                    </div>
                </div>
            </Link>
        </div>
    );
}
