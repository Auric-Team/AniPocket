export default function WatchLoading() {
    return (
        <div className="min-h-screen bg-[var(--bg-primary)] relative">

            {/* Cinematic Background Skeleton */}
            <div className="absolute top-0 left-0 right-0 h-[80vh] w-full z-0 overflow-hidden bg-[#13131c] animate-pulse">
                {/* Dark Vignettes mapping reality */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/80 to-transparent" />
            </div>

            <div className="relative z-10 pt-[100px] flex flex-col min-h-screen">
                <div className="container max-w-[1400px] mx-auto px-4 mt-6 pb-12">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">

                        {/* Video Player Skeleton (3/4 Col) */}
                        <div className="lg:col-span-3">
                            <div className="w-full aspect-video bg-[#1c1c28] rounded-t-xl animate-pulse shadow-lg border border-white/5 relative flex items-center justify-center">
                                <div className="w-16 h-16 rounded-full bg-[#3f3f46]/50 drop-shadow-md"></div>
                            </div>

                            <div className="bg-[#1a1a26] px-4 py-3 border-t border-[#111] animate-pulse flex justify-between h-12"></div>

                            <div className="mt-8 flex flex-col md:flex-row gap-6">
                                {/* Poster Box */}
                                <div className="w-[160px] hidden md:block shrink-0 bg-[#1c1c28] aspect-[3/4] rounded-md animate-pulse border border-white/5"></div>

                                {/* Title & Metadata Strings */}
                                <div className="flex-1 pt-2">
                                    <div className="h-8 w-3/4 bg-[#f4f4f5]/80 rounded-lg animate-pulse mb-6"></div>
                                    <div className="flex gap-2 mb-6">
                                        <div className="h-5 w-16 bg-[#1a1a26] rounded border border-white/10 animate-pulse"></div>
                                        <div className="h-5 w-16 bg-[#1a1a26] rounded border border-white/10 animate-pulse"></div>
                                    </div>
                                    {/* Synopsis body */}
                                    <div className="space-y-3">
                                        <div className="h-3 w-content bg-[#52525b]/50 rounded animate-pulse"></div>
                                        <div className="h-3 w-5/6 bg-[#52525b]/50 rounded animate-pulse"></div>
                                        <div className="h-3 w-4/6 bg-[#52525b]/50 rounded animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Episode Scroller Sidebar Skeleton (1/4 Col) */}
                        <div className="lg:col-span-1">
                            <div className="bg-[#13131c] w-full flex flex-col h-[500px] lg:h-[calc(100vh-140px)] sticky top-[80px] rounded animate-pulse border border-white/5">
                                <div className="p-4 border-b border-[#222230] bg-[#1a1a26]">
                                    <div className="h-4 w-32 bg-[#3f3f46]/80 rounded"></div>
                                </div>
                                <div className="flex-1 p-2 space-y-2">
                                    {Array.from({ length: 12 }).map((_, i) => (
                                        <div key={i} className="h-14 w-full bg-[#1c1c28]/50 rounded border border-white/5" style={{ animationDelay: `${i * 50}ms` }}></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
