import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Copyright, Gamepad2 } from 'lucide-react';
import { Game } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';

interface GameModalProps {
  game: Game | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function GameModal({ game, isOpen, onClose }: GameModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  // const iframeRef = useRef<HTMLIFrameElement>(null); // Assuming iframeRef is needed for the changes

  useEffect(() => {
    if (game && isOpen) {
      setIsLoading(true);
      // Increment play count when game is opened
      apiRequest('POST', `/api/games/${game.id}/play`).catch(console.error);

      // Simulate loading time for game
      // Removed the setTimeout as the iframe onLoad will handle the loading state
    }
  }, [game, isOpen]);

  if (!game) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="glass-dark w-[95vw] h-[95vh] max-w-none max-h-none overflow-hidden border border-mint-500/20 p-0"
        data-testid="modal-game"
      >
        <DialogHeader className="flex flex-row items-center justify-between p-3 md:p-4 border-b border-mint-500/20 bg-black/50 backdrop-blur-sm">
          <div className="flex items-center space-x-2 md:space-x-4">
            <div>
              <DialogTitle className="text-lg md:text-2xl font-bold text-white truncate" data-testid="text-game-title">
                {game.title}
              </DialogTitle>
              <DialogDescription className="sr-only">
                {game.description}
              </DialogDescription>
            </div>
            <Badge className="glass px-2 md:px-3 py-1 text-xs text-mint-300 border-mint-500/30 hidden sm:inline-flex">
              Powered by ASHURA Games
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="glass w-8 h-8 md:w-10 md:h-10 rounded-full text-gray-400 hover:text-white flex-shrink-0"
            data-testid="button-close-modal"
          >
            <X className="w-4 h-4 md:w-5 md:h-5" />
          </Button>
        </DialogHeader>

        <div className="flex-1 flex flex-col p-2 md:p-4">
          <div className="bg-gray-900 rounded-lg md:rounded-xl overflow-hidden flex-1 relative min-h-0">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                <div className="text-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 mint-gradient rounded-full flex items-center justify-center mb-3 md:mb-4 mx-auto animate-pulse">
                    <Gamepad2 className="text-white text-lg md:text-2xl" />
                  </div>
                  <p className="text-white text-base md:text-lg font-semibold mb-2">กำลังโหลดเกม...</p>
                  <p className="text-gray-400 text-sm">Powered by ASHURA Games</p>
                </div>
              </div>
            ) : (
              <iframe
                src={game.gameUrl}
                className="w-full h-full border-0"
                title={game.title}
                allow="fullscreen; gamepad; microphone; camera; autoplay; clipboard-read; clipboard-write"
                allowFullScreen
                sandbox="allow-same-origin allow-scripts allow-forms allow-pointer-lock allow-popups allow-modals allow-downloads"
                data-testid="iframe-game"
                onLoad={() => setIsLoading(false)}
                onError={(e) => {
                  console.error('Game loading error:', e);
                  setIsLoading(false);
                }}
                style={{ minHeight: '60vh' }}
              />
            )}

            {/* ASHURA Games Credit Overlay */}
            <div className="absolute bottom-2 md:bottom-4 right-2 md:right-4 glass px-2 md:px-3 py-1 rounded-full text-xs text-mint-300 z-10">
              <Copyright className="inline w-3 h-3 mr-1" />
              ASHURA Games
            </div>
          </div>

          {/* Game Description - Hidden on small screens to save space */}
          <div className="mt-2 md:mt-4 text-center hidden md:block">
            <p className="text-gray-400 text-sm">
              {game.description}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}