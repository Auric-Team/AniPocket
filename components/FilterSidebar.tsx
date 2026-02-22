'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

const TYPES = [
    { value: '1', label: 'Movie' },
    { value: '2', label: 'TV Series' },
    { value: '3', label: 'OVA' },
    { value: '4', label: 'ONA' },
    { value: '5', label: 'Special' },
    { value: '6', label: 'Music' },
];

const STATUSES = [
    { value: '1', label: 'Currently Airing' },
    { value: '2', label: 'Completed' },
    { value: '3', label: 'Upcoming' },
];

const SORTS = [
    { value: 'default', label: 'Default' },
    { value: 'recently_updated', label: 'Recently Updated' },
    { value: 'recently_added', label: 'Recently Added' },
    { value: 'release_date', label: 'Release Date' },
    { value: 'score', label: 'Score' },
    { value: 'name_az', label: 'Name A-Z' },
];

export default function FilterSidebar() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [keyword, setKeyword] = useState('');
    const [type, setType] = useState('');
    const [status, setStatus] = useState('');
    const [sort, setSort] = useState('');

    useEffect(() => {
        setTimeout(() => {
            setKeyword(searchParams.get('keyword') || searchParams.get('q') || '');
            setType(searchParams.get('type') || '');
            setStatus(searchParams.get('status') || '');
            setSort(searchParams.get('sort') || '');
        }, 0);
    }, [searchParams]);

    const handleApply = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (keyword) params.set('keyword', keyword);
        if (type) params.set('type', type);
        if (status) params.set('status', status);
        if (sort) params.set('sort', sort);

        // Reset page to 1 when filters change
        params.set('page', '1');

        router.push(`/search?${params.toString()}`);
    };

    const handleClear = () => {
        setKeyword('');
        setType('');
        setStatus('');
        setSort('');
        router.push('/search');
    };

    return (
        <form onSubmit={handleApply} className="bg-[#1e1e24] p-5 rounded-xl border border-white/5 space-y-6 lg:sticky lg:top-24">
            <div>
                <h2 className="text-xl font-bold text-white mb-4">Filters</h2>
                <div className="h-[1px] w-full bg-white/10 mb-5" />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold text-[#aaaaaa]">Keyword</label>
                <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Search anime..."
                    className="w-full bg-[#0b0c0f] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-[var(--accent)] border border-white/5 placeholder-[#555]"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold text-[#aaaaaa]">Type</label>
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-[#0b0c0f] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-[var(--accent)] border border-white/5 appearance-none"
                >
                    <option value="">All Types</option>
                    {TYPES.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                </select>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold text-[#aaaaaa]">Status</label>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-[#0b0c0f] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-[var(--accent)] border border-white/5 appearance-none"
                >
                    <option value="">All Statuses</option>
                    {STATUSES.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                </select>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold text-[#aaaaaa]">Sort By</label>
                <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="w-full bg-[#0b0c0f] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-[var(--accent)] border border-white/5 appearance-none"
                >
                    <option value="">Default sorting</option>
                    {SORTS.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                </select>
            </div>

            <div className="pt-4 flex gap-3">
                <button
                    type="submit"
                    className="flex-1 bg-[var(--accent)] hover:bg-white text-black font-bold py-2.5 rounded-lg transition-colors shadow-md"
                >
                    Filter
                </button>
                <button
                    type="button"
                    onClick={handleClear}
                    className="flex-1 bg-[#242428] hover:bg-[#333] text-white font-semibold py-2.5 rounded-lg transition-colors border border-white/5"
                >
                    Clear
                </button>
            </div>
        </form>
    );
}
