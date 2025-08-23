
// ASHURA Games - Universal Game Enhancement System
(function() {
    'use strict';
    
    // Enhanced device detection
    const DeviceInfo = {
        isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent),
        isAndroid: /Android/.test(navigator.userAgent),
        isTablet: /iPad|Android(?=.*Mobile)|SM-T|Nexus (?:7|10)|GT-N|GT-P|SCH-I800|Xoom|MID|KFAPW/.test(navigator.userAgent),
        isMobile: /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768,
        isTouch: 'ontouchstart' in window,
        pixelRatio: window.devicePixelRatio || 1,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight
    };
    
    // Performance level detection
    let performanceLevel = 'high';
    function detectPerformance() {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (DeviceInfo.isMobile) performanceLevel = 'medium';
        if ('deviceMemory' in navigator && navigator.deviceMemory < 4) performanceLevel = 'low';
        if (gl) {
            const renderer = gl.getParameter(gl.RENDERER);
            if (renderer.includes('PowerVR') || renderer.includes('Mali-400')) performanceLevel = 'low';
        }
        
        console.log(`🚀 Performance level: ${performanceLevel}`);
    }
    
    // Universal canvas optimization
    function optimizeAllCanvases() {
        const canvases = document.querySelectorAll('canvas');
        
        canvases.forEach((canvas, index) => {
            if (canvas.dataset.optimized) return;
            
            console.log(`🎮 Optimizing canvas ${index + 1}: ${canvas.width}x${canvas.height}`);
            
            // Get context
            const ctx = canvas.getContext('2d') || canvas.getContext('webgl') || canvas.getContext('webgl2');
            
            // Enhanced responsive sizing
            const optimizeCanvasSize = () => {
                const container = canvas.closest('.game-container') || canvas.parentElement || document.body;
                const headerHeight = 60;
                const controlsHeight = DeviceInfo.isMobile ? 100 : 0;
                const padding = DeviceInfo.isMobile ? 20 : 40;
                
                const availableWidth = window.innerWidth - padding;
                const availableHeight = window.innerHeight - headerHeight - controlsHeight - padding;
                
                // Store original dimensions
                if (!canvas.dataset.originalWidth) {
                    canvas.dataset.originalWidth = canvas.width || 800;
                    canvas.dataset.originalHeight = canvas.height || 600;
                }
                
                const originalWidth = parseInt(canvas.dataset.originalWidth);
                const originalHeight = parseInt(canvas.dataset.originalHeight);
                
                // Calculate optimal scale
                const scaleX = availableWidth / originalWidth;
                const scaleY = availableHeight / originalHeight;
                const scale = Math.min(scaleX, scaleY, 1);
                
                // Apply sizing
                const newWidth = Math.floor(originalWidth * scale);
                const newHeight = Math.floor(originalHeight * scale);
                
                canvas.style.width = newWidth + 'px';
                canvas.style.height = newHeight + 'px';
                canvas.style.maxWidth = '100%';
                canvas.style.maxHeight = '100%';
                canvas.style.display = 'block';
                canvas.style.margin = '0 auto';
                
                // High DPI support
                if (DeviceInfo.pixelRatio > 1 && performanceLevel === 'high') {
                    canvas.width = newWidth * DeviceInfo.pixelRatio;
                    canvas.height = newHeight * DeviceInfo.pixelRatio;
                    
                    if (ctx && ctx.scale) {
                        ctx.scale(DeviceInfo.pixelRatio, DeviceInfo.pixelRatio);
                    }
                } else {
                    canvas.width = newWidth;
                    canvas.height = newHeight;
                }
                
                console.log(`Canvas resized: ${newWidth}x${newHeight} (${scale.toFixed(2)}x)`);
            };
            
            // Performance optimizations
            if (ctx) {
                if (ctx instanceof CanvasRenderingContext2D) {
                    // 2D optimizations
                    ctx.imageSmoothingEnabled = performanceLevel !== 'low';
                    if (ctx.imageSmoothingQuality) {
                        ctx.imageSmoothingQuality = performanceLevel === 'high' ? 'high' : 'medium';
                    }
                } else if (ctx instanceof WebGLRenderingContext || ctx instanceof WebGL2RenderingContext) {
                    // WebGL optimizations
                    ctx.enable(ctx.BLEND);
                    ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE_MINUS_SRC_ALPHA);
                    
                    // Performance adjustments
                    if (performanceLevel === 'low') {
                        ctx.hint(ctx.FRAGMENT_SHADER_DERIVATIVE_HINT, ctx.FASTEST);
                    }
                }
            }
            
            // Enhanced focus and interaction
            canvas.tabIndex = 0;
            canvas.style.outline = 'none';
            canvas.setAttribute('aria-label', 'เกม - ใช้ปุ่มลูกศรหรือ WASD เพื่อควบคุม');
            
            // Auto-focus system
            let focusTimeout;
            ['click', 'touchstart', 'keydown'].forEach(event => {
                canvas.addEventListener(event, function() {
                    clearTimeout(focusTimeout);
                    focusTimeout = setTimeout(() => this.focus(), 50);
                }, { passive: event === 'touchstart' });
            });
            
            // Touch event optimization
            ['touchstart', 'touchmove', 'touchend'].forEach(eventType => {
                canvas.addEventListener(eventType, function(e) {
                    e.preventDefault();
                }, { passive: false });
            });
            
            // Size optimization
            optimizeCanvasSize();
            
            // Resize handler
            let resizeTimeout;
            const handleResize = () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(optimizeCanvasSize, 100);
            };
            
            window.addEventListener('resize', handleResize);
            window.addEventListener('orientationchange', () => {
                setTimeout(optimizeCanvasSize, 300);
            });
            
            canvas.dataset.optimized = 'true';
        });
    }
    
    // Enhanced mobile controls system
    function createUniversalMobileControls() {
        if (!DeviceInfo.isMobile || document.querySelector('.universal-mobile-controls')) return;
        
        const controlsHTML = `
            <div class="universal-mobile-controls">
                <div class="direction-controls">
                    <button class="control-btn dir-up" data-key="ArrowUp" title="ขึ้น">▲</button>
                    <div class="horizontal-dirs">
                        <button class="control-btn dir-left" data-key="ArrowLeft" title="ซ้าย">◄</button>
                        <button class="control-btn dir-down" data-key="ArrowDown" title="ลง">▼</button>
                        <button class="control-btn dir-right" data-key="ArrowRight" title="ขวา">►</button>
                    </div>
                </div>
                
                <div class="action-controls">
                    <button class="control-btn action-space" data-key="Space" title="กระทำ">🚀</button>
                    <button class="control-btn action-enter" data-key="Enter" title="เริ่ม">▶</button>
                    <button class="control-btn action-restart" data-key="KeyR" title="รีสตาร์ท">🔄</button>
                </div>
                
                <div class="wasd-controls">
                    <button class="control-btn wasd-w" data-key="KeyW" title="W">W</button>
                    <div class="wasd-row">
                        <button class="control-btn wasd-a" data-key="KeyA" title="A">A</button>
                        <button class="control-btn wasd-s" data-key="KeyS" title="S">S</button>
                        <button class="control-btn wasd-d" data-key="KeyD" title="D">D</button>
                    </div>
                </div>
                
                <div class="game-controls">
                    <button class="control-btn game-pause" data-key="KeyP" title="หยุด">⏸</button>
                    <button class="control-btn game-fullscreen" title="เต็มจอ">⛶</button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', controlsHTML);
        
        // Enhanced control events
        document.querySelectorAll('.control-btn').forEach(btn => {
            const key = btn.dataset.key;
            let isPressed = false;
            let pressInterval;
            
            const hapticFeedback = () => {
                if (navigator.vibrate) navigator.vibrate(15);
            };
            
            const getKeyCode = (keyString) => {
                const codes = {
                    'ArrowUp': 38, 'ArrowDown': 40, 'ArrowLeft': 37, 'ArrowRight': 39,
                    'Space': 32, 'Enter': 13, 'KeyR': 82, 'KeyP': 80,
                    'KeyW': 87, 'KeyA': 65, 'KeyS': 83, 'KeyD': 68
                };
                return codes[keyString] || 0;
            };
            
            const createKeyEvent = (type) => {
                const keyCode = getKeyCode(key);
                const keyName = key === 'Space' ? ' ' : key.replace('Key', '').toLowerCase();
                
                return new KeyboardEvent(type, {
                    key: keyName,
                    code: key,
                    keyCode: keyCode,
                    which: keyCode,
                    bubbles: true,
                    cancelable: true
                });
            };
            
            const pressStart = (e) => {
                e.preventDefault();
                if (isPressed) return;
                
                isPressed = true;
                hapticFeedback();
                
                // Special handling for fullscreen
                if (btn.classList.contains('game-fullscreen')) {
                    toggleFullscreen();
                    return;
                }
                
                // Dispatch keyboard event
                const event = createKeyEvent('keydown');
                document.dispatchEvent(event);
                
                const canvas = document.querySelector('canvas');
                if (canvas) {
                    canvas.dispatchEvent(event);
                    canvas.focus();
                }
                
                // Visual feedback
                btn.classList.add('pressed');
                
                // Continuous press for movement keys
                if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(key)) {
                    pressInterval = setInterval(() => {
                        if (isPressed) {
                            const continuousEvent = createKeyEvent('keydown');
                            document.dispatchEvent(continuousEvent);
                            if (canvas) canvas.dispatchEvent(continuousEvent);
                        }
                    }, 16);
                }
            };
            
            const pressEnd = (e) => {
                e.preventDefault();
                if (!isPressed) return;
                
                isPressed = false;
                clearInterval(pressInterval);
                
                if (!btn.classList.contains('game-fullscreen')) {
                    const event = createKeyEvent('keyup');
                    document.dispatchEvent(event);
                    
                    const canvas = document.querySelector('canvas');
                    if (canvas) canvas.dispatchEvent(event);
                }
                
                btn.classList.remove('pressed');
            };
            
            // Touch events
            btn.addEventListener('touchstart', pressStart, { passive: false });
            btn.addEventListener('touchend', pressEnd, { passive: false });
            btn.addEventListener('touchcancel', pressEnd, { passive: false });
            
            // Mouse events for testing
            btn.addEventListener('mousedown', pressStart);
            btn.addEventListener('mouseup', pressEnd);
            btn.addEventListener('mouseleave', pressEnd);
        });
    }
    
    // Enhanced fullscreen system
    function setupUniversalFullscreen() {
        window.toggleFullscreen = () => {
            const canvas = document.querySelector('canvas');
            const container = canvas ? (canvas.closest('.game-container') || canvas.parentElement) : document.body;
            
            if (!document.fullscreenElement) {
                container.requestFullscreen?.() || 
                container.webkitRequestFullscreen?.() || 
                container.msRequestFullscreen?.();
            } else {
                document.exitFullscreen?.() || 
                document.webkitExitFullscreen?.() || 
                document.msExitFullscreen?.();
            }
        };
        
        // Fullscreen change handler
        const handleFullscreenChange = () => {
            const canvas = document.querySelector('canvas');
            if (canvas) {
                setTimeout(() => {
                    optimizeAllCanvases();
                }, 100);
            }
        };
        
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    }
    
    // Game state management
    const GameState = {
        isRunning: false,
        isPaused: false,
        gameId: null,
        
        save(data) {
            try {
                localStorage.setItem(`ashura_game_${this.gameId}`, JSON.stringify(data));
            } catch (e) {
                console.warn('Could not save game state:', e);
            }
        },
        
        load() {
            try {
                const saved = localStorage.getItem(`ashura_game_${this.gameId}`);
                return saved ? JSON.parse(saved) : null;
            } catch (e) {
                console.warn('Could not load game state:', e);
                return null;
            }
        },
        
        clear() {
            try {
                localStorage.removeItem(`ashura_game_${this.gameId}`);
            } catch (e) {
                console.warn('Could not clear game state:', e);
            }
        }
    };
    
    // Enhanced keyboard handling
    function setupUniversalKeyboard() {
        const keyStates = {};
        
        document.addEventListener('keydown', (e) => {
            keyStates[e.code] = true;
            keyStates[e.key] = true;
            
            // Prevent default for game keys
            const gameKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'Enter'];
            if (gameKeys.includes(e.code)) {
                e.preventDefault();
            }
            
            // Focus canvas if game key is pressed
            const canvas = document.querySelector('canvas');
            if (canvas && gameKeys.includes(e.code)) {
                canvas.focus();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            keyStates[e.code] = false;
            keyStates[e.key] = false;
        });
        
        // Make key states globally available
        window.gameKeyStates = keyStates;
        window.isKeyPressed = (key) => !!keyStates[key];
    }
    
    // Performance monitoring and optimization
    function setupPerformanceMonitoring() {
        let frameCount = 0;
        let lastTime = performance.now();
        let fps = 60;
        
        const measurePerformance = () => {
            frameCount++;
            const currentTime = performance.now();
            const deltaTime = currentTime - lastTime;
            
            if (deltaTime >= 1000) {
                fps = Math.round((frameCount * 1000) / deltaTime);
                frameCount = 0;
                lastTime = currentTime;
                
                // Dynamic performance adjustment
                if (fps < 20) {
                    performanceLevel = 'low';
                    applyPerformanceMode();
                } else if (fps < 40) {
                    performanceLevel = 'medium';
                    applyPerformanceMode();
                }
            }
            
            requestAnimationFrame(measurePerformance);
        };
        
        measurePerformance();
    }
    
    function applyPerformanceMode() {
        document.body.className = document.body.className.replace(/performance-\w+/g, '');
        document.body.classList.add(`performance-${performanceLevel}`);
        
        const canvases = document.querySelectorAll('canvas');
        canvases.forEach(canvas => {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.imageSmoothingEnabled = performanceLevel !== 'low';
            }
        });
    }
    
    // Game enhancement utilities
    window.GameEnhancement = {
        // Device info
        device: DeviceInfo,
        performance: () => performanceLevel,
        
        // Canvas utilities
        optimizeCanvas: optimizeAllCanvases,
        getCanvas: () => document.querySelector('canvas'),
        
        // Input utilities
        keyStates: () => window.gameKeyStates || {},
        isKeyPressed: (key) => window.isKeyPressed ? window.isKeyPressed(key) : false,
        
        // Game state
        state: GameState,
        
        // Fullscreen
        toggleFullscreen: () => window.toggleFullscreen && window.toggleFullscreen(),
        
        // Performance-aware animation frame
        requestFrame: function(callback) {
            const targetFPS = performanceLevel === 'high' ? 60 : performanceLevel === 'medium' ? 30 : 20;
            const frameTime = 1000 / targetFPS;
            
            let lastFrameTime = 0;
            
            function frame(currentTime) {
                if (currentTime - lastFrameTime >= frameTime) {
                    callback(currentTime - lastFrameTime);
                    lastFrameTime = currentTime;
                }
                requestAnimationFrame(frame);
            }
            
            requestAnimationFrame(frame);
        },
        
        // Error recovery
        recoverGame: function() {
            console.log('🔧 Attempting game recovery...');
            setTimeout(() => {
                optimizeAllCanvases();
                createUniversalMobileControls();
            }, 500);
        }
    };
    
    // Auto-initialization system
    function initializeGameEnhancements() {
        console.log('🎮 ASHURA Universal Game Enhancement System Loading...');
        
        // Detect performance first
        detectPerformance();
        
        // Initialize core systems
        setupUniversalKeyboard();
        setupUniversalFullscreen();
        setupPerformanceMonitoring();
        
        // Wait for DOM to be ready
        const initEnhancements = () => {
            // Detect game ID from title or URL
            GameState.gameId = document.title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase() || 'unknown_game';
            
            // Optimize all canvases
            optimizeAllCanvases();
            
            // Add mobile controls
            createUniversalMobileControls();
            
            // Fix common issues
            fixCommonGameIssues();
            
            console.log('✨ Game enhancements activated!');
        };
        
        // Initialize immediately if DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initEnhancements);
        } else {
            initEnhancements();
        }
        
        // Re-initialize on changes (for dynamic games)
        const observer = new MutationObserver((mutations) => {
            let shouldReinit = false;
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.tagName === 'CANVAS' || (node.nodeType === 1 && node.querySelector('canvas'))) {
                        shouldReinit = true;
                    }
                });
            });
            
            if (shouldReinit) {
                setTimeout(initEnhancements, 100);
            }
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
    }
    
    // Common game issue fixes
    function fixCommonGameIssues() {
        // Fix viewport
        let viewport = document.querySelector('meta[name="viewport"]');
        if (!viewport) {
            viewport = document.createElement('meta');
            viewport.name = 'viewport';
            document.head.appendChild(viewport);
        }
        viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        
        // Fix scrolling
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        
        // Fix touch behavior
        document.body.style.touchAction = 'none';
        
        // Prevent context menu on game elements
        document.addEventListener('contextmenu', (e) => {
            if (e.target.tagName === 'CANVAS' || e.target.closest('.game-container')) {
                e.preventDefault();
            }
        });
        
        // Fix canvas styling
        const canvases = document.querySelectorAll('canvas');
        canvases.forEach(canvas => {
            canvas.style.imageRendering = 'pixelated';
            canvas.style.touchAction = 'none';
        });
        
        // Error handling
        window.addEventListener('error', (e) => {
            console.warn('Game error caught:', e.error);
            setTimeout(() => {
                window.GameEnhancement?.recoverGame();
            }, 1000);
        });
    }
    
    // Initialize everything
    initializeGameEnhancements();
    
})();

// Additional global utilities for game compatibility
window.addEventListener('load', () => {
    // Ensure all games have proper focus
    const canvas = document.querySelector('canvas');
    if (canvas) {
        canvas.focus();
    }
    
    // Log successful enhancement
    console.log('🎮 ASHURA Game Enhancement System Ready!');
});
