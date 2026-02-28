'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getEmbedUrl } from '@/lib/megaplay';
import Link from 'next/link';

interface VideoPlayerProps {
    episodeId: string;
    animeTitle: string;
    episodeNumber?: number;
    hasDub?: boolean;
    hasHindi?: boolean;
    nextEpisodeUrl?: string;
}

export default function VideoPlayer({ episodeId, animeTitle, episodeNumber, hasDub = false, hasHindi = false, nextEpisodeUrl }: VideoPlayerProps) {
    const router = useRouter();
    const [language, setLanguage] = useState<'sub' | 'dub' | 'hindi'>('sub');
    const [isLoading, setIsLoading] = useState(true);

    const [timeElapsed, setTimeElapsed] = useState(0);
    const [showNextOverlay, setShowNextOverlay] = useState(false);
    const [countdown, setCountdown] = useState(10);
    const [isHovered, setIsHovered] = useState(false);
    const [hindiUrl, setHindiUrl] = useState<string | null>(null);

    const AUTO_NEXT_TRIGGER_SECONDS = 1350;

    useEffect(() => {
        if (language === 'hindi') {
            let isMounted = true;
            const fetchHindi = async () => {
                setIsLoading(true);
                try {
                    const res = await fetch(`/api/hindi?title=${encodeURIComponent(animeTitle)}&ep=${episodeNumber || 1}`);
                    const data = await res.json();
                    if (isMounted && data.url) {
                        setHindiUrl(data.url);
                    }
                } catch (e) {
                    console.error("Failed to fetch hindi source:", e);
                } finally {
                    if (isMounted) setIsLoading(false);
                }
            };
            fetchHindi();
            return () => { isMounted = false; };
        } else {
            setHindiUrl(null);
        }
    }, [language, animeTitle, episodeNumber]);

    const embedUrl = language === 'hindi' && hindiUrl ? hindiUrl : getEmbedUrl(episodeId, language, animeTitle, episodeNumber);

    // Master Timer: Start counting seconds once the iframe loads
    useEffect(() => {
        if (isLoading) return;

        const timer = setInterval(() => {
            setTimeElapsed(prev => prev + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [isLoading]);

    // Auto-Next Logic
    useEffect(() => {
        if (!nextEpisodeUrl || isLoading) return;

        // Trigger the overlay
        if (timeElapsed === AUTO_NEXT_TRIGGER_SECONDS && !showNextOverlay) {
            setTimeout(() => setShowNextOverlay(true), 0);
        }

        // Handle the countdown if overlay is active
        if (showNextOverlay && countdown > 0) {
            const down = setTimeout(() => setCountdown(c => c - 1), 1000);
            return () => clearTimeout(down);
        } else if (showNextOverlay && countdown === 0) {
            // FIRE AUTO PLAY!
            router.push(nextEpisodeUrl);
        }
    }, [timeElapsed, showNextOverlay, countdown, nextEpisodeUrl, isLoading, router]);

    // Reset loading state when episode changes
    useEffect(() => {
        setIsLoading(true);
        setTimeElapsed(0);
        setShowNextOverlay(false);
        setCountdown(10);
    }, [episodeId]);

    return (
        <div
            className="w-full flex flex-col bg-[#09090b] relative group/player"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Player Container */}
            <div className="relative w-full aspect-video bg-[#050505] overflow-hidden">

                {/* Player Top Bar removed per user request */}

                {/* Clean Loading Overlay */}
                {isLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#09090b] z-30">
                        <div className="w-10 h-10 border-2 border-white/10 border-t-[#FFB000] rounded-full animate-spin mb-4" />
                        <span className="text-sm font-semibold text-[#a1a1aa] tracking-widest uppercase">Initializing Stream...</span>
                    </div>
                )}

                {/* Video Player Frame */}
                <iframe
                    src={embedUrl}
                    className="w-full h-full border-0 outline-none relative z-10"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    loading="eager"
                    title={`${animeTitle} Episode ${episodeNumber}`}
                    onLoad={() => setIsLoading(false)}
                />

                {/* PREMIUM AUTO-PLAY NEXT OVERLAY */}
                {showNextOverlay && nextEpisodeUrl && (
                    <div className="absolute bottom-6 right-6 z-40 bg-[#09090b]/90 backdrop-blur-md border border-white/10 p-5 rounded-xl shadow-2xl animate-in slide-in-from-right-8 duration-500 w-80">
                        <div className="flex justify-between items-start mb-3">
                            <h4 className="text-[#f4f4f5] font-bold text-sm">Up Next</h4>
                            <button
                                onClick={() => setShowNextOverlay(false)}
                                className="text-[#a1a1aa] hover:text-white transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <p className="text-[#a1a1aa] text-xs mb-4">Playing next episode in {countdown}s...</p>

                        <div className="flex gap-3">
                            <Link
                                href={nextEpisodeUrl}
                                className="flex-1 bg-[#f4f4f5] hover:bg-white text-[#09090b] text-sm font-bold py-2 px-4 rounded-full flex items-center justify-center gap-2 transition-all"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                Play Now
                            </Link>
                            <button
                                onClick={() => setShowNextOverlay(false)}
                                className="flex-1 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold py-2 px-4 rounded-full transition-all"
                            >
                                Cancel
                            </button>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 rounded-b-xl overflow-hidden">
                            <div
                                className="h-full bg-[#FFB000] transition-all ease-linear"
                                style={{ width: `${(countdown / 10) * 100}%`, transitionDuration: '1s' }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Simple Controls Bar */}
            <div className="flex items-center justify-between p-3.5 bg-[#18181b] border-t border-white/5">
                <div className="flex items-center gap-4 text-xs font-semibold">
                    <div className="flex items-center bg-[#09090b] border border-white/10 rounded-full overflow-hidden p-1 shadow-inner">
                        <button
                            onClick={() => { setLanguage('sub'); setIsLoading(true); }}
                            className={`px-4 py-1.5 rounded-full transition-all ${language === 'sub'
                                ? 'bg-[#f4f4f5] text-[#09090b] shadow-[0_2px_10px_rgba(255,255,255,0.1)] font-bold'
                                : 'text-[#a1a1aa] hover:text-white hover:bg-white/5'
                                }`}
                        >
                            SUB
                        </button>
                        <button
                            onClick={() => { if (hasDub) { setLanguage('dub'); setIsLoading(true); } }}
                            disabled={!hasDub}
                            className={`px-4 py-1.5 rounded-full transition-all ${language === 'dub'
                                ? 'bg-[#f4f4f5] text-[#09090b] shadow-[0_2px_10px_rgba(255,255,255,0.1)] font-bold'
                                : hasDub
                                    ? 'text-[#a1a1aa] hover:text-white hover:bg-white/5'
                                    : 'text-white/20 cursor-not-allowed hidden'
                                }`}
                            title={hasDub ? "Switch to English Dub" : "Dub not available"}
                        >
                            DUB
                        </button>
                        <button
                            onClick={() => { setLanguage('hindi'); setIsLoading(true); }}
                            className={`px-4 py-1.5 rounded-full transition-all ${language === 'hindi'
                                ? 'bg-[#FFB000] text-[#09090b] shadow-[0_2px_10px_rgba(255,176,0,0.3)] font-bold'
                                : 'text-[#a1a1aa] hover:text-white hover:bg-white/5'
                                }`}
                            title="Switch to Hindi Dub"
                        >
                            HINDI
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Simulated Skip Intro - purely visual flex if they click it they just sync the timer ahead */}
                    {timeElapsed > 30 && timeElapsed < 120 && (
                        <button
                            onClick={() => setTimeElapsed(120)}
                            className="mr-4 px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-semibold border border-white/5 transition-colors flex items-center gap-1 animate-in fade-in"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                            Skip Intro
                        </button>
                    )}
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#a1a1aa]">
                        Powered by <span className="text-[#FFB000]">MegaPlay</span>
                    </span>
                </div>
            </div >
        </div >
    );
}
