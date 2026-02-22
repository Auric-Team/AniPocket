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
        <div className="relative w-full h-[50vh] md:h-[70vh] min-h-[400px] max-h-[700px] bg-[#09090b] overflow-hidden">

            {/* The Background Image Array - Crossfading */}
            {animeList.map((anime, idx) => (
                <div
                    key={`bg-${anime.id}`}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                >
                    <div className="absolute top-0 right-0 w-full md:w-3/4 h-full">
                        <PlaceholderImage
                            src={anime.image}
                            alt={anime.title}
                            fill
                            className="object-cover object-top opacity-80"
                            priority={idx === 0}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#09090b] via-[#09090b]/80 to-transparent w-full md:w-[80%]" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent" />
                        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#09090b] to-transparent" />
                    </div>
                </div>
            ))}

            {/* Content Container */}
            <div className="relative z-20 h-full container mx-auto px-4 max-w-[1400px] flex flex-col justify-center pt-24 md:pt-16">
                <div className="w-full md:w-[60%] lg:w-[50%] flex flex-col items-start gap-4">

                    {/* Spotlight Badge */}
                    <div className="text-[#FFB000] text-sm md:text-base font-bold tracking-[0.15em] uppercase mb-1 drop-shadow-md">
                        #{currentIndex + 1} Spotlight
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#f4f4f5] leading-[1.15] line-clamp-2 md:line-clamp-3 drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)] font-outfit tracking-tight mb-4">
                        {currentAnime.title}
                    </h1>

                    {/* Meta Bar */}
                    <div className="flex flex-wrap items-center gap-2 md:gap-3 text-sm font-medium text-white mb-2 animate-fade-in">
                        <span className="flex items-center gap-1.5 font-bold">
                            <svg className="w-4 h-4 text-[#3db4f2]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>
                            {currentAnime.type || 'TV'}
                        </span>

                        {currentAnime.episodes?.sub && (
                            <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded text-[#f4f4f5] border border-white/5 font-medium shadow-sm">
                                <span className="text-[#FFB000] font-bold text-[10px] tracking-wider">SUB</span> {currentAnime.episodes.sub}
                            </span>
                        )}
                        {currentAnime.episodes?.dub && (
                            <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded text-[#f4f4f5] border border-white/5 font-medium shadow-sm">
                                <span className="text-[#e3b5cd] font-bold text-[10px] tracking-wider">DUB</span> {currentAnime.episodes.dub}
                            </span>
                        )}
                    </div>

                    <p className="text-[#a1a1aa] text-sm md:text-base max-w-2xl line-clamp-3 leading-relaxed drop-shadow-md mb-8">
                        {currentAnime.synopsis || "No description available for this title."}
                    </p>

                    <div className="flex flex-wrap items-center gap-4">
                        <Link
                            href={`/watch/${currentAnime.id}`}
                            className="bg-[#f4f4f5] hover:bg-white text-[#09090b] font-bold py-3.5 px-8 rounded flex items-center gap-2 transition-transform hover:scale-105 shadow-[0_4px_20px_rgba(255,255,255,0.2)]"
                        >
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                            Play
                        </Link>
                        <Link
                            href={`/anime/${currentAnime.id}`}
                            className="bg-[#27272a]/80 hover:bg-[#3f3f46] backdrop-blur-md border border-white/10 text-white font-semibold py-3.5 px-8 rounded transition-all hover:scale-105 shadow-lg"
                        >
                            More Info
                        </Link>
                    </div>
                </div>

                {/* Right Pagination Nav */}
                <div className="hidden lg:flex absolute right-4 bottom-1/2 translate-y-1/2 z-30 flex-col gap-3">
                    {animeList.slice(0, 5).map((anime, idx) => (
                        <button
                            key={`nav-${idx}`}
                            onClick={() => setCurrentIndex(idx)}
                            className={`group relative h-12 w-12 rounded bg-black/60 overflow-hidden border-2 transition-all ${idx === currentIndex ? 'border-[#FFB000] scale-110' : 'border-transparent hover:border-white/40'
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
                            key={`dot-${idx}`}
                            onClick={() => setCurrentIndex(idx)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-6 bg-[#FFB000]' : 'bg-white/30'
                                }`}
                        />
                    ))}
                </div>

                <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-[#09090b] to-transparent z-20" />
            </div>
        </div>
    );
}