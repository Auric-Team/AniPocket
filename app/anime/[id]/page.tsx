import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import EpisodeList from '@/components/EpisodeList';
import { getAnimeDetails } from '@/lib/hianime';

export const revalidate = 600;

export default async function AnimeDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const anime = await getAnimeDetails(id);

    if (!anime) {
        notFound();
    }

    return (
        <div className="min-h-screen">
            {/* Banner */}
            <div className="relative h-[40vh] md:h-[50vh] overflow-hidden bg-[var(--bg-secondary)]">
                <Image
                    src={anime.image || '/placeholder.jpg'}
                    alt={anime.title}
                    fill
                    className="object-cover opacity-30 blur-sm"
                    priority
                    unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/50 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative -mt-32 pb-12">
                <div className="container">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Poster */}
                        <div className="flex-shrink-0">
                            <div className="relative w-48 md:w-56 aspect-[3/4] rounded-lg overflow-hidden shadow-xl border border-[var(--border)]">
                                <Image
                                    src={anime.image || '/placeholder.jpg'}
                                    alt={anime.title}
                                    fill
                                    className="object-cover"
                                    priority
                                    unoptimized
                                />
                            </div>

                            {/* Watch Button - Mobile */}
                            {anime.episodeList.length > 0 && (
                                <Link
                                    href={`/watch/${anime.id}?ep=${anime.episodeList[0].id}&num=1`}
                                    className="mt-4 w-full btn btn-primary lg:hidden"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                    Watch Now
                                </Link>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <h1 className="text-2xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
                                {anime.title}
                            </h1>

                            {/* Meta Tags */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                {anime.type && (
                                    <span className="px-3 py-1 bg-[var(--bg-card)] border border-[var(--border)] rounded text-sm">
                                        {anime.type}
                                    </span>
                                )}
                                {anime.status && (
                                    <span className={`px-3 py-1 rounded text-sm ${anime.status === 'Ongoing'
                                            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                            : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                        }`}>
                                        {anime.status}
                                    </span>
                                )}
                                <span className="px-3 py-1 bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 rounded text-sm">
                                    {anime.totalEpisodes} Episodes
                                </span>
                            </div>

                            {/* Genres */}
                            {anime.genres && anime.genres.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {anime.genres.map((genre) => (
                                        <span
                                            key={genre}
                                            className="px-2.5 py-1 bg-[var(--bg-hover)] rounded text-xs text-[var(--text-secondary)]"
                                        >
                                            {genre}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Synopsis */}
                            {anime.synopsis && (
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Synopsis</h3>
                                    <p className="text-[var(--text-secondary)] leading-relaxed">{anime.synopsis}</p>
                                </div>
                            )}

                            {/* Watch Button - Desktop */}
                            {anime.episodeList.length > 0 && (
                                <Link
                                    href={`/watch/${anime.id}?ep=${anime.episodeList[0].id}&num=1`}
                                    className="hidden lg:inline-flex btn btn-primary mb-8"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                    Start Watching
                                </Link>
                            )}

                            {/* Episodes */}
                            <div className="p-4 md:p-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg">
                                {anime.episodeList.length > 0 ? (
                                    <EpisodeList
                                        episodes={anime.episodeList}
                                        animeId={anime.id}
                                    />
                                ) : (
                                    <div className="text-center py-8 text-[var(--text-muted)]">
                                        <p>No episodes available yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
