// Advanced Game Optimization System
class GameOptimizer {
    constructor() {
        this.isInitialized = false;
        this.performanceConfig = {
            enableVSync: true,
            maxFPS: 60,
            enableAntiAliasing: true,
            particleLimit: 1000,
            enableShadows: true
        };
        this.touchControls = {
            enabled: false,
            buttons: new Map()
        };
        this.gamepadSupport = {
            enabled: false,
            gamepads: []
        };
        this.init();
    }

    init() {
        if (this.isInitialized) return;

        this.setupPerformanceOptimization();
        this.setupResponsiveDesign();
        this.setupTouchControls();
        this.setupGamepadSupport();
        this.setupKeyboardOptimization();
        this.setupAudioOptimization();
        this.setupVisualEnhancements();
        this.setupErrorHandling();

        this.isInitialized = true;
        console.log('🎮 Game Optimizer initialized successfully');
    }

    setupPerformanceOptimization() {
        // FPS Monitoring และ Control
        let lastFrameTime = 0;
        let frameCount = 0;
        let fps = 0;

        const fpsCounter = () => {
            const now = performance.now();
            frameCount++;

            if (now - lastFrameTime >= 1000) {
                fps = Math.round((frameCount * 1000) / (now - lastFrameTime));
                frameCount = 0;
                lastFrameTime = now;

                // แสดง FPS Counter
                this.updateFPSDisplay(fps);

                // Auto-adjust quality based on performance
                this.autoAdjustQuality(fps);
            }

            requestAnimationFrame(fpsCounter);
        };

        requestAnimationFrame(fpsCounter);

        // Memory management
        this.setupMemoryOptimization();
    }

