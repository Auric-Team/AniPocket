import Hero from '@/components/Hero';
import AnimeCard from '@/components/AnimeCard';
import { getTrendingAnime } from '@/lib/hianime';

export const revalidate = 600; // Cache for 10 minutes

export default async function HomePage() {
  const animeList = await getTrendingAnime();

  return (
    <div>
      {/* Hero Section */}
      <Hero />

      {/* Trending Section */}
      <section className="py-12">
        <div className="container">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                Trending Now
              </h2>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                Most popular anime this week
              </p>
            </div>
          </div>

          {/* Anime Grid */}
          {animeList.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {animeList.map((anime, index) => (
                <AnimeCard key={anime.id} anime={anime} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-[var(--text-muted)]">
              <p>Loading anime...</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 border-t border-[var(--border)]">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: 'Fast Streaming',
                desc: 'No buffering with our optimized servers',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2M7 4h10M7 4l-1 16h12l-1-16" />
                  </svg>
                ),
                title: 'HD Quality',
                desc: 'Watch in stunning 1080p resolution',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: 'Daily Updates',
                desc: 'New episodes added as they air',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-6 rounded-lg bg-[var(--bg-card)] border border-[var(--border)]"
              >
                <div className="w-12 h-12 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-[var(--text-muted)]">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
