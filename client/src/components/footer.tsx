import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Gamepad2, Send } from 'lucide-react';
import { FaTwitter, FaDiscord, FaYoutube } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-t border-mint-500/20 mt-20" data-testid="footer-main">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 mint-gradient rounded-lg flex items-center justify-center">
                <Gamepad2 className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">ASHURA</h1>
                <p className="text-mint-300 text-sm">Games</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6">
              Play the best free HTML5 games online. No downloads, no registration required.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="glass w-10 h-10 rounded-full text-gray-400 hover:text-mint-300" data-testid="link-twitter">
                <FaTwitter />
              </Button>
              <Button variant="ghost" size="icon" className="glass w-10 h-10 rounded-full text-gray-400 hover:text-mint-300" data-testid="link-discord">
                <FaDiscord />
              </Button>
              <Button variant="ghost" size="icon" className="glass w-10 h-10 rounded-full text-gray-400 hover:text-mint-300" data-testid="link-youtube">
                <FaYoutube />
              </Button>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-mint-300 transition-colors" data-testid="link-action-games">Action Games</a></li>
              <li><a href="#" className="text-gray-400 hover:text-mint-300 transition-colors" data-testid="link-puzzle-games">Puzzle Games</a></li>
              <li><a href="#" className="text-gray-400 hover:text-mint-300 transition-colors" data-testid="link-racing-games">Racing Games</a></li>
              <li><a href="#" className="text-gray-400 hover:text-mint-300 transition-colors" data-testid="link-strategy-games">Strategy Games</a></li>
              <li><a href="#" className="text-gray-400 hover:text-mint-300 transition-colors" data-testid="link-io-games">.IO Games</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-mint-300 transition-colors" data-testid="link-about">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-mint-300 transition-colors" data-testid="link-contact">Contact</a></li>
              <li><a href="#" className="text-gray-400 hover:text-mint-300 transition-colors" data-testid="link-privacy">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-mint-300 transition-colors" data-testid="link-terms">Terms of Service</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Stay Updated</h4>
            <p className="text-gray-400 mb-4">Get notified about new games and updates.</p>
            <div className="flex space-x-2">
              <Input
                type="email"
                placeholder="Your email"
                className="glass flex-1 px-4 py-2 rounded-lg text-white placeholder-gray-400 border-white/20 focus:ring-2 focus:ring-mint-500 bg-white/10"
                data-testid="input-newsletter-email"
              />
              <Button className="mint-gradient px-4 py-2 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity" data-testid="button-newsletter-subscribe">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-mint-500/20 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 ASHURA Games. All rights reserved. | Powered by ASHURA Games Platform
          </p>
        </div>
      </div>
    </footer>
  );
}
