import Link from 'next/link';
import { notFound } from 'next/navigation';
import VideoPlayer from '@/components/VideoPlayer';
import EpisodeList from '@/components/EpisodeList';
import SynopsisText from '@/components/SynopsisText';
import WatchProgressTracker from '@/components/WatchProgressTracker';
import { getAnimeDetails, getEpisodeServers } from '@/lib/hianime';

// Do NOT use force-dynamic if you want SPA behavior. 
// However, we need to ensure the searchParams are handled correctly in the component.

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
                <div className="p-8 rounded-3xl bg-[#13131c] text-center max-w-md border border-white/5 shadow-2xl">
                    <h2 className="text-xl font-bold text-white mb-2">Series Unavailable</h2>
                    <p className="text-zinc-500 text-sm mb-6">We couldn&apos;t find any episodes for this title.</p>
                    <Link href="/" className="bg-rose-500 text-white px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest shadow-lg shadow-rose-500/20">Return Home</Link>
                </div>
            </div>
        );
    }

    const episodeNumber = num ? parseInt(num) : (anime.episodeList.find(e => e.id === currentEpId)?.number || 1);
    const currentIndex = anime.episodeList.findIndex(e => e.id === currentEpId);
    const prevEpisode = currentIndex > 0 ? anime.episodeList[currentIndex - 1] : null;
    const nextEpisode = currentIndex < anime.episodeList.length - 1 ? anime.episodeList[currentIndex + 1] : null;

    const nextEpisodeUrl = nextEpisode ? `/watch/${id}?ep=${encodeURIComponent(nextEpisode.id)}&num=${nextEpisode.number}` : undefined;

    // Fetch server status
    const servers = await getEpisodeServers(currentEpId);
    const hasDub = servers.dub;
    const hasHindi = servers.hindi;

    return (
        <div className="min-h-screen bg-[#07070a] relative font-sans">
            {/* Cinematic Background */}
            <div className="absolute top-0 left-0 right-0 h-[80vh] w-full z-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-[#0a0a0f] blur-[120px] scale-125 opacity-30 transition-all duration-1000"
                    style={{ backgroundImage: `url(${anime.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07070a] via-[#07070a]/90 to-transparent" />
            </div>

            <div className="relative z-10 pt-[70px] flex flex-col min-h-screen">
                <div className="container max-w-[1400px] mx-auto px-4 mt-6 pb-20">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                        {/* Video Column */}
                        <div className="lg:col-span-3 space-y-6">
                            <div className="bg-[#000] overflow-hidden rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.8)] border border-white/5 relative z-10">
                                <VideoPlayer
                                    key={`player-${currentEpId}`} // Re-mount only the player when episode changes
                                    episodeId={currentEpId}
                                    animeId={id}
                                    animeTitle={anime.title}
                                    episodeNumber={episodeNumber}
                                    hasDub={hasDub}
                                    hasHindi={hasHindi}
                                    nextEpisodeUrl={nextEpisodeUrl}
                                />
                            </div>

                            {/* Player Controls */}
                            <div className="flex items-center justify-between bg-[#13131c]/50 backdrop-blur-xl px-6 py-4 rounded-2xl border border-white/5 shadow-xl">
                                <nav className="flex items-center gap-3 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
                                    <Link href="/" className="hover:text-rose-500 transition-colors">Home</Link>
                                    <span className="opacity-20">/</span>
                                    <span className="text-rose-500 truncate max-w-[200px]">{anime.title}</span>
                                </nav>
                                <div className="flex items-center gap-2">
                                    {prevEpisode && (
                                        <Link 
                                            href={`/watch/${id}?ep=${encodeURIComponent(prevEpisode.id)}&num=${prevEpisode.number}`} 
                                            scroll={false}
                                            className="p-2.5 hover:bg-white/5 rounded-full text-zinc-400 hover:text-white transition-all active:scale-90"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M15 19l-7-7 7-7" /></svg>
                                        </Link>
                                    )}
                                    <div className="px-5 py-1 border-x border-white/5 flex flex-col items-center">
                                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Watching</span>
                                        <span className="text-xs font-black text-white">EP {episodeNumber}</span>
                                    </div>
                                    {nextEpisode && (
                                        <Link 
                                            href={`/watch/${id}?ep=${encodeURIComponent(nextEpisode.id)}&num=${nextEpisode.number}`} 
                                            scroll={false}
                                            className="p-2.5 hover:bg-white/5 rounded-full text-zinc-400 hover:text-white transition-all active:scale-90"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M9 5l7 7-7 7" /></svg>
                                        </Link>
                                    )}
                                </div>
                            </div>

                            {/* Info Section */}
                            <div className="flex flex-col md:flex-row gap-10 p-10 bg-[#13131c]/30 backdrop-blur-md rounded-[40px] border border-white/5 shadow-2xl">
                                <div className="w-[200px] hidden md:block shrink-0 shadow-2xl rounded-3xl overflow-hidden border border-white/5">
                                    <img src={anime.image} alt={anime.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 space-y-6">
                                    <h1 className="text-4xl font-black text-white tracking-tighter leading-tight">{anime.title}</h1>
                                    <div className="flex flex-wrap items-center gap-4">
                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-500/10 rounded-full border border-rose-500/20">
                                            <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
                                            <span className="text-rose-500 text-[10px] font-black uppercase tracking-widest">Ongoing</span>
                                        </div>
                                        <span className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">{anime.type || 'TV Series'}</span>
                                        <div className="w-1 h-1 bg-white/10 rounded-full" />
                                        <span className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">{anime.episodes?.sub} Episodes</span>
                                    </div>
                                    <SynopsisText text={anime.synopsis || "No synopsis available."} maxLength={400} />
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {anime.genres?.map(genre => (
                                            <span key={genre} className="text-[9px] font-black text-zinc-500 bg-white/5 px-4 py-1.5 rounded-full border border-white/5 uppercase tracking-[0.2em] hover:text-white hover:bg-rose-500/10 hover:border-rose-500/20 transition-all cursor-default">{genre}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Episodes Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-[#13131c]/50 backdrop-blur-xl rounded-[32px] border border-white/5 overflow-hidden shadow-2xl sticky top-[90px]">
                                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                    <h3 className="font-black text-white text-[10px] uppercase tracking-[0.4em]">Directory</h3>
                                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 rounded-full border border-white/5">
                                        <span className="text-[9px] font-black text-rose-500 uppercase">{anime.episodeList.length}</span>
                                        <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Files</span>
                                    </div>
                                </div>
                                <div className="h-[600px] lg:h-[72vh]">
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
