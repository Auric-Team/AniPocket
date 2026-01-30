import Link from 'next/link';
import { notFound } from 'next/navigation';
import VideoPlayer from '@/components/VideoPlayer';
import EpisodeList from '@/components/EpisodeList';
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

    // Use suspense/streaming if needed, but for now blocking fetch is fine
    const anime = await getAnimeDetails(id);
    if (!anime) {
        notFound();
    }

    // Default to first episode if no ep param
    const currentEpId = ep || (anime.episodeList.length > 0 ? anime.episodeList[0].id : null);
    
    if (!currentEpId) {
         // Anime exists but no episodes
         return (
             <div className="min-h-screen flex items-center justify-center">
                 <p className="text-[var(--text-muted)]">No episodes available for this anime.</p>
             </div>
         );
    }

    const episodeNumber = num ? parseInt(num) : (anime.episodeList.find(e => e.id === currentEpId)?.number || 1);
    const currentIndex = anime.episodeList.findIndex(e => e.id === currentEpId);
    const prevEpisode = currentIndex > 0 ? anime.episodeList[currentIndex - 1] : null;
    const nextEpisode = currentIndex < anime.episodeList.length - 1 ? anime.episodeList[currentIndex + 1] : null;

    // Check if dub is available (heuristic)
    const hasDub = (anime.episodes?.dub || 0) > 0;

    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            {/* Theater Container */}
            <div className="w-full bg-black/40 border-b border-[var(--border)] backdrop-blur-sm">
                <div className="container py-4">
                    {/* Breadcrumb */}
                    <nav className="mb-4 text-sm text-[var(--text-muted)] flex items-center gap-2">
                        <Link href="/" className="hover:text-white transition-colors">Home</Link>
                        <span className="text-[var(--border)]">/</span>
                        <Link href={`/anime/${id}`} className="hover:text-white transition-colors font-medium text-[var(--text-secondary)]">
                            {anime.title}
                        </Link>
                        <span className="text-[var(--border)]">/</span>
                        <span className="text-white">Episode {episodeNumber}</span>
                    </nav>

                    {/* Main Grid */}
                    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                        {/* Player Column */}
                        <div className="xl:col-span-3">
                            <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                                <VideoPlayer
                                    episodeId={currentEpId}
                                    animeTitle={anime.title}
                                    episodeNumber={episodeNumber}
                                    hasDub={hasDub}
                                />
                            </div>

                            {/* Player Controls / Meta */}
                            <div className="mt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl">
                                <div>
                                    <h1 className="text-lg md:text-xl font-bold text-white line-clamp-1">
                                        {anime.title}
                                    </h1>
                                    <p className="text-[var(--text-secondary)] text-sm mt-1">
                                        Episode {episodeNumber} 
                                        {anime.episodeList[currentIndex]?.title && ` - ${anime.episodeList[currentIndex].title}`}
                                    </p>
                                </div>

                                <div className="flex items-center gap-3 w-full md:w-auto">
                                    {prevEpisode ? (
                                        <Link
                                            href={`/watch/${id}?ep=${prevEpisode.id}&num=${prevEpisode.number}`}
                                            className="flex-1 md:flex-none btn btn-secondary text-sm"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                            Prev
                                        </Link>
                                    ) : (
                                        <button disabled className="flex-1 md:flex-none btn btn-secondary opacity-50 cursor-not-allowed text-sm">Prev</button>
                                    )}

                                    {nextEpisode ? (
                                        <Link
                                            href={`/watch/${id}?ep=${nextEpisode.id}&num=${nextEpisode.number}`}
                                            className="flex-1 md:flex-none btn btn-primary text-sm"
                                        >
                                            Next
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    ) : (
                                        <button disabled className="flex-1 md:flex-none btn btn-primary opacity-50 cursor-not-allowed text-sm">Next</button>
                                    )}
                                </div>
                            </div>
                            
                            {/* Anime Details (Collapsed) */}
                            <div className="mt-6 p-6 bg-[var(--bg-card)]/50 border border-[var(--border)] rounded-xl">
                                <div className="flex gap-4">
                                     <div className="relative w-20 h-28 flex-shrink-0 rounded-lg overflow-hidden bg-[var(--bg-secondary)]">
                                         {/* We use a simple img here for simplicity inside server component */}
                                         <img src={anime.image} alt={anime.title} className="object-cover w-full h-full" />
                                     </div>
                                     <div>
                                         <h3 className="font-bold text-white mb-2">About this anime</h3>
                                         <p className="text-sm text-[var(--text-secondary)] line-clamp-3">
                                             {anime.synopsis || "No synopsis available."}
                                         </p>
                                         <div className="mt-3 flex gap-2">
                                             {anime.genres?.slice(0, 3).map(g => (
                                                 <span key={g} className="px-2 py-1 text-xs bg-[var(--bg-secondary)] border border-[var(--border)] rounded text-[var(--text-muted)]">
                                                     {g}
                                                 </span>
                                             ))}
                                         </div>
                                     </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Column */}
                        <div className="xl:col-span-1">
                            <div className="sticky top-24 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 flex flex-col h-[calc(100vh-140px)]">
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
            
            {/* More content could go here, like "Recommended" */}
        </div>
    );
}