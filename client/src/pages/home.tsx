import { useState, useEffect } from 'react';
import Header from '@/components/header';
import CategoryFilter from '@/components/category-filter';
import TrendingSection from '@/components/trending-section';
import NewReleasesCarousel from '@/components/new-releases-carousel';
import GamesGrid from '@/components/games-grid';
import GameModal from '@/components/game-modal';
import Footer from '@/components/footer';
import { Game } from '@shared/schema';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      setSelectedCategory('all'); // Reset category filter when searching
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery(''); // Clear search when changing category
  };

  const handleGamePlay = (game: Game) => {
    setSelectedGame(game);
    setIsGameModalOpen(true);
  };

  const handleGameModalClose = () => {
    setIsGameModalOpen(false);
    setSelectedGame(null);
  };

  // Add intersection observer for animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-slide-up');
        }
      });
    }, observerOptions);

    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      observer.observe(section);
    });

    return () => {
      sections.forEach(section => {
        observer.unobserve(section);
      });
    };
  }, []);

  return (
    <div className="min-h-screen" data-testid="page-home">
      <Header onSearch={handleSearch} />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12" data-testid="section-hero">
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-4 animate-slide-up">
              เล่น<span className="text-transparent bg-clip-text mint-gradient">เกมส์</span>สุดมันส์
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto animate-slide-up">
              ค้นพบเกมส์ HTML5 ฟรีนับพันเกมส์ ไม่ต้องดาวน์โหลด ไม่ต้องสมัครสมาชิก แค่คลิกและเล่นได้เลย!
            </p>
            <div className="flex flex-wrap justify-center gap-3 animate-slide-up">
              <span className="glass px-4 py-2 rounded-full text-mint-300 text-sm border-mint-500/30">🎮 มากกว่า 2000 เกมส์</span>
              <span className="glass px-4 py-2 rounded-full text-mint-300 text-sm border-mint-500/30">⚡ เล่นได้ทันที</span>
              <span className="glass px-4 py-2 rounded-full text-mint-300 text-sm border-mint-500/30">📱 รองรับมือถือ</span>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <CategoryFilter
          activeCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />

        {/* Conditional rendering based on search */}
        {searchQuery ? (
          <GamesGrid
            onGamePlay={handleGamePlay}
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
          />
        ) : (
          <>
            {/* Trending Section */}
            <TrendingSection onGamePlay={handleGamePlay} />

            {/* New Releases Carousel */}
            <NewReleasesCarousel onGamePlay={handleGamePlay} />

            {/* All Games Grid */}
            <GamesGrid
              onGamePlay={handleGamePlay}
              selectedCategory={selectedCategory}
              searchQuery=""
            />
          </>
        )}
      </main>

      {/* Game Modal */}
      <GameModal
        game={selectedGame}
        isOpen={isGameModalOpen}
        onClose={handleGameModalClose}
      />

      <Footer />
    </div>
  );
}
