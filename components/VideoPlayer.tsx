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

    const embedUrl = getEmbedUrl(episodeId, language);

    return (
        <div className="w-full flex flex-col bg-black">
            {/* Player Container */}
            <div className="relative w-full aspect-video bg-[#050505]">

                {/* Clean Loading Overlay */}
                {isLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#111] z-10">
                        <div className="w-8 h-8 border-2 border-white/10 border-t-[var(--accent)] rounded-full animate-spin mb-4" />
                        <span className="text-sm font-semibold text-gray-400">Loading player...</span>
                    </div>
                )}

                {/* Video Player Frame */}
                <iframe
                    src={embedUrl}
                    className="w-full h-full border-0 outline-none"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    loading="eager"
                    title={`${animeTitle} Episode ${episodeNumber}`}
                    onLoad={() => setIsLoading(false)}
                />
            </div>

            {/* Simple Controls Bar */}
            <div className="flex items-center justify-between p-3 bg-white/5 border-t border-white/10">
                <div className="flex items-center gap-4 text-xs font-semibold text-gray-400">
                    <div className="flex items-center gap-1.5 border border-white/10 rounded overflow-hidden">
                        <button
                            onClick={() => { setLanguage('sub'); setIsLoading(true); }}
                            className={`px-3 py-1.5 transition-colors ${language === 'sub'
                                ? 'bg-[var(--accent)] text-white'
                                : 'bg-transparent hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            SUB
                        </button>
                        <button
                            onClick={() => { if (hasDub) { setLanguage('dub'); setIsLoading(true); } }}
                            disabled={!hasDub}
                            className={`px-3 py-1.5 transition-colors ${language === 'dub'
                                ? 'bg-[var(--accent)] text-white'
                                : hasDub
                                    ? 'bg-transparent hover:bg-white/5 hover:text-white'
                                    : 'text-white/20 cursor-not-allowed hidden'
                                }`}
                            title={hasDub ? "Switch to Dub" : "Dub not available"}
                        >
                            DUB
                        </button>
                    </div>
                </div>

                <div className="text-[10px] font-bold tracking-wider uppercase text-[var(--accent)]">
                    MegaPlay
                </div>
            </div>
        </div>
    );
}
