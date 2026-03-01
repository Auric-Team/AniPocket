'use client';

import { useState, useEffect } from 'react';

interface VideoPlayerProps {
    episodeId: string;
    animeId: string;
    animeTitle: string;
    episodeNumber?: number;
    hasDub?: boolean;
    hasHindi?: boolean;
    nextEpisodeUrl?: string; // Re-adding the missing prop
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
    const [language, setLanguage] = useState<'sub' | 'dub' | 'hindi'>(serverType);
    const [isLoading, setIsLoading] = useState(true);
    const [embedUrl, setEmbedUrl] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        
        const updatePlayer = async () => {
            setIsLoading(true);
            setError(null);
            
            try {
                if (language === 'hindi') {
                    const res = await fetch(`/api/hindi?title=${encodeURIComponent(animeTitle)}&ep=${episodeNumber || 1}`);
                    const data = await res.json();
                    if (isMounted) {
                        if (data.url) setEmbedUrl(data.url);
                        else setError("Hindi version not available for this episode.");
                    }
                } else {
                    const match = episodeId.match(/[?&]ep=(\d+)/);
                    const numericId = match ? match[1] : episodeId;
                    const url = `https://megaplay.buzz/stream/s-2/${numericId}/${language}?autoplay=1`;
                    if (isMounted) setEmbedUrl(url);
                }
            } catch (e) {
                if (isMounted) setError("Failed to load player.");
            }
        };

        updatePlayer();
        return () => { isMounted = false; };
    }, [language, animeTitle, episodeNumber, episodeId]);

    return (
        <div className="w-full flex flex-col bg-[#000] relative aspect-video group overflow-hidden">
            {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#07070a] z-30">
                    <div className="w-12 h-12 border-[3px] border-white/5 border-t-rose-500 rounded-full animate-spin mb-4" />
                    <span className="text-[10px] font-black text-rose-500 tracking-[0.4em] uppercase font-outfit">Loading Sync...</span>
                </div>
            )}

            {error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#07070a] z-40 text-center px-4">
                    <div className="max-w-xs p-6 bg-[#13131c] rounded-3xl border border-white/5 shadow-2xl">
                        <p className="text-zinc-400 text-sm font-bold mb-4">{error}</p>
                        <button 
                            onClick={() => setLanguage('sub')} 
                            className="bg-rose-500 text-white px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-rose-500/20 active:scale-95 transition-transform"
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
                    className="w-full h-full border-0 outline-none relative z-10 transition-opacity duration-700"
                    style={{ opacity: isLoading ? 0 : 1 }}
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    onLoad={() => setIsLoading(false)}
                />
            )}

            <div className="flex flex-wrap items-center justify-between p-4 bg-[#13131c] border-t border-white/5 gap-4 relative z-20">
                <div className="flex items-center gap-4 text-xs font-semibold">
                    <div className="flex items-center bg-[#0a0a0f] border border-white/10 rounded-full overflow-hidden p-1 shadow-inner">
                        <button 
                            onClick={() => setLanguage('sub')} 
                            className={`px-6 py-2 rounded-full transition-all text-[10px] font-black tracking-widest ${language === 'sub' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'text-[#71717a] hover:text-white'}`}
                        >
                            SUB
                        </button>
                        <button 
                            onClick={() => { if (hasDub) setLanguage('dub'); }} 
                            disabled={!hasDub} 
                            className={`px-6 py-2 rounded-full transition-all text-[10px] font-black tracking-widest ${language === 'dub' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : hasDub ? 'text-[#71717a] hover:text-white' : 'opacity-20 cursor-not-allowed hidden'}`}
                        >
                            DUB
                        </button>
                        <button 
                            onClick={() => setLanguage('hindi')} 
                            className={`px-6 py-2 rounded-full transition-all text-[10px] font-black tracking-widest ${language === 'hindi' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'text-[#71717a] hover:text-white'}`}
                        >
                            HINDI
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/5">
                        <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
                        <span className="text-[9px] font-black tracking-[0.2em] uppercase text-zinc-500">Auto-Stream Ready</span>
                    </div>
                </div>
            </div >
        </div>
    );
}
