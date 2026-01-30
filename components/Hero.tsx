'use client';

import Link from 'next/link';
import SearchBar from './SearchBar';

export default function Hero() {
    return (
        <section className="relative py-16 md:py-24 overflow-hidden">
            {/* Subtle Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--accent)]/5 to-transparent pointer-events-none" />

            <div className="container relative">
                <div className="max-w-3xl mx-auto text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-full text-sm">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-[var(--text-secondary)]">Streaming Now</span>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
                        Watch Anime <span className="gradient-text">Online Free</span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-lg text-[var(--text-secondary)] mb-8 max-w-xl mx-auto">
                        Stream thousands of anime episodes in HD quality. No ads, no signup required.
                    </p>

                    {/* Search */}
                    <SearchBar />

                    {/* Quick Stats */}
                    <div className="flex items-center justify-center gap-8 mt-10 pt-8 border-t border-[var(--border)]">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-[var(--text-primary)]">10K+</div>
                            <div className="text-sm text-[var(--text-muted)]">Anime</div>
                        </div>
                        <div className="w-px h-10 bg-[var(--border)]" />
                        <div className="text-center">
                            <div className="text-2xl font-bold text-[var(--text-primary)]">100K+</div>
                            <div className="text-sm text-[var(--text-muted)]">Episodes</div>
                        </div>
                        <div className="w-px h-10 bg-[var(--border)]" />
                        <div className="text-center">
                            <div className="text-2xl font-bold text-[var(--text-primary)]">HD</div>
                            <div className="text-sm text-[var(--text-muted)]">Quality</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
