'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

import { Anime } from '@/lib/types';

export default function LiveSearchBar() {
    // 1. Core State
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Anime[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // 2. Refs & Hooks
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const pathname = usePathname();

    // 3. Debounce Timer Ref
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close on route change
    useEffect(() => {
        setIsOpen(false);
        setQuery('');
    }, [pathname]);

    // Live Fetcher Engine
    const fetchResults = async (searchQuery: string) => {
        if (!searchQuery.trim() || searchQuery.length < 2) {
            setResults([]);
            setIsOpen(false);
            return;
        }

        setIsLoading(true);
        setIsOpen(true);
        try {
            // Hit our Next.js API route that wraps hianime's `searchAnime`
            const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
            if (res.ok) {
                const data = await res.json();
                setResults(data.slice(0, 5)); // Keep dropdown clean with top 5
            }
        } catch (error) {
            console.error("Live search failed", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setQuery(val);

        if (debounceTimer.current) clearTimeout(debounceTimer.current);

        if (val.length < 2) {
            setIsOpen(false);
            setResults([]);
            return;
        }

        debounceTimer.current = setTimeout(() => fetchResults(val), 400); // 400ms debounce
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && query.trim()) {
            setIsOpen(false);
            router.push(`/search?keyword=${encodeURIComponent(query)}`);
            setQuery('');
        }
    };

    return (
        <div ref={dropdownRef} className="relative w-full lg:w-[400px]">
            {/* Input Bar */}
            <div className="flex items-center bg-[#222230] rounded-full w-full h-10 px-4 group focus-within:ring-1 focus-within:ring-[#f43f5e] focus-within:bg-[#13131c] transition-all duration-300 shadow-sm border border-transparent focus-within:border-white/5">
                <span className={`mr-3 transition-colors ${isLoading ? 'text-[#f43f5e] animate-pulse' : 'text-[#888]'}`}>
                    {isLoading ? (
                        <div className="w-4 h-4 rounded-full border-2 border-t-[#f43f5e] border-r-transparent border-b-[#f43f5e] border-l-transparent animate-spin" />
                    ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    )}
                </span>

                <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => query.length >= 2 && setIsOpen(true)}
                    placeholder="Search anime..."
                    className="bg-transparent border-none outline-none text-white text-[13px] font-medium w-full placeholder-[#888]"
                />

                {query && (
                    <button
                        onClick={() => { setQuery(''); setIsOpen(false); }}
                        className="p-1 hover:text-white text-[#888] transition-colors bg-[#ffffff0a] rounded-md border border-white/5"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                )}
            </div>

            {/* Auto-Complete Dropdown Menu */}
            <AnimatePresence>
                {isOpen && query.length >= 2 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-12 left-0 right-0 bg-[#13131c]/95 backdrop-blur-2xl border border-white/10 rounded-xl shadow-[0_30px_60px_rgba(0,0,0,0.8)] overflow-hidden z-[200]"
                    >
                        {isLoading && results.length === 0 ? (
                            <div className="p-4 text-center text-sm text-[#888] flex items-center justify-center gap-2">
                                <div className="w-3 h-3 rounded-full border-2 border-t-[#f43f5e] border-r-transparent border-b-[#f43f5e] border-l-transparent animate-spin" />
                                Searching database...
                            </div>
                        ) : results.length > 0 ? (
                            <div className="flex flex-col">
                                {results.map((anime) => (
                                    <Link
                                        key={anime.id}
                                        href={`/watch/${anime.id}`}
                                        className="group flex items-center gap-3 p-3 hover:bg-[#ffffff0a] transition-colors border-b border-white/5 last:border-0"
                                    >
                                        <div className="relative w-10 h-14 rounded overflow-hidden shrink-0 bg-[#1c1c28]">
                                            <Image
                                                src={anime.image}
                                                alt={anime.title}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                unoptimized
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-[13px] font-semibold text-[#f4f4f5] line-clamp-1 group-hover:text-[#f43f5e] transition-colors">
                                                {anime.title}
                                            </h4>
                                            <div className="flex items-center gap-2 mt-1.5 text-[11px] font-medium text-[#888]">
                                                <span>{anime.type || 'TV'}</span>
                                                <span className="w-1 h-1 rounded-full bg-[#52525b]" />
                                                <span>{anime.duration?.replace('m', ' min') || '24 min'}</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                                <Link
                                    href={`/search?keyword=${encodeURIComponent(query)}`}
                                    className="p-3 text-center text-[12px] font-bold text-[#f43f5e] hover:text-[#0a0a0f] hover:bg-[#f43f5e] transition-colors flex items-center justify-center gap-1 group"
                                >
                                    View All Results
                                    <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                                </Link>
                            </div>
                        ) : query.length >= 2 ? (
                            <div className="p-4 text-center text-sm text-[#888]">
                                No anime found for &quot;{query}&quot;
                            </div>
                        ) : null}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
