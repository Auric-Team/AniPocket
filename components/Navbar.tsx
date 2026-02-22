'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Logo from './Logo';
import LiveSearchBar from './LiveSearchBar';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setTimeout(() => setIsMobileMenuOpen(false), 0);
    }, [pathname]);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Subbed Anime', href: '/search?sort=trending' },
        { name: 'Dubbed Anime', href: '/search?type=movie' },
        { name: 'Most Popular', href: '/search?type=tv' },
    ];

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-[100] transition-colors duration-500 ${isScrolled ? 'bg-[#0b0c0f]/80 backdrop-blur-xl border-b border-white/5 shadow-2xl' : 'bg-gradient-to-b from-[#09090b]/80 to-transparent'
                }`}
        >
            <div className="container mx-auto px-4 max-w-[1400px]">
                <div className="flex items-center justify-between h-14 md:h-16">
                    {/* Left side: Hamburger + Logo */}
                    <div className="flex items-center gap-4 lg:gap-6">
                        {/* Mobile Hamburger Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="lg:hidden p-1.5 -ml-1.5 text-[#aaaaaa] hover:text-[var(--accent)] transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        <Link href="/" className="flex items-center gap-1.5 shrink-0">
                            <Logo />
                        </Link>

                        {/* Desktop Search Bar */}
                        <div className="hidden lg:block w-[400px]">
                            <LiveSearchBar />
                        </div>
                    </div>

                    {/* Right side: Nav links + User Actions */}
                    <div className="flex items-center gap-4 shrink-0">
                        {/* Desktop Links */}
                        <nav className="hidden lg:flex items-center gap-6 mr-4">
                            {navLinks.map((item) => {
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

                        {/* Mobile Search Icon */}
                        <Link
                            href="/search"
                            className="lg:hidden p-2 text-[#aaaaaa] hover:text-[var(--accent)] transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </Link>

                        <div className="flex items-center gap-3">
                            <button className="hidden sm:block text-sm font-semibold text-white bg-[#2b2b31] hover:bg-[#3b3b42] px-4 py-2 rounded-lg transition-colors">
                                Login
                            </button>
                            <div className="w-8 h-8 rounded-full bg-[var(--accent)] cursor-pointer overflow-hidden flex items-center justify-center">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=transparent" alt="Avatar" className="w-full h-full object-cover mix-blend-multiply opacity-80" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Drawer Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-[200] lg:hidden flex">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />

                    {/* Drawer */}
                    <div className="relative w-[280px] h-full bg-[var(--bg-secondary)] shadow-2xl flex flex-col transform transition-transform duration-300 translate-x-0">
                        <div className="p-4 border-b border-[#ffffff14] flex items-center justify-between">
                            <Logo />
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-2 text-[#aaaaaa] hover:text-white bg-[#2b2b31] rounded-full transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto py-4">
                            <nav className="flex flex-col gap-1 px-3">
                                {navLinks.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={`px-4 py-3 rounded-xl text-[14px] font-semibold transition-all ${isActive
                                                ? 'bg-[var(--accent)] text-[#111]'
                                                : 'text-[#aaaaaa] hover:bg-[#2b2b31] hover:text-white'
                                                }`}
                                        >
                                            {item.name}
                                        </Link>
                                    )
                                })}
                            </nav>
                        </div>

                        <div className="p-4 border-t border-[#ffffff14]">
                            <button className="w-full text-sm font-bold text-[#111] bg-[var(--accent)] hover:bg-[var(--accent-hover)] py-3 rounded-xl transition-colors">
                                Login to Sync
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