    updateFPSDisplay(fps) {
        let fpsDisplay = document.getElementById('fps-counter');
        if (!fpsDisplay) {
            fpsDisplay = document.createElement('div');
            fpsDisplay.id = 'fps-counter';
            fpsDisplay.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                background: rgba(0, 0, 0, 0.8);
                color: #00ff00;
                padding: 5px 10px;
                border-radius: 5px;
                font-family: 'Courier New', monospace;
                font-size: 12px;
                z-index: 10000;
                pointer-events: none;
            `;
            document.body.appendChild(fpsDisplay);
        }

        const color = fps >= 50 ? '#00ff00' : fps >= 30 ? '#ffff00' : '#ff0000';
        fpsDisplay.style.color = color;
        fpsDisplay.textContent = `FPS: ${fps}`;
    }

    autoAdjustQuality(fps) {
        if (fps < 30) {
            // ลดคุณภาพเมื่อ FPS ต่ำ
            this.performanceConfig.enableShadows = false;
            this.performanceConfig.particleLimit = 500;
            this.performanceConfig.enableAntiAliasing = false;
        } else if (fps > 55) {
            // เพิ่มคุณภาพเมื่อ FPS สูง
            this.performanceConfig.enableShadows = true;
            this.performanceConfig.particleLimit = 1000;
            this.performanceConfig.enableAntiAliasing = true;
        }
    }

    setupMemoryOptimization() {
        // Garbage Collection Optimization
        let memoryCleanupInterval = setInterval(() => {
            if (window.gc) {
                window.gc();
            }

            // Clean up unused canvas contexts
            const canvases = document.querySelectorAll('canvas');
            canvases.forEach(canvas => {
                if (canvas.style.display === 'none' || !canvas.parentNode) {
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                    }
                }
            });
        }, 30000); // ทุก 30 วินาที

        // ทำความสะอาดเมื่อออกจากหน้า
        window.addEventListener('beforeunload', () => {
            clearInterval(memoryCleanupInterval);
        });
    }

    setupResponsiveDesign() {
        const gameContainer = document.querySelector('.game-container, #gameContainer, .game, #game');
        if (!gameContainer) return;

        const resizeHandler = () => {
            const canvas = gameContainer.querySelector('canvas');
            if (canvas) {
                const rect = gameContainer.getBoundingClientRect();
                const aspectRatio = canvas.width / canvas.height;

                let newWidth, newHeight;

                if (rect.width / rect.height > aspectRatio) {
                    newHeight = rect.height;
                    newWidth = newHeight * aspectRatio;
                } else {
                    newWidth = rect.width;
                    newHeight = newWidth / aspectRatio;
                }

                canvas.style.width = newWidth + 'px';
                canvas.style.height = newHeight + 'px';
                canvas.style.maxWidth = '100%';
                canvas.style.maxHeight = '100vh';
            }
        };

        window.addEventListener('resize', resizeHandler);
        window.addEventListener('orientationchange', () => {
            setTimeout(resizeHandler, 100);
        });

        resizeHandler();
    }

    setupTouchControls() {
        if (!('ontouchstart' in window)) return;

        this.touchControls.enabled = true;

        // สร้าง Virtual D-Pad
        this.createVirtualDPad();

        // สร้าง Action Buttons
        this.createActionButtons();

        // Gesture Support
        this.setupGestureControls();
    }

    createVirtualDPad() {
        const dpad = document.createElement('div');
        dpad.id = 'virtual-dpad';
        dpad.innerHTML = `
            <div class="dpad-center">
                <div class="dpad-button dpad-up" data-key="ArrowUp">↑</div>
                <div class="dpad-button dpad-left" data-key="ArrowLeft">←</div>
                <div class="dpad-button dpad-right" data-key="ArrowRight">→</div>
                <div class="dpad-button dpad-down" data-key="ArrowDown">↓</div>
            </div>
        `;

        dpad.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            width: 120px;
            height: 120px;
            z-index: 9999;
            opacity: 0.7;
        `;

        document.body.appendChild(dpad);

        // Event listeners for D-Pad
        dpad.querySelectorAll('.dpad-button').forEach(button => {
            const key = button.dataset.key;

            button.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.simulateKeyEvent('keydown', key);
                button.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
            });

            button.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.simulateKeyEvent('keyup', key);
                button.style.backgroundColor = 'transparent';
            });
        });
    }

    createActionButtons() {
        const actionContainer = document.createElement('div');
        actionContainer.id = 'action-buttons';
        actionContainer.innerHTML = `
            <div class="action-button" data-key=" ">A</div>
            <div class="action-button" data-key="Enter">B</div>
        `;

        actionContainer.style.cssText = `
            position: fixed;
            bottom: 60px;
            right: 20px;
            z-index: 9999;
            display: flex;
            gap: 10px;
            opacity: 0.7;
        `;

        document.body.appendChild(actionContainer);

        actionContainer.querySelectorAll('.action-button').forEach(button => {
            const key = button.dataset.key;

            button.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.simulateKeyEvent('keydown', key);
                button.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
            });

            button.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.simulateKeyEvent('keyup', key);
                button.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            });
        });
    }

    setupGestureControls() {
        let startX, startY;
        const gameArea = document.querySelector('.game-container, #gameContainer, canvas');
        if (!gameArea) return;

        gameArea.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
        });

        gameArea.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;

            const touch = e.changedTouches[0];
            const endX = touch.clientX;
            const endY = touch.clientY;

            const deltaX = endX - startX;
            const deltaY = endY - startY;

            // Swipe detection
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (Math.abs(deltaX) > 50) {
                    const key = deltaX > 0 ? 'ArrowRight' : 'ArrowLeft';
                    this.simulateKeyEvent('keydown', key);
                    setTimeout(() => this.simulateKeyEvent('keyup', key), 100);
                }
            } else {
                if (Math.abs(deltaY) > 50) {
                    const key = deltaY > 0 ? 'ArrowDown' : 'ArrowUp';
                    this.simulateKeyEvent('keydown', key);
                    setTimeout(() => this.simulateKeyEvent('keyup', key), 100);
                }
            }

            startX = startY = null;
        });
    }

    setupGamepadSupport() {
        if (!navigator.getGamepads) return;

        this.gamepadSupport.enabled = true;

        window.addEventListener('gamepadconnected', (e) => {
            console.log('🎮 Gamepad connected:', e.gamepad.id);
            this.gamepadSupport.gamepads[e.gamepad.index] = e.gamepad;
        });

        window.addEventListener('gamepaddisconnected', (e) => {
            console.log('🎮 Gamepad disconnected:', e.gamepad.id);
            delete this.gamepadSupport.gamepads[e.gamepad.index];
        });

        // Gamepad polling
        const pollGamepads = () => {
            if (!this.gamepadSupport.enabled) return;

            const gamepads = navigator.getGamepads();
            for (let i = 0; i < gamepads.length; i++) {
                const gamepad = gamepads[i];
                if (gamepad) {
                    this.handleGamepadInput(gamepad);
                }
            }

            requestAnimationFrame(pollGamepads);
        };

        pollGamepads();
    }

    handleGamepadInput(gamepad) {
        const threshold = 0.3;

        // D-Pad / Left stick
        if (gamepad.axes[0] > threshold) this.simulateKeyEvent('keydown', 'ArrowRight');
        else if (gamepad.axes[0] < -threshold) this.simulateKeyEvent('keydown', 'ArrowLeft');

        if (gamepad.axes[1] > threshold) this.simulateKeyEvent('keydown', 'ArrowDown');
        else if (gamepad.axes[1] < -threshold) this.simulateKeyEvent('keydown', 'ArrowUp');

        // Buttons
        if (gamepad.buttons[0].pressed) this.simulateKeyEvent('keydown', ' '); // A
        if (gamepad.buttons[1].pressed) this.simulateKeyEvent('keydown', 'Escape'); // B
        if (gamepad.buttons[9].pressed) this.simulateKeyEvent('keydown', 'Enter'); // Start
    }

    setupKeyboardOptimization() {
        // Prevent default behaviors for game keys
        const gameKeys = [
            'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
            'Space', 'Enter', 'Escape', 'w', 'a', 's', 'd'
        ];

        document.addEventListener('keydown', (e) => {
            if (gameKeys.includes(e.key) || gameKeys.includes(e.code)) {
                e.preventDefault();
            }
        });

        // Key repeat optimization
        const keyStates = {};

        document.addEventListener('keydown', (e) => {
            if (!keyStates[e.code]) {
                keyStates[e.code] = true;
                // Dispatch optimized key event
            }
        });

        document.addEventListener('keyup', (e) => {
            keyStates[e.code] = false;
        });
    }

    setupAudioOptimization() {
        // Audio context setup
        if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const audioContext = new AudioContext();

            // Audio pooling system
            const audioPool = new Map();

            window.playOptimizedSound = (src, volume = 1.0, loop = false) => {
                if (!audioPool.has(src)) {
                    const audio = new Audio(src);
                    audio.preload = 'auto';
                    audioPool.set(src, [audio]);
                }

                const sounds = audioPool.get(src);
                let availableSound = sounds.find(sound => sound.ended || sound.paused);

                if (!availableSound) {
                    availableSound = new Audio(src);
                    sounds.push(availableSound);
                }

                availableSound.volume = volume;
                availableSound.loop = loop;
                availableSound.currentTime = 0;

                const playPromise = availableSound.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.log('Audio play failed:', error);
                    });
                }

                return availableSound;
            };
        }
    }

    setupVisualEnhancements() {
        // Particle system optimization
        window.ParticleSystem = class {
            constructor(canvas, maxParticles = 100) {
                this.canvas = canvas;
                this.ctx = canvas.getContext('2d');
                this.particles = [];
                this.maxParticles = maxParticles;
            }

            addParticle(x, y, vx, vy, color = '#ffffff', life = 1.0) {
                if (this.particles.length >= this.maxParticles) {
                    this.particles.shift(); // Remove oldest particle
                }

                this.particles.push({
                    x, y, vx, vy, color, life, maxLife: life
                });
            }

            update(deltaTime) {
                for (let i = this.particles.length - 1; i >= 0; i--) {
                    const particle = this.particles[i];

                    particle.x += particle.vx * deltaTime;
                    particle.y += particle.vy * deltaTime;
                    particle.life -= deltaTime;

                    if (particle.life <= 0) {
                        this.particles.splice(i, 1);
                    }
                }
            }

            render() {
                this.ctx.save();

                for (const particle of this.particles) {
                    const alpha = particle.life / particle.maxLife;
                    this.ctx.globalAlpha = alpha;
                    this.ctx.fillStyle = particle.color;
                    this.ctx.fillRect(particle.x - 1, particle.y - 1, 2, 2);
                }

                this.ctx.restore();
            }
        };

        // Enhanced canvas rendering
        this.optimizeCanvasRendering();
    }

    optimizeCanvasRendering() {
        const canvases = document.querySelectorAll('canvas');

        canvases.forEach(canvas => {
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // Enable hardware acceleration
            ctx.imageSmoothingEnabled = this.performanceConfig.enableAntiAliasing;

            // Optimize for performance
            const originalClearRect = ctx.clearRect;
            ctx.clearRect = function(x, y, w, h) {
                this.save();
                this.globalCompositeOperation = 'copy';
                this.fillStyle = '#000000';
                originalClearRect.call(this, x, y, w, h);
                this.restore();
            };
        });
    }

    setupErrorHandling() {
        window.addEventListener('error', (e) => {
            console.error('🚨 Game Error:', e.error);

            // Show user-friendly error message
            this.showErrorNotification('เกิดข้อผิดพลาด กรุณาโหลดเกมใหม่');
        });

        window.addEventListener('unhandledrejection', (e) => {
            console.error('🚨 Promise Rejection:', e.reason);
            e.preventDefault();
        });
    }

    showErrorNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #ff4444;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 10001;
            font-family: Arial, sans-serif;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    simulateKeyEvent(type, key) {
        const event = new KeyboardEvent(type, {
            key: key,
            code: key,
            bubbles: true,
            cancelable: true
        });

        document.dispatchEvent(event);
    }

    // Public API methods
    enableTouchControls() {
        const dpad = document.getElementById('virtual-dpad');
        const buttons = document.getElementById('action-buttons');

        if (dpad) dpad.style.display = 'block';
        if (buttons) buttons.style.display = 'flex';
    }

    disableTouchControls() {
        const dpad = document.getElementById('virtual-dpad');
        const buttons = document.getElementById('action-buttons');

        if (dpad) dpad.style.display = 'none';
        if (buttons) buttons.style.display = 'none';
    }

    setPerformanceMode(mode) {
        switch (mode) {
            case 'high':
                this.performanceConfig.enableShadows = true;
                this.performanceConfig.enableAntiAliasing = true;
                this.performanceConfig.particleLimit = 1000;
                break;
            case 'medium':
                this.performanceConfig.enableShadows = true;
                this.performanceConfig.enableAntiAliasing = false;
                this.performanceConfig.particleLimit = 500;
                break;
            case 'low':
                this.performanceConfig.enableShadows = false;
                this.performanceConfig.enableAntiAliasing = false;
                this.performanceConfig.particleLimit = 200;
                break;
        }
    }

    getPerformanceStats() {
        return {
            fps: parseInt(document.getElementById('fps-counter')?.textContent?.replace('FPS: ', '') || '0'),
            memoryUsage: performance.memory ? {
                used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
                total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
                limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
            } : null,
            config: {...this.performanceConfig}
        };
    }
}

// Initialize the game optimizer
const gameOptimizer = new GameOptimizer();

// Make it globally available
window.GameOptimizer = GameOptimizer;
window.gameOptimizer = gameOptimizer;

// Auto-detect mobile and enable touch controls
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    gameOptimizer.enableTouchControls();
}

console.log('🎮 Advanced Game Optimization System loaded successfully!');