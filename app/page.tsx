import HeroCarousel from '@/components/HeroCarousel';
import AnimeCard from '@/components/AnimeCard';
import TrendingList from '@/components/TrendingList';
import SidebarList from '@/components/SidebarList';
import PageTransition from '@/components/PageTransition';
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
    <PageTransition>
      <div className="min-h-screen pb-12">
        {/* 1. Spotlight Slider */}
        <HeroCarousel animeList={spotlightList} />

        {/* Removed negative margin to prevent overlap and layout issues */}
        <div className="container relative z-10 mt-8 md:mt-12">
          
          {/* 2. Trending List */}
          <section className="mb-16">
             <TrendingList animeList={trendingList} />
          </section>

          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Left Column: Latest Episodes (Main Content) */}
            <div className="lg:col-span-3">
              <section className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-[var(--accent)] flex items-center gap-2">
                    Latest Episodes
                  </h2>
                  <Link href="/search?sort=latest" className="text-sm text-[var(--text-muted)] hover:text-white">View All &rarr;</Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {latestList.map((anime, index) => (
                    <AnimeCard key={anime.id} anime={anime} index={index} />
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column: Sidebar Lists */}
            <div className="lg:col-span-1 space-y-8">
              <SidebarList title="Top Airing" animeList={topAiringList} viewAllLink="/search?type=top-airing" />
              <SidebarList title="Most Popular" animeList={popularList} viewAllLink="/search?sort=popular" />
              <SidebarList title="Most Favorite" animeList={favoriteList} viewAllLink="/search?sort=favorite" />
              <SidebarList title="Latest Completed" animeList={completedList} viewAllLink="/search?status=completed" />
            </div>

          </div>
        </div>
      </div>
    </PageTransition>
  );
}
