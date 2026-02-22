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
                        <Link href={`/watch/${item.id}?ep=${item.episodeId}&num=${item.episodeNumber}`} className="block relative bg-[#27272a] border border-white/5 rounded-xl overflow-hidden transition-all duration-500 group-hover:border-[#FFB000]/50 shadow-[0_4px_20px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_30px_rgba(255,176,0,0.15)] transform group-hover:scale-[1.02]">
                            <div className="relative w-full aspect-video bg-[#09090b]">
                                <img src={item.image || '/placeholder.jpg'} alt={item.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-secondary)] via-transparent to-transparent opacity-80 z-10" />

                                {/* Custom Play Button Overlay */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 bg-black/40 backdrop-blur-[2px]">
                                    <div className="w-14 h-14 bg-gradient-to-r from-[#FFB000] to-[#FF5E00] rounded-full flex items-center justify-center text-[#09090b] shadow-[0_0_30px_rgba(255,176,0,0.3)] transform scale-90 group-hover:scale-100 transition-transform duration-500">
                                        <svg className="w-6 h-6 ml-1 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 relative z-20 bg-[#27272a]">
                                <h3 className="font-semibold text-[#f4f4f5] text-[15px] line-clamp-1 group-hover:text-[#FFB000] transition-colors">{item.title}</h3>
                                <p className="text-[13px] text-[#FFB000] mt-1 font-bold">Resuming Episode {item.episodeNumber}</p>
                            </div>
                        </Link>

                        {/* Delete History Action */}
                        <button
                            onClick={(e) => { e.preventDefault(); removeFromHistory(item.id); }}
                            className="absolute top-2 right-2 z-30 w-8 h-8 bg-black/80 hover:bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm border border-white/10"
                            title="Remove from history"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
}
