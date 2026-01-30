'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';

function SearchBarContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className={`relative group transition-all duration-300 ${isFocused ? 'scale-105' : ''}`}>
      <div className={`absolute inset-0 bg-gradient-to-r from-[var(--accent)] to-purple-600 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity ${isFocused ? 'opacity-50' : ''}`} />
      <div className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search anime..."
          className="w-full h-12 pl-5 pr-12 rounded-full bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-all shadow-lg"
        />
        <button
          type="submit"
          className="absolute right-1.5 p-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-full transition-colors"
          aria-label="Search"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </form>
  );
}

export default function SearchBar() {
  return (
    <Suspense fallback={<div className="h-12 w-full bg-[var(--bg-card)] rounded-full animate-pulse" />}>
      <SearchBarContent />
    </Suspense>
  );
}