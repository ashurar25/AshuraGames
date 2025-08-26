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

  const badge = getCategoryBadge(game.category);
  const categoryDisplay = badge.label.split(' ')[1]; // Extract category name
  const categoryStyles = getCategoryBadge(game.category);

  return (
    <div 
      className={`game-card glass-dark rounded-2xl overflow-hidden group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-mint-500/30 transform hover:-translate-y-2 hover:scale-[1.03] border border-gradient-to-r from-white/10 to-mint-500/20 hover:border-mint-400/50 shadow-xl hover:shadow-2xl hover:shadow-mint-500/30 backdrop-blur-xl ${cardClass}`}
      onClick={handlePlayClick}
      data-testid={`card-game-${game.id}`}
    >
      {/* Header without cover image */}
      <div className="p-4 md:p-5 bg-gradient-to-r from-gray-900/60 to-gray-800/40 border-b border-white/10">
        <div className="flex items-center justify-between mb-3">
          <Badge 
            className={`text-xs px-3 py-1.5 font-semibold border-2 ${categoryStyles.bg} ${categoryStyles.text} ${categoryStyles.border} backdrop-blur-xl rounded-full`}
            data-testid="badge-category"
          >
            {categoryDisplay}
          </Badge>
          <Badge className="text-xs px-3 py-1.5 glass-dark text-yellow-300 border-2 border-yellow-400/40 backdrop-blur-xl rounded-full font-semibold" data-testid="badge-rating">
            ⭐ {formatRating(game.rating)}
          </Badge>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-mint-400/90 to-cyan-400/90 text-black font-semibold shadow hover:shadow-mint-500/30 transition" onClick={handlePlayClick}>
          <Play className="w-4 h-4" /> เล่นเกม
        </button>
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