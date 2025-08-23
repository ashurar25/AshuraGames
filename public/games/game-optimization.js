
// ASHURA Games - Enhanced Game Optimization JavaScript
(function() {
    'use strict';
    
    // Device detection and performance optimizations
    let isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    let isAndroid = /Android/.test(navigator.userAgent);
    let isTablet = /iPad|Android(?=.*Mobile)|SM-T|Nexus (?:7|10)|GT-N|GT-P|SCH-I800|Xoom|MID|KFAPW/.test(navigator.userAgent);
    let isMobile = isIOS || isAndroid || window.innerWidth < 768;
    let isHighRes = window.devicePixelRatio > 1.5;
    let performanceLevel = 'high'; // high, medium, low
    
    // Global game state management
    let gameStates = new Map();
    let currentGame = null;
    let isGamePaused = false;
    
    // Disable right-click context menu on games
    document.addEventListener('contextmenu', function(e) {
        if (e.target.tagName === 'CANVAS' || e.target.closest('.game-container')) {
            e.preventDefault();
            return false;
        }
    });
    
    // Prevent default touch behaviors on canvas and game containers
    ['touchstart', 'touchmove', 'touchend', 'touchcancel'].forEach(eventType => {
        document.addEventListener(eventType, function(e) {
            if (e.target.tagName === 'CANVAS' || e.target.closest('.game-container')) {
                e.preventDefault();
            }
        }, { passive: false });
    });
    
    // Enhanced canvas optimization with comprehensive fixes
    function optimizeCanvas() {
        const canvases = document.querySelectorAll('canvas');
        canvases.forEach(canvas => {
            if (canvas.dataset.optimized) return; // Skip already optimized canvases
            
            const ctx = canvas.getContext('2d') || canvas.getContext('webgl') || canvas.getContext('webgl2');
            if (ctx) {
                // Performance-based optimization
                if (ctx instanceof CanvasRenderingContext2D) {
                    // 2D Context optimizations
                    if (performanceLevel === 'high') {
                        ctx.imageSmoothingEnabled = true;
                        ctx.imageSmoothingQuality = 'high';
                    } else {
                        ctx.imageSmoothingEnabled = false;
                    }
                    
                    // Fix canvas scaling issues
                    const rect = canvas.getBoundingClientRect();
                    const ratio = Math.min(window.devicePixelRatio || 1, performanceLevel === 'high' ? 2 : 1.5);
                    
                    if (rect.width && rect.height) {
                        // Ensure canvas has proper dimensions
                        if (!canvas.width || !canvas.height) {
                            canvas.width = rect.width * ratio;
                            canvas.height = rect.height * ratio;
                        }
                        ctx.scale(ratio, ratio);
                        canvas.style.width = rect.width + 'px';
                        canvas.style.height = rect.height + 'px';
                    }
                } else if (ctx instanceof WebGLRenderingContext || ctx instanceof WebGL2RenderingContext) {
                    // WebGL optimizations
                    const ext = ctx.getExtension('OES_texture_float') || 
                              ctx.getExtension('OES_texture_half_float') ||
                              ctx.getExtension('WEBGL_color_buffer_float');
                    
                    // Enable antialiasing for better quality
                    ctx.enable(ctx.BLEND);
                    ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE_MINUS_SRC_ALPHA);
                }
            }
            
            // Enhanced focus and interaction
            canvas.tabIndex = 0;
            canvas.setAttribute('aria-label', 'Game Canvas - ใช้ปุ่มลูกศรหรือ WASD เพื่อควบคุม');
            canvas.style.outline = 'none';
            
            // Auto-focus on interaction with debounce
            let focusTimeout;
            ['click', 'touchstart', 'keydown'].forEach(event => {
                canvas.addEventListener(event, function() {
                    clearTimeout(focusTimeout);
                    focusTimeout = setTimeout(() => {
                        this.focus();
                    }, 50);
                }, { passive: event === 'touchstart' });
            });
            
            // Responsive canvas sizing with proper aspect ratio
            const resizeCanvas = () => {
                const container = canvas.closest('.game-container') || canvas.parentElement;
                const maxWidth = Math.min(window.innerWidth - 20, 900);
                const maxHeight = Math.min(window.innerHeight - 100, 700);
                
                canvas.style.maxWidth = maxWidth + 'px';
                canvas.style.maxHeight = maxHeight + 'px';
                canvas.style.width = 'auto';
                canvas.style.height = 'auto';
                canvas.style.display = 'block';
                canvas.style.margin = '0 auto';
            };
            
            window.addEventListener('resize', resizeCanvas);
            resizeCanvas();
            
            canvas.dataset.optimized = 'true';
        });
    }
    
    // Enhanced mobile controls with better game detection
    function addMobileControls() {
        if (!isMobile && window.innerWidth > 768) return;
        
        const existingControls = document.querySelector('.mobile-controls');
        if (existingControls) return;
        
        // Intelligent control detection based on game content
        const pageContent = document.body.textContent.toLowerCase();
        const needsDirectional = pageContent.includes('arrow') || 
                               pageContent.includes('wasd') ||
                               pageContent.includes('เลื่อน') ||
                               pageContent.includes('เคลื่อน') ||
                               document.querySelector('canvas');
        
        const needsSpace = pageContent.includes('space') ||
                          pageContent.includes('กระโดด') ||
                          pageContent.includes('ยิง') ||
                          pageContent.includes('fire') ||
                          pageContent.includes('shoot');
        
        const needsEnter = pageContent.includes('enter') ||
                          pageContent.includes('เริ่ม') ||
                          pageContent.includes('start');
        
        // Create adaptive control layout
        let controlsHTML = '<div class="mobile-controls">';
        
        if (needsDirectional) {
            controlsHTML += `
                <div class="direction-pad">
                    <button class="mobile-btn dir-btn" data-key="ArrowUp" title="ขึ้น">↑</button>
                    <div class="horizontal-controls">
                        <button class="mobile-btn dir-btn" data-key="ArrowLeft" title="ซ้าย">←</button>
                        <button class="mobile-btn dir-btn" data-key="ArrowDown" title="ลง">↓</button>
                        <button class="mobile-btn dir-btn" data-key="ArrowRight" title="ขวา">→</button>
                    </div>
                </div>
            `;
        }
        
        controlsHTML += '<div class="action-buttons">';
        
        if (needsSpace) {
            controlsHTML += '<button class="mobile-btn action-btn" data-key="Space" title="กระทำ">⚡</button>';
        }
        
        if (needsEnter) {
            controlsHTML += '<button class="mobile-btn action-btn" data-key="Enter" title="เริ่ม">▶</button>';
        }
        
        // Add common game keys
        controlsHTML += `
            <button class="mobile-btn utility-btn" data-key="KeyR" title="รีสตาร์ท">🔄</button>
            <button class="mobile-btn utility-btn" data-key="KeyP" title="หยุด">⏸</button>
        `;
        
        controlsHTML += '</div></div>';
        
        document.body.insertAdjacentHTML('beforeend', controlsHTML);
        
        // Enhanced mobile control events with better feedback
        document.querySelectorAll('.mobile-btn').forEach(btn => {
            const key = btn.dataset.key;
            let pressInterval;
            let isPressed = false;
            
            const hapticFeedback = () => {
                if (navigator.vibrate) {
                    navigator.vibrate(15);
                }
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
                
                const event = createKeyEvent('keydown');
                
                // Dispatch to multiple targets for better compatibility
                document.dispatchEvent(event);
                const canvas = document.querySelector('canvas');
                if (canvas) {
                    canvas.dispatchEvent(event);
                    canvas.focus();
                }
                
                // Visual feedback
                btn.classList.add('pressed');
                btn.style.transform = 'scale(0.9)';
                btn.style.opacity = '0.8';
                
                // Continuous press for movement keys
                if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
                    pressInterval = setInterval(() => {
                        if (isPressed) {
                            const continuousEvent = createKeyEvent('keydown');
                            document.dispatchEvent(continuousEvent);
                            if (canvas) canvas.dispatchEvent(continuousEvent);
                        }
                    }, 16); // ~60fps
                }
            };
            
            const pressEnd = (e) => {
                e.preventDefault();
                if (!isPressed) return;
                
                isPressed = false;
                clearInterval(pressInterval);
                
                const event = createKeyEvent('keyup');
                document.dispatchEvent(event);
                const canvas = document.querySelector('canvas');
                if (canvas) canvas.dispatchEvent(event);
                
                // Reset visual feedback
                btn.classList.remove('pressed');
                btn.style.transform = 'scale(1)';
                btn.style.opacity = '1';
            };
            
            // Touch events
            btn.addEventListener('touchstart', pressStart, { passive: false });
            btn.addEventListener('touchend', pressEnd, { passive: false });
            btn.addEventListener('touchcancel', pressEnd, { passive: false });
            
            // Mouse events for desktop testing
            btn.addEventListener('mousedown', pressStart);
            btn.addEventListener('mouseup', pressEnd);
            btn.addEventListener('mouseleave', pressEnd);
        });
        
        // Auto-hide controls with improved timing
        let hideTimeout;
        const resetHideTimeout = () => {
            clearTimeout(hideTimeout);
            const controls = document.querySelector('.mobile-controls');
            if (controls) {
                controls.style.opacity = '1';
                controls.style.pointerEvents = 'auto';
                hideTimeout = setTimeout(() => {
                    controls.style.opacity = '0.7';
                }, 8000);
            }
        };
        
        ['touchstart', 'touchmove', 'click', 'keydown'].forEach(event => {
            document.addEventListener(event, resetHideTimeout);
        });
    }
    
    function getKeyCode(key) {
        const codes = {
            'ArrowLeft': 37, 'ArrowUp': 38, 'ArrowRight': 39, 'ArrowDown': 40,
            'Space': 32, 'Enter': 13, 'Escape': 27,
            'KeyR': 82, 'KeyP': 80, 'KeyW': 87, 'KeyA': 65, 'KeyS': 83, 'KeyD': 68,
            'KeyQ': 81, 'KeyE': 69, 'KeyF': 70, 'KeyG': 71, 'KeyH': 72,
            'Digit1': 49, 'Digit2': 50, 'Digit3': 51, 'Digit4': 52, 'Digit5': 53
        };
        return codes[key] || key.charCodeAt(0) || 0;
    }
    
    // Enhanced fullscreen functionality
    function setupFullscreen() {
        const canvas = document.querySelector('canvas');
        if (!canvas) return;
        
        // Double-click to fullscreen with better handling
        let clickCount = 0;
        canvas.addEventListener('click', function() {
            clickCount++;
            setTimeout(() => {
                if (clickCount === 2) {
                    toggleFullscreen();
                }
                clickCount = 0;
            }, 300);
        });
        
        // Add fullscreen button
        const fullscreenBtn = document.createElement('button');
        fullscreenBtn.className = 'fullscreen-btn';
        fullscreenBtn.innerHTML = '⛶';
        fullscreenBtn.title = 'เต็มจอ';
        fullscreenBtn.onclick = toggleFullscreen;
        
        const gameContainer = canvas.closest('.game-container') || canvas.parentElement;
        gameContainer.style.position = 'relative';
        gameContainer.appendChild(fullscreenBtn);
        
        function toggleFullscreen() {
            if (!document.fullscreenElement) {
                const element = gameContainer || canvas;
                element.requestFullscreen?.() || 
                element.webkitRequestFullscreen?.() || 
                element.msRequestFullscreen?.();
            } else {
                document.exitFullscreen?.() || 
                document.webkitExitFullscreen?.() || 
                document.msExitFullscreen?.();
            }
        }
        
        // Handle fullscreen change
        document.addEventListener('fullscreenchange', function() {
            const canvas = document.querySelector('canvas');
            if (canvas) {
                if (document.fullscreenElement) {
                    canvas.classList.add('fullscreen');
                    document.body.classList.add('game-fullscreen');
                } else {
                    canvas.classList.remove('fullscreen');
                    document.body.classList.remove('game-fullscreen');
                }
                optimizeCanvas(); // Re-optimize for new size
            }
        });
    }
    
    // Enhanced performance monitoring
    function setupPerformanceMonitoring() {
        let lastTime = performance.now();
        let frameCount = 0;
        let fps = 60;
        let performanceHistory = [];
        
        function measureFPS() {
            frameCount++;
            const currentTime = performance.now();
            const deltaTime = currentTime - lastTime;
            
            if (deltaTime >= 1000) {
                fps = Math.round((frameCount * 1000) / deltaTime);
                frameCount = 0;
                lastTime = currentTime;
                
                performanceHistory.push(fps);
                if (performanceHistory.length > 10) {
                    performanceHistory.shift();
                }
                
                const avgFPS = performanceHistory.reduce((a, b) => a + b, 0) / performanceHistory.length;
                
                // Dynamic performance adjustment
                if (avgFPS < 25) {
                    performanceLevel = 'low';
                    applyLowPerformanceMode();
                } else if (avgFPS < 45) {
                    performanceLevel = 'medium';
                    applyMediumPerformanceMode();
                } else {
                    performanceLevel = 'high';
                }
            }
            
            requestAnimationFrame(measureFPS);
        }
        
        measureFPS();
    }
    
    function applyLowPerformanceMode() {
        const canvases = document.querySelectorAll('canvas');
        canvases.forEach(canvas => {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.imageSmoothingEnabled = false;
            }
        });
        
        // Reduce particle effects
        document.querySelectorAll('.particle').forEach(p => p.remove());
        
        // Disable animations
        document.body.classList.add('low-performance');
    }
    
    function applyMediumPerformanceMode() {
        document.body.classList.remove('low-performance');
        document.body.classList.add('medium-performance');
    }
    
    // Game state management
    function saveGameState(gameId, state) {
        try {
            localStorage.setItem(`game_${gameId}`, JSON.stringify(state));
        } catch (e) {
            console.warn('Could not save game state:', e);
        }
    }
    
    function loadGameState(gameId) {
        try {
            const saved = localStorage.getItem(`game_${gameId}`);
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            console.warn('Could not load game state:', e);
            return null;
        }
    }
    
    // Enhanced game detection and initialization
    function detectAndInitializeGame() {
        const canvas = document.querySelector('canvas');
        const gameContainer = document.querySelector('.game-container') || document.getElementById('gameContainer');
        
        if (canvas || gameContainer) {
            currentGame = document.title || 'unknown';
            
            // Apply game-specific optimizations
            optimizeCanvas();
            setupCanvasFocus();
            addMobileControls();
            setupFullscreen();
            addGameUI();
            
            console.log(`🎮 Game detected and optimized: ${currentGame}`);
        }
    }
    
    function addGameUI() {
        if (document.querySelector('.game-ui-overlay')) return;
        
        const overlay = document.createElement('div');
        overlay.className = 'game-ui-overlay';
        overlay.innerHTML = `
            <div class="game-info">
                <span class="fps-counter">FPS: 60</span>
                <span class="performance-indicator">⚡ ${performanceLevel}</span>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Update FPS display
        setInterval(() => {
            const fpsElement = document.querySelector('.fps-counter');
            const perfElement = document.querySelector('.performance-indicator');
            if (fpsElement && perfElement) {
                fpsElement.textContent = `FPS: ${Math.round(60 * (performanceLevel === 'high' ? 1 : performanceLevel === 'medium' ? 0.8 : 0.6))}`;
                perfElement.textContent = `⚡ ${performanceLevel}`;
            }
        }, 1000);
    }
    
    function setupCanvasFocus() {
        const canvas = document.querySelector('canvas');
        if (canvas) {
            canvas.focus();
            
            // Enhanced keyboard event handling
            const keyStates = {};
            
            document.addEventListener('keydown', (e) => {
                keyStates[e.code] = true;
                
                // Prevent page scrolling on game keys
                if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
                    e.preventDefault();
                }
            });
            
            document.addEventListener('keyup', (e) => {
                keyStates[e.code] = false;
            });
            
            // Make key states available globally
            window.gameKeyStates = keyStates;
        }
    }
    
    // Performance level detection
    function detectPerformanceLevel() {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        // Device-based detection
        if (isIOS && /iPhone|iPod/.test(navigator.userAgent)) {
            performanceLevel = 'medium';
        } else if (isAndroid && window.innerWidth < 1024) {
            performanceLevel = 'medium';
        } else if (gl) {
            const renderer = gl.getParameter(gl.RENDERER);
            if (renderer.includes('Adreno') && !renderer.includes('6')) {
                performanceLevel = 'medium';
            } else if (renderer.includes('Mali') || renderer.includes('PowerVR')) {
                performanceLevel = 'medium';
            }
        }
        
        // Memory-based adjustment
        if ('deviceMemory' in navigator && navigator.deviceMemory < 4) {
            performanceLevel = 'low';
        }
        
        // Connection-based adjustment
        if ('connection' in navigator) {
            const connection = navigator.connection;
            if (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g') {
                performanceLevel = 'low';
            }
        }
        
        console.log('🚀 Performance level detected:', performanceLevel);
    }
    
    // Enhanced initialization
    function init() {
        console.log('🎮 ASHURA Games Enhancement Loading...');
        
        detectPerformanceLevel();
        detectAndInitializeGame();
        setupPerformanceMonitoring();
        
        // Handle visibility changes
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                isGamePaused = true;
                const pauseEvent = new CustomEvent('gamePause');
                document.dispatchEvent(pauseEvent);
            } else {
                isGamePaused = false;
                const resumeEvent = new CustomEvent('gameResume');
                document.dispatchEvent(resumeEvent);
            }
        });
        
        // Resize handler with debounce
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                optimizeCanvas();
                addMobileControls();
            }, 150);
        });
        
        // Error handling for games
        window.addEventListener('error', function(e) {
            console.warn('Game error caught:', e.error);
            // Try to recover
            setTimeout(() => {
                optimizeCanvas();
            }, 1000);
        });
        
        console.log('✨ ASHURA Games Enhancement Ready!');
    }
    
    // Global game utilities
    window.GameOptimization = {
        isMobile,
        isIOS,
        isAndroid,
        performanceLevel,
        optimizeCanvas,
        saveGameState,
        loadGameState,
        
        // Enhanced requestAnimationFrame
        smoothRAF: function(callback) {
            let lastTime = 0;
            function frame(currentTime) {
                const deltaTime = currentTime - lastTime;
                const targetFrameTime = performanceLevel === 'high' ? 16.67 : 
                                      performanceLevel === 'medium' ? 20 : 33.33;
                
                if (deltaTime >= targetFrameTime && !isGamePaused) {
                    callback(deltaTime);
                    lastTime = currentTime;
                }
                requestAnimationFrame(frame);
            }
            requestAnimationFrame(frame);
        },
        
        // Game utilities
        preventLag: function() {
            document.documentElement.style.scrollBehavior = 'auto';
            
            const style = document.createElement('style');
            style.innerHTML = `
                * { 
                    backface-visibility: hidden;
                    transform: translateZ(0);
                }
                .game-animation {
                    animation-duration: revert !important;
                    transition-duration: revert !important;
                }
            `;
            document.head.appendChild(style);
        },
        
        // Restart current game
        restartGame: function() {
            if (window.location.reload) {
                window.location.reload();
            }
        },
        
        // Pause/Resume game
        togglePause: function() {
            isGamePaused = !isGamePaused;
            const event = new CustomEvent(isGamePaused ? 'gamePause' : 'gameResume');
            document.dispatchEvent(event);
            return isGamePaused;
        }
    };
    
    // Initialize when ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Re-initialize on navigation (for SPA games)
    let lastURL = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastURL) {
            lastURL = url;
            setTimeout(init, 100);
        }
    }).observe(document, { subtree: true, childList: true });
    
})();
