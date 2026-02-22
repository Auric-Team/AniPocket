import HeroCarousel from '@/components/HeroCarousel';
import AnimeCard from '@/components/AnimeCard';
import TrendingList from '@/components/TrendingList';
import SidebarList from '@/components/SidebarList';
import {
  getSpotlightAnime,
  getTrendingAnime,
  getLatestEpisodeAnime,
  getTopAiringAnime,
  getMostPopularAnime,
  getMostFavoriteAnime,
  getLatestCompletedAnime
} from '@/lib/hianime';
import Link from 'next/link';
import { Suspense } from 'react';

export const revalidate = 600; // Cache for 10 minutes

export default async function HomePage() {
  const [
    spotlightList,
    trendingList,
    latestList,
    topAiringList,
    popularList,
    favoriteList,
    completedList
  ] = await Promise.all([
    getSpotlightAnime(),
    getTrendingAnime(),
    getLatestEpisodeAnime(),
    getTopAiringAnime(),
    getMostPopularAnime(),
    getMostFavoriteAnime(),
    getLatestCompletedAnime()
  ]);

  const continueWatchingList = topAiringList.slice(2, 6);

  return (
    <div className="min-h-screen pb-16 bg-[var(--bg-primary)]">
      {/* Spotlight Slider */}
      <Suspense fallback={
        <div className="w-full h-[50vh] md:h-[70vh] min-h-[400px] max-h-[700px] bg-[#0b0c0f] relative overflow-hidden flex items-center">
          <div className="absolute inset-0 bg-[#1e1e24] animate-pulse" />
          <div className="container relative z-10 px-4">
            <div className="w-3/4 md:w-1/2 space-y-4">
              <div className="h-4 w-24 bg-[#333] rounded animate-pulse" />
              <div className="h-12 md:h-20 w-full bg-[#333] rounded animate-pulse" />
              <div className="h-4 w-48 bg-[#333] rounded animate-pulse" />
              <div className="h-24 w-full bg-[#333] rounded animate-pulse" />
              <div className="flex gap-4 pt-4">
                <div className="h-12 w-32 bg-[#333] rounded-full animate-pulse" />
                <div className="h-12 w-32 bg-[#333] rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      }>
        <HeroCarousel animeList={spotlightList} />
      </Suspense>

      <div className="container max-w-[1400px] mx-auto px-4 md:px-6 mt-8">

        {/* Professional Continue Watching Row */}
        {continueWatchingList.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-4 px-2">
              <svg className="w-6 h-6 text-[var(--accent)]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              <h2 className="text-xl font-bold text-white tracking-wide">Continue Watching</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {continueWatchingList.map((anime) => (
                <Link key={`cw-${anime.id}`} href={`/watch/${anime.id}`} className="group relative bg-[var(--bg-secondary)] border border-white/10 rounded-lg overflow-hidden transition-colors hover:bg-white/5 block">
                  <div className="relative w-full h-24 md:h-32 bg-black">
                    <img src={anime.image} alt={anime.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                      <div className="w-10 h-10 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/30">
                        <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                      </div>
                    </div>
                    {/* Fake Progress */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-black z-30">
                      <div className="h-full bg-[var(--accent)]" style={{ width: `${Math.floor(Math.random() * 60) + 20}%` }} />
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-white text-sm line-clamp-1 group-hover:text-[var(--accent)] transition-colors">{anime.title}</h3>
                    <p className="text-xs text-gray-400 mt-1">Episode {Math.floor(Math.random() * 12) + 1}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Trending Next Row */}
        <section className="mb-12">
          <TrendingList animeList={trendingList} />
        </section>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          <div className="lg:col-span-3">
            <section className="mb-10">
              <div className="flex items-center justify-between mb-6 pb-2 border-b border-white/10">
                <h2 className="text-xl md:text-2xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-[var(--accent)] rounded" />
                  Latest Episodes
                </h2>
                <Link href="/search?sort=latest" className="text-xs font-semibold uppercase text-gray-400 hover:text-white transition-colors">
                  View All
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-5">
                {latestList.map((anime, index) => (
                  <AnimeCard key={anime.id} anime={anime} index={index} />
                ))}
              </div>
            </section>
          </div>

          <div className="lg:col-span-1 space-y-8">
            <SidebarList title="Top Airing" animeList={topAiringList} viewAllLink="/search?type=top-airing" />
            <SidebarList title="Most Popular" animeList={popularList} viewAllLink="/search?sort=popular" />

            <div className="lg:sticky lg:top-24 space-y-8">
              <SidebarList title="Fan Favorites" animeList={favoriteList} viewAllLink="/search?sort=favorite" />
              <SidebarList title="Completed" animeList={completedList} viewAllLink="/search?status=completed" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
