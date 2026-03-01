import Link from 'next/link';
import { notFound } from 'next/navigation';
import VideoPlayer from '@/components/VideoPlayer';
import EpisodeList from '@/components/EpisodeList';
import SynopsisText from '@/components/SynopsisText';
import WatchProgressTracker from '@/components/WatchProgressTracker';
import { getAnimeDetails, getEpisodeServers } from '@/lib/hianime';

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
                <div className="p-8 rounded bg-[#13131c] text-center max-w-md border border-white/5">
                    <h2 className="text-xl font-bold text-white mb-2">No Episodes Found</h2>
                    <p className="text-[#888] text-sm mb-6">We couldn&apos;t find any episodes for this anime.</p>
                    <Link href="/" className="bg-[var(--accent)] text-[#111] px-6 py-2 rounded-full font-bold text-sm">Return Home</Link>
                </div>
            </div>
        );
    }

    const episodeNumber = num ? parseInt(num) : (anime.episodeList.find(e => e.id === currentEpId)?.number || 1);
    const currentIndex = anime.episodeList.findIndex(e => e.id === currentEpId);
    const prevEpisode = currentIndex > 0 ? anime.episodeList[currentIndex - 1] : null;
    const nextEpisode = currentIndex < anime.episodeList.length - 1 ? anime.episodeList[currentIndex + 1] : null;

    const nextEpisodeUrl = nextEpisode ? `/watch/${id}?ep=${nextEpisode.id}&num=${nextEpisode.number}` : undefined;

    const servers = await getEpisodeServers(currentEpId);
    const hasDub = servers.dub;
    const hasHindi = servers.hindi;

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] relative">

            {/* 1. MASSIVE CINEMATIC BACKGROUND */}
            <div className="absolute top-0 left-0 right-0 h-[80vh] w-full z-0 overflow-hidden pointer-events-none">
                {/* Core Image Grid - aggressively blurred */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-[#0a0a0f] blur-3xl scale-110 opacity-60 transition-all duration-1000"
                    style={{ backgroundImage: `url(${anime.image})` }}
                />
                {/* Vignettes & Gradients to ensure text is readable */}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/80 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-primary)] via-transparent to-transparent" />
            </div>

            {/* 2. MAIN CONTENT WRAPPER */}
            <div className="relative z-10 pt-[60px] flex flex-col min-h-screen">

                {/* Glassmorphism Breadcrumb strip */}
                <div className="w-full bg-black/20 backdrop-blur-md py-2 border-b border-white/5">
                    <div className="container max-w-[1400px] mx-auto px-4">
                        <nav className="flex items-center gap-2 text-[13px] font-medium text-[#aaaaaa]">
                            <Link href="/" className="hover:text-white transition-colors drop-shadow-md">Home</Link>
                            <span className="text-white/30 text-[10px]">●</span>
                            <Link href="/search?type=tv" className="hover:text-white transition-colors drop-shadow-md">TV</Link>
                            <span className="text-white/30 text-[10px]">●</span>
                            <Link href={`/anime/${id}`} className="text-[#f4f4f5] font-bold hover:text-white transition-colors line-clamp-1 max-w-[200px] drop-shadow-md">
                                {anime.title}
                            </Link>
                        </nav>
                    </div>
                </div>

                {/* Invisible Watch History Tracker */}
                <WatchProgressTracker
                    animeId={anime.id}
                    animeTitle={anime.title}
                    animeImage={anime.image}
                    episodeId={currentEpId}
                    episodeNumber={episodeNumber}
                />

                <div className="container max-w-[1400px] mx-auto px-4 mt-6 pb-12">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">

                        {/* Video Column */}
                        <div className="lg:col-span-3">
                            {/* Video Player Box with Cinematic Glow */}
                            <div className="bg-[#0a0a0f] overflow-hidden rounded-t-xl shadow-[0_0_50px_rgba(255,176,0,0.05)] border border-white/5 relative z-10 transition-all duration-500 hover:shadow-[0_0_50px_rgba(255,176,0,0.1)]">
                                <VideoPlayer
                                    key={`${id}-${currentEpId}`}
                                    episodeId={currentEpId}
                                    animeId={id}
                                    animeTitle={anime.title}
                                    episodeNumber={episodeNumber}
                                    hasDub={hasDub}
                                    hasHindi={hasHindi}
                                    nextEpisodeUrl={nextEpisodeUrl}
                                />
                            </div>

                            {/* Player Controls Underneath (Auto Play, Next, Prev, Light) */}
                            <div className="flex items-center justify-between bg-[#1a1a26] px-4 py-3 text-[13px] font-semibold text-[#aaaaaa] border-t border-[#111]">
                                <div className="flex items-center gap-4">
                                    <button className="flex items-center gap-1.5 hover:text-[var(--accent)] transition-colors">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                        Lights
                                    </button>
                                </div>
                                <div className="flex items-center gap-2">
                                    {prevEpisode ? (
                                        <Link
                                            href={`/watch/${id}?ep=${prevEpisode.id}&num=${prevEpisode.number}`}
                                            className="px-3 py-1.5 hover:text-[var(--accent)] transition-colors flex items-center gap-1"
                                        >
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                                            Prev
                                        </Link>
                                    ) : (
                                        <button disabled className="px-3 py-1.5 text-[#555] cursor-not-allowed flex items-center gap-1">
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                                            Prev
                                        </button>
                                    )}

                                    {nextEpisode ? (
                                        <Link
                                            href={`/watch/${id}?ep=${nextEpisode.id}&num=${nextEpisode.number}`}
                                            className="px-3 py-1.5 hover:text-[var(--accent)] transition-colors flex items-center gap-1 text-white border-l border-[#333] pl-4"
                                        >
                                            Next
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                                        </Link>
                                    ) : (
                                        <button disabled className="px-3 py-1.5 text-[#555] cursor-not-allowed flex items-center gap-1 border-l border-[#333] pl-4">
                                            Max
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Title Section below player */}
                            <div className="mt-6 mb-8 flex flex-col md:flex-row gap-6">
                                <div className="w-[160px] hidden md:block shrink-0">
                                    <img src={anime.image} alt={anime.title} className="w-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <h1 className="text-2xl font-semibold text-white mb-2">
                                        {anime.title}
                                    </h1>
                                    <div className="flex items-center gap-3 text-xs mb-4">
                                        <div className="flex bg-[#1a1a26]/90 font-bold rounded overflow-hidden">
                                            {anime.episodes?.sub && (
                                                <span className="bg-[var(--badge-sub)] text-[#111] px-1.5 py-[2px] flex items-center">
                                                    <svg className="w-3 h-3 mr-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12z" /></svg>
                                                    {anime.episodes.sub}
                                                </span>
                                            )}
                                            {anime.episodes?.dub && (
                                                <span className="bg-[var(--badge-dub)] text-[#111] px-1.5 py-[2px] flex items-center border-l border-black/10">
                                                    <svg className="w-3 h-3 mr-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /><circle cx="12" cy="12" r="3" /></svg>
                                                    {anime.episodes.dub}
                                                </span>
                                            )}
                                            {anime.episodes?.hindi && (
                                                <span className="bg-[#f43f5e] text-[#111] px-1.5 py-[2px] flex items-center border-l border-black/10">
                                                    <svg className="w-3 h-3 mr-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /><circle cx="12" cy="12" r="3" /></svg>
                                                    {anime.episodes.hindi}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-[#888]">PG-13</span>
                                        <span className="text-[#888]">HD</span>
                                    </div>
                                    <p className="text-[#aaaaaa] text-[13px] leading-[1.6] mb-4">
                                        <SynopsisText text={anime.synopsis || "No synopsis available."} maxLength={200} />
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right Side Episodes List */}
                        <div className="lg:col-span-1">
                            <div className="bg-[#13131c] w-full flex flex-col h-[500px] lg:h-[calc(100vh-140px)] sticky top-[80px]">
                                <div className="p-3 border-b border-[#222230] flex items-center justify-between">
                                    <h3 className="font-semibold text-white">List of episodes:</h3>
                                </div>
                                <div className="flex-1 overflow-hidden bg-[#1a1a26]">
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
        </div>
    );
}