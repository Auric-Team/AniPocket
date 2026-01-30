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

    if (!ep) {
        notFound();
    }

    const anime = await getAnimeDetails(id);
    if (!anime) {
        notFound();
    }

    const episodeNumber = num ? parseInt(num) : 1;
    const currentIndex = anime.episodeList.findIndex(e => e.id === ep);
    const prevEpisode = currentIndex > 0 ? anime.episodeList[currentIndex - 1] : null;
    const nextEpisode = currentIndex < anime.episodeList.length - 1 ? anime.episodeList[currentIndex + 1] : null;

    // Check if dub is available for THIS specific episode
    // Assumes dub episodes start from 1 and are sequential
    const dubCount = anime.episodes?.dub || 0;
    const hasDub = dubCount >= episodeNumber;

    return (
        <div className="py-6">
            <div className="container">
                {/* Breadcrumb */}
                <nav className="mb-4 text-sm text-[var(--text-muted)]">
                    <ol className="flex items-center gap-2 flex-wrap">
                        <li>
                            <Link href="/" className="hover:text-white transition-colors">Home</Link>
                        </li>
                        <li>/</li>
                        <li>
                            <Link href={`/anime/${id}`} className="hover:text-white transition-colors max-w-[200px] truncate inline-block">
                                {anime.title}
                            </Link>
                        </li>
                        <li>/</li>
                        <li className="text-[var(--text-primary)]">Episode {episodeNumber}</li>
                    </ol>
                </nav>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Video Player */}
                    <div className="xl:col-span-2">
                        <VideoPlayer
                            episodeId={ep}
                            animeTitle={anime.title}
                            episodeNumber={episodeNumber}
                            hasDub={hasDub}
                        />

                        {/* Episode Navigation */}
                        <div className="flex items-center justify-between mt-6 gap-4">
                            {prevEpisode ? (
                                <Link
                                    href={`/watch/${id}?ep=${prevEpisode.id}&num=${prevEpisode.number}`}
                                    className="btn btn-secondary"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    <span className="hidden sm:inline">Previous</span>
                                </Link>
                            ) : <div />}

                            <Link
                                href={`/anime/${id}`}
                                className="text-[var(--text-secondary)] hover:text-white text-sm font-medium"
                            >
                                View All Episodes
                            </Link>

                            {nextEpisode ? (
                                <Link
                                    href={`/watch/${id}?ep=${nextEpisode.id}&num=${nextEpisode.number}`}
                                    className="btn btn-primary"
                                >
                                    <span className="hidden sm:inline">Next</span>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            ) : <div />}
                        </div>
                    </div>

                    {/* Episode List Sidebar */}
                    <div className="xl:col-span-1">
                        <div className="sticky top-20 p-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-hide">
                            <EpisodeList
                                episodes={anime.episodeList}
                                animeId={id}
                                currentEpisodeId={ep}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
