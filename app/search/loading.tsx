import { SkeletonRow } from '@/components/SkeletonCard';

export default function SearchLoading() {
    return (
        <div className="min-h-screen bg-[var(--bg-primary)] pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-[1400px]">
                {/* Header Skeleton */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                    <div>
                        <div className="h-4 bg-[#888]/20 w-32 rounded mb-3 animate-pulse"></div>
                        <div className="h-10 bg-[#f4f4f5]/80 w-64 rounded-xl animate-pulse"></div>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Filter Buttons Skeleton */}
                        <div className="h-10 w-24 bg-[#13131c] rounded-xl border border-white/5 animate-pulse"></div>
                        <div className="h-10 w-24 bg-[#13131c] rounded-xl border border-white/5 animate-pulse"></div>
                    </div>
                </div>

                {/* Grid Skeleton */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
                    {Array.from({ length: 15 }).map((_, i) => (
                        <div key={i} className="animate-pulse" style={{ animationDelay: `${i * 50}ms` }}>
                            {/* Re-use the card UI directly to ensure grid mapping matches layout perfectly */}
                            <div className="relative aspect-[3/4] bg-[#1c1c28] rounded-xl overflow-hidden mb-3 border border-white/5">
                                <div className="absolute inset-0 bg-[#3f3f46]/30"></div>
                            </div>
                            <div className="h-4 bg-[#52525b]/50 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-[#52525b]/40 rounded w-12"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
