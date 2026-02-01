'use client';

import { useState, useEffect, useCallback } from 'react';
import { getEpisodeServers, getEpisodeSource, Server } from '@/app/actions';

interface VideoPlayerProps {
    episodeId: string;
    animeTitle: string;
    episodeNumber?: number;
    hasDub?: boolean; // Initial hint
}

export default function VideoPlayer({ episodeId, animeTitle, episodeNumber, hasDub: initialHasDub = false }: VideoPlayerProps) {
    const [language, setLanguage] = useState<'sub' | 'dub'>('sub');
    const [isLoading, setIsLoading] = useState(true);
    const [isTheaterMode, setIsTheaterMode] = useState(false);
    
    const [servers, setServers] = useState<Server[]>([]);
    const [videoUrl, setVideoUrl] = useState<string>('');
    const [error, setError] = useState<string>('');

    // Load Source for a specific server
    const loadSource = useCallback(async (serverId: string) => {
        setIsLoading(true);
        setError('');
        try {
            const url = await getEpisodeSource(serverId);
            if (url) {
                setVideoUrl(url);
            } else {
                setError('Failed to get video stream.');
            }
        } catch (err) {
            console.error(err);
            setError('Error loading video.');
        } finally {
            // If url is set, iframe onLoad will handle the spinner.
            // If error, we stop spinner here.
            // We'll leave spinner on until iframe loads if successful.
        }
    }, []);

    // Initial Load
    useEffect(() => {
        let mounted = true;

        async function init() {
            setIsLoading(true);
            setError('');
            setVideoUrl('');
            
            try {
                const fetchedServers = await getEpisodeServers(episodeId);
                if (!mounted) return;

                setServers(fetchedServers);

                if (fetchedServers.length === 0) {
                    setError('No servers found for this episode.');
                    setIsLoading(false);
                    return;
                }

                // Determine Language
                // Default to 'sub'. If current lang is 'dub' but no dub servers, switch to 'sub'.
                // If 'sub' but no sub servers (rare), switch to 'dub'.
                let targetLang = language;
                const hasSub = fetchedServers.some(s => s.type === 'sub');
                const hasDub = fetchedServers.some(s => s.type === 'dub');

                if (targetLang === 'dub' && !hasDub) targetLang = 'sub';
                if (targetLang === 'sub' && !hasSub && hasDub) targetLang = 'dub';

                setLanguage(targetLang);

                // Pick Best Server
                // Prefer "MegaCloud" or "VidStreaming" or "HD-1"
                const bestServer = fetchedServers.find(s => s.type === targetLang && (s.name.includes('Mega') || s.name.includes('HD-1'))) 
                                || fetchedServers.find(s => s.type === targetLang);

                if (bestServer) {
                    await loadSource(bestServer.id);
                } else {
                    setError('No servers available.');
                    setIsLoading(false);
                }

            } catch (err) {
                console.error(err);
                if (mounted) {
                    setError('Failed to load episode data.');
                    setIsLoading(false);
                }
            }
        }

        init();

        return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [episodeId]); // Re-run when episode changes

    // Handle Language Switch
    const switchLanguage = async (newLang: 'sub' | 'dub') => {
        if (newLang === language) return;
        
        // Find best server for new lang
        const bestServer = servers.find(s => s.type === newLang && (s.name.includes('Mega') || s.name.includes('HD-1'))) 
                        || servers.find(s => s.type === newLang);
        
        if (bestServer) {
            setLanguage(newLang);
            await loadSource(bestServer.id);
        } else {
            // Should not happen if UI is correct
            console.warn(`No server for ${newLang}`);
        }
    };

    const dubAvailable = servers.some(s => s.type === 'dub');

    return (
        <div className={isTheaterMode ? 'fixed inset-0 z-50 bg-black p-4' : ''}>
            {/* Player Container */}
            <div className={`relative bg-black rounded-lg overflow-hidden ${isTheaterMode ? 'h-full' : ''}`}>
                
                {/* Error State */}
                {error && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-secondary)] z-20">
                         <div className="text-center p-4">
                             <p className="text-red-400 mb-2">{error}</p>
                             <button 
                                onClick={() => window.location.reload()}
                                className="text-sm underline text-[var(--text-muted)] hover:text-white"
                             >
                                 Reload Page
                             </button>
                         </div>
                    </div>
                )}

                {/* Loading Overlay */}
                {isLoading && !error && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-secondary)] z-10">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-10 h-10 border-3 border-[var(--border)] border-t-[var(--accent)] rounded-full animate-spin" />
                            <span className="text-sm text-[var(--text-muted)]">Loading stream...</span>
                        </div>
                    </div>
                )}

                {/* Video Player */}
                {videoUrl && (
                    <iframe
                        src={videoUrl}
                        className={`w-full ${isTheaterMode ? 'h-full' : 'aspect-video'}`}
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                        loading="eager"
                        title={`${animeTitle} Episode ${episodeNumber}`}
                        onLoad={() => setIsLoading(false)}
                    />
                )}
                {!videoUrl && !isLoading && !error && (
                     <div className={`w-full ${isTheaterMode ? 'h-full' : 'aspect-video'} bg-black flex items-center justify-center`}>
                         <span className="text-[var(--text-muted)]">No video loaded.</span>
                     </div>
                )}
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
                    {/* Language Toggle */}
                    {dubAvailable ? (
                        <div className="flex rounded-lg overflow-hidden border border-[var(--border)]">
                            <button
                                onClick={() => switchLanguage('sub')}
                                className={`px-4 py-2 text-sm font-medium transition-colors ${language === 'sub'
                                    ? 'bg-[var(--accent)] text-white'
                                    : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
                                    }`}
                            >
                                SUB
                            </button>
                            <button
                                onClick={() => switchLanguage('dub')}
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

                    {/* Server Selection (Optional, could add later if needed) */}
                    
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
                <span>Current Server: {servers.find(s => s.type === language && (s.name.includes('Mega') || s.name.includes('HD-1')))?.name || 'Default'}</span>
            </div>
        </div>
    );
}