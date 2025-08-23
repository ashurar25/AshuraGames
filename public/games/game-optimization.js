
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
    
    // Disable right-click context menu on games
    document.addEventListener('contextmenu', function(e) {
        if (e.target.tagName === 'CANVAS') {
            e.preventDefault();
            return false;
        }
    });
    
    // Prevent default touch behaviors on canvas
    document.addEventListener('touchstart', function(e) {
        if (e.target.tagName === 'CANVAS') {
            e.preventDefault();
        }
    }, { passive: false });
    
    document.addEventListener('touchmove', function(e) {
        if (e.target.tagName === 'CANVAS') {
            e.preventDefault();
        }
    }, { passive: false });
    
    document.addEventListener('touchend', function(e) {
        if (e.target.tagName === 'CANVAS') {
            e.preventDefault();
        }
    }, { passive: false });
    
    // Enhanced canvas optimization with performance levels
    function optimizeCanvas() {
        const canvases = document.querySelectorAll('canvas');
        canvases.forEach(canvas => {
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
                    
                    // Set optimal pixel ratio based on device
                    const ratio = Math.min(window.devicePixelRatio || 1, performanceLevel === 'high' ? 2 : 1.5);
                    const rect = canvas.getBoundingClientRect();
                    
                    if (rect.width && rect.height) {
                        canvas.width = rect.width * ratio;
                        canvas.height = rect.height * ratio;
                        ctx.scale(ratio, ratio);
                        canvas.style.width = rect.width + 'px';
                        canvas.style.height = rect.height + 'px';
                    }
                } else if (ctx instanceof WebGLRenderingContext || ctx instanceof WebGL2RenderingContext) {
                    // WebGL optimizations
                    const ext = ctx.getExtension('OES_texture_float') || 
                              ctx.getExtension('OES_texture_half_float') ||
                              ctx.getExtension('WEBGL_color_buffer_float');
                    if (ext && performanceLevel === 'high') {
                        console.log('WebGL optimizations enabled');
                    }
                }
            }
            
            // Enhanced focus and interaction
            canvas.tabIndex = 0;
            canvas.setAttribute('aria-label', 'Game Canvas');
            canvas.style.outline = 'none';
            
            // Auto-focus on interaction
            ['click', 'touchstart', 'keydown'].forEach(event => {
                canvas.addEventListener(event, function() {
                    this.focus();
                }, { passive: event === 'touchstart' });
            });
            
            // Responsive canvas sizing
            const resizeCanvas = () => {
                if (canvas.style.maxWidth !== '100%') {
                    canvas.style.maxWidth = '100%';
                    canvas.style.height = 'auto';
                }
            };
            
            window.addEventListener('resize', resizeCanvas);
            resizeCanvas();
        });
    }
    
    // Auto-focus canvas for keyboard input
    function setupCanvasFocus() {
        const canvas = document.querySelector('canvas');
        if (canvas) {
            canvas.focus();
            canvas.addEventListener('click', () => canvas.focus());
            canvas.addEventListener('touchstart', () => canvas.focus());
        }
    }
    
    // Enhanced mobile controls with better UX
    function addMobileControls() {
        if (!isMobile && window.innerWidth > 768) return;
        
        const existingControls = document.querySelector('.mobile-controls');
        if (existingControls) return;
        
        // Smart control detection based on game type
        const needsDirectional = document.querySelector('canvas') && 
            (document.body.textContent.includes('Arrow') || 
             document.body.textContent.includes('WASD') ||
             document.body.textContent.includes('เลื่อน'));
        
        const needsSpace = document.body.textContent.includes('Space') ||
                          document.body.textContent.includes('กระโดด') ||
                          document.body.textContent.includes('ยิง');
        
        let controlsHTML = '<div class="mobile-controls">';
        
        if (needsDirectional) {
            controlsHTML += `
                <button class="mobile-btn" data-key="ArrowLeft" title="ซ้าย">←</button>
                <button class="mobile-btn" data-key="ArrowUp" title="ขึ้น">↑</button>
                <button class="mobile-btn" data-key="ArrowDown" title="ลง">↓</button>
                <button class="mobile-btn" data-key="ArrowRight" title="ขวา">→</button>
            `;
        }
        
        if (needsSpace) {
            controlsHTML += '<button class="mobile-btn" data-key="Space" title="กระทำ">⎵</button>';
        }
        
        // Add common game keys
        controlsHTML += `
            <button class="mobile-btn" data-key="KeyR" title="รีสตาร์ท">🔄</button>
            <button class="mobile-btn" data-key="KeyP" title="หยุด">⏸</button>
        </div>`;
        
        document.body.insertAdjacentHTML('beforeend', controlsHTML);
        
        // Enhanced mobile control events with haptic feedback
        document.querySelectorAll('.mobile-btn').forEach(btn => {
            const key = btn.dataset.key;
            let pressInterval;
            
            // Haptic feedback function
            const hapticFeedback = () => {
                if (navigator.vibrate) {
                    navigator.vibrate(10);
                }
            };
            
            const pressStart = (e) => {
                e.preventDefault();
                hapticFeedback();
                
                const event = new KeyboardEvent('keydown', {
                    key: key === 'Space' ? ' ' : key.replace('Key', '').toLowerCase(),
                    code: key,
                    keyCode: getKeyCode(key),
                    bubbles: true
                });
                
                // Dispatch to both document and canvas
                document.dispatchEvent(event);
                const canvas = document.querySelector('canvas');
                if (canvas) canvas.dispatchEvent(event);
                
                btn.style.transform = 'scale(1.1)';
                btn.style.background = 'rgba(16, 185, 129, 0.5)';
                
                // Continuous press for movement keys
                if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
                    pressInterval = setInterval(() => {
                        document.dispatchEvent(event);
                        if (canvas) canvas.dispatchEvent(event);
                    }, 16); // ~60fps
                }
            };
            
            const pressEnd = (e) => {
                e.preventDefault();
                clearInterval(pressInterval);
                
                const event = new KeyboardEvent('keyup', {
                    key: key === 'Space' ? ' ' : key.replace('Key', '').toLowerCase(),
                    code: key,
                    keyCode: getKeyCode(key),
                    bubbles: true
                });
                
                document.dispatchEvent(event);
                const canvas = document.querySelector('canvas');
                if (canvas) canvas.dispatchEvent(event);
                
                btn.style.transform = 'scale(1)';
                btn.style.background = '';
            };
            
            btn.addEventListener('touchstart', pressStart, { passive: false });
            btn.addEventListener('touchend', pressEnd, { passive: false });
            btn.addEventListener('touchcancel', pressEnd, { passive: false });
            btn.addEventListener('mousedown', pressStart);
            btn.addEventListener('mouseup', pressEnd);
            btn.addEventListener('mouseleave', pressEnd);
        });
        
        // Auto-hide controls after inactivity
        let hideTimeout;
        const resetHideTimeout = () => {
            clearTimeout(hideTimeout);
            const controls = document.querySelector('.mobile-controls');
            if (controls) {
                controls.style.opacity = '1';
                hideTimeout = setTimeout(() => {
                    controls.style.opacity = '0.7';
                }, 5000);
            }
        };
        
        ['touchstart', 'touchmove', 'click'].forEach(event => {
            document.addEventListener(event, resetHideTimeout);
        });
    }
    
    function getKeyCode(key) {
        const codes = {
            'ArrowLeft': 37,
            'ArrowUp': 38,
            'ArrowRight': 39,
            'ArrowDown': 40,
            'Space': 32,
            'KeyR': 82,
            'KeyP': 80,
            'KeyW': 87,
            'KeyA': 65,
            'KeyS': 83,
            'KeyD': 68,
            'Enter': 13,
            'Escape': 27
        };
        return codes[key] || key.charCodeAt(0) || 0;
    }
    
    // Fullscreen functionality
    function setupFullscreen() {
        const canvas = document.querySelector('canvas');
        if (!canvas) return;
        
        // Double-click to fullscreen
        canvas.addEventListener('dblclick', function() {
            if (!document.fullscreenElement) {
                this.requestFullscreen?.() || 
                this.webkitRequestFullscreen?.() || 
                this.msRequestFullscreen?.();
            } else {
                document.exitFullscreen?.() || 
                document.webkitExitFullscreen?.() || 
                document.msExitFullscreen?.();
            }
        });
        
        // Handle fullscreen change
        document.addEventListener('fullscreenchange', function() {
            const canvas = document.querySelector('canvas');
            if (canvas) {
                if (document.fullscreenElement) {
                    canvas.classList.add('fullscreen');
                } else {
                    canvas.classList.remove('fullscreen');
                }
            }
        });
    }
    
    // Performance monitoring
    function setupPerformanceMonitoring() {
        let lastTime = performance.now();
        let frameCount = 0;
        let fps = 0;
        
        function measureFPS() {
            frameCount++;
            const currentTime = performance.now();
            const deltaTime = currentTime - lastTime;
            
            if (deltaTime >= 1000) {
                fps = Math.round((frameCount * 1000) / deltaTime);
                frameCount = 0;
                lastTime = currentTime;
                
                // Optimize based on FPS
                if (fps < 30) {
                    // Reduce quality if FPS is too low
                    const canvases = document.querySelectorAll('canvas');
                    canvases.forEach(canvas => {
                        const ctx = canvas.getContext('2d');
                        if (ctx) {
                            ctx.imageSmoothingEnabled = false;
                        }
                    });
                }
            }
            
            requestAnimationFrame(measureFPS);
        }
        
        measureFPS();
    }
    
    // Enhanced initialization with progressive loading
    function init() {
        console.log('🎮 ASHURA Games Enhancement Loading...');
        
        // Detect performance level
        detectPerformanceLevel();
        
        // Load enhancements progressively
        optimizeCanvas();
        setupCanvasFocus();
        addMobileControls();
        setupFullscreen();
        setupPerformanceMonitoring();
        addVisualEnhancements();
        setupAccessibility();
        
        // Resize handler with debounce
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                optimizeCanvas();
                adjustForScreenSize();
            }, 150);
        });
        
        // Enhanced visibility change handler
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                const pauseEvent = new CustomEvent('gamePause');
                document.dispatchEvent(pauseEvent);
                // Reduce performance when hidden
                if (performanceLevel !== 'low') {
                    performanceLevel = 'low';
                }
            } else {
                const resumeEvent = new CustomEvent('gameResume');
                document.dispatchEvent(resumeEvent);
                // Restore performance when visible
                detectPerformanceLevel();
            }
        });
        
        // Network change handler
        if ('connection' in navigator) {
            navigator.connection.addEventListener('change', adjustForConnection);
        }
        
        // Battery optimization
        if ('getBattery' in navigator) {
            navigator.getBattery().then(setupBatteryOptimization);
        }
        
        console.log('✨ ASHURA Games Enhancement Ready!');
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
        
        console.log('🚀 Performance level:', performanceLevel);
    }
    
    // Visual enhancements
    function addVisualEnhancements() {
        if (performanceLevel === 'low') return;
        
        // Add particle container
        const particleContainer = document.createElement('div');
        particleContainer.className = 'particle-container';
        document.body.appendChild(particleContainer);
        
        // Add random particles occasionally
        setInterval(() => {
            if (Math.random() < 0.3 && document.querySelectorAll('.particle').length < 5) {
                createFloatingParticle();
            }
        }, 3000);
    }
    
    function createFloatingParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * window.innerWidth + 'px';
        particle.style.top = window.innerHeight + 'px';
        particle.style.width = (Math.random() * 6 + 4) + 'px';
        particle.style.height = particle.style.width;
        
        document.querySelector('.particle-container')?.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 3000);
    }
    
    // Accessibility enhancements
    function setupAccessibility() {
        // Add screen reader support
        const canvas = document.querySelector('canvas');
        if (canvas && !canvas.getAttribute('aria-label')) {
            canvas.setAttribute('aria-label', 'เกม ASHURA - ใช้ปุ่มลูกศรหรือแตะเพื่อควบคุม');
        }
        
        // High contrast detection
        if (window.matchMedia('(prefers-contrast: high)').matches) {
            document.body.classList.add('high-contrast');
        }
        
        // Reduced motion detection
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.body.classList.add('reduced-motion');
        }
    }
    
    function adjustForScreenSize() {
        const gameContainer = document.querySelector('.game-container') || document.querySelector('#gameContainer');
        if (gameContainer) {
            if (window.innerWidth < 480) {
                gameContainer.style.padding = '10px';
                gameContainer.style.margin = '5px';
            } else if (window.innerWidth < 768) {
                gameContainer.style.padding = '15px';
                gameContainer.style.margin = '10px';
            }
        }
    }
    
    function adjustForConnection() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            if (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g') {
                performanceLevel = 'low';
                // Reduce visual effects
                document.querySelectorAll('.particle').forEach(p => p.remove());
            }
        }
    }
    
    function setupBatteryOptimization(battery) {
        battery.addEventListener('levelchange', () => {
            if (battery.level < 0.2) {
                performanceLevel = 'low';
                console.log('🔋 Battery low - reducing performance');
            }
        });
    }
    
    // Initialize when ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Global game utilities
    window.GameOptimization = {
        isMobile: isMobile,
        isIOS: isIOS,
        isAndroid: isAndroid,
        optimizeCanvas: optimizeCanvas,
        
        // Enhanced requestAnimationFrame for smooth gameplay
        smoothRAF: function(callback) {
            let lastTime = 0;
            function frame(currentTime) {
                const deltaTime = currentTime - lastTime;
                if (deltaTime >= 16.67) { // Cap at 60 FPS
                    callback(deltaTime);
                    lastTime = currentTime;
                }
                requestAnimationFrame(frame);
            }
            requestAnimationFrame(frame);
        },
        
        // Prevent game lag
        preventLag: function() {
            // Disable smooth scrolling
            document.documentElement.style.scrollBehavior = 'auto';
            
            // Optimize animations
            const style = document.createElement('style');
            style.innerHTML = `
                * {
                    animation-fill-mode: both;
                    animation-duration: 0.01ms !important;
                    animation-delay: 0.01ms !important;
                    transition-duration: 0.01ms !important;
                    transition-delay: 0.01ms !important;
                }
                .game-animation {
                    animation-duration: revert !important;
                    transition-duration: revert !important;
                }
            `;
            document.head.appendChild(style);
        }
    };
    
})();
