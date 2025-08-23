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
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (game && isOpen) {
      setIsLoading(true);
      setError(null);
      setRetryCount(0);

      // Set a timeout to hide loading after 5 seconds (increased for better loading)
      const timeout = setTimeout(() => {
        setIsLoading(false);
      }, 5000);

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

    // Handle keyboard events for better game control
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only prevent default for specific game control keys when modal is open
      const gameKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyQ', 'KeyE', 'KeyR', 'KeyF', 'KeyC', 'KeyX', 'KeyZ'];
      if (isOpen && gameKeys.includes(e.code)) {
        // Only prevent default if the target is not an input element
        if (e.target && !(e.target as HTMLElement).matches('input, textarea, select')) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
      
      // Close modal with Escape key
      if (e.code === 'Escape' && isOpen) {
        onClose();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      // Same logic for key up events
      const gameKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyQ', 'KeyE', 'KeyR', 'KeyF', 'KeyC', 'KeyX', 'KeyZ'];
      if (isOpen && gameKeys.includes(e.code)) {
        if (e.target && !(e.target as HTMLElement).matches('input, textarea, select')) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('keyup', handleKeyUp);
    }

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [isOpen]);

  const handleIframeLoad = () => {
    setIsLoading(false);
    setError(null);
    setRetryCount(0);
    console.log('Game loaded successfully:', game?.title);
    
    // Focus the iframe after loading for better input handling
    setTimeout(() => {
      if (iframeRef.current) {
        iframeRef.current.focus();
      }
    }, 100);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    if (retryCount < 2) {
      setError(`กำลังโหลดเกม... (ครั้งที่ ${retryCount + 2})`);
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        setIsLoading(true);
        setError(null);
      }, 1000);
    } else {
      setError('ไม่สามารถโหลดเกมได้ กรุณาลองใหม่อีกครั้ง');
    }
  };

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    setRetryCount(0);
  };

  if (!game) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="glass-dark w-[95vw] h-[95vh] max-w-none max-h-none overflow-hidden border border-mint-500/20 p-0"
        data-testid="modal-game"
      >
        <DialogHeader className="flex flex-row items-center justify-between p-3 border-b border-gradient-to-r from-mint-500/30 via-purple-500/30 to-cyan-500/30 bg-gradient-to-r from-purple-900/90 via-blue-900/90 to-cyan-900/90 backdrop-blur-xl shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-mint-400 to-cyan-400 shadow-lg shadow-mint-500/30">
              <span className="text-lg">🎮</span>
            </div>
            <div className="flex flex-col">
              <DialogTitle className="text-sm md:text-lg font-bold bg-gradient-to-r from-mint-300 via-cyan-300 to-purple-300 bg-clip-text text-transparent truncate" data-testid="text-game-title">
                {game.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-gray-400 hidden md:block">
                เล่นเกม {game.title} - ใช้ปุ่มเต็มจอเพื่อขยายหน้าจอ หรือปุ่ม X เพื่อปิด
              </DialogDescription>
            </div>
            <Badge className="px-3 py-1 text-xs bg-gradient-to-r from-mint-500/80 to-cyan-500/80 text-white border border-mint-400/50 shadow-lg shadow-mint-500/30 hidden sm:inline-flex rounded-full">
              ✨ ASHURA
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
            onClick={() => {
              // Focus iframe when container is clicked for better game control
              if (iframeRef.current) {
                iframeRef.current.focus();
              }
            }}
            onMouseEnter={() => {
              // Focus iframe when mouse enters container
              if (iframeRef.current) {
                iframeRef.current.focus();
              }
            }}
          >
            <iframe
              ref={iframeRef}
              src={game.gameUrl}
              className="w-full h-full border-0 bg-gray-900"
              title={game.title}
              allow="fullscreen; gamepad; microphone; camera; autoplay; clipboard-read; clipboard-write; accelerometer; gyroscope; payment; web-share"
              allowFullScreen
              sandbox="allow-same-origin allow-scripts allow-forms allow-pointer-lock allow-popups allow-modals allow-downloads allow-top-navigation-by-user-activation allow-presentation allow-storage-access-by-user-activation"
              data-testid="iframe-game"
              tabIndex={0}
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              loading="eager"
              onMouseEnter={() => {
                // Focus iframe when mouse enters
                if (iframeRef.current) {
                  iframeRef.current.focus();
                }
              }}
              onClick={() => {
                // Focus iframe when clicked
                if (iframeRef.current) {
                  iframeRef.current.focus();
                }
              }}
              style={{ 
                minHeight: isFullscreen ? '100vh' : '500px',
                width: '100%',
                height: '100%',
                backgroundColor: '#111827',
                border: 'none',
                outline: 'none',
                imageRendering: 'pixelated'
              }}
            />

            {/* Enhanced Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900/95 via-blue-900/95 to-cyan-900/95 backdrop-blur-xl z-10">
                <div className="text-center animate-slide-up">
                  {/* Animated Loading Ring */}
                  <div className="relative w-24 h-24 md:w-28 md:h-28 mx-auto mb-8">
                    <div className="absolute inset-0 rounded-full border-4 border-mint-500/30 shadow-xl"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-mint-400 border-r-cyan-400 animate-spin shadow-lg shadow-mint-500/50"></div>
                    <div className="absolute inset-2 rounded-full border-3 border-transparent border-t-purple-400 border-l-pink-400 animate-spin shadow-md shadow-purple-500/30" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                    <div className="absolute inset-4 rounded-full border-2 border-transparent border-b-cyan-300 animate-spin" style={{ animationDuration: '2s' }}></div>
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-mint-500/20 to-cyan-500/20 rounded-full backdrop-blur-sm">
                      <Gamepad2 className="text-mint-300 w-10 h-10 md:w-12 md:h-12 animate-bounce-subtle filter drop-shadow-lg" />
                    </div>
                  </div>
                  
                  {/* Enhanced Loading Text with Multiple Gradients */}
                  <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-mint-300 via-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent mb-3 animate-shimmer bg-[length:300%_100%] filter drop-shadow-sm">
                    ✨ กำลังโหลดเกม...
                  </h3>
                  
                  {/* Game Title with Enhanced Styling */}
                  <div className="glass-dark px-6 py-3 rounded-xl mb-4 border border-mint-500/30 shadow-lg shadow-mint-500/20">
                    <p className="text-mint-200 text-lg md:text-xl font-semibold">
                      🎮 {game?.title}
                    </p>
                  </div>
                  
                  {/* Enhanced Loading Progress Dots */}
                  <div className="flex justify-center space-x-2 mb-6">
                    <div className="w-3 h-3 bg-gradient-to-r from-mint-400 to-cyan-400 rounded-full animate-bounce shadow-lg shadow-mint-500/50" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-bounce shadow-lg shadow-cyan-500/50" style={{ animationDelay: '200ms' }}></div>
                    <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-bounce shadow-lg shadow-purple-500/50" style={{ animationDelay: '400ms' }}></div>
                  </div>
                  
                  {/* Enhanced Credit with Logo and Better Styling */}
                  <div className="glass-dark px-4 py-2 rounded-full border border-cyan-400/30 shadow-lg shadow-cyan-400/20 backdrop-blur-lg">
                    <div className="flex items-center justify-center space-x-2">
                      <img 
                        src="/ashura-logo.png" 
                        alt="ASHURA Logo" 
                        className="w-5 h-5 object-contain opacity-90 filter drop-shadow-sm"
                      />
                      <p className="text-cyan-300 text-sm font-semibold bg-gradient-to-r from-cyan-300 to-mint-300 bg-clip-text text-transparent">
                        Powered by ASHURA Games
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced ASHURA Games Credit Overlay - hidden in fullscreen */}
            {!isFullscreen && (
              <div className="absolute bottom-3 md:bottom-4 right-3 md:right-4 z-10">
                <div className="glass-dark px-4 md:px-5 py-2.5 rounded-xl border border-gradient-to-r from-mint-400/40 to-cyan-400/40 shadow-xl shadow-mint-400/30 backdrop-blur-xl hover:shadow-2xl hover:shadow-mint-400/50 transition-all duration-300 transform hover:scale-105">
                  <div className="flex items-center space-x-2.5">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-mint-400 to-cyan-400 rounded-full blur-sm opacity-50 animate-pulse"></div>
                      <img 
                        src="/ashura-logo.png" 
                        alt="ASHURA Logo" 
                        className="relative w-5 h-5 md:w-6 md:h-6 object-contain filter drop-shadow-sm"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs md:text-sm font-bold bg-gradient-to-r from-mint-300 via-cyan-300 to-purple-300 bg-clip-text text-transparent leading-none">
                        ASHURA
                      </span>
                      <span className="text-[10px] md:text-xs text-gray-400 font-medium leading-none">
                        Games
                      </span>
                    </div>
                  </div>
                </div>
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

            {/* Enhanced Error Overlay */}
            {error && !isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-red-900/30 via-purple-900/90 to-orange-900/30 backdrop-blur-xl z-10">
                <div className="text-center text-white animate-slide-up max-w-md px-6">
                  {/* Enhanced Error Icon */}
                  <div className="relative w-20 h-20 mx-auto mb-6">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 via-pink-500 to-orange-500 animate-pulse shadow-2xl shadow-red-500/40"></div>
                    <div className="absolute inset-1 rounded-full bg-gradient-to-r from-red-600 to-pink-600 flex items-center justify-center">
                      <X className="w-10 h-10 text-white filter drop-shadow-lg" />
                    </div>
                  </div>
                  
                  {/* Enhanced Error Message */}
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-red-400 via-pink-400 to-orange-400 bg-clip-text text-transparent mb-3">
                    ⚠️ ไม่สามารถโหลดเกมได้
                  </h3>
                  
                  <div className="glass-dark px-6 py-4 rounded-xl mb-4 border border-red-500/30 shadow-lg shadow-red-500/20">
                    <p className="text-lg mb-2 text-red-200 font-medium">{error}</p>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      💡 ตรวจสอบการเชื่อมต่ออินเทอร์เน็ตและลองใหม่ หรือเลือกเกมอื่น
                    </p>
                  </div>
                  
                  {/* Enhanced Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      onClick={handleRetry}
                      className="bg-gradient-to-r from-mint-500 to-cyan-500 hover:from-mint-600 hover:to-cyan-600 text-white px-8 py-3 rounded-xl font-semibold shadow-xl shadow-mint-500/40 hover:shadow-2xl hover:shadow-mint-500/60 transition-all transform hover:scale-105 border border-mint-400/50"
                    >
                      🔄 ลองใหม่อีกครั้ง
                    </Button>
                    <Button
                      onClick={onClose}
                      variant="outline"
                      className="border-2 border-gray-400/50 text-gray-200 hover:bg-gray-700/70 hover:border-gray-300 px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                    >
                      🎮 เลือกเกมอื่น
                    </Button>
                  </div>
                </div>
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