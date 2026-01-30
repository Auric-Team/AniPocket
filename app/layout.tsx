import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import './globals.css';
import MobileNav from '@/components/MobileNav';

export const metadata: Metadata = {
  title: 'AniPocket - Watch Anime Online',
  description: 'Stream your favorite anime in HD quality. Watch the latest episodes of popular anime series.',
  keywords: ['anime', 'streaming', 'watch anime', 'anime online', 'free anime'],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://megaplay.buzz" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://megaplay.buzz" />
        <link rel="preconnect" href="https://proxy.animo.qzz.io" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg-primary)]/95 backdrop-blur-sm border-b border-[var(--border)]">
          <div className="container">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[var(--accent)] rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <span className="text-xl font-bold">AniPocket</span>
              </Link>

              {/* Desktop Nav */}
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/" className="text-[var(--text-secondary)] hover:text-white text-sm font-medium">
                  Home
                </Link>
                <Link href="/search" className="text-[var(--text-secondary)] hover:text-white text-sm font-medium">
                  Browse
                </Link>
                <Link href="/search" className="btn btn-primary text-sm py-2 px-4">
                  Search
                </Link>
              </nav>

              {/* Mobile Nav */}
              <MobileNav />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="pt-16 min-h-screen">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-[var(--border)] py-8 mt-12">
          <div className="container">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-[var(--accent)] rounded flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <span className="font-semibold">AniPocket</span>
              </div>
              <p className="text-[var(--text-muted)] text-sm">
                © 2024 AniPocket. For educational purposes only.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
