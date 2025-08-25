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
        this.qualityMode = 'medium'; // 'low' | 'medium' | 'high'
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
        this.installCinematicOverlay();
        this.applyInitialQualityFromPrefs();
        this.setupErrorHandling();

        this.isInitialized = true;
        console.log('🎮 Game Optimizer initialized successfully');
    }

    // ... (rest of the code remains the same)

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

    installCinematicOverlay() {
        // Avoid duplicate
        if (document.getElementById('cinematic-overlay')) return;
        const overlay = document.createElement('div');
        overlay.id = 'cinematic-overlay';
        overlay.className = 'cinematic-overlay';
        overlay.setAttribute('aria-hidden', 'true');
        document.body.appendChild(overlay);

        // subtle camera shake API (applies transform on body)
        let shakeT = 0, active = false;
        const step = () => {
            if (!active) return;
            shakeT += 0.016;
            const amp = this.qualityMode === 'high' ? 1.2 : this.qualityMode === 'medium' ? 0.6 : 0.0;
            const dx = Math.sin(shakeT * 37) * amp;
            const dy = Math.cos(shakeT * 29) * amp;
            document.documentElement.style.setProperty('--gf-shake-x', dx.toFixed(2) + 'px');
            document.documentElement.style.setProperty('--gf-shake-y', dy.toFixed(2) + 'px');
            requestAnimationFrame(step);
        };
        this.startShake = () => { if (!active){ active = true; requestAnimationFrame(step);} };
        this.stopShake = () => { active = false; document.documentElement.style.setProperty('--gf-shake-x','0px'); document.documentElement.style.setProperty('--gf-shake-y','0px'); };
    }

    applyInitialQualityFromPrefs(){
        try {
            const saved = localStorage.getItem('ashura:quality');
            if (saved === 'low' || saved === 'medium' || saved === 'high') {
                this.setQualityMode(saved);
                return;
            }
        } catch(_) {}
        // Heuristic: mobile -> medium/low, desktop -> high/medium
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.setQualityMode(isMobile ? 'medium' : 'high');
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

    setQualityMode(mode){
        if (!['low','medium','high'].includes(mode)) return;
        this.qualityMode = mode;
        // Map quality to performance config
        this.setPerformanceMode(mode);
        // Update CSS hooks
        document.body.classList.remove('gf-quality-low','gf-quality-medium','gf-quality-high');
        document.body.classList.add(`gf-quality-${mode}`);
        try { localStorage.setItem('ashura:quality', mode); } catch(_) {}
        // Notify listeners (e.g., toolbar)
        window.dispatchEvent(new CustomEvent('gf:quality', { detail: { mode } }));
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

// Expose a convenience for Game Frame toolbar
window.setAshuraQuality = function(mode){
    try { gameOptimizer.setQualityMode(mode); } catch(_) {}
};

// Auto-detect mobile and enable touch controls
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    gameOptimizer.enableTouchControls();
}

console.log('🎮 Advanced Game Optimization System loaded successfully!');