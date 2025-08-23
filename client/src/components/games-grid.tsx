import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import GameCard from './game-card';
import { Game } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Gamepad2 } from 'lucide-react';
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
            <div 
              key={i} 
              className="glass-dark rounded-xl overflow-hidden animate-pulse" 
              data-testid={`skeleton-game-${i}`}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {/* Enhanced skeleton with shimmer effect */}
              <div className="relative">
                <Skeleton className="w-full h-36 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 animate-shimmer bg-[length:200%_100%]" />
                {/* Floating skeleton badges */}
                <div className="absolute top-3 right-3">
                  <Skeleton className="h-6 w-16 bg-gray-600 rounded-full" />
                </div>
                <div className="absolute top-3 left-3">
                  <Skeleton className="h-6 w-12 bg-gray-600 rounded-full" />
                </div>
              </div>
              
              <div className="p-3 md:p-4 space-y-3">
                {/* Title skeleton */}
                <Skeleton className="h-5 w-3/4 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 animate-shimmer bg-[length:200%_100%] rounded-lg" />
                
                {/* Description skeleton */}
                <div className="space-y-2">
                  <Skeleton className="h-3 w-full bg-gray-700 rounded" />
                  <Skeleton className="h-3 w-2/3 bg-gray-700 rounded" />
                </div>
                
                {/* Stats skeleton */}
                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center space-x-1">
                    <Skeleton className="h-4 w-4 bg-gray-600 rounded-full" />
                    <Skeleton className="h-3 w-8 bg-gray-700 rounded" />
                  </div>
                  <div className="flex items-center space-x-1">
                    <Skeleton className="h-2 w-2 bg-gray-600 rounded-full" />
                    <Skeleton className="h-3 w-12 bg-gray-700 rounded" />
                  </div>
                </div>
              </div>
              
              {/* Shimmer overlay */}
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"></div>
            </div>
          ))
        ) : filteredAndSortedGames.length === 0 ? (
          <div className="col-span-full text-center py-16 animate-slide-up">
            {/* Enhanced empty state */}
            <div className="relative mb-8">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-800 to-gray-700 flex items-center justify-center">
                <Gamepad2 className="w-12 h-12 text-gray-500" />
              </div>
              {/* Floating particles */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce opacity-60" style={{ animationDelay: '0ms' }}></div>
              </div>
              <div className="absolute top-4 left-1/2 transform -translate-x-8">
                <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce opacity-40" style={{ animationDelay: '200ms' }}></div>
              </div>
              <div className="absolute top-4 left-1/2 transform translate-x-8">
                <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce opacity-40" style={{ animationDelay: '400ms' }}></div>
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-4">
              {searchQuery ? `ไม่พบเกมที่ค้นหา "${searchQuery}"` : 'ไม่มีเกมในหมวดหมู่นี้'}
            </h3>
            
            {searchQuery ? (
              <div className="max-w-md mx-auto">
                <p className="text-gray-400 mb-6">ลองค้นหาด้วยคำอื่นหรือเลือกหมวดหมู่อื่น</p>
                <div className="glass-dark px-6 py-3 rounded-xl inline-block border border-gray-700">
                  <span className="text-gray-400 text-sm">คำค้นหา: </span>
                  <span className="text-mint-300 font-medium">"{searchQuery}"</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-400 max-w-md mx-auto">
                เกมในหมวดหมู่นี้กำลังอัพเดท กรุณาลองหมวดหมู่อื่น
              </p>
            )}
          </div>
        ) : (
          visibleGames.map((game, index) => (
            <div
              key={game.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <GameCard
                game={game}
                onPlay={onGamePlay}
              />
            </div>
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
