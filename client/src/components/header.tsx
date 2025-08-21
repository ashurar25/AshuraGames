import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Menu, Gamepad2 } from 'lucide-react';

interface HeaderProps {
  onSearch: (query: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <header className="glass-dark fixed top-0 w-full z-50 border-b border-mint-500/20" data-testid="header-main">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3" data-testid="logo-section">
            <div className="w-10 h-10 mint-gradient rounded-lg flex items-center justify-center animate-glow">
              <Gamepad2 className="text-white text-lg" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">ASHURA</h1>
              <p className="text-mint-300 text-sm -mt-1">Games</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex space-x-6" data-testid="navigation-menu">
              <a href="#" className="text-white hover:text-mint-300 transition-colors" data-testid="link-home">Home</a>
              <a href="#categories" className="text-gray-300 hover:text-mint-300 transition-colors" data-testid="link-categories">Categories</a>
              <a href="#trending" className="text-gray-300 hover:text-mint-300 transition-colors" data-testid="link-trending">Trending</a>
              <a href="#new" className="text-gray-300 hover:text-mint-300 transition-colors" data-testid="link-new">New</a>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative" data-testid="search-section">
              <Input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="glass w-64 px-4 py-2 pl-10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-mint-500 transition-all border-0 bg-white/10"
                data-testid="input-search"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden text-white"
              data-testid="button-mobile-menu"
            >
              <Menu className="text-xl" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
