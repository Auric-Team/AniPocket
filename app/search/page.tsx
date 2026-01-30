import SearchBar from '@/components/SearchBar';
import AnimeCard from '@/components/AnimeCard';
import { 
    searchAnimeFromSite, 
    getTrendingAnime, 
    getMostPopularAnime,
    getTopAiringAnime,
    getAnimeByCategory 
} from '@/lib/hianime';

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; type?: string; sort?: string }>;
}) {
    const { q, type, sort } = await searchParams;
    const query = q || '';

    let results = [];
    let title = 'Browse Anime';

    if (query) {
        results = await searchAnimeFromSite(query);
        title = 'Search Results';
    } else if (type === 'movie') {
        results = await getAnimeByCategory('movie');
        title = 'Movies';
    } else if (type === 'tv') {
        results = await getAnimeByCategory('tv');
        title = 'TV Series';
    } else if (type === 'top-airing') {
        results = await getTopAiringAnime();
        title = 'Top Airing';
    } else if (sort === 'trending') {
        // Use Trending list (Ranked)
        results = await getTrendingAnime();
        title = 'Trending Now';
    } else if (sort === 'popular') {
        results = await getMostPopularAnime();
        title = 'Most Popular';
    } else {
        // Default view (e.g. Top Airing or Trending)
        results = await getTopAiringAnime();
        title = 'Top Airing';
    }

    return (
        <div className="py-20 md:py-24 min-h-screen">
            <div className="container">
                {/* Header */}
                <div className="max-w-2xl mx-auto text-center mb-12">
                    <h1 className="text-3xl md:text-5xl font-bold text-[var(--text-primary)] mb-6">
                        {title}
                    </h1>
                    
                    {!query && (
                        <p className="text-[var(--text-muted)] mb-8 text-lg">
                            Discover the best anime tailored just for you.
                        </p>
                    )}
                    
                    <div className="max-w-md mx-auto">
                        <SearchBar />
                    </div>
                </div>

                {/* Filters */}
                {!query && (
                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        {[
                            { label: 'Top Airing', href: '/search?type=top-airing', active: type === 'top-airing' || (!sort && !type) },
                            { label: 'Trending', href: '/search?sort=trending', active: sort === 'trending' },
                            { label: 'Popular', href: '/search?sort=popular', active: sort === 'popular' },
                            { label: 'Movies', href: '/search?type=movie', active: type === 'movie' },
                            { label: 'TV Series', href: '/search?type=tv', active: type === 'tv' },
                        ].map((filter) => (
                            <a
                                key={filter.label}
                                href={filter.href}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                                    filter.active 
                                        ? 'bg-[var(--accent)] text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]' 
                                        : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border)] hover:border-[var(--accent)] hover:text-white'
                                }`}
                            >
                                {filter.label}
                            </a>
                        ))}
                    </div>
                )}

                {/* Results Count */}
                {query && (
                    <p className="text-sm text-[var(--text-muted)] mb-6">
                        Found {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
                    </p>
                )}

                {/* Results Grid */}
                {results.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                        {results.map((anime, index) => (
                            <AnimeCard key={anime.id} anime={anime} index={index} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-[var(--bg-card)]/50 rounded-2xl border border-[var(--border)] dashed border-2">
                        <div className="w-20 h-20 mx-auto mb-6 bg-[var(--bg-card)] rounded-full flex items-center justify-center">
                            <svg className="w-10 h-10 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">No results found</h3>
                        <p className="text-[var(--text-muted)] max-w-sm mx-auto">
                            We couldn't find any anime matching your search. Try checking for typos or using different keywords.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
