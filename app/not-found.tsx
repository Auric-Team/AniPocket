import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-4">
      <div className="text-center max-w-md">
        <div className="relative w-32 h-32 mx-auto mb-8">
          <div className="absolute inset-0 bg-[var(--accent)]/20 rounded-full blur-xl animate-pulse"></div>
          <svg className="relative w-full h-full text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Page Not Found
        </h1>

        <p className="text-[#888] text-sm mb-6">The page you are looking for doesn&apos;t exist or has been moved.</p>

        <Link
          href="/"
          className="btn btn-primary px-8 py-3 rounded-full text-base shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all hover:scale-105"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}