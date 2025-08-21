import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
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
        className="glass-dark max-w-6xl max-h-[90vh] overflow-hidden border border-mint-500/20"
        data-testid="modal-game"
      >
        <DialogHeader className="flex flex-row items-center justify-between p-6 border-b border-mint-500/20">
          <div className="flex items-center space-x-4">
            <DialogTitle className="text-2xl font-bold text-white" data-testid="text-game-title">
              {game.title}
            </DialogTitle>
            <Badge className="glass px-3 py-1 text-xs text-mint-300 border-mint-500/30">
              Powered by ASHURA Games
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="glass w-10 h-10 rounded-full text-gray-400 hover:text-white"
            data-testid="button-close-modal"
          >
            <X className="w-5 h-5" />
          </Button>
        </DialogHeader>

        <div className="p-6">
          <div className="bg-gray-900 rounded-xl overflow-hidden aspect-video relative">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mint-gradient rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse">
                    <Gamepad2 className="text-white text-2xl" />
                  </div>
                  <p className="text-white text-lg font-semibold mb-2">Loading Game...</p>
                  <p className="text-gray-400">Powered by ASHURA Games</p>
                </div>
              </div>
            ) : (
              <iframe
                // ref={iframeRef} // Removed as it's not used in the original context provided for modification
                src={game.gameUrl}
                className="w-full h-full"
                title={game.title}
                allow="fullscreen; gamepad; microphone; camera"
                data-testid="iframe-game"
                onLoad={() => setIsLoading(false)} // Added onLoad to manage loading state
              />
            )}

            {/* ASHURA Games Credit Overlay */}
            <div className="absolute bottom-4 right-4 glass px-3 py-1 rounded-full text-xs text-mint-300">
              <Copyright className="inline w-3 h-3 mr-1" />
              ASHURA Games
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-gray-400 text-sm">
              {game.description}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}