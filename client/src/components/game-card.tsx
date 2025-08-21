import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Star } from 'lucide-react';
import { Game } from '@shared/schema';

interface GameCardProps {
  game: Game;
  onPlay: (game: Game) => void;
  size?: 'small' | 'medium' | 'large';
}

export default function GameCard({ game, onPlay, size = 'medium' }: GameCardProps) {
  const handlePlayClick = () => {
    onPlay(game);
  };

  const formatPlays = (plays: number): string => {
    if (plays >= 1000000) {
      return `${(plays / 1000000).toFixed(1)}M`;
    }
    if (plays >= 1000) {
      return `${(plays / 1000).toFixed(0)}K`;
    }
    return plays.toString();
  };

  const formatRating = (rating: number): string => {
    return (rating / 10).toFixed(1);
  };

  const getCategoryBadge = (category: string) => {
    const badges = {
      action: { label: '⚡ Action', color: 'bg-red-500' },
      puzzle: { label: '🧩 Puzzle', color: 'bg-purple-500' },
      racing: { label: '🚗 Racing', color: 'bg-orange-500' },
      multiplayer: { label: '👥 Multiplayer', color: 'bg-green-500' },
      io: { label: '🌐 .IO', color: 'bg-blue-500' },
      strategy: { label: '♟️ Strategy', color: 'bg-indigo-500' },
    };
    return badges[category as keyof typeof badges] || { label: category, color: 'bg-gray-500' };
  };

  const cardClass = size === 'small' ? 'min-w-[280px]' : size === 'large' ? 'w-full' : 'w-full';
  const imageHeight = size === 'small' ? 'h-40' : size === 'large' ? 'h-48' : 'h-36';

  const badge = getCategoryBadge(game.category);

  return (
    <div 
      className={`game-card glass-dark rounded-xl overflow-hidden group cursor-pointer ${cardClass}`}
      onClick={handlePlayClick}
      data-testid={`card-game-${game.id}`}
    >
      <div className="relative">
        <img 
          src={game.thumbnail} 
          alt={`${game.title} Game`} 
          className={`w-full ${imageHeight} object-cover`}
          data-testid={`img-game-${game.id}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        {/* Category badge */}
        <div className="absolute top-3 right-3">
          <Badge className={`${badge.color} text-white text-xs px-2 py-1`}>
            {badge.label}
          </Badge>
        </div>

        {/* Special badges */}
        {game.isNew && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-blue-500 text-white text-xs px-2 py-1">
              🆕 ใหม่
            </Badge>
          </div>
        )}
        {game.isTrending && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-orange-500 text-white text-xs px-2 py-1">
              🔥 ฮิต
            </Badge>
          </div>
        )}

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Button 
            className="mint-gradient text-white px-6 py-3 rounded-lg font-semibold transform scale-90 group-hover:scale-100 transition-transform"
            data-testid={`button-play-${game.id}`}
          >
            <Play className="w-4 h-4 mr-2" />
            Play Now
          </Button>
        </div>
      </div>
      
      <div className="p-3 md:p-4">
        <h4 className="text-white font-semibold text-sm md:text-base mb-1 md:mb-2" data-testid={`text-title-${game.id}`}>
          {game.title}
        </h4>
        {size !== 'small' && (
          <p className="text-gray-400 text-xs md:text-sm mb-3" data-testid={`text-description-${game.id}`}>
            {game.description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-mint-300 text-xs md:text-sm flex items-center" data-testid={`text-rating-${game.id}`}>
            <Star className="w-3 h-3 md:w-4 md:h-4 mr-1" />
            {formatRating(game.rating)}
          </span>
          <span className="text-gray-500 text-xs md:text-sm" data-testid={`text-plays-${game.id}`}>
            {formatPlays(game.plays)} plays
          </span>
        </div>
      </div>
    </div>
  );
}
