import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Menu, X, GamepadIcon, User, LogIn, Crown, Coins, Moon, Sun, Trophy } from 'lucide-react';
import { Link } from 'wouter';
import { useTheme } from '@/hooks/use-theme';

interface HeaderProps {
  onSearch: (query: string) => void;
  searchQuery: string;
}

interface UserData {
  id: string;
  username: string;
  level: number;
  coins: number;
  isAdmin: boolean;
}

export default function Header({ onSearch, searchQuery }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    // ตรวจสอบข้อมูลผู้ใช้จาก localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }

    // ฟังการเปลี่ยนแปลงใน localStorage
    const handleStorageChange = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (error) {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/10 backdrop-blur-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer">
              <img 
                src="/ashura-logo.png" 
                alt="ASHURA Games Logo" 
                className="w-10 h-10 object-contain"
              />
              <div>
                <h1 className="text-xl font-bold text-white">ASHURA</h1>
                <p className="text-xs text-gray-400">Games</p>
              </div>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="ค้นหาเกม..."
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                className="pl-10 glass border-white/20 text-white placeholder-gray-400"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Leaderboard */}
            <Link href="/leaderboard">
              <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-gray-800/50">
                <Trophy className="w-4 h-4 mr-2" />
                อันดับ
              </Button>
            </Link>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="text-gray-400 hover:text-white hover:bg-gray-800/50"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            {user ? (
              <>
                {/* User Info */}
                <div className="flex items-center space-x-3 text-white">
                  <div className="flex items-center space-x-2 bg-gray-800/50 rounded-lg px-3 py-2">
                    <Coins className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-semibold">{user.coins.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 mint-gradient rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-sm">
                      <div className="font-semibold">{user.username}</div>
                      <div className="text-xs text-gray-400">เลเวล {user.level}</div>
                    </div>
                    {user.isAdmin && (
                      <Badge className="bg-purple-500 text-white text-xs">
                        <Crown className="w-3 h-3 mr-1" />
                        แอดมิน
                      </Badge>
                    )}
                  </div>
                </div>

                <Link href="/profile">
                  <Button variant="outline" className="text-mint-300 border-mint-500/50 hover:bg-mint-500/10">
                    <User className="w-4 h-4 mr-2" />
                    โปรไฟล์
                  </Button>
                </Link>

                {user.isAdmin && (
                  <Link href="/admin">
                    <Button variant="outline" className="text-purple-300 border-purple-500/50 hover:bg-purple-500/10">
                      <Crown className="w-4 h-4 mr-2" />
                      แอดมิน
                    </Button>
                  </Link>
                )}

                <Button 
                  onClick={handleLogout}
                  variant="outline" 
                  className="text-red-400 border-red-500/50 hover:bg-red-500/10"
                  size="sm"
                >
                  ออกจากระบบ
                </Button>
              </>
            ) : (
              <Link href="/auth">
                <Button className="mint-gradient text-white">
                  <LogIn className="w-4 h-4 mr-2" />
                  เข้าสู่ระบบ
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="ค้นหาเกม..."
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                className="pl-10 glass border-white/20 text-white placeholder-gray-400"
              />
            </div>

            {user ? (
              <div className="flex flex-col space-y-3">
                {/* User Info Mobile */}
                <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 mint-gradient rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold">{user.username}</div>
                      <div className="text-xs text-gray-400">เลเวล {user.level}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Coins className="w-4 h-4 text-yellow-400" />
                    <span className="text-white font-semibold">{user.coins.toLocaleString()}</span>
                  </div>
                </div>

                <Link href="/profile" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full text-mint-300 border-mint-500/50 hover:bg-mint-500/10">
                    <User className="w-4 h-4 mr-2" />
                    โปรไฟล์
                  </Button>
                </Link>

                {user.isAdmin && (
                  <Link href="/admin" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full text-purple-300 border-purple-500/50 hover:bg-purple-500/10">
                      <Crown className="w-4 h-4 mr-2" />
                      แอดมิน
                    </Button>
                  </Link>
                )}

                <Button 
                  onClick={handleLogout}
                  variant="outline" 
                  className="w-full text-red-400 border-red-500/50 hover:bg-red-500/10"
                >
                  ออกจากระบบ
                </Button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link href="/auth" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full mint-gradient text-white">
                    <LogIn className="w-4 h-4 mr-2" />
                    เข้าสู่ระบบ
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}