
// Global Game Optimization JavaScript
(function() {
    'use strict';
    
    // Performance optimizations
    let isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    let isAndroid = /Android/.test(navigator.userAgent);
    let isMobile = isIOS || isAndroid || window.innerWidth < 768;
    
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
    
    // Optimize canvas rendering
    function optimizeCanvas() {
        const canvases = document.querySelectorAll('canvas');
        canvases.forEach(canvas => {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                // Enable hardware acceleration
                ctx.imageSmoothingEnabled = false;
                ctx.webkitImageSmoothingEnabled = false;
                ctx.mozImageSmoothingEnabled = false;
                ctx.msImageSmoothingEnabled = false;
                
                // Set optimal pixel ratio
                const ratio = Math.min(window.devicePixelRatio || 1, 2);
                const rect = canvas.getBoundingClientRect();
                
                canvas.width = rect.width * ratio;
                canvas.height = rect.height * ratio;
                ctx.scale(ratio, ratio);
                canvas.style.width = rect.width + 'px';
                canvas.style.height = rect.height + 'px';
            }
            
            // Add canvas focus capability
            canvas.tabIndex = 0;
            canvas.addEventListener('click', function() {
                this.focus();
            });
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
    
    // Add mobile controls if needed
    function addMobileControls() {
        if (!isMobile) return;
        
        const existingControls = document.querySelector('.mobile-controls');
        if (existingControls) return;
        
        const controlsHTML = `
            <div class="mobile-controls">
                <button class="mobile-btn" data-key="ArrowLeft">←</button>
                <button class="mobile-btn" data-key="ArrowUp">↑</button>
                <button class="mobile-btn" data-key="ArrowDown">↓</button>
                <button class="mobile-btn" data-key="ArrowRight">→</button>
                <button class="mobile-btn" data-key="Space">⎵</button>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', controlsHTML);
        
        // Add event listeners for mobile controls
        document.querySelectorAll('.mobile-btn').forEach(btn => {
            const key = btn.dataset.key;
            
            btn.addEventListener('touchstart', function(e) {
                e.preventDefault();
                const event = new KeyboardEvent('keydown', {
                    key: key === 'Space' ? ' ' : key,
                    code: key,
                    keyCode: getKeyCode(key)
                });
                document.dispatchEvent(event);
                this.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
            });
            
            btn.addEventListener('touchend', function(e) {
                e.preventDefault();
                const event = new KeyboardEvent('keyup', {
                    key: key === 'Space' ? ' ' : key,
                    code: key,
                    keyCode: getKeyCode(key)
                });
                document.dispatchEvent(event);
                this.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            });
        });
    }
    
    function getKeyCode(key) {
        const codes = {
            'ArrowLeft': 37,
            'ArrowUp': 38,
            'ArrowRight': 39,
            'ArrowDown': 40,
            'Space': 32
        };
        return codes[key] || 0;
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
    
    // Initialize optimizations when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    function init() {
        optimizeCanvas();
        setupCanvasFocus();
        addMobileControls();
        setupFullscreen();
        setupPerformanceMonitoring();
        
        // Resize handler
        window.addEventListener('resize', function() {
            setTimeout(optimizeCanvas, 100);
        });
        
        // Visibility change handler
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                // Pause game when tab is hidden (if game supports it)
                const pauseEvent = new CustomEvent('gamePause');
                document.dispatchEvent(pauseEvent);
            } else {
                // Resume game when tab is visible
                const resumeEvent = new CustomEvent('gameResume');
                document.dispatchEvent(resumeEvent);
            }
        });
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
