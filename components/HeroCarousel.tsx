'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Anime } from '@/lib/types';
import PlaceholderImage from './PlaceholderImage';

interface HeroCarouselProps {
    animeList: Anime[];
}

export default function HeroCarousel({ animeList }: HeroCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    // Use top 10 anime for spotlight slider
    const slides = animeList.slice(0, 10);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % slides.length);
        }, 6000); 
        return () => clearInterval(timer);
    }, [slides.length]);

    if (slides.length === 0) return null;

    return (
        <div className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden bg-[var(--bg-primary)] z-0 group">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                >
                    {/* Original Banner Image (Clear, No Blur) */}
                    <div className="absolute inset-0">
                        <PlaceholderImage
                            src={slides[currentIndex].image}
                            alt={slides[currentIndex].title}
                            fill
                            className="object-cover opacity-100"
                            priority
                        />
                        {/* Gradient Overlays for Text Readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-black/30" />
                        <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-primary)]/90 via-[var(--bg-primary)]/40 to-transparent" />
                    </div>

                    {/* Content Container */}
                    <div className="container relative h-full flex items-center pt-16 md:pt-20">
                        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 w-full">
                            {/* Text Content */}
                            <div className="flex-1 max-w-2xl z-10 space-y-6">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2, duration: 0.5 }}
                                >
                                    <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider uppercase text-[var(--accent)] bg-[var(--accent)]/10 border border-[var(--accent)]/20 rounded-full">
                                        #{currentIndex + 1} Spotlight
                                    </span>
                                    <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold leading-tight text-white line-clamp-2 drop-shadow-xl">
                                        {slides[currentIndex].title}
                                    </h1>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3, duration: 0.5 }}
                                    className="line-clamp-3 text-gray-300 text-sm md:text-base leading-relaxed max-w-xl drop-shadow-md"
                                >
                                    {slides[currentIndex].synopsis}
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4, duration: 0.5 }}
                                    className="flex flex-wrap items-center gap-4 text-sm md:text-base text-white font-medium"
                                >
                                    {slides[currentIndex].type && (
                                        <span className="flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M4 6h16v12H4z" />
                                            </svg>
                                            {slides[currentIndex].type}
                                        </span>
                                    )}
                                    {slides[currentIndex].episodes?.sub && (
                                        <span className="flex items-center gap-1 px-2 py-0.5 bg-white/20 backdrop-blur-md rounded">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                            </svg>
                                            {slides[currentIndex].episodes.sub}
                                        </span>
                                    )}
                                    <span className="px-2 py-0.5 bg-[var(--accent)] rounded text-xs font-bold">HD</span>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5, duration: 0.5 }}
                                    className="flex items-center gap-4 pt-4"
                                >
                                    <Link
                                        href={`/anime/${slides[currentIndex].id}`}
                                        className="btn btn-primary h-12 px-8 text-lg rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(99,102,241,0.4)] flex items-center"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                        Watch Now
                                    </Link>
                                    <Link
                                        href={`/anime/${slides[currentIndex].id}`}
                                        className="btn bg-white/10 border border-white/20 hover:bg-white/20 h-12 px-8 text-lg rounded-full backdrop-blur-md transition-colors"
                                    >
                                        Details
                                    </Link>
                                </motion.div>
                            </div>
                            
                            {/* Poster Image Removed to prevent overlap and show full banner */}
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button 
                onClick={() => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/20 hover:bg-[var(--accent)] text-white rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 z-20"
            >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <button 
                onClick={() => setCurrentIndex((prev) => (prev + 1) % slides.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/20 hover:bg-[var(--accent)] text-white rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 z-20"
            >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {/* Indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {slides.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-1 rounded-full transition-all duration-300 ${idx === currentIndex
                                ? 'bg-[var(--accent)] w-8 shadow-[0_0_10px_var(--accent)]'
                                : 'bg-white/30 hover:bg-white/60 w-2'
                            }`}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}