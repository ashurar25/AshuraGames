import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Star, 
  Zap, 
  Puzzle, 
  Car, 
  Users, 
  Globe, 
  Target,
  Gamepad2,
  Map,
  Heart,
  Trophy
} from 'lucide-react';

interface CategoryFilterProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { 
    id: 'all', 
    label: 'เกมทั้งหมด', 
    icon: Star, 
    gradient: 'from-yellow-400 to-orange-500',
    bgGradient: 'from-yellow-500/20 to-orange-500/20',
    shadow: 'shadow-yellow-500/25'
  },
  { 
    id: 'action', 
    label: 'แอ็คชั่น', 
    icon: Zap, 
    gradient: 'from-red-500 to-pink-500',
    bgGradient: 'from-red-500/20 to-pink-500/20',
    shadow: 'shadow-red-500/25'
  },
  { 
    id: 'puzzle', 
    label: 'ปริศนา', 
    icon: Puzzle, 
    gradient: 'from-purple-500 to-indigo-500',
    bgGradient: 'from-purple-500/20 to-indigo-500/20',
    shadow: 'shadow-purple-500/25'
  },
  { 
    id: 'racing', 
    label: 'แข่งรถ', 
    icon: Car, 
    gradient: 'from-orange-500 to-yellow-500',
    bgGradient: 'from-orange-500/20 to-yellow-500/20',
    shadow: 'shadow-orange-500/25'
  },
  { 
    id: 'arcade', 
    label: 'อาเคด', 
    icon: Gamepad2, 
    gradient: 'from-cyan-500 to-blue-500',
    bgGradient: 'from-cyan-500/20 to-blue-500/20',
    shadow: 'shadow-cyan-500/25'
  },
  { 
    id: 'adventure', 
    label: 'ผจญภัย', 
    icon: Map, 
    gradient: 'from-green-500 to-emerald-500',
    bgGradient: 'from-green-500/20 to-emerald-500/20',
    shadow: 'shadow-green-500/25'
  },
  { 
    id: 'casual', 
    label: 'สบายๆ', 
    icon: Heart, 
    gradient: 'from-pink-500 to-rose-500',
    bgGradient: 'from-pink-500/20 to-rose-500/20',
    shadow: 'shadow-pink-500/25'
  },
  { 
    id: 'sports', 
    label: 'กีฬา', 
    icon: Trophy, 
    gradient: 'from-blue-500 to-sky-500',
    bgGradient: 'from-blue-500/20 to-sky-500/20',
    shadow: 'shadow-blue-500/25'
  },
  { 
    id: 'strategy', 
    label: 'กลยุทธ์', 
    icon: Target, 
    gradient: 'from-indigo-500 to-purple-500',
    bgGradient: 'from-indigo-500/20 to-purple-500/20',
    shadow: 'shadow-indigo-500/25'
  },
];

export default function CategoryFilter({ activeCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <section className="container mx-auto px-4 mb-12 animate-slide-up" data-testid="category-filter-section">
      {/* Category Title */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-mint-300 to-cyan-300 bg-clip-text text-transparent mb-2">
          เลือกหมวดหมู่เกม
        </h2>
        <p className="text-gray-400 text-sm md:text-base">เลือกประเภทเกมที่คุณชื่นชอบ</p>
      </div>

      {/* Enhanced Category Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-9 gap-3 md:gap-4 mb-8">
        {categories.map((category, index) => {
          const Icon = category.icon;
          const isActive = activeCategory === category.id;

          return (
            <Button
              key={category.id}
              variant="ghost"
              onClick={() => onCategoryChange(category.id)}
              className={`group relative h-20 md:h-24 flex flex-col items-center justify-center rounded-2xl transition-all duration-500 transform hover:scale-105 ${
                isActive 
                  ? `bg-gradient-to-br ${category.bgGradient} border-2 border-gradient-to-r ${category.gradient} shadow-lg ${category.shadow} scale-105` 
                  : 'glass-dark border border-white/10 hover:border-white/30 hover:bg-white/5'
              }`}
              data-testid={`button-category-${category.id}`}
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              {/* Background glow effect */}
              {isActive && (
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${category.gradient} opacity-20 blur-xl`}></div>
              )}
              
              {/* Icon container */}
              <div className={`relative mb-1 md:mb-2 transition-all duration-300 ${
                isActive 
                  ? 'animate-bounce-subtle' 
                  : 'group-hover:scale-110 group-hover:-translate-y-1'
              }`}>
                <Icon className={`w-6 h-6 md:w-8 md:h-8 transition-all duration-300 ${
                  isActive 
                    ? `text-white drop-shadow-lg` 
                    : 'text-gray-400 group-hover:text-white'
                }`} />
              </div>
              
              {/* Label */}
              <span className={`text-xs md:text-sm font-medium transition-all duration-300 text-center leading-tight ${
                isActive 
                  ? 'text-white font-bold' 
                  : 'text-gray-400 group-hover:text-white'
              }`}>
                {category.label}
              </span>

              {/* Active indicator */}
              {isActive && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-transparent via-white to-transparent rounded-full animate-pulse"></div>
              )}
              
              {/* Hover particles */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="absolute top-2 left-2 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '0ms' }}></div>
                <div className="absolute top-3 right-3 w-1 h-1 bg-mint-400 rounded-full animate-ping" style={{ animationDelay: '200ms' }}></div>
                <div className="absolute bottom-2 left-1/2 w-1 h-1 bg-cyan-400 rounded-full animate-ping" style={{ animationDelay: '400ms' }}></div>
              </div>
            </Button>
          );
        })}
      </div>

      {/* Active category display */}
      <div className="text-center">
        <div className="inline-flex items-center glass-dark px-4 py-2 rounded-full border border-mint-500/30">
          <div className="w-2 h-2 bg-mint-400 rounded-full animate-pulse mr-2"></div>
          <span className="text-mint-300 text-sm font-medium">
            {categories.find(cat => cat.id === activeCategory)?.label || 'เกมทั้งหมด'}
          </span>
        </div>
      </div>
    </section>
  );
}