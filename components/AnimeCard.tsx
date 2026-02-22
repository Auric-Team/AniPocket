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
                {/* Image Container - Exact HiAnime Style */}
                <div className="relative aspect-[3/4] bg-[#242428] overflow-hidden mb-2">
                    <PlaceholderImage
                        src={anime.image}
                        alt={anime.title}
                        fill
                        className="object-cover transition-transform duration-300"
                    />

                    {/* Dark overlay on hover */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

                    {/* Center Play Icon on Hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                        <div className="w-14 h-14 bg-[var(--accent)] text-[#111] rounded-full flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-300 shadow-lg">
                            <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                        </div>
                    </div>

                    {/* Top Right Badges */}
                    <div className="absolute top-0 right-0 z-30 flex flex-col items-end">
                        {/* E.g., rating, or other tags if we had them */}
                    </div>

                    {/* Bottom Left Badges (Tick/Sub/Dub) - Exact HiAnime positioning */}
                    <div className="absolute bottom-0 left-0 right-0 z-30 flex items-end">
                        <div className="flex bg-[#242428]/90 text-[11px] font-bold rounded-tr-lg overflow-hidden backdrop-blur-sm">
                            {anime.episodes?.sub && (
                                <span className="bg-[var(--badge-sub)] text-[#111] px-1.5 py-0.5 flex items-center">
                                    <svg className="w-3 h-3 mr-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12z" /></svg>
                                    {anime.episodes.sub}
                                </span>
                            )}
                            {anime.episodes?.dub && (
                                <span className="bg-[var(--badge-dub)] text-[#111] px-1.5 py-0.5 flex items-center border-l border-black/10">
                                    <svg className="w-3 h-3 mr-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /><circle cx="12" cy="12" r="3" /></svg>
                                    {anime.episodes.dub}
                                </span>
                            )}
                            {(anime.episodes?.sub || anime.episodes?.dub) && (
                                <span className="px-1.5 py-0.5 text-white bg-[#ffffff14] border-l border-white/10">
                                    {Math.max(anime.episodes?.sub || 0, anime.episodes?.dub || 0)}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Info Text */}
                <div className="flex flex-col">
                    <h3 className="text-[14px] font-semibold text-white line-clamp-1 group-hover:text-[var(--accent)] transition-colors mb-1">
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
