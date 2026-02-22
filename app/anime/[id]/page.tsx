import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import EpisodeList from '@/components/EpisodeList';
import SynopsisText from '@/components/SynopsisText';
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
        <div className="min-h-screen bg-[#0b0c0f] pt-[60px] pb-12">

            {/* HiAnime specific Breadcrumb strip */}
            <div className="w-full bg-[#1e1e24] py-2 border-b border-white/5 mb-6">
                <div className="container max-w-[1400px] mx-auto px-4">
                    <nav className="flex items-center gap-2 text-[13px] font-medium text-[#aaaaaa]">
                        <Link href="/" className="hover:text-[var(--accent)] transition-colors">Home</Link>
                        <span className="text-[#444] text-[10px]">●</span>
                        <Link href="/search?type=tv" className="hover:text-[var(--accent)] transition-colors">TV</Link>
                        <span className="text-[#444] text-[10px]">●</span>
                        <span className="text-[#f9f9f9] line-clamp-1 max-w-[200px]">
                            {anime.title}
                        </span>
                    </nav>
                </div>
            </div>

            <div className="container max-w-[1400px] mx-auto px-4">
                <div className="flex flex-col md:flex-row gap-8 lg:gap-10 items-start">

                    {/* Left Column: Poster & Actions */}
                    <div className="w-[200px] md:w-[250px] shrink-0 mx-auto md:mx-0">
                        <div className="w-full relative aspect-[3/4] bg-[#242428] mb-4">
                            <Image
                                src={anime.image || '/placeholder.jpg'}
                                alt={anime.title}
                                fill
                                className="object-cover"
                                priority
                                unoptimized
                            />
                        </div>

                        {anime.episodeList.length > 0 ? (
                            <Link
                                href={`/watch/${anime.id}?ep=${anime.episodeList[0].id}&num=1`}
                                className="w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[#111] font-bold py-3 rounded-full flex justify-center items-center gap-2 transition-colors mb-3"
                            >
                                <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                                Watch Now
                            </Link>
                        ) : (
                            <button disabled className="w-full bg-[#333] text-[#888] font-bold py-3 rounded-full mb-3 cursor-not-allowed">
                                Not Available
                            </button>
                        )}

                        <button className="w-full bg-[#ffffff14] hover:bg-[#ffffff24] text-white font-semibold py-3 rounded-full transition-colors flex justify-center items-center gap-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg>
                            Add to List
                        </button>
                    </div>

                    {/* Right Column: Details Info */}
                    <div className="flex-1 min-w-0">

                        {/* Title Row */}
                        <div className="mb-4">
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">
                                {anime.title}
                            </h1>

                            {/* Meta Badges */}
                            <div className="flex flex-wrap items-center gap-3 text-sm">
                                <span className="flex items-center gap-1 bg-white text-black px-1.5 py-[2px] rounded-sm font-bold text-[11px] uppercase tracking-wider">
                                    {anime.status && anime.status.includes('Finished') ? 'HD' : anime.status || 'HD'}
                                </span>

                                <span className="flex items-center gap-1 bg-[#242428]/90 font-bold rounded overflow-hidden">
                                    {anime.episodes?.sub && (
                                        <span className="bg-[var(--badge-sub)] text-[#111] px-1.5 py-[2px] flex items-center text-[11px]">
                                            <svg className="w-3 h-3 mr-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12z" /></svg>
                                            {anime.episodes.sub}
                                        </span>
                                    )}
                                    {anime.episodes?.dub && (
                                        <span className="bg-[var(--badge-dub)] text-[#111] px-1.5 py-[2px] flex items-center border-l border-black/10 text-[11px]">
                                            <svg className="w-3 h-3 mr-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /><circle cx="12" cy="12" r="3" /></svg>
                                            {anime.episodes.dub}
                                        </span>
                                    )}
                                    {anime.episodes?.hindi && (
                                        <span className="bg-[#FFB000] text-[#111] px-1.5 py-[2px] flex items-center border-l border-black/10 text-[11px]">
                                            <svg className="w-3 h-3 mr-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /><circle cx="12" cy="12" r="3" /></svg>
                                            {anime.episodes.hindi}
                                        </span>
                                    )}
                                </span>

                                <span className="text-[#888]">•</span>
                                <span className="text-[#aaaaaa] font-medium">{anime.type || 'TV'}</span>
                                <span className="text-[#888]">•</span>
                                <span className="text-[#aaaaaa] font-medium">24m</span>
                            </div>
                        </div>

                        {/* Synopsis */}
                        <div className="mb-6">
                            <SynopsisText text={anime.synopsis || "No description available for this title."} maxLength={300} />
                        </div>

                        <div className="w-full h-[1px] bg-[#ffffff14] mb-6" />

                        {/* Extra Grid Metadata */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-[13px] mb-8">
                            <div className="flex">
                                <span className="text-[#888] w-[90px] font-medium">Type:</span>
                                <span className="text-[#f9f9f9]">{anime.type || 'TV'}</span>
                            </div>
                            <div className="flex">
                                <span className="text-[#888] w-[90px] font-medium">Status:</span>
                                <span className="text-[#f9f9f9]">{anime.status || 'Ongoing'}</span>
                            </div>
                            <div className="flex">
                                <span className="text-[#888] w-[90px] font-medium">Genres:</span>
                                <div className="flex-1 flex flex-wrap gap-1">
                                    {anime.genres && anime.genres.map((g, i) => (
                                        <span key={g} className="text-[#f9f9f9] hover:text-[var(--accent)] cursor-pointer transition-colors">
                                            {g}{i < anime.genres!.length - 1 ? ',' : ''}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Episodes Section - if they scroll down */}
                        <div className="bg-[#1e1e24] w-full flex flex-col h-[400px] border-t border-[#ffffff14]">
                            <div className="p-3 border-b border-[#2b2b31] flex items-center justify-between">
                                <h3 className="font-semibold text-white">Episodes List</h3>
                            </div>
                            <div className="flex-1 overflow-hidden bg-[#242428]">
                                <EpisodeList
                                    episodes={anime.episodeList}
                                    animeId={anime.id}
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
