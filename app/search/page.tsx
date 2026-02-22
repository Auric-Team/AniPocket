import AnimeCard from '@/components/AnimeCard';
import FilterSidebar from '@/components/FilterSidebar';
import Pagination from '@/components/Pagination';
import { getAdvancedSearchAnime } from '@/lib/hianime';

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ keyword?: string; type?: string; sort?: string; status?: string; page?: string; q?: string }>;
}) {
    const params = await searchParams;

    // Normalize user's direct navigation query `q` to `keyword` if needed
    const keyword = params.keyword || params.q || '';
    const type = params.type || '';
    const status = params.status || '';
    const sort = params.sort || '';
    const page = parseInt(params.page || '1');

    const result = await getAdvancedSearchAnime({
        keyword,
        type,
        status,
        sort,
        page,
    });

    const isFiltered = keyword || type || status || sort;

    return (
        <div className="min-h-screen py-20 bg-[var(--bg-primary)]">
            <div className="container max-w-[1400px] mx-auto px-4 md:px-6">

                {/* Advanced Header */}
                <div className="mb-8 border-b border-white/10 pb-4">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        {keyword ? `Search Results: "${keyword}"` : isFiltered ? 'Filtered Results' : 'Advanced Discovery'}
                    </h1>
                    <p className="text-[#aaaaaa] text-sm md:text-base">
                        {result.animes.length > 0
                            ? `Showing page ${result.currentPage} of ${result.totalPages}`
                            : 'Adjust your filters below to find exactly what you are looking for.'}
                    </p>
                </div>

                {/* Layout Grid: Sidebar + Results */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                    {/* Filter Sidebar */}
                    <div className="lg:col-span-1">
                        <FilterSidebar />
                    </div>

                    {/* Results Area */}
                    <div className="lg:col-span-3">
                        {result.animes.length > 0 ? (
                            <>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-5">
                                    {result.animes.map((anime, index) => (
                                        <AnimeCard key={anime.id} anime={anime} index={index} />
                                    ))}
                                </div>
                                <Pagination
                                    currentPage={result.currentPage}
                                    totalPages={result.totalPages}
                                    hasNextPage={result.hasNextPage}
                                />
                            </>
                        ) : (
                            <div className="text-center py-24 bg-[#1e1e24] rounded-xl border border-white/5">
                                <div className="w-16 h-16 mx-auto mb-4 bg-[#242428] rounded-full flex items-center justify-center shadow-inner">
                                    <svg className="w-8 h-8 text-[#555]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">No results found</h3>
                                <p className="text-[#888] max-w-sm mx-auto text-sm">
                                    We couldn&apos;t find any anime matching your exact criteria. Try removing some filters or checking your spelling.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
