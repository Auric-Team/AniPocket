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
        <div className="min-h-screen pb-12">
            {/* Immersive Banner */}
            <div className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
                <Image
                    src={anime.image || '/placeholder.jpg'}
                    alt={anime.title}
                    fill
                    className="object-cover opacity-50 blur-xl scale-110"
                    priority
                    unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/40 to-black/60" />
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-primary)]/90 via-transparent to-transparent" />
            </div>

            {/* Main Content */}
            <div className="container relative z-10 -mt-32 md:-mt-48">
                <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
                    {/* Left Column: Poster & Actions */}
                    <div className="flex-shrink-0 flex flex-col items-center md:items-start w-full md:w-auto">
                        <div className="relative w-[200px] md:w-[280px] aspect-[2/3] rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-4 border-[var(--bg-card)] ring-1 ring-white/10 rotate-1 hover:rotate-0 transition-transform duration-500">
                            <Image
                                src={anime.image || '/placeholder.jpg'}
                                alt={anime.title}
                                fill
                                className="object-cover"
                                priority
                                unoptimized
                            />
                        </div>

                        <div className="w-full max-w-[280px] mt-6 space-y-3">
                            {anime.episodeList.length > 0 ? (
                                <Link
                                    href={`/watch/${anime.id}?ep=${anime.episodeList[0].id}&num=1`}
                                    className="w-full btn btn-primary h-12 text-lg rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] hover:scale-105 transition-all"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                    Watch Now
                                </Link>
                            ) : (
                                <button disabled className="w-full btn btn-secondary h-12 rounded-xl opacity-50 cursor-not-allowed">
                                    Not Available
                                </button>
                            )}
                            
                            <button className="w-full btn bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] border border-[var(--border)] text-[var(--text-secondary)] h-11 rounded-xl transition-colors">
                                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                Add to Watchlist
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Details */}
                    <div className="flex-1 min-w-0 pt-4 md:pt-12">
                        {/* Title & Stats */}
                        <div className="mb-8">
                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                                {anime.title}
                            </h1>
                            
                            <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-gray-300">
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg border border-white/5">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    {anime.type || 'TV'}
                                </span>
                                
                                {anime.status && (
                                    <span className={`px-3 py-1 rounded-lg border backdrop-blur-md ${
                                        anime.status === 'Ongoing' 
                                            ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                                            : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                                    }`}>
                                        {anime.status}
                                    </span>
                                )}

                                <div className="flex items-center gap-3 ml-2">
                                    {anime.episodes?.sub && (
                                        <div className="flex items-center gap-1 text-[var(--text-secondary)]">
                                            <svg className="w-4 h-4 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                            </svg>
                                            <span className="font-medium text-white">{anime.episodes.sub}</span> Sub
                                        </div>
                                    )}
                                    {anime.episodes?.dub && (
                                        <div className="flex items-center gap-1 text-[var(--text-secondary)]">
                                            <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                            </svg>
                                            <span className="font-medium text-white">{anime.episodes.dub}</span> Dub
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Genres */}
                        {anime.genres && anime.genres.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-8">
                                {anime.genres.map((genre) => (
                                    <span
                                        key={genre}
                                        className="px-4 py-1.5 bg-[var(--bg-card)]/50 hover:bg-[var(--accent)]/20 border border-[var(--border)] hover:border-[var(--accent)]/50 rounded-full text-sm text-[var(--text-secondary)] hover:text-white transition-all cursor-default"
                                    >
                                        {genre}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Synopsis */}
                        {anime.synopsis && (
                            <div className="mb-12 bg-[var(--bg-card)]/30 backdrop-blur-sm border border-[var(--border)] rounded-2xl p-6">
                                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Synopsis
                                </h3>
                                <p className="text-[var(--text-secondary)] leading-relaxed text-lg">
                                    {anime.synopsis}
                                </p>
                            </div>
                        )}

                        {/* Episodes Section */}
                        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 md:p-8">
                            {anime.episodeList.length > 0 ? (
                                <EpisodeList
                                    episodes={anime.episodeList}
                                    animeId={anime.id}
                                />
                            ) : (
                                <div className="text-center py-12 text-[var(--text-muted)]">
                                    <p>No episodes available yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

