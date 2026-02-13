import type { Metadata, Viewport } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import BackgroundEffects from '@/components/BackgroundEffects';
import ProgressBar from '@/components/ProgressBar';
import { Suspense } from 'react';

const outfit = Outfit({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: 'AniPocket - Next Gen Anime Streaming',
  description: 'Experience anime like never before. Ad-free, HD quality, and beautifully designed.',
  keywords: ['anime', 'streaming', 'watch anime', 'anime online', 'free anime', 'premium'],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0a0a0b',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} scroll-smooth`}>
      <head>
        <link rel="preconnect" href="https://megaplay.buzz" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://megaplay.buzz" />
        <link rel="preconnect" href="https://cors.eu.org" crossOrigin="anonymous" />
      </head>
      <body className="antialiased bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans overflow-x-hidden selection:bg-[var(--accent)] selection:text-white">
        {/* Cinematic Background */}
        <BackgroundEffects />
        
        {/* Navigation Progress Bar */}
        <Suspense fallback={null}>
          <ProgressBar />
        </Suspense>

        {/* UI Layer */}
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />

          <main className="flex-grow">
            {children}
          </main>

          <footer className="border-t border-white/5 py-12 mt-12 bg-black/40 backdrop-blur-xl">
            <div className="container">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                <div className="col-span-1 md:col-span-2">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-tr from-[var(--accent)] to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-[var(--accent)]/20">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <span className="text-2xl font-bold tracking-tight">AniPocket</span>
                  </div>
                  <p className="text-[var(--text-muted)] text-sm max-w-sm leading-relaxed">
                    The next generation of anime streaming. Built for fans who appreciate quality, speed, and aesthetics.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-4 text-white">Explore</h4>
                  <ul className="space-y-2 text-sm text-[var(--text-muted)]">
                    <li><a href="/" className="hover:text-[var(--accent)] transition-colors hover:translate-x-1 inline-block duration-200">Home</a></li>
                    <li><a href="/search?sort=trending" className="hover:text-[var(--accent)] transition-colors hover:translate-x-1 inline-block duration-200">Trending</a></li>
                    <li><a href="/search?type=movie" className="hover:text-[var(--accent)] transition-colors hover:translate-x-1 inline-block duration-200">Movies</a></li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-4 text-white">Info</h4>
                  <ul className="space-y-2 text-sm text-[var(--text-muted)]">
                    <li><span className="cursor-not-allowed hover:text-white transition-colors">DMCA</span></li>
                    <li><span className="cursor-not-allowed hover:text-white transition-colors">Terms</span></li>
                    <li><span className="cursor-not-allowed hover:text-white transition-colors">Privacy</span></li>
                  </ul>
                </div>
              </div>
              
              <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-[var(--text-muted)] text-xs">
                  © {new Date().getFullYear()} AniPocket. Non-commercial project.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
