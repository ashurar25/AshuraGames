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
    <header className="glass-dark fixed top-0 w-full z-50 border-b border-mint-500/20 backdrop-blur-xl" data-testid="header-main">
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Enhanced Logo Section */}
          <div className="flex items-center space-x-3 group cursor-pointer" data-testid="logo-section">
            <div className="relative">
              <div className="w-10 h-10 md:w-12 md:h-12 mint-gradient rounded-xl flex items-center justify-center shadow-lg shadow-mint-500/30 group-hover:shadow-mint-500/50 transition-all duration-300 group-hover:scale-110">
                <Gamepad2 className="text-white text-lg md:text-xl group-hover:animate-bounce-subtle" />
              </div>
              {/* Floating particles effect */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity"></div>
            </div>
            <div className="transition-all duration-300 group-hover:transform group-hover:translate-x-1">
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-white via-mint-300 to-cyan-300 bg-clip-text text-transparent">
                ASHURA
              </h1>
              <p className="text-mint-300 text-xs md:text-sm -mt-1 font-medium">Games Platform</p>
            </div>
          </div>
          
          {/* Enhanced Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <nav className="flex space-x-8" data-testid="navigation-menu">
              <a href="#" className="relative text-white font-medium hover:text-mint-300 transition-all duration-300 group" data-testid="link-home">
                หน้าแรก
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-mint-400 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#categories" className="relative text-gray-300 font-medium hover:text-mint-300 transition-all duration-300 group" data-testid="link-categories">
                หมวดหมู่
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-mint-400 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#trending" className="relative text-gray-300 font-medium hover:text-mint-300 transition-all duration-300 group" data-testid="link-trending">
                ยอดนิยม
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-mint-400 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#new" className="relative text-gray-300 font-medium hover:text-mint-300 transition-all duration-300 group" data-testid="link-new">
                เกมส์ใหม่
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-mint-400 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
              </a>
            </nav>
          </div>

          {/* Enhanced Search and Menu */}
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="relative group" data-testid="search-section">
              <Input
                type="text"
                placeholder="ค้นหาเกมส์..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="glass w-48 md:w-64 px-4 py-2 pl-10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-mint-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 border-0 bg-white/10 group-hover:bg-white/15 focus:w-56 md:focus:w-72"
                data-testid="input-search"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 group-hover:text-mint-400 transition-colors" />
              
              {/* Search suggestions backdrop */}
              {searchQuery && (
                <div className="absolute top-full mt-2 w-full bg-gray-900/95 backdrop-blur-lg rounded-xl border border-mint-500/20 shadow-xl shadow-mint-500/10 z-50">
                  <div className="p-3 text-center text-gray-400 text-sm">กำลังค้นหา "{searchQuery}"...</div>
                </div>
              )}
            </div>
            
            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden text-white hover:text-mint-300 hover:bg-mint-500/10 rounded-xl transition-all duration-300"
              data-testid="button-mobile-menu"
            >
              <Menu className="text-lg md:text-xl" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Animated gradient line */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-mint-500 to-transparent animate-shimmer"></div>
    </header>
  );
}
