'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import MobileNav from './MobileNav';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-[100] transition-colors duration-300 ${isScrolled ? 'bg-[var(--bg-secondary)] shadow-lg' : 'bg-[var(--bg-secondary)]'
                }`}
        >
            <div className="container mx-auto px-4 max-w-[1400px]">
                <div className="flex items-center justify-between h-14 md:h-16">
                    {/* HiAnime Logo Area */}
                    <div className="flex items-center gap-6">
                        <Link href="/" className="flex items-center gap-1.5 shrink-0">
                            {/* Precise HiAnime style logo typography */}
                            <span className="text-2xl font-black tracking-tight text-white flex items-center">
                                <span className="w-8 h-8 rounded-full bg-[var(--accent)] text-[#111] flex items-center justify-center mr-1 text-lg">
                                    A
                                </span>
                                Ani<span className="text-[var(--accent)]">Pocket</span>
                            </span>
                        </Link>

                        {/* Search Bar - HiAnime exact replica (gray bar, search icon left, filter right) */}
                        <div className="hidden lg:flex items-center bg-[#2b2b31] rounded-full w-[400px] h-10 px-4 group focus-within:ring-1 focus-within:ring-[var(--accent)] transition-shadow">
                            <span className="text-[#888] mr-3">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </span>
                            <input
                                type="text"
                                placeholder="Search anime..."
                                className="bg-transparent border-none outline-none text-white text-sm w-full placeholder-[#888]"
                            />
                            <button className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#888] hover:text-[var(--accent)] transition-colors px-2 py-1 bg-[#1e1e24] rounded-md shrink-0 border border-white/5">
                                Filter
                            </button>
                        </div>
                    </div>

                    {/* Right Nav */}
                    <div className="flex items-center gap-4 shrink-0">
                        {/* Desktop Links */}
                        <nav className="hidden lg:flex items-center gap-6 mr-4">
                            {[
                                { name: 'Home', href: '/' },
                                { name: 'Subbed Anime', href: '/search?sort=trending' },
                                { name: 'Dubbed Anime', href: '/search?type=movie' },
                                { name: 'Most Popular', href: '/search?type=tv' },
                            ].map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`text-[13px] font-medium transition-colors ${isActive ? 'text-[var(--accent)]' : 'text-[#aaaaaa] hover:text-[var(--accent)]'
                                            }`}
                                    >
                                        {item.name}
                                    </Link>
                                )
                            })}
                        </nav>

                        {/* Mobile Actions */}
                        <Link
                            href="/search"
                            className="lg:hidden w-10 h-10 flex items-center justify-center text-white"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </Link>

                        <div className="lg:hidden">
                            <MobileNav />
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Login button perfectly styled */}
                            <button className="hidden sm:block text-sm font-semibold text-white bg-[#2b2b31] hover:bg-[#3b3b42] px-4 py-2 rounded-lg transition-colors">
                                Login
                            </button>
                            {/* Profile Avatar */}
                            <div className="w-8 h-8 rounded-full bg-[var(--accent)] cursor-pointer overflow-hidden flex items-center justify-center">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=transparent" alt="Avatar" className="w-full h-full object-cover mix-blend-multiply opacity-80" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
