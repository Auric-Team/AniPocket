import SearchBar from '@/components/SearchBar';
import AnimeCard from '@/components/AnimeCard';
import { searchAnimeFromSite, getTrendingAnime } from '@/lib/hianime';

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>;
}) {
    const { q } = await searchParams;
    const query = q || '';

    const results = query
        ? await searchAnimeFromSite(query)
        : await getTrendingAnime();

    return (
        <div className="py-12">
            <div className="container">
                {/* Header */}
                <div className="max-w-2xl mx-auto text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
                        {query ? 'Search Results' : 'Browse Anime'}
                    </h1>
                    <p className="text-[var(--text-muted)] mb-8">
                        {query ? `Showing results for "${query}"` : 'Search for your favorite anime'}
                    </p>
                    <SearchBar />
                </div>

                {/* Results Count */}
                {query && (
                    <p className="text-sm text-[var(--text-muted)] mb-6">
                        Found {results.length} result{results.length !== 1 ? 's' : ''}
                    </p>
                )}

                {/* Results Grid */}
                {results.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {results.map((anime, index) => (
                            <AnimeCard key={anime.id} anime={anime} index={index} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 mx-auto mb-4 bg-[var(--bg-card)] rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-lg text-[var(--text-primary)] mb-2">No results found</p>
                        <p className="text-[var(--text-muted)]">Try searching with different keywords</p>
                    </div>
                )}
            </div>
        </div>
    );
}
