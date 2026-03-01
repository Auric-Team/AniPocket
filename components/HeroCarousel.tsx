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
        <div className="relative w-full h-[50vh] md:h-[65vh] min-h-[400px] max-h-[600px] bg-[#0a0a0f] overflow-hidden">

            {/* Clean Background Image Array - Fade Transitions */}
            {animeList.map((anime, idx) => (
                <div
                    key={`bg-${anime.id}`}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                >
                    <PlaceholderImage
                        src={anime.image}
                        alt={anime.title}
                        fill
                        className="object-cover object-top opacity-90"
                        priority={idx === 0}
                    />

                    {/* Clean Gradients for Text Legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0a0a0f] via-[#0a0a0f]/80 to-transparent w-full md:w-[70%]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
                </div>
            ))}

            {/* Content Container */}
            <div className="relative z-20 h-full container mx-auto px-4 max-w-[1400px] flex flex-col justify-center pt-24 md:pt-16">
                <div className="w-full md:w-[65%] lg:w-[50%] flex flex-col items-start gap-3">

                    {/* Spotlight Badge */}
                    <div className="text-[#f43f5e] text-sm md:text-base font-bold tracking-widest uppercase mb-1 drop-shadow-md">
                        #{currentIndex + 1} Spotlight
                    </div>

                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-[#f4f4f5] leading-tight line-clamp-2 md:line-clamp-3 drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)] font-outfit tracking-tight mb-2">
                        {currentAnime.title}
                    </h1>

                    {/* Meta Bar */}
                    <div className="flex flex-wrap items-center gap-2 md:gap-3 text-sm font-medium text-[#e4e4e7] mb-2 animate-fade-in">
                        <span className="flex items-center gap-1.5 font-bold">
                            <svg className="w-4 h-4 text-[#f43f5e]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>
                            {currentAnime.type || 'TV'}
                        </span>

                        {currentAnime.episodes?.sub && (
                            <span className="flex items-center gap-1.5 bg-[#13131c]/80 border border-white/5 px-2 py-0.5 rounded shadow-sm">
                                <span className="text-[#f43f5e] font-bold text-[10px]">SUB</span> {currentAnime.episodes.sub}
                            </span>
                        )}
                        {currentAnime.episodes?.dub && (
                            <span className="flex items-center gap-1.5 bg-[#13131c]/80 border border-white/5 px-2 py-0.5 rounded shadow-sm">
                                <span className="text-[#f43f5e] font-bold text-[10px]">DUB</span> {currentAnime.episodes.dub}
                            </span>
                        )}
                    </div>

                    <p className="text-[#a1a1aa] text-sm md:text-base max-w-2xl line-clamp-3 leading-relaxed drop-shadow-md mb-6">
                        {currentAnime.synopsis || "No description available for this title."}
                    </p>

                    {/* Clean Action Buttons */}
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                        <Link
                            href={`/watch/${currentAnime.id}`}
                            className="bg-[#f43f5e] hover:bg-[#e11d48] text-[#0a0a0f] font-bold tracking-wide py-3 px-8 rounded-full flex items-center gap-2 transition-transform hover:-translate-y-1 shadow-[0_4px_15px_rgba(255,176,0,0.3)]"
                        >
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                            Watch Now
                        </Link>
                        <Link
                            href={`/anime/${currentAnime.id}`}
                            className="bg-[#1c1c28]/80 hover:bg-[#3f3f46] text-white font-semibold py-3 px-8 rounded-full transition-transform hover:-translate-y-1 border border-white/10"
                        >
                            More Info
                        </Link>
                    </div>
                </div>

                {/* Right Pagination Nav - Simplistic */}
                <div className="hidden lg:flex absolute right-6 bottom-1/2 translate-y-1/2 z-30 flex-col gap-2">
                    {animeList.slice(0, 5).map((anime, idx) => (
                        <button
                            key={`nav-${idx}`}
                            onClick={() => setCurrentIndex(idx)}
                            className={`group relative h-14 w-10 md:w-16 rounded overflow-hidden border transition-all ${idx === currentIndex ? 'border-[#f43f5e]' : 'border-transparent hover:border-white/40'
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
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-6 bg-[#f43f5e]' : 'bg-white/30'
                                }`}
                        />
                    ))}
                </div>

                <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-[#0a0a0f] to-transparent z-20" />
            </div>
        </div>
    );
}