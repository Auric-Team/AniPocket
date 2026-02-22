'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Anime } from '@/lib/types';
import PlaceholderImage from './PlaceholderImage';

interface HeroCarouselProps {
    animeList: Anime[];
}

export default function HeroCarousel({ animeList }: HeroCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-advance
    useEffect(() => {
        if (!animeList.length) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % animeList.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [animeList.length]);

    if (!animeList || animeList.length === 0) return null;

    const currentAnime = animeList[currentIndex];

    return (
        <div className="relative w-full h-[50vh] md:h-[70vh] min-h-[400px] max-h-[700px] bg-[#0b0c0f] overflow-hidden">

            {/* The Background Image Array - Crossfading */}
            {animeList.map((anime, idx) => (
                <div
                    key={anime.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                >
                    {/* HiAnime uses posters pinned to the right, bleeding into dark on the left */}
                    <div className="absolute top-0 right-0 w-full md:w-3/4 h-full">
                        <PlaceholderImage
                            src={anime.image}
                            alt={anime.title}
                            fill
                            className="object-cover object-top opacity-80"
                            priority={idx === 0}
                        />
                        {/* Gradient Mask to blend image into background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0c0f] via-[#0b0c0f]/80 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c0f] via-transparent to-transparent" />
                    </div>
                </div>
            ))}

            {/* Content Overlay */}
            <div className="absolute inset-0 z-20 container mx-auto px-4 max-w-[1400px] flex flex-col justify-center">
                <div className="w-full md:w-[60%] lg:w-[50%] flex flex-col items-start gap-4">

                    {/* Spotlight Badge */}
                    <div className="text-[var(--accent)] text-sm font-bold tracking-widest uppercase">
                        #{currentIndex + 1} Spotlight
                    </div>

                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] line-clamp-2 md:line-clamp-3 
                        drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                        {currentAnime.title}
                    </h1>

                    {/* HiAnime Meta Bar */}
                    <div className="flex flex-wrap items-center gap-2 md:gap-3 text-sm font-medium text-white mb-2">
                        <span className="flex items-center gap-1.5 font-bold">
                            <svg className="w-4 h-4 text-[#3db4f2]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>
                            {currentAnime.type || 'TV'}
                        </span>

                        <div className="flex bg-[#242428]/90 text-[11px] font-bold rounded overflow-hidden">
                            {currentAnime.episodes?.sub && (
                                <span className="bg-[var(--badge-sub)] text-[#111] px-1.5 py-0.5 flex items-center">
                                    <svg className="w-3 h-3 mr-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12z" /></svg>
                                    {currentAnime.episodes.sub}
                                </span>
                            )}
                            {currentAnime.episodes?.dub && (
                                <span className="bg-[var(--badge-dub)] text-[#111] px-1.5 py-0.5 flex items-center border-l border-black/10">
                                    <svg className="w-3 h-3 mr-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /><circle cx="12" cy="12" r="3" /></svg>
                                    {currentAnime.episodes.dub}
                                </span>
                            )}
                        </div>

                        <span className="text-[#888] hidden sm:inline">•</span>
                        <span className="text-[#aaaaaa] font-medium hidden sm:inline">HD</span>
                    </div>

                    <p className="text-[#aaaaaa] text-sm leading-relaxed line-clamp-3 md:line-clamp-4 max-w-xl mb-4 font-medium">
                        {currentAnime.synopsis || "No description available for this title."}
                    </p>

                    <div className="flex flex-wrap items-center gap-4">
                        <Link
                            href={`/watch/${currentAnime.id}`}
                            className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[#111] font-bold py-3 px-6 md:px-8 rounded-full flex items-center gap-2 transition-transform hover:scale-105"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                            WATCH NOW
                        </Link>
                        <Link
                            href={`/anime/${currentAnime.id}`}
                            className="bg-[#242428] hover:bg-[#3b3b42] text-white font-semibold py-3 px-6 rounded-full flex items-center gap-2 transition-colors border border-white/5"
                        >
                            Detail
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Right Pagination Nav - Exact HiAnime Style */}
            <div className="hidden lg:flex absolute right-4 bottom-1/2 translate-y-1/2 z-30 flex-col gap-3">
                {animeList.slice(0, 5).map((anime, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`group relative h-12 w-12 rounded bg-black/60 overflow-hidden border-2 transition-all ${idx === currentIndex ? 'border-[var(--accent)] scale-110' : 'border-transparent hover:border-white/40'
                            }`}
                    >
                        <Image src={anime.image} alt="nav" fill className="object-cover opacity-60 group-hover:opacity-100" />
                    </button>
                ))}
            </div>

            {/* Mobile Dots */}
            <div className="absolute bottom-4 left-0 right-0 z-30 flex justify-center gap-2 lg:hidden">
                {animeList.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-6 bg-[var(--accent)]' : 'bg-white/30'
                            }`}
                    />
                ))}
            </div>

            {/* Gradient bottom fade to mix into next section */}
            <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-[var(--bg-primary)] to-transparent z-20" />
        </div>
    );
}