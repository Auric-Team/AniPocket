'use client';

import { useState } from 'react';
import { getEmbedUrl } from '@/lib/megaplay';

interface VideoPlayerProps {
    episodeId: string;
    animeTitle: string;
    episodeNumber?: number;
    hasDub?: boolean; // Whether dub is available for this anime
}

export default function VideoPlayer({ episodeId, animeTitle, episodeNumber, hasDub = false }: VideoPlayerProps) {
    const [language, setLanguage] = useState<'sub' | 'dub'>('sub');
    const [isLoading, setIsLoading] = useState(true);
    const [isTheaterMode, setIsTheaterMode] = useState(false);

    const embedUrl = getEmbedUrl(episodeId, language);

    return (
        <div className={isTheaterMode ? 'fixed inset-0 z-50 bg-black p-4' : ''}>
            {/* Player Container */}
            <div className={`relative bg-black rounded-lg overflow-hidden ${isTheaterMode ? 'h-full' : ''}`}>
                {/* Loading Overlay */}
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-secondary)] z-10">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-10 h-10 border-3 border-[var(--border)] border-t-[var(--accent)] rounded-full animate-spin" />
                            <span className="text-sm text-[var(--text-muted)]">Loading video...</span>
                        </div>
                    </div>
                )}

                {/* Video Player */}
                <iframe
                    src={embedUrl}
                    className={`w-full ${isTheaterMode ? 'h-full' : 'aspect-video'}`}
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    loading="eager"
                    title={`${animeTitle} Episode ${episodeNumber}`}
                    onLoad={() => setIsLoading(false)}
                />
            </div>

            {/* Controls Bar */}
            <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4 ${isTheaterMode ? 'px-4' : ''}`}>
                {/* Episode Info */}
                <div>
                    <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                        {animeTitle}
                    </h2>
                    {episodeNumber && (
                        <p className="text-sm text-[var(--text-muted)]">
                            Episode {episodeNumber}
                        </p>
                    )}
                </div>

                {/* Controls */}
                <div className="flex items-center gap-2">
                    {/* Language Toggle - Only show if DUB is available */}
                    {hasDub ? (
                        <div className="flex rounded-lg overflow-hidden border border-[var(--border)]">
                            <button
                                onClick={() => { setLanguage('sub'); setIsLoading(true); }}
                                className={`px-4 py-2 text-sm font-medium transition-colors ${language === 'sub'
                                    ? 'bg-[var(--accent)] text-white'
                                    : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
                                    }`}
                            >
                                SUB
                            </button>
                            <button
                                onClick={() => { setLanguage('dub'); setIsLoading(true); }}
                                className={`px-4 py-2 text-sm font-medium transition-colors ${language === 'dub'
                                    ? 'bg-[var(--accent)] text-white'
                                    : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
                                    }`}
                            >
                                DUB
                            </button>
                        </div>
                    ) : (
                        <span className="px-4 py-2 text-sm font-medium bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-[var(--text-secondary)]">
                            SUB Only
                        </span>
                    )}

                    {/* Theater Mode */}
                    <button
                        onClick={() => setIsTheaterMode(!isTheaterMode)}
                        className="p-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] hover:bg-[var(--bg-hover)] transition-colors"
                        title={isTheaterMode ? 'Exit theater mode' : 'Theater mode'}
                    >
                        <svg className="w-5 h-5 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {isTheaterMode ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Video Info */}
            <div className={`flex items-center gap-4 mt-4 text-sm text-[var(--text-muted)] ${isTheaterMode ? 'px-4' : ''}`}>
                <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                    HD Quality
                </span>
                <span>•</span>
                <span>Powered by MegaPlay</span>
            </div>
        </div>
    );
}
