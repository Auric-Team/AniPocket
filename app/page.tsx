import HeroCarousel from '@/components/HeroCarousel';
import AnimeCard from '@/components/AnimeCard';
import TrendingList from '@/components/TrendingList';
import SidebarList from '@/components/SidebarList';
import ContinueWatchingClient from '@/components/ContinueWatchingClient';
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

  return (
    <div className="min-h-screen pb-16 bg-[var(--bg-primary)]">
      {/* Spotlight Slider */}
      <Suspense fallback={
        <div className="w-full h-[50vh] md:h-[70vh] min-h-[400px] max-h-[700px] bg-[#07070a] relative overflow-hidden flex items-center">
          <div className="absolute inset-0 bg-[#13131c] animate-pulse" />
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

        {/* Real LocalStorage Continue Watching Row */}
        <ContinueWatchingClient />

        {/* Trending Next Row */}
        <section className="mb-12">
          <TrendingList animeList={trendingList} />
        </section>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          <div className="lg:col-span-3">
            <section className="mb-10 mt-4 relative z-10">
              <div className="flex items-center justify-between mb-6 pb-2 border-b border-white/5">
                <h2 className="text-xl md:text-2xl font-bold text-[#f4f4f5] tracking-tight flex items-center gap-2 font-outfit">
                  Latest Episodes
                </h2>
                <Link href="/search?sort=latest" className="text-xs font-semibold uppercase text-[#a1a1aa] hover:text-[#f43f5e] transition-colors">
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
