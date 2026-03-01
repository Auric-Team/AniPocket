'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Anime } from '@/lib/types';
import { useRef } from 'react';

const MotionLink = motion.create(Link);

interface TrendingListProps {
    animeList: Anime[];
}

export default function TrendingList({ animeList }: TrendingListProps) {
    const listRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (listRef.current) {
            const scrollAmount = direction === 'left' ? -350 : 350;
            listRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    if (!animeList || animeList.length === 0) return null;

    return (
        <div className="w-full relative px-0 md:px-2">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl md:text-2xl font-bold text-zinc-100 tracking-tight flex items-center gap-2 font-outfit">
                    Trending Now
                </h2>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => scroll('left')}
                        className="w-10 h-10 rounded-full bg-[#13131c] hover:bg-[#f43f5e] hover:text-[#0a0a0f] flex items-center justify-center text-zinc-100 transition-all duration-300 border border-white/5 shadow-md"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="w-10 h-10 rounded-full bg-[#13131c] hover:bg-[#f43f5e] hover:text-[#0a0a0f] flex items-center justify-center text-zinc-100 transition-all duration-300 border border-white/5 shadow-md"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>
            </div>

            <div className="relative group/slider">
                {/* Scroll Buttons */}
                <div className="absolute -left-4 top-1/2 -translate-y-1/2 z-40 opacity-0 group-hover/slider:opacity-100 transition-opacity hidden md:block">
                    <button onClick={() => scroll('left')} className="w-12 h-12 bg-[#0a0a0f]/80 hover:bg-[#f43f5e] text-white hover:text-black rounded-full flex items-center justify-center backdrop-blur shadow-xl border border-white/10 transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                </div>
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 z-40 opacity-0 group-hover/slider:opacity-100 transition-opacity hidden md:block">
                    <button onClick={() => scroll('right')} className="w-12 h-12 bg-[#0a0a0f]/80 hover:bg-[#f43f5e] text-white hover:text-black rounded-full flex items-center justify-center backdrop-blur shadow-xl border border-white/10 transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>

                {/* Ultra Clean Horizontal Scroll */}
                <motion.div
                    ref={listRef}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.1
                            }
                        }
                    }}
                    className="flex overflow-x-auto gap-4 md:gap-5 pb-6 pt-2 snap-x scrollbar-hide px-2 md:px-0"
                >
                    {animeList.slice(0, 10).map((anime, index) => (
                        <MotionLink
                            key={anime.id}
                            href={`/watch/${anime.id}`}
                            variants={{
                                hidden: { opacity: 0, y: 30 },
                                visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
                            }}
                            whileHover={{ scale: 1.05, transition: { type: "spring", stiffness: 400, damping: 25 } }}
                            className="relative flex-shrink-0 w-[140px] md:w-[170px] snap-start group outline-none flex flex-col gap-3"
                        >
                            {/* Standard Clean Poster */}
                            <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#1c1c28] shadow-lg group-hover:shadow-[0_8px_30px_rgba(255,176,0,0.15)] transition-all duration-300">
                                <Image
                                    src={anime.image}
                                    alt={anime.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                                    unoptimized
                                />

                                {/* Pure Gold Premium Rank Badge - Clean Top Left */}
                                <div className="absolute top-0 left-0 bg-[#f43f5e] text-[#0a0a0f] font-black text-sm px-3.5 py-1 rounded-br-xl z-30 font-outfit shadow-md">
                                    #{index + 1}
                                </div>

                                {/* Custom Play Button Overlay */}
                                <div className="absolute inset-x-0 bottom-0 top-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 bg-black/40 backdrop-blur-[2px]">
                                    <div className="w-12 h-12 bg-[#f43f5e] text-[#0a0a0f] rounded-full flex items-center justify-center scale-90 group-hover:scale-100 transition-transform duration-300 shadow-[0_4px_20px_rgba(255,176,0,0.4)]">
                                        <svg className="w-5 h-5 ml-1 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                    </div>
                                </div>
                            </div>

                            {/* Clean Text Box - Outside image for readability */}
                            <div className="px-1 flex flex-col gap-1">
                                <h3 className="text-[14px] md:text-[15px] font-bold text-[#f4f4f5] line-clamp-2 leading-snug group-hover:text-[#f43f5e] transition-colors duration-200">
                                    {anime.title}
                                </h3>
                                <div className="flex flex-wrap items-center gap-2 text-[12px] font-medium text-[#a1a1aa]">
                                    <span>{anime.type || 'TV'}</span>
                                    <span className="w-1 h-1 rounded-full bg-[#52525b]" />
                                    <span className="text-[#f43f5e] font-semibold">HD</span>
                                </div>
                            </div>
                        </MotionLink>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
