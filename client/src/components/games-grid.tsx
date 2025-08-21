import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import GameCard from './game-card';
import { Game } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus } from 'lucide-react';
import { useState, useMemo } from 'react';

interface GamesGridProps {
  onGamePlay: (game: Game) => void;
  selectedCategory: string;
  searchQuery: string;
}

export default function GamesGrid({ onGamePlay, selectedCategory, searchQuery }: GamesGridProps) {
  const [sortBy, setSortBy] = useState('popular');
  const [visibleCount, setVisibleCount] = useState(20);

  const { data: allGames, isLoading } = useQuery<Game[]>({
    queryKey: ['/api/games'],
  });

  const { data: searchResults, isLoading: isSearching } = useQuery<Game[]>({
    queryKey: ['/api/games/search', searchQuery],
    enabled: searchQuery.length > 0,
    queryFn: async () => {
      const response = await fetch(`/api/games/search?q=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) throw new Error('Search failed');
      return response.json();
    },
  });

  const filteredAndSortedGames = useMemo(() => {
    let games = searchQuery ? searchResults || [] : allGames || [];

    // Filter by category
    if (selectedCategory !== 'all') {
      games = games.filter(game => game.category === selectedCategory);
    }

    // Sort games
    switch (sortBy) {
      case 'newest':
        games.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'rating':
        games.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        games.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'popular':
      default:
        games.sort((a, b) => b.plays - a.plays);
        break;
    }

    return games;
  }, [allGames, searchResults, selectedCategory, sortBy, searchQuery]);

  const visibleGames = filteredAndSortedGames.slice(0, visibleCount);
  const hasMore = visibleCount < filteredAndSortedGames.length;

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 20);
  };

  const currentLoading = isLoading || (searchQuery.length > 0 && isSearching);

  return (
    <section className="container mx-auto px-4 mb-16" id="all-games" data-testid="section-games-grid">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-3xl font-bold text-white">
          {searchQuery ? `Search Results for "${searchQuery}"` : 'All Games'}
        </h3>
        <div className="flex items-center space-x-4">
          <span className="text-gray-400 text-sm" data-testid="text-games-count">
            Showing {visibleGames.length} of {filteredAndSortedGames.length} games
          </span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="glass text-white w-40 border-white/20" data-testid="select-sort">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="glass-dark border-mint-500/20">
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="name">A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6" data-testid="grid-games">
        {currentLoading ? (
          Array.from({ length: 20 }, (_, i) => (
            <div key={i} className="glass-dark rounded-xl overflow-hidden" data-testid={`skeleton-game-${i}`}>
              <Skeleton className="w-full h-36 bg-gray-700" />
              <div className="p-3 space-y-2">
                <Skeleton className="h-4 bg-gray-700" />
                <Skeleton className="h-3 bg-gray-700" />
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-12 bg-gray-700" />
                  <Skeleton className="h-3 w-16 bg-gray-700" />
                </div>
              </div>
            </div>
          ))
        ) : filteredAndSortedGames.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 text-lg mb-4">No games found</div>
            {searchQuery && (
              <p className="text-gray-500">Try adjusting your search terms or browse by category</p>
            )}
          </div>
        ) : (
          visibleGames.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onPlay={onGamePlay}
            />
          ))
        )}
      </div>

      {hasMore && !currentLoading && (
        <div className="text-center mt-12">
          <Button
            onClick={handleLoadMore}
            className="glass-dark px-8 py-4 rounded-lg text-mint-300 hover:text-white border-mint-500/30 hover:border-mint-500 transition-all"
            data-testid="button-load-more"
          >
            <Plus className="w-5 h-5 mr-2" />
            Load More Games
          </Button>
        </div>
      )}
    </section>
  );
}
