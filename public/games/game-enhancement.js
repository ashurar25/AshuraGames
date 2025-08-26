// ASHURA Games - Advanced Enhancement System
// Modern, Beautiful, and Highly Playable Game JavaScript

class GameEnhancement {
    constructor() {
        this.isInitialized = false;
        this.particleSystem = null;
        this.audioSystem = null;
        this.achievementSystem = null;
        this.effectsSystem = null;
        this.inputSystem = null;
        this.performanceMonitor = null;
        
        this.config = {
            enableParticles: true,
            enableAudio: true,
            enableAchievements: true,
            enableEffects: true,
            particleLimit: 500,
            audioVolume: 0.3,
            enableHaptics: true,
            enableScreenShake: true
        };

        this.init();
    }

    init() {
        if (this.isInitialized) return;

        this.setupParticleSystem();
        this.setupAudioSystem();
        this.setupAchievementSystem();
        this.setupEffectsSystem();
        this.setupInputSystem();
        this.setupPerformanceMonitor();
        this.setupGameEnhancements();
        this.setupMobileOptimizations();

        this.isInitialized = true;
        console.log('🎮 Game Enhancement System initialized successfully');
    }

    // Particle System
    setupParticleSystem() {
        this.particleSystem = {
            particles: [],
            container: null,

            init() {
                if (!this.container) {
                    this.container = document.createElement('div');
                    this.container.className = 'particle-container';
                    document.body.appendChild(this.container);
                }
            },

            add(x, y, options = {}) {
                if (!window.gameEnhancement.config.enableParticles) return;
                
                const particle = {
                    x: x,
                    y: y,
                    vx: options.vx || (Math.random() - 0.5) * 4,
                    vy: options.vy || (Math.random() - 0.5) * 4,
                    color: options.color || '#00ffc8',
                    size: options.size || Math.random() * 4 + 2,
                    life: options.life || 1.0,
                    maxLife: options.life || 1.0,
                    gravity: options.gravity || 0.1,
                    element: null
                };

                // Create DOM element
                particle.element = document.createElement('div');
                particle.element.className = 'particle';
                particle.element.style.cssText = `
                    left: ${particle.x}px;
                    top: ${particle.y}px;
                    width: ${particle.size}px;
                    height: ${particle.size}px;
                    background: ${particle.color};
                    position: absolute;
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 1000;
                `;

                this.container.appendChild(particle.element);
                this.particles.push(particle);

                // Auto-remove after animation
                setTimeout(() => this.remove(particle), 3000);
            },

            remove(particle) {
                const index = this.particles.indexOf(particle);
                if (index > -1) {
                    this.particles.splice(index, 1);
                    if (particle.element && particle.element.parentNode) {
                        particle.element.parentNode.removeChild(particle.element);
                    }
                }
            },

            createExplosion(x, y, count = 10, color = '#00ffc8') {
                for (let i = 0; i < count; i++) {
                    const angle = (Math.PI * 2 * i) / count;
                    const speed = Math.random() * 3 + 2;
                    this.add(x, y, {
                        vx: Math.cos(angle) * speed,
                        vy: Math.sin(angle) * speed,
                        color: color,
                        size: Math.random() * 3 + 2,
                        life: 0.8
                    });
                }
            },

            createTrail(x, y, color = '#00ffc8') {
                this.add(x, y, {
                    vx: (Math.random() - 0.5) * 2,
                    vy: (Math.random() - 0.5) * 2,
                    color: color,
                    size: Math.random() * 2 + 1,
                    life: 0.5
                });
            }
        };

        this.particleSystem.init();
    }

    // Audio System
    setupAudioSystem() {
        this.audioSystem = {
            context: null,
            masterGain: null,
            sounds: new Map(),

            init() {
                try {
                    this.context = new (window.AudioContext || window.webkitAudioContext)();
                    this.masterGain = this.context.createGain();
                    this.masterGain.connect(this.context.destination);
                    this.masterGain.gain.value = window.gameEnhancement.config.audioVolume;
                } catch (e) {
                    console.warn('Audio context not supported');
                }
            },

            createSound(frequency, duration = 0.1, type = 'sine', volume = 1.0) {
                if (!this.context) return () => {};

                return () => {
                    try {
                        const oscillator = this.context.createOscillator();
                        const gainNode = this.context.createGain();

                        oscillator.connect(gainNode);
                        gainNode.connect(this.masterGain);

                        oscillator.frequency.value = frequency;
                        oscillator.type = type;

                        gainNode.gain.setValueAtTime(volume * 0.1, this.context.currentTime);
                        gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);

                        oscillator.start(this.context.currentTime);
                        oscillator.stop(this.context.currentTime + duration);
                    } catch (e) {
                        console.warn('Audio playback failed');
                    }
                };
            },

            playSuccess() {
                const sound = this.createSound(523.25, 0.2, 'sine', 0.5); // C5
                sound();
                setTimeout(() => {
                    const sound2 = this.createSound(659.25, 0.2, 'sine', 0.5); // E5
                    sound2();
                }, 100);
            },

            playError() {
                const sound = this.createSound(220, 0.3, 'sawtooth', 0.3);
                sound();
            },

            playClick() {
                const sound = this.createSound(800, 0.05, 'square', 0.2);
                sound();
            },

            playPowerUp() {
                for (let i = 0; i < 5; i++) {
                    setTimeout(() => {
                        const freq = 440 + (i * 110);
                        const sound = this.createSound(freq, 0.1, 'sine', 0.3);
                        sound();
                    }, i * 50);
                }
            }
        };

