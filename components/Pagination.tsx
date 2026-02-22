'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
}

export default function Pagination({ currentPage, totalPages, hasNextPage }: PaginationProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return;

        const params = new URLSearchParams(searchParams.toString());
        params.set('page', newPage.toString());

        router.push(`/search?${params.toString()}`);
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-2 mt-12 mb-8">
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-10 h-10 rounded-full bg-[#242428] hover:bg-[var(--accent)] hover:text-black flex items-center justify-center text-white transition-colors disabled:opacity-50 disabled:hover:bg-[#242428] disabled:hover:text-white"
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>

            <div className="flex items-center gap-2 px-4 py-2 bg-[#242428] rounded-full text-white font-semibold">
                <span className="text-[var(--accent)]">{currentPage}</span>
                <span className="text-[#888]">of</span>
                <span>{totalPages}</span>
            </div>

            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!hasNextPage && currentPage >= totalPages}
                className="w-10 h-10 rounded-full bg-[#242428] hover:bg-[var(--accent)] hover:text-black flex items-center justify-center text-white transition-colors disabled:opacity-50 disabled:hover:bg-[#242428] disabled:hover:text-white"
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
        </div>
    );
}
