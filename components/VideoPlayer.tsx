'use client';

import { useState, useEffect } from 'react';

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
    serverType = 'sub'
}: VideoPlayerProps) {
    const [language, setLanguage] = useState<'sub' | 'dub' | 'hindi'>(serverType);
    const [isLoading, setIsLoading] = useState(true);
    const [embedUrl, setEmbedUrl] = useState('');
    const [error, setError] = useState<string | null>(null);

    // Deeply robust source resolution
    useEffect(() => {
        let isMounted = true;
        
        const updatePlayer = async () => {
            setIsLoading(true);
            setError(null);
            
            try {
                if (language === 'hindi') {
                    // Hindi Sync using Animelok logic
                    const res = await fetch(`/api/hindi?title=${encodeURIComponent(animeTitle)}&ep=${episodeNumber || 1}`);
                    const data = await res.json();
                    if (isMounted) {
                        if (data.url) setEmbedUrl(data.url);
                        else setError("Hindi Dub not found for this specific episode.");
                    }
                } else {
                    // Ultra-Robust Zoro ID Extraction
                    const decodedEpId = decodeURIComponent(episodeId);
                    
                    // Match the 'ep=' number which is what external mirrors use
                    let numericId = '';
                    const epMatch = decodedEpId.match(/[?&]ep=(\d+)/);
                    
                    if (epMatch) {
                        numericId = epMatch[1];
                    } else {
                        // Fallback: The numeric part might be at the very end
                        const parts = decodedEpId.split('-');
                        const lastPart = parts[parts.length - 1];
                        numericId = lastPart.split('?')[0]; // Handle cases like slug-1234?extra=...
                    }

                    if (!numericId || isNaN(Number(numericId))) {
                        // Critical Fallback: Use the episode list numbering if direct ID fails
                        // Note: This is a last resort and might not work for all providers
                        setError("Episode ID glitch detected. Trying fallback...");
                    }

                    const url = `https://megaplay.buzz/stream/s-2/${numericId}/${language}?autoplay=1`;
                    if (isMounted) setEmbedUrl(url);
                }
            } catch (e) {
                if (isMounted) setError("Stream resolution failed. Please try another language.");
            }
        };

        updatePlayer();
        return () => { isMounted = false; };
    }, [language, animeTitle, episodeNumber, episodeId]);

    return (
        <div className="w-full flex flex-col bg-[#000] relative aspect-video group overflow-hidden border border-white/5 rounded-3xl">
            {/* Premium Loading Spinner */}
            {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#07070a] z-30">
                    <div className="relative flex items-center justify-center">
                        <div className="w-20 h-20 border-2 border-rose-500/5 border-t-rose-500 rounded-full animate-spin" />
                        <div className="absolute w-12 h-12 border-2 border-rose-500/10 border-b-rose-500 rounded-full animate-spin-slow" />
                    </div>
                    <div className="mt-8 flex flex-col items-center gap-2">
                        <span className="text-[10px] font-black text-rose-500 tracking-[0.5em] uppercase animate-pulse">Initializing Stream</span>
                        <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Zoro-Cloud Protocol v2.4</span>
                    </div>
                </div>
            )}

            {/* Error Overlay with Glassmorphism */}
            {error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#07070a]/90 z-40 text-center px-4 backdrop-blur-md">
                    <div className="max-w-sm p-10 bg-zinc-900/50 rounded-[40px] border border-white/5 shadow-2xl">
                        <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-500">
                             <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </div>
                        <h3 className="text-white font-black text-lg mb-2 uppercase tracking-tight">Source Glitch</h3>
                        <p className="text-zinc-400 text-sm font-medium mb-8 leading-relaxed px-4">{error}</p>
                        <button 
                            onClick={() => { setLanguage('sub'); setError(null); }} 
                            className="w-full bg-rose-500 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-rose-500/20 active:scale-95 transition-all hover:bg-rose-600"
                        >
                            Try Subtitled Version
                        </button>
                    </div>
                </div>
            )}

            {/* High-Performance Iframe */}
            {embedUrl && (
                <iframe
                    key={embedUrl}
                    src={embedUrl}
                    className="w-full h-full border-0 outline-none relative z-10 transition-opacity duration-1000"
                    style={{ opacity: isLoading ? 0 : 1 }}
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    onLoad={() => setIsLoading(false)}
                />
            )}

            {/* Glossy Controls Row */}
            <div className="flex flex-wrap items-center justify-between p-5 bg-[#13131c]/90 backdrop-blur-xl border-t border-white/5 gap-4 relative z-20">
                <div className="flex items-center gap-4">
                    <div className="flex items-center bg-black/40 border border-white/5 rounded-2xl overflow-hidden p-1.5 shadow-2xl">
                        <button 
                            onClick={() => setLanguage('sub')} 
                            className={`px-6 py-2.5 rounded-xl transition-all text-[10px] font-black tracking-widest ${language === 'sub' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                            SUB
                        </button>
                        {/* Always show DUB if possible, only hide if we are 100% sure it's unavailable */}
                        <button 
                            onClick={() => { setLanguage('dub'); }} 
                            className={`px-6 py-2.5 rounded-xl transition-all text-[10px] font-black tracking-widest ${language === 'dub' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                            DUB
                        </button>
                        <button 
                            onClick={() => setLanguage('hindi')} 
                            className={`px-6 py-2.5 rounded-xl transition-all text-[10px] font-black tracking-widest ${language === 'hindi' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                            HINDI
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2.5 px-4 py-2 bg-white/5 rounded-xl border border-white/5">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <span className="text-[9px] font-black tracking-[0.2em] uppercase text-zinc-400">Stream Optimized</span>
                    </div>
                </div>
            </div >
        </div>
    );
}
