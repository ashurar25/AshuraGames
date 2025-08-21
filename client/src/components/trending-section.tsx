import { useQuery } from '@tanstack/react-query';
import GameCard from './game-card';
import { Game } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';
import { Flame } from 'lucide-react';

interface TrendingSectionProps {
  onGamePlay: (game: Game) => void;
}

export default function TrendingSection({ onGamePlay }: TrendingSectionProps) {
  const { data: games, isLoading } = useQuery<Game[]>({
    queryKey: ['/api/games/trending'],
  });

  return (
    <section className="container mx-auto px-4 mb-16" id="trending" data-testid="section-trending">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-3xl font-bold text-white flex items-center">
          <Flame className="text-orange-500 mr-3" />
          Trending Now
        </h3>
        <a href="#all-games" className="text-mint-300 hover:text-mint-200 transition-colors" data-testid="link-view-all-trending">
          View All
        </a>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="glass-dark rounded-xl overflow-hidden" data-testid={`skeleton-trending-${i}`}>
              <Skeleton className="w-full h-48 bg-gray-700" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 bg-gray-700" />
                <Skeleton className="h-3 bg-gray-700" />
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-12 bg-gray-700" />
                  <Skeleton className="h-3 w-16 bg-gray-700" />
                </div>
              </div>
            </div>
          ))
        ) : (
          games?.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onPlay={onGamePlay}
              size="large"
            />
          ))
        )}
      </div>
    </section>
  );
}
