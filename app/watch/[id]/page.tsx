import Link from 'next/link';
import { notFound } from 'next/navigation';
import VideoPlayer from '@/components/VideoPlayer';
import EpisodeList from '@/components/EpisodeList';
import SynopsisText from '@/components/SynopsisText';
import WatchProgressTracker from '@/components/WatchProgressTracker';
import { getAnimeDetails } from '@/lib/hianime';

export default async function WatchPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ ep?: string; num?: string }>;
}) {
    const { id } = await params;
    const { ep, num } = await searchParams;

    const anime = await getAnimeDetails(id);
    if (!anime) {
        notFound();
    }

    const currentEpId = ep || (anime.episodeList.length > 0 ? anime.episodeList[0].id : null);

    if (!currentEpId) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#07070a]">
                <div className="p-12 rounded-[40px] bg-[#13131c] text-center max-w-md border border-white/5 shadow-2xl">
                    <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-8 text-rose-500">
                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    </div>
                    <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">Access Denied</h2>
                    <p className="text-zinc-500 text-sm mb-10 leading-relaxed">The streaming nodes could not establish a connection to this series.</p>
                    <Link href="/" className="inline-block bg-rose-500 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">Return to Deck</Link>
                </div>
            </div>
        );
    }

    const episodeNumber = num ? parseInt(num) : (anime.episodeList.find(e => e.id === currentEpId)?.number || 1);
    const currentIndex = anime.episodeList.findIndex(e => e.id === currentEpId);
    const nextEpisode = currentIndex < anime.episodeList.length - 1 ? anime.episodeList[currentIndex + 1] : null;

    const nextEpisodeUrl = nextEpisode ? `/watch/${id}?ep=${encodeURIComponent(nextEpisode.id)}&num=${nextEpisode.number}` : undefined;

    // Use a robust fallback for the dub count
    const hasDub = (anime.episodes?.dub || 0) > 0;
    const hasHindi = true;

    return (
        <div className="min-h-screen bg-[#07070a] relative font-sans">
            <div className="absolute top-0 left-0 right-0 h-[80vh] w-full z-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-[#0a0a0f] blur-[150px] scale-125 opacity-20 transition-all duration-1000"
                    style={{ backgroundImage: `url(${anime.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07070a] via-[#07070a]/90 to-transparent" />
            </div>

            <div className="relative z-10 pt-[80px] flex flex-col min-h-screen">
                <div className="container max-w-[1400px] mx-auto px-4 mt-4 pb-20">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                        <div className="lg:col-span-3 space-y-6">
                            <div className="bg-[#000] overflow-hidden rounded-[32px] shadow-[0_0_100px_rgba(0,0,0,0.9)] border border-white/5 relative z-10">
                                <VideoPlayer
                                    key={`player-${currentEpId}`}
                                    episodeId={currentEpId}
                                    animeId={id}
                                    animeTitle={anime.title}
                                    episodeNumber={episodeNumber}
                                    hasDub={hasDub}
                                    hasHindi={hasHindi}
                                    nextEpisodeUrl={nextEpisodeUrl}
                                />
                            </div>

                            <div className="flex flex-col md:flex-row gap-10 p-10 bg-[#13131c]/20 backdrop-blur-3xl rounded-[48px] border border-white/5 shadow-2xl">
                                <div className="w-[200px] hidden md:block shrink-0 shadow-2xl rounded-[32px] overflow-hidden border border-white/10 ring-1 ring-white/5">
                                    <img src={anime.image} alt={anime.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 space-y-6">
                                    <div className="flex flex-col gap-2">
                                        <nav className="flex items-center gap-3 text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em]">
                                            <Link href="/" className="hover:text-rose-500 transition-colors">Home</Link>
                                            <span className="opacity-20 text-[6px]">/</span>
                                            <span className="text-zinc-500">Streaming</span>
                                            <span className="opacity-20 text-[6px]">/</span>
                                            <span className="text-rose-500 truncate max-w-[200px]">{anime.title}</span>
                                        </nav>
                                        <h1 className="text-5xl font-black text-white tracking-tighter leading-none">{anime.title}</h1>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4">
                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                            <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">Active</span>
                                        </div>
                                        <span className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">{anime.type || 'TV'}</span>
                                        <div className="w-1 h-1 bg-white/10 rounded-full" />
                                        <span className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">{anime.episodes?.sub} Eps Total</span>
                                    </div>
                                    
                                    <div className="bg-white/[0.02] p-6 rounded-3xl border border-white/5">
                                        <SynopsisText text={anime.synopsis || "No data available."} maxLength={450} />
                                    </div>

                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {anime.genres?.map(genre => (
                                            <span key={genre} className="text-[9px] font-black text-zinc-500 bg-white/5 px-4 py-2 rounded-xl border border-white/5 uppercase tracking-[0.2em] hover:text-white hover:bg-rose-500/10 transition-all cursor-default">{genre}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            <div className="bg-[#13131c]/40 backdrop-blur-3xl rounded-[40px] border border-white/5 overflow-hidden shadow-2xl sticky top-[90px]">
                                <div className="p-7 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                                    <h3 className="font-black text-white text-[10px] uppercase tracking-[0.4em]">Index</h3>
                                    <div className="flex items-center gap-2 px-3 py-1 bg-rose-500/10 rounded-full border border-rose-500/10">
                                        <span className="text-[10px] font-black text-rose-500">{anime.episodeList.length}</span>
                                        <span className="text-[8px] font-black text-rose-500/50 uppercase tracking-widest">Files</span>
                                    </div>
                                </div>
                                <div className="h-[600px] lg:h-[75vh]">
                                    <EpisodeList
                                        episodes={anime.episodeList}
                                        animeId={id}
                                        currentEpisodeId={currentEpId}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <WatchProgressTracker
                animeId={anime.id}
                animeTitle={anime.title}
                animeImage={anime.image}
                episodeId={currentEpId}
                episodeNumber={episodeNumber}
            />
        </div>
    );
}
