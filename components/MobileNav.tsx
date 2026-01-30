'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function MobileNav() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="md:hidden">
            {/* Hamburger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-[var(--text-secondary)] hover:text-white"
                aria-label="Toggle menu"
            >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {isOpen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                </svg>
            </button>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="absolute top-16 left-0 right-0 bg-[var(--bg-secondary)] border-b border-[var(--border)] p-4">
                    <nav className="flex flex-col gap-2">
                        <Link
                            href="/"
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-3 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-white"
                        >
                            Home
                        </Link>
                        <Link
                            href="/search"
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-3 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-white"
                        >
                            Browse
                        </Link>
                        <Link
                            href="/search"
                            onClick={() => setIsOpen(false)}
                            className="btn btn-primary mt-2"
                        >
                            Search Anime
                        </Link>
                    </nav>
                </div>
            )}
        </div>
    );
}
