import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Copyright, Gamepad2, Maximize, Minimize } from 'lucide-react';
import { Game } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';

interface GameModalProps {
  game: Game | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function GameModal({ game, isOpen, onClose }: GameModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (game && isOpen) {
      setIsLoading(true);
      
      // Set a timeout to hide loading after 3 seconds regardless
      const timeout = setTimeout(() => {
        setIsLoading(false);
      }, 3000);
      
      // Increment play count when game is opened
      apiRequest('POST', `/api/games/${game.id}/play`).catch(console.error);
      
      return () => clearTimeout(timeout);
    }
  }, [game, isOpen]);

  // Handle fullscreen mode
  const toggleFullscreen = async () => {
    if (!gameContainerRef.current) return;

    try {
      if (!isFullscreen) {
        // Enter fullscreen
        if (gameContainerRef.current.requestFullscreen) {
          await gameContainerRef.current.requestFullscreen();
        } else if ((gameContainerRef.current as any).webkitRequestFullscreen) {
          await (gameContainerRef.current as any).webkitRequestFullscreen();
        } else if ((gameContainerRef.current as any).msRequestFullscreen) {
          await (gameContainerRef.current as any).msRequestFullscreen();
        }
        setIsFullscreen(true);
      } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  };

  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).msFullscreenElement
      );
      setIsFullscreen(isCurrentlyFullscreen);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

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
              <DialogDescription className="text-sm text-gray-400 hidden md:block">
                {game.description}
              </DialogDescription>
            </div>
            <Badge className="glass px-2 md:px-3 py-1 text-xs text-mint-300 border-mint-500/30 hidden sm:inline-flex">
              Powered by ASHURA Games
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFullscreen}
              className="glass w-8 h-8 md:w-10 md:h-10 rounded-full text-gray-400 hover:text-white flex-shrink-0"
              data-testid="button-fullscreen"
              title={isFullscreen ? "ออกจากเต็มจอ" : "เต็มจอ"}
            >
              {isFullscreen ? (
                <Minimize className="w-4 h-4 md:w-5 md:h-5" />
              ) : (
                <Maximize className="w-4 h-4 md:w-5 md:h-5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="glass w-8 h-8 md:w-10 md:h-10 rounded-full text-gray-400 hover:text-white flex-shrink-0"
              data-testid="button-close-modal"
            >
              <X className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 flex flex-col p-2 md:p-4 min-h-0">
          <div 
            ref={gameContainerRef}
            className={`bg-gray-900 rounded-lg md:rounded-xl overflow-hidden flex-1 relative ${
              isFullscreen ? 'fixed inset-0 z-50 rounded-none bg-black p-0 m-0' : 'min-h-[500px]'
            }`}
          >
            <iframe
              ref={iframeRef}
              src={game.gameUrl}
              className="w-full h-full border-0 bg-gray-900"
              title={game.title}
              allow="fullscreen; gamepad; microphone; camera; autoplay; clipboard-read; clipboard-write; accelerometer; gyroscope; payment"
              allowFullScreen
              sandbox="allow-same-origin allow-scripts allow-forms allow-pointer-lock allow-popups allow-modals allow-downloads allow-top-navigation-by-user-activation allow-presentation"
              data-testid="iframe-game"
              onLoad={(e) => {
                console.log('Game loaded successfully:', game.title);
                setIsLoading(false);
              }}
              onError={(e) => {
                console.error('Game loading error:', e);
                console.error('Failed to load game:', game.title, 'URL:', game.gameUrl);
                setIsLoading(false);
              }}
              style={{ 
                minHeight: isFullscreen ? '100vh' : '500px',
                width: '100%',
                height: '100%',
                backgroundColor: '#111827'
              }}
            />

            {/* Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900/90 backdrop-blur-sm z-10">
                <div className="text-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 mint-gradient rounded-full flex items-center justify-center mb-3 md:mb-4 mx-auto animate-spin">
                    <Gamepad2 className="text-white text-lg md:text-2xl" />
                  </div>
                  <p className="text-white text-base md:text-lg font-semibold mb-2">กำลังโหลดเกม...</p>
                  <p className="text-gray-400 text-sm">Powered by ASHURA Games</p>
                </div>
              </div>
            )}

            {/* ASHURA Games Credit Overlay - hidden in fullscreen */}
            {!isFullscreen && (
              <div className="absolute bottom-2 md:bottom-4 right-2 md:right-4 glass px-2 md:px-3 py-1 rounded-full text-xs text-mint-300 z-10">
                <Copyright className="inline w-3 h-3 mr-1" />
                ASHURA Games
              </div>
            )}

            {/* Fullscreen Controls Overlay */}
            {isFullscreen && (
              <div className="absolute top-4 right-4 z-50 flex space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleFullscreen}
                  className="w-12 h-12 rounded-full text-white bg-black/70 hover:bg-black/80 backdrop-blur-sm border border-mint-500/30"
                  data-testid="button-fullscreen-exit"
                  title="ออกจากเต็มจอ"
                >
                  <Minimize className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="w-12 h-12 rounded-full text-white bg-black/70 hover:bg-black/80 backdrop-blur-sm border border-mint-500/30"
                  data-testid="button-close-fullscreen"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            )}
          </div>

          {/* Game Description - Hidden in fullscreen and on small screens */}
          {!isFullscreen && (
            <div className="mt-2 md:mt-4 text-center hidden md:block">
              <p className="text-gray-400 text-sm">
                {game.description}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}