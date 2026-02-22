'use client';

import Link from 'next/link';
import { useWatchHistory } from '@/hooks/useWatchHistory';

export default function ContinueWatchingClient() {
    const { history, isLoaded, removeFromHistory } = useWatchHistory();

    // Return nothing until client loads to avoid hydration mismatch, or if empty
    if (!isLoaded || !history || history.length === 0) return null;

    return (
        <section className="mb-12 relative z-10 pt-16 md:pt-24">
            <div className="flex items-center justify-between mb-4 md:px-2">
                <h2 className="text-xl md:text-2xl font-bold text-[#f4f4f5] tracking-tight flex items-center gap-2 font-outfit">
                    Continue Watching
                </h2>
            </div>

            <div className="flex overflow-x-auto gap-4 pb-6 pt-2 px-4 md:px-2 scrollbar-hide snap-x">
                {history.map((item) => (
                    <div key={`cw-${item.id}`} className="relative flex-shrink-0 w-[240px] md:w-[280px] snap-start group animate-in fade-in transition-all">

                        {/* Wrapper for hover effects and safe linking */}
                        <div className="relative bg-[#09090b] border border-white/5 rounded-xl overflow-hidden transition-all duration-500 group-hover:border-[#FFB000]/50 shadow-[0_4px_20px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_30px_rgba(255,176,0,0.15)] transform group-hover:scale-[1.02]">

                            <Link href={`/watch/${item.id}?ep=${item.episodeId}&num=${item.episodeNumber}`} className="block relative aspect-video bg-[#18181b]">
                                <img src={item.image || '/placeholder.jpg'} alt={item.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/40 to-transparent opacity-90 z-10" />

                                {/* Premium Play Button Hover */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 bg-black/40 backdrop-blur-[2px]">
                                    <div className="w-12 h-12 bg-[#f4f4f5] rounded-full flex items-center justify-center text-[#09090b] shadow-[0_4px_20px_rgba(255,255,255,0.2)] transform scale-90 group-hover:scale-100 transition-transform duration-500">
                                        <svg className="w-5 h-5 ml-1 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                    </div>
                                </div>

                                {/* Bottom Play Progress & Episode Badge */}
                                <div className="absolute bottom-3 left-3 right-3 z-30 flex items-center justify-between">
                                    <span className="bg-[#FFB000] text-[#09090b] text-[10px] font-bold px-2 py-0.5 rounded-full shadow-[0_2px_10px_rgba(255,176,0,0.3)]">
                                        EP {item.episodeNumber}
                                    </span>
                                    {/* Simulated subtle progress bar */}
                                    <div className="w-1/2 h-1 bg-white/20 rounded-full overflow-hidden">
                                        <div className="h-full bg-[#FFB000] rounded-full w-[45%]" />
                                    </div>
                                </div>
                            </Link>

                            {/* Meta Data Block */}
                            <div className="p-3.5 relative z-20 bg-[#18181b] border-t border-white/5 flex gap-2 justify-between items-start">
                                <Link href={`/watch/${item.id}?ep=${item.episodeId}&num=${item.episodeNumber}`} className="flex-1 block">
                                    <h3 className="font-semibold text-[#f4f4f5] text-[14px] line-clamp-1 group-hover:text-[#FFB000] transition-colors pr-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-[12px] text-[#a1a1aa] mt-0.5 max-w-full truncate">
                                        {/* Optional subtext, e.g., "Time remaining..." if tracked, otherwise static encouragement */}
                                        Pick up where you left off
                                    </p>
                                </Link>

                                {/* Safe Delete History Action - Outside of Link bounds */}
                                <button
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeFromHistory(item.id); }}
                                    className="w-8 h-8 rounded-full bg-white/5 hover:bg-red-500/20 text-[#a1a1aa] hover:text-red-500 flex items-center justify-center transition-all border border-white/5 hover:border-red-500/50 flex-shrink-0"
                                    title="Remove from history"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </section>
    );
}
