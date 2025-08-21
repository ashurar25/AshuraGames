import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Star, 
  Zap, 
  Puzzle, 
  Car, 
  Users, 
  Globe, 
  Target 
} from 'lucide-react';

interface CategoryFilterProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { id: 'all', label: 'All Games', icon: Star },
  { id: 'action', label: 'Action', icon: Zap },
  { id: 'puzzle', label: 'Puzzle', icon: Puzzle },
  { id: 'racing', label: 'Racing', icon: Car },
  { id: 'multiplayer', label: 'Multiplayer', icon: Users },
  { id: 'io', label: '.IO', icon: Globe },
  { id: 'strategy', label: 'Strategy', icon: Target },
];

export default function CategoryFilter({ activeCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <section className="container mx-auto px-4 mb-12" data-testid="category-filter-section">
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = activeCategory === category.id;
          
          return (
            <Button
              key={category.id}
              variant={isActive ? "default" : "outline"}
              onClick={() => onCategoryChange(category.id)}
              className={`px-6 py-3 rounded-full transition-all ${
                isActive 
                  ? 'glass-dark bg-mint-600/20 border-mint-500 text-white hover:bg-mint-500/30' 
                  : 'glass text-gray-300 border-white/20 hover:text-mint-300 hover:border-mint-500/50'
              }`}
              data-testid={`button-category-${category.id}`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {category.label}
            </Button>
          );
        })}
      </div>
    </section>
  );
}
