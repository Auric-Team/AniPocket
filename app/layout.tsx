import type { Metadata, Viewport } from 'next';
import { Outfit, Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Logo from '@/components/Logo';
import BackgroundEffects from '@/components/BackgroundEffects';
import ProgressBar from '@/components/ProgressBar';
import PageTransition from '@/components/PageTransition';
import Link from 'next/link';
import { Suspense } from 'react';

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
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
  themeColor: '#0b0c0f',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable} scroll-smooth`}>
      <head>
        <link rel="preconnect" href="https://megaplay.buzz" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://megaplay.buzz" />
        <link rel="preconnect" href="https://cors.eu.org" crossOrigin="anonymous" />
      </head>
      <body className="antialiased bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans overflow-x-hidden selection:bg-[var(--accent)] selection:text-[#09090b]">
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
            <PageTransition>
              {children}
            </PageTransition>
          </main>

          <footer className="border-t border-white/5 py-12 mt-12 bg-black/40 backdrop-blur-xl">
            <div className="container">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                <div className="col-span-1 md:col-span-2">
                  <div className="flex items-center gap-2 mb-6">
                    <Logo />
                  </div>
                  <p className="text-[var(--text-muted)] text-sm max-w-sm leading-relaxed">
                    The next generation of anime streaming. Built for fans who appreciate quality, speed, and aesthetics.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-4 text-white">Explore</h4>
                  <ul className="space-y-2 text-sm text-[var(--text-muted)]">
                    <li><Link href="/" className="hover:text-[var(--accent)] transition-colors hover:translate-x-1 inline-block duration-200">Home</Link></li>
                    <li><Link href="/search?sort=trending" className="hover:text-[var(--accent)] transition-colors hover:translate-x-1 inline-block duration-200">Trending</Link></li>
                    <li><Link href="/search?type=movie" className="hover:text-[var(--accent)] transition-colors hover:translate-x-1 inline-block duration-200">Movies</Link></li>
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
