export default function SkeletonCard() {
    return (
        <div className="relative aspect-[3/4] bg-[#27272a] rounded-xl overflow-hidden mb-3 shadow-[0_4px_20px_rgba(0,0,0,0.5)] border border-white/5 animate-pulse">
            {/* Card Image Skeleton */}
            <div className="absolute inset-0 bg-[#3f3f46]/30"></div>

            {/* Gradient Overlay Matching AnimeCard */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#18181b] via-[#18181b]/40 to-transparent"></div>

            {/* Content Skeletons */}
            <div className="absolute bottom-0 left-0 right-0 p-3 pt-6 z-10 flex flex-col gap-2">
                {/* Title Line 1 */}
                <div className="h-4 bg-[#52525b]/50 rounded w-3/4"></div>
                {/* Title Line 2 (Optional wrapping simulation) */}
                <div className="h-4 bg-[#52525b]/50 rounded w-1/2 mb-1.5"></div>

                {/* Metadata Pills Skeleton */}
                <div className="flex gap-2">
                    <div className="h-3.5 bg-[#52525b]/40 rounded w-10"></div>
                    <div className="h-3.5 bg-[#52525b]/40 rounded w-8"></div>
                </div>
            </div>
        </div>
    );
}

// Full Collection Skeleton Row for Trending
export function SkeletonRow({ count = 10 }: { count?: number }) {
    return (
        <div className="flex overflow-x-hidden gap-4 md:gap-5 pb-6 pt-2 px-2 md:px-0">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="relative flex-shrink-0 w-[140px] md:w-[170px] flex flex-col gap-2 opacity-50" style={{ animationDelay: `${i * 100}ms` }}>
                    <SkeletonCard />
                </div>
            ))}
        </div>
    );
}
