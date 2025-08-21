import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import GameCard from './game-card';
import { Game } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';

interface NewReleasesCarouselProps {
  onGamePlay: (game: Game) => void;
}

export default function NewReleasesCarousel({ onGamePlay }: NewReleasesCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: games, isLoading } = useQuery<Game[]>({
    queryKey: ['/api/games/new'],
  });

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const cardWidth = 296; // 280px + 16px gap
      const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="container mx-auto px-4 mb-16" id="new" data-testid="section-new-releases">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-3xl font-bold text-white flex items-center">
          <Star className="text-yellow-500 mr-3" />
          เกมใหม่ล่าสุด
        </h3>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('left')}
            className="glass w-10 h-10 rounded-full text-mint-300 hover:text-white border-white/20"
            data-testid="button-prev-carousel"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('right')}
            className="glass w-10 h-10 rounded-full text-mint-300 hover:text-white border-white/20"
            data-testid="button-next-carousel"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="overflow-hidden">
        <div 
          ref={scrollRef}
          className="flex space-x-6 scroll-container overflow-x-auto pb-2" 
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          data-testid="carousel-container"
        >
          {isLoading ? (
            Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="glass-dark rounded-xl overflow-hidden min-w-[280px]" data-testid={`skeleton-new-${i}`}>
                <Skeleton className="w-full h-40 bg-gray-700" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 bg-gray-700" />
                  <Skeleton className="h-3 bg-gray-700" />
                </div>
              </div>
            ))
          ) : (
            games?.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onPlay={onGamePlay}
                size="small"
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}