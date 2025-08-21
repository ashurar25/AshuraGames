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
              เล่นเกมส์ HTML5 ฟรีที่ดีที่สุดออนไลน์ ไม่ต้องดาวน์โหลด ไม่ต้องสมัครสมาชิก
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
            <h4 className="text-white font-semibold mb-4">หมวดหมู่</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-mint-300 transition-colors" data-testid="link-action-games">เกมส์แอคชั่น</a></li>
              <li><a href="#" className="text-gray-400 hover:text-mint-300 transition-colors" data-testid="link-puzzle-games">เกมส์ปริศนา</a></li>
              <li><a href="#" className="text-gray-400 hover:text-mint-300 transition-colors" data-testid="link-racing-games">เกมส์รถแข่ง</a></li>
              <li><a href="#" className="text-gray-400 hover:text-mint-300 transition-colors" data-testid="link-strategy-games">เกมส์กลยุทธ์</a></li>
              <li><a href="#" className="text-gray-400 hover:text-mint-300 transition-colors" data-testid="link-io-games">เกมส์ .IO</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">บริษัท</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-mint-300 transition-colors" data-testid="link-about">เกี่ยวกับเรา</a></li>
              <li><a href="#" className="text-gray-400 hover:text-mint-300 transition-colors" data-testid="link-contact">ติดต่อเรา</a></li>
              <li><a href="#" className="text-gray-400 hover:text-mint-300 transition-colors" data-testid="link-privacy">นโยบายความเป็นส่วนตัว</a></li>
              <li><a href="#" className="text-gray-400 hover:text-mint-300 transition-colors" data-testid="link-terms">เงื่อนไขการให้บริการ</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">รับข่าวสาร</h4>
            <p className="text-gray-400 mb-4">รับการแจ้งเตือนเกี่ยวกับเกมส์ใหม่และอัพเดต</p>
            <div className="flex space-x-2">
              <Input
                type="email"
                placeholder="อีเมลของคุณ"
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
            © 2024 ASHURA Games. สงวนลิขสิทธิ์ทั้งหมด | ขับเคลื่อนโดย ASHURA Games Platform
          </p>
        </div>
      </div>
    </footer>
  );
}
