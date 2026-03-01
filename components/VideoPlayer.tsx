'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface VideoPlayerProps {
    episodeId: string;
    animeId: string;
    animeTitle: string;
    episodeNumber?: number;
    hasDub?: boolean;
    hasHindi?: boolean;
    nextEpisodeUrl?: string;
    serverType?: 'sub' | 'dub';
}

export default function VideoPlayer({
    episodeId,
    animeId,
    animeTitle,
    episodeNumber,
    hasDub = false,
    hasHindi = false,
    nextEpisodeUrl,
    serverType = 'sub'
}: VideoPlayerProps) {
    const router = useRouter();
    const [language, setLanguage] = useState<'sub' | 'dub' | 'hindi'>(serverType);
    const [isLoading, setIsLoading] = useState(true);
    const [embedUrl, setEmbedUrl] = useState('');
    const [error, setError] = useState<string | null>(null);

    const [timeElapsed, setTimeElapsed] = useState(0);
    const [showNextOverlay, setShowNextOverlay] = useState(false);
    const [countdown, setCountdown] = useState(10);
    
    const AUTO_NEXT_TRIGGER_SECONDS = 1350;

    useEffect(() => {
        let isMounted = true;
        
        const updateSource = async () => {
            setIsLoading(true);
            setError(null);
            
            try {
                if (language === 'hindi') {
                    // Fetch the Hindi URL from our local API which resolves Animelok
                    const res = await fetch(`/api/hindi?title=${encodeURIComponent(animeTitle)}&ep=${episodeNumber || 1}`);
                    const data = await res.json();
                    
                    if (isMounted) {
                        if (data.url) {
                            setEmbedUrl(data.url);
                        } else {
                            setError("Hindi dub not found for this episode.");
                        }
                    }
                } else {
                    // For sub/dub, use our local proxy which redirects to the best iframe
                    // We append a timestamp to force the iframe to reload if the episodeId changed
                    const url = `/api/source?episodeId=${encodeURIComponent(episodeId)}&type=${language}&t=${Date.now()}`;
                    setEmbedUrl(url);
                }
            } catch (e) {
                console.error("Source error:", e);
                if (isMounted) {
                    setEmbedUrl(`https://megaplay.buzz/stream/s-2/${episodeId}/${language}?autoplay=1`);
                }
            }
        };

        updateSource();
        return () => { isMounted = false; };
    }, [language, animeTitle, episodeNumber, episodeId]);

    // Master Timer
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeElapsed(prev => prev + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Auto Next Logic
    useEffect(() => {
        if (!nextEpisodeUrl) return;
        if (timeElapsed === AUTO_NEXT_TRIGGER_SECONDS && !showNextOverlay) {
            setShowNextOverlay(true);
        }
        if (showNextOverlay && countdown > 0) {
            const down = setTimeout(() => setCountdown(c => c - 1), 1000);
            return () => clearTimeout(down);
        } else if (showNextOverlay && countdown === 0) {
            router.push(nextEpisodeUrl);
        }
    }, [timeElapsed, showNextOverlay, countdown, nextEpisodeUrl, router]);

    return (
        <div className="w-full flex flex-col bg-[#0a0a0f] relative group/player">
            <div className="relative w-full aspect-video bg-[#050505] overflow-hidden">
                {isLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a0f] z-30">
                        <div className="w-10 h-10 border-2 border-white/10 border-t-[#f43f5e] rounded-full animate-spin mb-4" />
                        <span className="text-sm font-semibold text-[#a1a1aa] tracking-widest uppercase text-white/50 font-outfit">Loading Player...</span>
                    </div>
                )}

                {error && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a0f] z-40 text-center px-4">
                        <div className="bg-[#13131c] p-6 rounded-2xl border border-white/5 shadow-2xl">
                            <p className="text-white font-bold mb-4">{error}</p>
                            <button 
                                onClick={() => setLanguage('sub')} 
                                className="bg-[#f43f5e] text-white px-8 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-rose-500/20 hover:scale-105 transition-transform"
                            >
                                Try Subtitled
                            </button>
                        </div>
                    </div>
                )}

                {embedUrl && (
                    <iframe
                        key={embedUrl}
                        src={embedUrl}
                        className="w-full h-full border-0 outline-none relative z-10"
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                        title={`${animeTitle} Episode ${episodeNumber}`}
                        onLoad={() => setIsLoading(false)}
                    />
                )}

                {showNextOverlay && nextEpisodeUrl && (
                    <div className="absolute bottom-6 right-6 z-50 bg-[#0a0a0f]/95 backdrop-blur-md border border-white/10 p-5 rounded-xl shadow-2xl animate-in slide-in-from-right-8 duration-500 w-80">
                        <div className="flex justify-between items-start mb-3">
                            <h4 className="text-[#f4f4f5] font-bold text-sm tracking-tight">Up Next</h4>
                            <button onClick={() => setShowNextOverlay(false)} className="text-[#a1a1aa] hover:text-white transition-colors">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <p className="text-[#a1a1aa] text-xs mb-4">Playing next episode in {countdown}s...</p>
                        <div className="flex gap-3">
                            <Link href={nextEpisodeUrl} className="flex-1 bg-[#f4f4f5] hover:bg-white text-[#0a0a0f] text-sm font-bold py-2 px-4 rounded-full flex items-center justify-center gap-2 transition-all">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                Play Now
                            </Link>
                            <button onClick={() => setShowNextOverlay(false)} className="flex-1 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold py-2 px-4 rounded-full transition-all">
                                Cancel
                            </button>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 rounded-b-xl overflow-hidden">
                            <div className="h-full bg-[#f43f5e] transition-all ease-linear" style={{ width: `${(countdown / 10) * 100}%`, transitionDuration: '1s' }} />
                        </div>
                    </div>
                )}
            </div>

            <div className="flex flex-wrap items-center justify-between p-4 bg-[#13131c] border-t border-white/5 gap-4">
                <div className="flex items-center gap-4 text-xs font-semibold">
                    <div className="flex items-center bg-[#0a0a0f] border border-white/10 rounded-full overflow-hidden p-1 shadow-inner">
                        <button 
                            onClick={() => { setLanguage('sub'); }} 
                            className={`px-5 py-2 rounded-full transition-all ${language === 'sub' ? 'bg-[#f43f5e] text-white font-bold shadow-lg shadow-rose-500/20' : 'text-[#a1a1aa] hover:text-white hover:bg-white/5'}`}
                        >
                            SUB
                        </button>
                        <button 
                            onClick={() => { if (hasDub) { setLanguage('dub'); } }} 
                            disabled={!hasDub} 
                            className={`px-5 py-2 rounded-full transition-all ${language === 'dub' ? 'bg-[#f43f5e] text-white font-bold shadow-lg shadow-rose-500/20' : hasDub ? 'text-[#a1a1aa] hover:text-white hover:bg-white/5' : 'text-white/20 cursor-not-allowed hidden'}`}
                        >
                            DUB
                        </button>
                        <button 
                            onClick={() => { setLanguage('hindi'); }} 
                            className={`px-5 py-2 rounded-full transition-all ${language === 'hindi' ? 'bg-[#f43f5e] text-white font-bold shadow-lg shadow-rose-500/20' : 'text-[#a1a1aa] hover:text-white hover:bg-white/5'}`}
                        >
                            HINDI
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#71717a] bg-white/5 px-2 py-1 rounded">
                        External Player
                    </span>
                </div>
            </div >
        </div >
    );
}
