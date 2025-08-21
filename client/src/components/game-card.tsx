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
      action: { label: '⚡ Action', color: 'bg-gradient-to-r from-red-500 to-pink-500', glow: 'shadow-red-500/25' },
      puzzle: { label: '🧩 Puzzle', color: 'bg-gradient-to-r from-purple-500 to-indigo-500', glow: 'shadow-purple-500/25' },
      racing: { label: '🚗 Racing', color: 'bg-gradient-to-r from-orange-500 to-yellow-500', glow: 'shadow-orange-500/25' },
      arcade: { label: '🕹️ Arcade', color: 'bg-gradient-to-r from-cyan-500 to-blue-500', glow: 'shadow-cyan-500/25' },
      adventure: { label: '🗺️ Adventure', color: 'bg-gradient-to-r from-green-500 to-emerald-500', glow: 'shadow-green-500/25' },
      casual: { label: '😊 Casual', color: 'bg-gradient-to-r from-pink-500 to-rose-500', glow: 'shadow-pink-500/25' },
      sports: { label: '⚽ Sports', color: 'bg-gradient-to-r from-blue-500 to-sky-500', glow: 'shadow-blue-500/25' },
      strategy: { label: '♟️ Strategy', color: 'bg-gradient-to-r from-indigo-500 to-purple-500', glow: 'shadow-indigo-500/25' },
    };
    return badges[category as keyof typeof badges] || { label: category, color: 'bg-gradient-to-r from-gray-500 to-slate-500', glow: 'shadow-gray-500/25' };
  };

  const cardClass = size === 'small' ? 'min-w-[280px]' : size === 'large' ? 'w-full' : 'w-full';
  const imageHeight = size === 'small' ? 'h-40' : size === 'large' ? 'h-48' : 'h-36';

  const badge = getCategoryBadge(game.category);

  return (
    <div 
      className={`game-card glass-dark rounded-xl overflow-hidden group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-mint-500/20 transform hover:-translate-y-2 hover:scale-[1.02] ${cardClass}`}
      onClick={handlePlayClick}
      data-testid={`card-game-${game.id}`}
    >
      <div className="relative overflow-hidden">
        <img 
          src={game.thumbnail} 
          alt={`${game.title} Game`} 
          className={`w-full ${imageHeight} object-cover transition-transform duration-700 group-hover:scale-110`}
          data-testid={`img-game-${game.id}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-mint-500/10 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Category badge */}
        <div className="absolute top-3 right-3">
          <Badge className={`${badge.color} ${badge.glow} text-white text-xs px-3 py-1 rounded-full shadow-lg animate-pulse`}>
            {badge.label}
          </Badge>
        </div>

        {/* Special badges */}
        {game.isNew && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs px-3 py-1 rounded-full shadow-lg shadow-blue-500/25 animate-glow">
              🆕 ใหม่
            </Badge>
          </div>
        )}
        {game.isTrending && !game.isNew && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-3 py-1 rounded-full shadow-lg shadow-orange-500/25 animate-glow">
              🔥 ฮิต
            </Badge>
          </div>
        )}

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <Button 
            className="mint-gradient text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-mint-500/30 transform scale-75 group-hover:scale-100 transition-all duration-300 hover:shadow-2xl hover:shadow-mint-500/50"
            data-testid={`button-play-${game.id}`}
          >
            <Play className="w-5 h-5 mr-2 fill-current" />
            Play Now
          </Button>
        </div>

        {/* Hover glow effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-mint-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
      </div>
      
      <div className="p-4 md:p-5 bg-gradient-to-b from-gray-900/50 to-gray-900/80 backdrop-blur-sm">
        <h4 className="text-white font-bold text-base md:text-lg mb-2 group-hover:text-mint-300 transition-colors duration-300" data-testid={`text-title-${game.id}`}>
          {game.title}
        </h4>
        {size !== 'small' && (
          <p className="text-gray-300 text-sm md:text-base mb-4 leading-relaxed group-hover:text-gray-200 transition-colors duration-300" data-testid={`text-description-${game.id}`}>
            {game.description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-current" />
            <span className="text-yellow-400 text-sm md:text-base font-semibold" data-testid={`text-rating-${game.id}`}>
              {formatRating(game.rating)}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-mint-400 rounded-full animate-pulse"></div>
            <span className="text-mint-400 text-sm md:text-base font-medium" data-testid={`text-plays-${game.id}`}>
              {formatPlays(game.plays)} plays
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
