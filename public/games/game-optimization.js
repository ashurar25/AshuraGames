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

    // Comprehensive Game Enhancement System
        window.GameEnhancement = {
            // Device info
            device: DeviceInfo,
            performance: () => performanceLevel,
            fps: () => fps,

            // Advanced utilities
            utils: {
                clamp,
                lerp,
                distance,
                random,
                randomInt,

                // Color utilities
                hexToRgb(hex) {
                    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                    return result ? {
                        r: parseInt(result[1], 16),
                        g: parseInt(result[2], 16),
                        b: parseInt(result[3], 16)
                    } : null;
                },

                rgbToHex(r, g, b) {
                    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
                },

                // Easing functions
                easing: {
                    linear: t => t,
                    easeInQuad: t => t * t,
                    easeOutQuad: t => t * (2 - t),
                    easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
                    easeInCubic: t => t * t * t,
                    easeOutCubic: t => (--t) * t * t + 1,
                    easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
                    easeInBounce: t => 1 - window.GameEnhancement.utils.easing.easeOutBounce(1 - t),
                    easeOutBounce: t => {
                        if (t < 1/2.75) return 7.5625 * t * t;
                        else if (t < 2/2.75) return 7.5625 * (t -= 1.5/2.75) * t + 0.75;
                        else if (t < 2.5/2.75) return 7.5625 * (t -= 2.25/2.75) * t + 0.9375;
                        else return 7.5625 * (t -= 2.625/2.75) * t + 0.984375;
                    }
                },

                // Vector operations
                vector: {
                    add(a, b) { return {x: a.x + b.x, y: a.y + b.y}; },
                    subtract(a, b) { return {x: a.x - b.x, y: a.y - b.y}; },
                    multiply(v, scalar) { return {x: v.x * scalar, y: v.y * scalar}; },
                    magnitude(v) { return Math.sqrt(v.x * v.x + v.y * v.y); },
                    normalize(v) {
                        const mag = this.magnitude(v);
                        return mag > 0 ? {x: v.x / mag, y: v.y / mag} : {x: 0, y: 0};
                    },
                    dot(a, b) { return a.x * b.x + a.y * b.y; }
                },

                // Collision detection
                collision: {
                    pointInRect(point, rect) {
                        return point.x >= rect.x && point.x <= rect.x + rect.width &&
                               point.y >= rect.y && point.y <= rect.y + rect.height;
                    },

                    rectIntersect(a, b) {
                        return a.x < b.x + b.width && a.x + a.width > b.x &&
                               a.y < b.y + b.height && a.y + a.height > b.y;
                    },

                    circleIntersect(a, b) {
                        const dx = a.x - b.x;
                        const dy = a.y - b.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        return distance < (a.radius + b.radius);
                    }
                }
            },

            // Enhanced audio system
            audio: createAudioManager(),

            // Advanced particle system
            createParticleSystem,

            // Canvas optimization
            optimizeCanvas: optimizeAllCanvases,

            // Storage system
            storage: {
                set(key, value) {
                    try {
                        localStorage.setItem(`ashura_game_${key}`, JSON.stringify(value));
                    } catch (e) {
                        console.warn('Storage not available:', e);
                    }
                },

                get(key, defaultValue = null) {
                    try {
                        const item = localStorage.getItem(`ashura_game_${key}`);
                        return item ? JSON.parse(item) : defaultValue;
                    } catch (e) {
                        console.warn('Storage read error:', e);
                        return defaultValue;
                    }
                },

                remove(key) {
                    try {
                        localStorage.removeItem(`ashura_game_${key}`);
                    } catch (e) {
                        console.warn('Storage remove error:', e);
                    }
                }
            },

            // Input manager
            input: {
                keys: {},
                mouse: {x: 0, y: 0, pressed: false},
                touches: [],

                init() {
                    // Keyboard
                    document.addEventListener('keydown', (e) => {
                        this.keys[e.code] = true;
                        this.keys[e.key] = true;
                    });

                    document.addEventListener('keyup', (e) => {
                        this.keys[e.code] = false;
                        this.keys[e.key] = false;
                    });

                    // Mouse
                    document.addEventListener('mousemove', (e) => {
                        this.mouse.x = e.clientX;
                        this.mouse.y = e.clientY;
                    });

                    document.addEventListener('mousedown', () => {
                        this.mouse.pressed = true;
                    });

                    document.addEventListener('mouseup', () => {
                        this.mouse.pressed = false;
                    });

                    // Touch
                    document.addEventListener('touchstart', (e) => {
                        this.touches = Array.from(e.touches).map(touch => ({
                            x: touch.clientX,
                            y: touch.clientY,
                            id: touch.identifier
                        }));
                    });

                    document.addEventListener('touchmove', (e) => {
                        e.preventDefault();
                        this.touches = Array.from(e.touches).map(touch => ({
                            x: touch.clientX,
                            y: touch.clientY,
                            id: touch.identifier
                        }));
                    });

                    document.addEventListener('touchend', () => {
                        this.touches = [];
                    });
                },

                isKeyPressed(key) {
                    return this.keys[key] || false;
                },

                getTouch(index = 0) {
                    return this.touches[index] || null;
                }
            },

            // Enhanced responsive design helpers
            responsive: {
                isMobile: DeviceInfo.isMobile,
                isTablet: DeviceInfo.isTablet,
                orientation: DeviceInfo.orientation,

                onResize(callback) {
                    let resizeTimeout;
                    window.addEventListener('resize', () => {
                        clearTimeout(resizeTimeout);
                        resizeTimeout = setTimeout(() => {
                            DeviceInfo.viewportWidth = window.innerWidth;
                            DeviceInfo.viewportHeight = window.innerHeight;
                            DeviceInfo.orientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
                            optimizeAllCanvases();
                            callback(DeviceInfo);
                        }, 100);
                    });
                },

                scaleCanvas(canvas, baseWidth, baseHeight) {
                    const container = canvas.parentElement || document.body;
                    const containerWidth = container.clientWidth || window.innerWidth;
                    const containerHeight = container.clientHeight || window.innerHeight;

                    const scaleX = (containerWidth - 40) / baseWidth;
                    const scaleY = (containerHeight - 200) / baseHeight;
                    const scale = Math.min(scaleX, scaleY, 1);

                    const newWidth = baseWidth * scale;
                    const newHeight = baseHeight * scale;

                    canvas.style.width = newWidth + 'px';
                    canvas.style.height = newHeight + 'px';
                    canvas.style.maxWidth = '100%';
                    canvas.style.maxHeight = 'calc(100vh - 200px)';

                    return scale;
                },

                getOptimalCanvasSize(baseWidth, baseHeight) {
                    const maxWidth = Math.min(baseWidth, window.innerWidth - 40);
                    const maxHeight = Math.min(baseHeight, window.innerHeight - 200);

                    const aspectRatio = baseWidth / baseHeight;
                    let newWidth, newHeight;

                    if (maxWidth / maxHeight > aspectRatio) {
                        newHeight = maxHeight;
                        newWidth = newHeight * aspectRatio;
                    } else {
                        newWidth = maxWidth;
                        newHeight = newWidth / aspectRatio;
                    }

                    return { width: newWidth, height: newHeight };
                }
            },

            // Enhanced game state management
            state: {
                create(initialState) {
                    let state = { ...initialState };
                    const listeners = [];
                    const history = [{ ...initialState }];
                    const maxHistory = 50;

                    return {
                        get: (key) => key ? state[key] : state,

                        set: (key, value) => {
                            if (typeof key === 'object') {
                                state = { ...state, ...key };
                            } else {
                                state[key] = value;
                            }

                            // Add to history
                            history.push({ ...state });
                            if (history.length > maxHistory) {
                                history.shift();
                            }

                            listeners.forEach(fn => fn(state));
                        },

                        subscribe: (fn) => {
                            listeners.push(fn);
                            return () => {
                                const index = listeners.indexOf(fn);
                                if (index > -1) listeners.splice(index, 1);
                            };
                        },

                        reset: () => {
                            state = { ...initialState };
                            listeners.forEach(fn => fn(state));
                        },

                        undo: () => {
                            if (history.length > 1) {
                                history.pop(); // Remove current state
                                state = { ...history[history.length - 1] };
                                listeners.forEach(fn => fn(state));
                            }
                        },

                        save: (name) => {
                            try {
                                localStorage.setItem(`ashura_game_state_${name}`, JSON.stringify(state));
                            } catch (e) {
                                console.warn('Could not save state:', e);
                            }
                        },

                        load: (name) => {
                            try {
                                const saved = localStorage.getItem(`ashura_game_state_${name}`);
                                if (saved) {
                                    state = JSON.parse(saved);
                                    listeners.forEach(fn => fn(state));
                                    return true;
                                }
                            } catch (e) {
                                console.warn('Could not load state:', e);
                            }
                            return false;
                        }
                    };
                }
            },

            // Animation system
            animation: {
                create(target, properties, duration, easing = 'linear') {
                    const startTime = performance.now();
                    const startValues = {};
                    const easingFn = window.GameEnhancement.utils.easing[easing] || window.GameEnhancement.utils.easing.linear;

                    // Store initial values
                    for (const prop in properties) {
                        startValues[prop] = target[prop] || 0;
                    }

                    const animate = (currentTime) => {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const easedProgress = easingFn(progress);

                        // Update properties
                        for (const prop in properties) {
                            const startValue = startValues[prop];
                            const endValue = properties[prop];
                            target[prop] = startValue + (endValue - startValue) * easedProgress;
                        }

                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        }
                    };

                    requestAnimationFrame(animate);
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
        window.GameEnhancement.input.init();

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