        this.audioSystem.init();
    }

    // Achievement System
    setupAchievementSystem() {
        this.achievementSystem = {
            achievements: new Map(),
            unlockedAchievements: new Set(),

            init() {
                // Load saved achievements
                try {
                    const saved = localStorage.getItem('ashura_achievements');
                    if (saved) {
                        this.unlockedAchievements = new Set(JSON.parse(saved));
                    }
                } catch (e) {
                    console.warn('Failed to load achievements');
                }

                // Define default achievements
                this.define('first_game', {
                    title: 'เริ่มต้นการผจญภัย',
                    description: 'เล่นเกมครั้งแรก',
                    icon: '🎮'
                });

                this.define('score_100', {
                    title: 'นักสู้มือใหม่',
                    description: 'ทำคะแนนได้ 100 แต้ม',
                    icon: '🏆'
                });

                this.define('score_1000', {
                    title: 'ผู้เชี่ยวชาญ',
                    description: 'ทำคะแนนได้ 1,000 แต้ม',
                    icon: '⭐'
                });

                this.define('perfect_game', {
                    title: 'เกมเพอร์เฟค',
                    description: 'เล่นได้อย่างสมบูรณ์แบบ',
                    icon: '💎'
                });
            },

            define(id, achievement) {
                this.achievements.set(id, achievement);
            },

            unlock(id) {
                if (this.unlockedAchievements.has(id)) return false;

                const achievement = this.achievements.get(id);
                if (!achievement) return false;

                this.unlockedAchievements.add(id);
                this.saveProgress();
                this.showNotification(achievement);
                
                // Play achievement sound
                if (window.gameEnhancement.audioSystem) {
                    window.gameEnhancement.audioSystem.playPowerUp();
                }

                return true;
            },

            showNotification(achievement) {
                const notification = document.createElement('div');
                notification.className = 'achievement';
                notification.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <span style="font-size: 2rem;">${achievement.icon}</span>
                        <div>
                            <div style="font-size: 1.2rem; font-weight: bold;">${achievement.title}</div>
                            <div style="font-size: 0.9rem; opacity: 0.8;">${achievement.description}</div>
                        </div>
                    </div>
                `;

                document.body.appendChild(notification);

                // Create particles
                if (window.gameEnhancement.particleSystem) {
                    window.gameEnhancement.particleSystem.createExplosion(
                        window.innerWidth - 200, 100, 15, '#ffd700'
                    );
                }

                // Remove after animation
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 3000);
            },

            saveProgress() {
                try {
                    localStorage.setItem('ashura_achievements', 
                        JSON.stringify([...this.unlockedAchievements]));
                } catch (e) {
                    console.warn('Failed to save achievements');
                }
            }
        };

        this.achievementSystem.init();
    }

    // Effects System
    setupEffectsSystem() {
        this.effectsSystem = {
            screenShake: {
                intensity: 0,
                duration: 0,
                startTime: 0,

                start(intensity = 5, duration = 300) {
                    if (!window.gameEnhancement.config.enableScreenShake) return;
                    
                    this.intensity = intensity;
                    this.duration = duration;
                    this.startTime = Date.now();
                    this.animate();
                },

                animate() {
                    const elapsed = Date.now() - this.startTime;
                    if (elapsed >= this.duration) {
                        document.body.style.transform = '';
                        return;
                    }

                    const progress = elapsed / this.duration;
                    const currentIntensity = this.intensity * (1 - progress);
                    
                    const x = (Math.random() - 0.5) * currentIntensity;
                    const y = (Math.random() - 0.5) * currentIntensity;
                    
                    document.body.style.transform = `translate(${x}px, ${y}px)`;
                    
                    requestAnimationFrame(() => this.animate());
                }
            },

            flash: {
                create(color = '#ffffff', duration = 100) {
                    const flash = document.createElement('div');
                    flash.style.cssText = `
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: ${color};
                        opacity: 0.7;
                        z-index: 9999;
                        pointer-events: none;
                        animation: flashFade ${duration}ms ease-out forwards;
                    `;

                    // Add CSS animation if not exists
                    if (!document.getElementById('flash-animation')) {
                        const style = document.createElement('style');
                        style.id = 'flash-animation';
                        style.textContent = `
                            @keyframes flashFade {
                                0% { opacity: 0.7; }
                                100% { opacity: 0; }
                            }
                        `;
                        document.head.appendChild(style);
                    }

                    document.body.appendChild(flash);
                    setTimeout(() => {
                        if (flash.parentNode) {
                            flash.parentNode.removeChild(flash);
                        }
                    }, duration);
                }
            },

            ripple: {
                create(x, y, color = '#00ffc8') {
                    const ripple = document.createElement('div');
                    ripple.style.cssText = `
                        position: fixed;
                        left: ${x - 25}px;
                        top: ${y - 25}px;
                        width: 50px;
                        height: 50px;
                        border: 2px solid ${color};
                        border-radius: 50%;
                        pointer-events: none;
                        z-index: 1000;
                        animation: rippleExpand 0.6s ease-out forwards;
                    `;

                    // Add CSS animation if not exists
                    if (!document.getElementById('ripple-animation')) {
                        const style = document.createElement('style');
                        style.id = 'ripple-animation';
                        style.textContent = `
                            @keyframes rippleExpand {
                                0% { 
                                    transform: scale(0);
                                    opacity: 1;
                                }
                                100% { 
                                    transform: scale(4);
                                    opacity: 0;
                                }
                            }
                        `;
                        document.head.appendChild(style);
                    }

                    document.body.appendChild(ripple);
                    setTimeout(() => {
                        if (ripple.parentNode) {
                            ripple.parentNode.removeChild(ripple);
                        }
                    }, 600);
                }
            }
        };
    }

    // Input System
    setupInputSystem() {
        this.inputSystem = {
            keys: new Set(),
            mouse: { x: 0, y: 0, pressed: false },
            touch: { x: 0, y: 0, active: false },

            init() {
                // Keyboard events
                document.addEventListener('keydown', (e) => {
                    this.keys.add(e.code);
                    
                    // Play click sound for game keys
                    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 
                          'KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(e.code)) {
                        if (window.gameEnhancement.audioSystem) {
                            window.gameEnhancement.audioSystem.playClick();
                        }
                    }
                });

                document.addEventListener('keyup', (e) => {
                    this.keys.delete(e.code);
                });

                // Mouse events
                document.addEventListener('mousemove', (e) => {
                    this.mouse.x = e.clientX;
                    this.mouse.y = e.clientY;
                });

                document.addEventListener('mousedown', (e) => {
                    this.mouse.pressed = true;
                    
                    // Create ripple effect
                    if (window.gameEnhancement.effectsSystem) {
                        window.gameEnhancement.effectsSystem.ripple.create(e.clientX, e.clientY);
                    }
                });

                document.addEventListener('mouseup', () => {
                    this.mouse.pressed = false;
                });

                // Touch events
                document.addEventListener('touchstart', (e) => {
                    if (e.touches.length > 0) {
                        this.touch.x = e.touches[0].clientX;
                        this.touch.y = e.touches[0].clientY;
                        this.touch.active = true;

                        // Create ripple effect
                        if (window.gameEnhancement.effectsSystem) {
                            window.gameEnhancement.effectsSystem.ripple.create(
                                this.touch.x, this.touch.y
                            );
                        }

                        // Haptic feedback
                        if (window.gameEnhancement.config.enableHaptics && navigator.vibrate) {
                            navigator.vibrate(50);
                        }
                    }
                }, { passive: false });

                document.addEventListener('touchmove', (e) => {
                    if (e.touches.length > 0) {
                        this.touch.x = e.touches[0].clientX;
                        this.touch.y = e.touches[0].clientY;
                    }
                }, { passive: false });

                document.addEventListener('touchend', () => {
                    this.touch.active = false;
                });
            },

            isKeyPressed(keyCode) {
                return this.keys.has(keyCode);
            }
        };

        this.inputSystem.init();
    }

    // Performance Monitor
    setupPerformanceMonitor() {
        this.performanceMonitor = {
            fps: 0,
            frameCount: 0,
            lastTime: performance.now(),

            update() {
                this.frameCount++;
                const currentTime = performance.now();
                
                if (currentTime >= this.lastTime + 1000) {
                    this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
                    this.frameCount = 0;
                    this.lastTime = currentTime;
                    
                    // Update FPS display if exists
                    const fpsCounter = document.getElementById('fps-counter');
                    if (fpsCounter) {
                        fpsCounter.textContent = `FPS: ${this.fps}`;
                    }
                }
                
                requestAnimationFrame(() => this.update());
            },

            start() {
                this.update();
            }
        };

        this.performanceMonitor.start();
    }

    // Game Enhancements
    setupGameEnhancements() {
        // Enhance buttons with sound effects
        document.addEventListener('click', (e) => {
            if (e.target.matches('button, .btn, .menu-button, .restart-btn')) {
                if (this.audioSystem) {
                    this.audioSystem.playClick();
                }
                
                // Create particle effect
                if (this.particleSystem) {
                    this.particleSystem.createExplosion(
                        e.clientX, e.clientY, 5, '#00ffc8'
                    );
                }
            }
        });

        // Auto-unlock first game achievement
        setTimeout(() => {
            if (this.achievementSystem) {
                this.achievementSystem.unlock('first_game');
            }
        }, 1000);

        // Add score tracking
        this.setupScoreTracking();
    }

    setupScoreTracking() {
        // Monitor score changes
        const scoreElements = ['#score', '.score-value', '#finalScore'];
        
        scoreElements.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.type === 'childList' || mutation.type === 'characterData') {
                            const score = parseInt(element.textContent) || 0;
                            this.checkScoreAchievements(score);
                        }
                    });
                });

                observer.observe(element, {
                    childList: true,
                    subtree: true,
                    characterData: true
                });
            }
        });
    }

    checkScoreAchievements(score) {
        if (score >= 100 && this.achievementSystem) {
            this.achievementSystem.unlock('score_100');
        }
        if (score >= 1000 && this.achievementSystem) {
            this.achievementSystem.unlock('score_1000');
        }
    }

    // Mobile Optimizations
    setupMobileOptimizations() {
        // Prevent zoom on double tap
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);

        // Prevent context menu on long press
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });

        // Optimize for mobile performance
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            this.config.particleLimit = 200;
            this.config.enableEffects = false;
        }
    }

    // Public API Methods
    createExplosion(x, y, count = 10, color = '#00ffc8') {
        if (this.particleSystem) {
            this.particleSystem.createExplosion(x, y, count, color);
        }
    }

    playSound(type) {
        if (!this.audioSystem) return;
        
        switch (type) {
            case 'success':
                this.audioSystem.playSuccess();
                break;
            case 'error':
                this.audioSystem.playError();
                break;
            case 'click':
                this.audioSystem.playClick();
                break;
            case 'powerup':
                this.audioSystem.playPowerUp();
                break;
        }
    }

    screenShake(intensity = 5, duration = 300) {
        if (this.effectsSystem) {
            this.effectsSystem.screenShake.start(intensity, duration);
        }
    }

    flash(color = '#ffffff', duration = 100) {
        if (this.effectsSystem) {
            this.effectsSystem.flash.create(color, duration);
        }
    }

    unlockAchievement(id) {
        if (this.achievementSystem) {
            return this.achievementSystem.unlock(id);
        }
        return false;
    }

    // Configuration
    setConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        
        // Apply audio volume change
        if (this.audioSystem && this.audioSystem.masterGain) {
            this.audioSystem.masterGain.gain.value = this.config.audioVolume;
        }
    }

    getStats() {
        return {
            fps: this.performanceMonitor ? this.performanceMonitor.fps : 0,
            particles: this.particleSystem ? this.particleSystem.particles.length : 0,
            achievements: this.achievementSystem ? this.achievementSystem.unlockedAchievements.size : 0,
            config: this.config
        };
    }
}

// Initialize the enhancement system
const gameEnhancement = new GameEnhancement();

// Make it globally available
window.GameEnhancement = GameEnhancement;
window.gameEnhancement = gameEnhancement;

// Convenience functions
window.createExplosion = (x, y, count, color) => gameEnhancement.createExplosion(x, y, count, color);
window.playGameSound = (type) => gameEnhancement.playSound(type);
window.screenShake = (intensity, duration) => gameEnhancement.screenShake(intensity, duration);
window.flashScreen = (color, duration) => gameEnhancement.flash(color, duration);
window.unlockAchievement = (id) => gameEnhancement.unlockAchievement(id);

console.log('🎮 Advanced Game Enhancement System loaded successfully!');
