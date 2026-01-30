'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import MobileNav from './MobileNav';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();
    const isHome = pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || !isHome
                    ? 'bg-[var(--bg-primary)]/95 backdrop-blur-md border-b border-[var(--border)] shadow-lg'
                    : 'bg-gradient-to-b from-black/80 to-transparent border-transparent'
                }`}
        >
            <div className="container">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative w-8 h-8 md:w-10 md:h-10 bg-[var(--accent)] rounded-xl flex items-center justify-center overflow-hidden transition-transform group-hover:scale-110 shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent" />
                            <svg className="w-5 h-5 md:w-6 md:h-6 text-white relative z-10" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                        <span className="text-xl md:text-2xl font-bold tracking-tight text-white">
                            Ani<span className="text-[var(--accent)]">Pocket</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        {[
                            { name: 'Home', href: '/' },
                            { name: 'Trending', href: '/search?sort=trending' },
                            { name: 'Movies', href: '/search?type=movie' },
                            { name: 'TV Series', href: '/search?type=tv' },
                        ].map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-sm font-medium text-gray-300 hover:text-white transition-colors relative group py-2"
                            >
                                {item.name}
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--accent)] transition-all duration-300 group-hover:w-full" />
                            </Link>
                        ))}
                    </nav>

                    {/* Right Side */}
                    <div className="flex items-center gap-4">
                        <Link
                            href="/search"
                            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] text-sm text-[var(--text-muted)] hover:text-white hover:border-[var(--accent)] transition-all group w-64"
                        >
                            <svg className="w-4 h-4 group-hover:text-[var(--accent)] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <span>Search anime...</span>
                            <div className="ml-auto flex gap-1">
                                <kbd className="hidden lg:inline-flex h-5 items-center gap-1 rounded border border-[var(--border)] bg-[var(--bg-card)] px-1.5 font-mono text-[10px] font-medium text-[var(--text-muted)] opacity-100">
                                    <span className="text-xs">⌘</span>K
                                </kbd>
                            </div>
                        </Link>

                        {/* Mobile Nav Toggle */}
                        <div className="md:hidden">
                            <MobileNav />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
