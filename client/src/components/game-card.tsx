import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Star, Users } from 'lucide-react';
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
      action: { label: '⚡ Action', color: 'bg-gradient-to-r from-red-500 to-pink-500', glow: 'shadow-red-500/25', bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
      puzzle: { label: '🧩 Puzzle', color: 'bg-gradient-to-r from-purple-500 to-indigo-500', glow: 'shadow-purple-500/25', bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
      racing: { label: '🚗 Racing', color: 'bg-gradient-to-r from-orange-500 to-yellow-500', glow: 'shadow-orange-500/25', bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20' },
      arcade: { label: '🕹️ Arcade', color: 'bg-gradient-to-r from-cyan-500 to-blue-500', glow: 'shadow-cyan-500/25', bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20' },
      adventure: { label: '🗺️ Adventure', color: 'bg-gradient-to-r from-green-500 to-emerald-500', glow: 'shadow-green-500/25', bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' },
      casual: { label: '😊 Casual', color: 'bg-gradient-to-r from-pink-500 to-rose-500', glow: 'shadow-pink-500/25', bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/20' },
      sports: { label: '⚽ Sports', color: 'bg-gradient-to-r from-blue-500 to-sky-500', glow: 'shadow-blue-500/25', bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
      strategy: { label: '♟️ Strategy', color: 'bg-gradient-to-r from-indigo-500 to-purple-500', glow: 'shadow-indigo-500/25', bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20' },
    };
    return badges[category as keyof typeof badges] || { label: category, color: 'bg-gradient-to-r from-gray-500 to-slate-500', glow: 'shadow-gray-500/25', bg: 'bg-gray-500/10', text: 'text-gray-400', border: 'border-gray-500/20' };
  };

  const cardClass = size === 'small' ? 'min-w-[280px]' : size === 'large' ? 'w-full' : 'w-full';
  const imageHeight = size === 'small' ? 'h-40' : size === 'large' ? 'h-48' : 'h-36';

  const badge = getCategoryBadge(game.category);
  const categoryDisplay = badge.label.split(' ')[1]; // Extract category name
  const categoryStyles = getCategoryBadge(game.category);

  // Determine the thumbnail URL, providing a fallback
  const thumbnailUrl = game.thumbnail || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM2MzY2ZjEiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNlZDE5OGMiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0idXJsKCNnKSIvPjx0ZXh0IHg9IjUwJSIgeT0iNDUlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+🎮</90ZXh0Pjx0ZXh0IHg9IjUwJSIgeT0iNjAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+R2FtZTwvdGV4dD48L3N2Zz4=';

  return (
    <div 
      className={`game-card glass-dark rounded-2xl overflow-hidden group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-mint-500/30 transform hover:-translate-y-2 hover:scale-[1.03] border border-gradient-to-r from-white/10 to-mint-500/20 hover:border-mint-400/50 shadow-xl hover:shadow-2xl hover:shadow-mint-500/30 backdrop-blur-xl ${cardClass}`}
      onClick={handlePlayClick}
      data-testid={`card-game-${game.id}`}
    >
      {/* Enhanced Thumbnail Image */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={thumbnailUrl}
          alt={`${game.title} Game`}
          className={`w-full ${imageHeight} object-cover group-hover:scale-110 transition-transform duration-500 filter group-hover:brightness-110`}
          onError={(e) => {
            console.error(`Failed to load thumbnail for game: ${game.title}`);
            (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM2MzY2ZjEiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNlZDE5OGMiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0idXJsKCNnKSIvPjx0ZXh0IHg9IjUwJSIgeT0iNDUlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+🎮</90ZXh0Pjx0ZXh0IHg9IjUwJSIgeT0iNjAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+R2FtZTwvdGV4dD48L3N2Zz4=';
          }}
        />

        {/* Enhanced Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/50 transition-all duration-500"></div>

        {/* Enhanced Category Badge */}
        <div className="absolute top-3 left-3 z-10">
          <Badge 
            className={`text-xs px-3 py-1.5 font-semibold border-2 ${categoryStyles.bg} ${categoryStyles.text} ${categoryStyles.border} backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 rounded-full`}
            data-testid="badge-category"
          >
            {categoryStyles.icon} {categoryDisplay}
          </Badge>
        </div>

        {/* Enhanced Rating Badge */}
        <div className="absolute top-3 right-3 z-10">
          <Badge className="text-xs px-3 py-1.5 glass-dark text-yellow-300 border-2 border-yellow-400/40 backdrop-blur-xl shadow-lg shadow-yellow-500/20 rounded-full font-semibold" data-testid="badge-rating">
            ⭐ {formatRating(game.rating)}
          </Badge>
        </div>

        {/* Enhanced Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
          <div className="relative">
            <div className="absolute inset-0 w-20 h-20 rounded-full bg-gradient-to-r from-mint-400 to-cyan-400 blur-lg opacity-60 animate-pulse"></div>
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-r from-mint-400/90 to-cyan-400/90 backdrop-blur-sm flex items-center justify-center shadow-2xl shadow-mint-500/50 border-2 border-white/30 transform hover:scale-110 transition-transform duration-300">
              <Play className="w-10 h-10 text-white ml-1 filter drop-shadow-lg" />
            </div>
          </div>
        </div>

        {/* Shine Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 via-transparent to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </div>
      </div>

      {/* Enhanced Game Content */}
      <div className="p-4 md:p-5 bg-gradient-to-t from-gray-900/50 to-transparent">
        <h3 className="font-bold text-sm md:text-base text-white mb-3 line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-mint-300 group-hover:to-cyan-300 group-hover:bg-clip-text transition-all duration-500" data-testid={`text-title-${game.id}`}>
          {game.title}
        </h3>
        {size !== 'small' && (
          <p className="text-gray-300 text-xs md:text-sm mb-4 line-clamp-2 leading-relaxed opacity-90" data-testid={`text-description-${game.id}`}>
            {game.description}
          </p>
        )}
        {/* Enhanced Game Stats */}
        <div className="flex items-center justify-between text-xs mt-auto">
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-gray-800/80 to-gray-700/80 border border-gray-600/30 backdrop-blur-sm">
            <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-current" />
            <span className="text-yellow-400 text-sm md:text-base font-semibold" data-testid={`text-rating-${game.id}`}>
              {formatRating(game.rating)}
            </span>
          </div>
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-gray-800/80 to-gray-700/80 border border-gray-600/30 backdrop-blur-sm">
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