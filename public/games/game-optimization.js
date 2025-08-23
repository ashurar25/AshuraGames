
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
        viewportHeight: window.innerHeight,
        orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
    };
    
    // Performance level detection
    let performanceLevel = 'high';
    let fps = 60;
    let frameCount = 0;
    let lastTime = performance.now();
    
    function detectPerformance() {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        // Base performance assessment
        if (DeviceInfo.isMobile) performanceLevel = 'medium';
        if ('deviceMemory' in navigator && navigator.deviceMemory < 4) performanceLevel = 'low';
        if ('hardwareConcurrency' in navigator && navigator.hardwareConcurrency < 4) performanceLevel = 'medium';
        
        // WebGL renderer check
        if (gl) {
            const renderer = gl.getParameter(gl.RENDERER);
            const vendor = gl.getParameter(gl.VENDOR);
            
            if (renderer.includes('PowerVR') || renderer.includes('Mali-400') || renderer.includes('Adreno (TM) 3')) {
                performanceLevel = 'low';
            } else if (renderer.includes('Mali') || renderer.includes('Adreno') || vendor.includes('ARM')) {
                performanceLevel = 'medium';
            }
        }
        
        console.log(`🚀 Performance level: ${performanceLevel}`);
        applyPerformanceMode();
    }
    
    // Enhanced canvas optimization
    function optimizeAllCanvases() {
        const canvases = document.querySelectorAll('canvas');
        
        canvases.forEach(canvas => {
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            
            // High DPI support
            const rect = canvas.getBoundingClientRect();
            const pixelRatio = Math.min(DeviceInfo.pixelRatio, performanceLevel === 'high' ? 2 : 1);
            
            canvas.width = rect.width * pixelRatio;
            canvas.height = rect.height * pixelRatio;
            
            ctx.scale(pixelRatio, pixelRatio);
            canvas.style.width = rect.width + 'px';
            canvas.style.height = rect.height + 'px';
            
            // Performance optimizations
            ctx.imageSmoothingEnabled = performanceLevel !== 'low';
            ctx.imageSmoothingQuality = performanceLevel === 'high' ? 'high' : 'low';
            
            // Touch optimization
            if (DeviceInfo.isTouch) {
                canvas.style.touchAction = 'none';
                canvas.style.userSelect = 'none';
                canvas.style.webkitUserSelect = 'none';
            }
        });
    }
    
    // Enhanced touch handling
    function setupTouchControls() {
        if (!DeviceInfo.isTouch) return;
        
        // Prevent default touch behaviors
        document.addEventListener('touchstart', (e) => {
            if (e.target.tagName === 'CANVAS') {
                e.preventDefault();
            }
        }, { passive: false });
        
        document.addEventListener('touchmove', (e) => {
            if (e.target.tagName === 'CANVAS') {
                e.preventDefault();
            }
        }, { passive: false });
        
        // Virtual controls for mobile
        createVirtualControls();
    }
    
    function createVirtualControls() {
        if (!DeviceInfo.isMobile || document.getElementById('virtualControls')) return;
        
        const controls = document.createElement('div');
        controls.id = 'virtualControls';
        controls.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 10px;
            z-index: 1000;
            pointer-events: none;
        `;
        
        // Create directional pad
        const dpad = document.createElement('div');
        dpad.style.cssText = `
            position: relative;
            width: 120px;
            height: 120px;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 50%;
            pointer-events: auto;
        `;
        
        const directions = [
            { name: 'up', style: 'top: 10px; left: 50%; transform: translateX(-50%);', key: 'ArrowUp' },
            { name: 'down', style: 'bottom: 10px; left: 50%; transform: translateX(-50%);', key: 'ArrowDown' },
            { name: 'left', style: 'left: 10px; top: 50%; transform: translateY(-50%);', key: 'ArrowLeft' },
            { name: 'right', style: 'right: 10px; top: 50%; transform: translateY(-50%);', key: 'ArrowRight' }
        ];
        
        directions.forEach(dir => {
            const btn = document.createElement('div');
            btn.style.cssText = `
                position: absolute;
                width: 30px;
                height: 30px;
                background: rgba(255, 255, 255, 0.8);
                border-radius: 50%;
                ${dir.style}
            `;
            
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                simulateKeyPress(dir.key, true);
            });
            
            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                simulateKeyPress(dir.key, false);
            });
            
            dpad.appendChild(btn);
        });
        
        // Action buttons
        const actionArea = document.createElement('div');
        actionArea.style.cssText = `
            display: flex;
            gap: 10px;
            pointer-events: auto;
        `;
        
        const buttons = [
            { text: 'A', key: ' ' },
            { text: 'B', key: 'Escape' }
        ];
        
        buttons.forEach(btn => {
            const button = document.createElement('button');
            button.textContent = btn.text;
            button.style.cssText = `
                width: 50px;
                height: 50px;
                border-radius: 50%;
                border: none;
                background: rgba(255, 255, 255, 0.8);
                font-weight: bold;
                font-size: 18px;
            `;
            
            button.addEventListener('touchstart', (e) => {
                e.preventDefault();
                simulateKeyPress(btn.key, true);
            });
            
            button.addEventListener('touchend', (e) => {
                e.preventDefault();
                simulateKeyPress(btn.key, false);
            });
            
            actionArea.appendChild(button);
        });
        
        controls.appendChild(dpad);
        controls.appendChild(actionArea);
        document.body.appendChild(controls);
    }
    
    function simulateKeyPress(key, isDown) {
        const event = new KeyboardEvent(isDown ? 'keydown' : 'keyup', {
            key: key,
            code: key === ' ' ? 'Space' : key,
            bubbles: true
        });
        document.dispatchEvent(event);
    }
    
    // Performance monitoring
    function startPerformanceMonitoring() {
        const measurePerformance = () => {
            frameCount++;
            const currentTime = performance.now();
            const deltaTime = currentTime - lastTime;
            
            if (deltaTime >= 1000) {
                fps = Math.round((frameCount * 1000) / deltaTime);
                frameCount = 0;
                lastTime = currentTime;
                
                // Dynamic performance adjustment
                if (fps < 20 && performanceLevel !== 'low') {
                    performanceLevel = 'low';
                    console.warn('🐌 Low FPS detected, switching to low performance mode');
                    applyPerformanceMode();
                } else if (fps < 40 && performanceLevel === 'high') {
                    performanceLevel = 'medium';
                    console.warn('⚠️ Medium FPS detected, switching to medium performance mode');
                    applyPerformanceMode();
                } else if (fps > 55 && performanceLevel === 'low') {
                    performanceLevel = 'medium';
                    console.log('📈 FPS improved, switching to medium performance mode');
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
                ctx.imageSmoothingQuality = performanceLevel === 'high' ? 'high' : 'low';
            }
        });
        
        // Adjust particle counts and effects
        const style = document.createElement('style');
        style.textContent = `
            .performance-low * { animation-duration: 0.5s !important; }
            .performance-low canvas { image-rendering: pixelated !important; }
            .performance-medium * { animation-duration: 0.75s !important; }
        `;
        document.head.appendChild(style);
    }
    
    // Audio management
    function createAudioManager() {
        const audioContext = window.AudioContext || window.webkitAudioContext;
        let audioCtx = null;
        
        const sounds = {};
        
        return {
            init() {
                try {
                    audioCtx = new audioContext();
                } catch (e) {
                    console.warn('Audio not supported');
                }
            },
            
            createSound(frequency, duration = 0.1, type = 'sine') {
                if (!audioCtx) return () => {};
                
                return () => {
                    const oscillator = audioCtx.createOscillator();
                    const gainNode = audioCtx.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(audioCtx.destination);
                    
                    oscillator.frequency.value = frequency;
                    oscillator.type = type;
                    
                    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
                    
                    oscillator.start(audioCtx.currentTime);
                    oscillator.stop(audioCtx.currentTime + duration);
                };
            }
        };
    }
    
    // Utility functions
    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }
    
    function lerp(start, end, factor) {
        return start + (end - start) * factor;
    }
    
    function distance(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }
    
    function random(min, max) {
        return Math.random() * (max - min) + min;
    }
    
    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    // Particle system
    function createParticleSystem() {
        const particles = [];
        
        return {
            particles,
            
            add(x, y, options = {}) {
                const particle = {
                    x,
                    y,
                    vx: options.vx || random(-2, 2),
                    vy: options.vy || random(-2, 2),
                    life: options.life || 1,
                    maxLife: options.life || 1,
                    color: options.color || '#ffffff',
                    size: options.size || 3,
                    gravity: options.gravity || 0.1
                };
                
                particles.push(particle);
                
                // Limit particles for performance
                if (particles.length > (performanceLevel === 'high' ? 200 : performanceLevel === 'medium' ? 100 : 50)) {
                    particles.shift();
                }
            },
            
            update() {
                for (let i = particles.length - 1; i >= 0; i--) {
                    const p = particles[i];
                    
                    p.x += p.vx;
                    p.y += p.vy;
                    p.vy += p.gravity;
                    p.life -= 0.02;
                    
                    if (p.life <= 0) {
                        particles.splice(i, 1);
                    }
                }
            },
            
            draw(ctx) {
                particles.forEach(p => {
                    const alpha = p.life / p.maxLife;
                    ctx.save();
                    ctx.globalAlpha = alpha;
                    ctx.fillStyle = p.color;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                });
            }
        };
    }
    
    // Game enhancement utilities
    window.GameEnhancement = {
        // Device info
        device: DeviceInfo,
        performance: () => performanceLevel,
        fps: () => fps,
        
        // Utilities
        utils: {
            clamp,
            lerp,
            distance,
            random,
            randomInt
        },
        
        // Audio
        audio: createAudioManager(),
        
        // Particles
        createParticleSystem,
        
        // Canvas optimization
        optimizeCanvas: optimizeAllCanvases,
        
        // Responsive design helpers
        responsive: {
            isMobile: DeviceInfo.isMobile,
            isTablet: DeviceInfo.isTablet,
            orientation: DeviceInfo.orientation,
            
            onResize(callback) {
                window.addEventListener('resize', () => {
                    DeviceInfo.viewportWidth = window.innerWidth;
                    DeviceInfo.viewportHeight = window.innerHeight;
                    DeviceInfo.orientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
                    callback(DeviceInfo);
                });
            },
            
            scaleCanvas(canvas, baseWidth, baseHeight) {
                const container = canvas.parentElement;
                const containerWidth = container.clientWidth;
                const containerHeight = container.clientHeight;
                
                const scaleX = containerWidth / baseWidth;
                const scaleY = containerHeight / baseHeight;
                const scale = Math.min(scaleX, scaleY);
                
                canvas.style.width = (baseWidth * scale) + 'px';
                canvas.style.height = (baseHeight * scale) + 'px';
                
                return scale;
            }
        },
        
        // Game state management
        state: {
            create(initialState) {
                let state = { ...initialState };
                const listeners = [];
                
                return {
                    get: (key) => key ? state[key] : state,
                    set: (key, value) => {
                        if (typeof key === 'object') {
                            state = { ...state, ...key };
                        } else {
                            state[key] = value;
                        }
                        listeners.forEach(fn => fn(state));
                    },
                    subscribe: (fn) => listeners.push(fn),
                    reset: () => {
                        state = { ...initialState };
                        listeners.forEach(fn => fn(state));
                    }
                };
            }
        }
    };
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    function init() {
        console.log('🎮 ASHURA Game Enhancement System initialized');
        
        detectPerformance();
        optimizeAllCanvases();
        setupTouchControls();
        startPerformanceMonitoring();
        
        // Initialize audio on first user interaction
        document.addEventListener('click', () => {
            window.GameEnhancement.audio.init();
        }, { once: true });
        
        document.addEventListener('touchstart', () => {
            window.GameEnhancement.audio.init();
        }, { once: true });
        
        // Handle orientation change
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                optimizeAllCanvases();
                DeviceInfo.orientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
            }, 100);
        });
        
        // Prevent context menu on mobile
        if (DeviceInfo.isMobile) {
            document.addEventListener('contextmenu', (e) => {
                if (e.target.tagName === 'CANVAS') {
                    e.preventDefault();
                }
            });
        }
        
        // Add global styles for better mobile experience
        const style = document.createElement('style');
        style.textContent = `
            canvas {
                display: block;
                margin: 0 auto;
                max-width: 100%;
                height: auto;
                image-rendering: ${performanceLevel === 'low' ? 'pixelated' : 'auto'};
            }
            
            @media (max-width: 768px) {
                canvas {
                    max-height: calc(100vh - 200px);
                }
                
                body {
                    overflow-x: hidden;
                }
                
                #virtualControls {
                    display: flex !important;
                }
            }
            
            @media (min-width: 769px) {
                #virtualControls {
                    display: none !important;
                }
            }
        `;
        document.head.appendChild(style);
        
        console.log('✅ Game enhancement system ready');
    }
})();
