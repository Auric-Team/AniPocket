import { SkeletonRow } from '@/components/SkeletonCard';

export default function Loading() {
    return (
        <div className="min-h-screen bg-[#09090b] pt-20">
            {/* Hero Skeleton Map */}
            <div className="w-full h-[60vh] md:h-[75vh] bg-[#18181b] animate-pulse relative overflow-hidden mb-12">
                <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] to-transparent"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4 w-full max-w-2xl px-4">
                    <div className="h-10 md:h-16 bg-[#27272a]/80 rounded-xl w-3/4"></div>
                    <div className="h-4 bg-[#27272a]/60 rounded w-1/2 mt-4"></div>
                    <div className="h-12 bg-[#FFB000]/20 rounded-full w-48 mt-6"></div>
                </div>
            </div>

            {/* Trending Shelf Skeleton Map */}
            <div className="container mx-auto px-4 max-w-[1400px]">
                <div className="mb-8">
                    <div className="h-8 bg-[#27272a] rounded w-64 mb-6"></div>
                    <SkeletonRow count={8} />
                </div>

                <div className="mb-8">
                    <div className="h-8 bg-[#27272a] rounded w-56 mb-6 mt-12"></div>
                    <SkeletonRow count={8} />
                </div>
            </div>
        </div>
    );
}
