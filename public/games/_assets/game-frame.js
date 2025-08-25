/* Shared Game Frame JS: toolbar, helpers, and loader */
(function(){
  const state = { muted: false, fpsVisible: true, fs: false, audioUnlocked: false };

  // Lightweight config hook: set window.GF_CONFIG before this script
  // Example: window.GF_CONFIG = { maxDevicePixelRatio: 1.75, resizeDebounceMs: 150, autoPauseOnHide: true, pixelArt: false, debug: false }
  const CFG = Object.assign({
    maxDevicePixelRatio: 1.75,
    resizeDebounceMs: 150,
    autoPauseOnHide: true,
    pixelArt: false,
    debug: /[?&]gfDebug=1/i.test(location.search) || false,
    autoMuteOnPause: true,
    showPauseOverlay: true,
    hints: false,
  }, window.GF_CONFIG || {});

  function el(tag, cls, html){
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  // Paused overlay
  let pausedOverlay;
  function ensurePausedOverlay(){
    if (pausedOverlay) return pausedOverlay;
    pausedOverlay = el('div','gf-paused-overlay');
    const badge = el('div','gf-paused-badge','Paused');
    pausedOverlay.appendChild(badge);
    document.body.appendChild(pausedOverlay);
    return pausedOverlay;
  }
  function showPaused(){ ensurePausedOverlay(); pausedOverlay.classList.add('is-visible'); }
  function hidePaused(){ if (!pausedOverlay) return; pausedOverlay.classList.remove('is-visible'); }

  function ensureToolbar(){
    if (document.querySelector('.game-toolbar')) return;
    document.body.classList.add('gf-with-toolbar');

    const bar = el('div','game-toolbar');
    const left = el('div','gf-left');
    const right = el('div','gf-right');

    // Back button
    const backBtn = el('button','gf-btn', '⟵ Back');
    backBtn.addEventListener('click', () => {
      if (history.length > 1) {
        history.back();
      } else {
        location.href = '/';
      }
    });

    // Title
    const title = el('div','gf-title');
    const h1 = document.querySelector('.game-container h1, h1');
    const docTitle = (document.title || '').replace(/\s*-\s*ASHURA.*$/i,'');
    title.textContent = h1?.textContent?.trim() || docTitle || 'Game';

    left.appendChild(backBtn);
    left.appendChild(title);

    // Fullscreen
    const fsBtn = el('button','gf-btn gf-btn--primary','⛶ Fullscreen');
    fsBtn.addEventListener('click', toggleFullscreen);

    // Mute
    const muteBtn = el('button','gf-btn','🔇 Mute');
    muteBtn.addEventListener('click', () => {
      state.muted = !state.muted;
      setGlobalMute(state.muted);
      muteBtn.textContent = state.muted ? '🔈 Unmute' : '🔇 Mute';
      toast(state.muted ? 'Sound muted' : 'Sound unmuted');
    });

    // FPS toggle
    const fpsBtn = el('button','gf-btn','⏱ FPS');
    fpsBtn.addEventListener('click', () => {
      state.fpsVisible = !state.fpsVisible;
      const fps = document.getElementById('fps-counter');
      if (fps) fps.style.display = state.fpsVisible ? 'block' : 'none';
    });

    // Quality toggle (Low/Medium/High)
    const qualityOrder = ['low','medium','high'];
    const cap = (s)=> s ? s.charAt(0).toUpperCase()+s.slice(1) : s;
    const qualityBtn = el('button','gf-btn','🎛 Quality');
    let currentQuality = (window.gameOptimizer && window.gameOptimizer.qualityMode) || (function(){ try { return localStorage.getItem('ashura:quality') || 'medium'; } catch(_) { return 'medium'; } })();
    const syncQualityLabel = (mode) => { qualityBtn.textContent = `🎛 Quality: ${cap(mode)}`; };
    syncQualityLabel(currentQuality);
    qualityBtn.addEventListener('click', () => {
      const idx = Math.max(0, qualityOrder.indexOf(currentQuality));
      currentQuality = qualityOrder[(idx + 1) % qualityOrder.length];
      if (window.setAshuraQuality) { try { window.setAshuraQuality(currentQuality); } catch(_){} }
      syncQualityLabel(currentQuality);
      try { toast(`Quality: ${cap(currentQuality)}`); } catch(_){}
    });
    // Keep label in sync with external changes
    window.addEventListener('gf:quality', (e)=>{
      const m = e && e.detail && e.detail.mode;
      if (!m) return;
      currentQuality = m;
      syncQualityLabel(m);
    });

    right.appendChild(fsBtn);
    right.appendChild(muteBtn);
    right.appendChild(fpsBtn);
    right.appendChild(qualityBtn);

    bar.appendChild(left);
    bar.appendChild(right);
    document.body.appendChild(bar);
    // Ensure a global FPS counter element exists for the FPS toggle and debug overlay
    if (!document.getElementById('fps-counter')) {
      const fps = el('div');
      fps.id = 'fps-counter';
      fps.style.position = 'fixed';
      fps.style.top = '64px';
      fps.style.right = '12px';
      fps.style.zIndex = '7000';
      fps.style.color = '#fff';
      fps.style.font = '600 12px/1 ui-sans-serif';
      fps.style.display = state.fpsVisible ? 'block' : 'none';
      document.body.appendChild(fps);
    }
  }

  function toggleFullscreen(){
    const container = document.querySelector('.game-container, #gameContainer, .game, #game') || document.documentElement;
    if (!document.fullscreenElement) {
      (container.requestFullscreen || container.webkitRequestFullscreen || container.msRequestFullscreen)?.call(container);
    } else {
      (document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen)?.call(document);
    }
  }

  function setGlobalMute(muted){
    // HTMLAudioElements
    document.querySelectorAll('audio').forEach(a => a.muted = muted);
    // Web Audio best-effort
    if (window.Howler && window.Howler.mute) window.Howler.mute(muted);
    if (window.createjs && window.createjs.Sound) window.createjs.Sound.muted = muted;
  }

  // Loader overlay
  let loader;
  function ensureLoader(){
    if (loader) return loader;
    loader = el('div','game-loader');
    loader.innerHTML = '<div class="spinner"></div><div class="label">Loading…</div>';
    document.body.appendChild(loader);
    return loader;
  }
  function showLoader(label){
    ensureLoader();
    const l = loader.querySelector('.label');
    if (label) l.textContent = label;
    loader.classList.add('is-visible');
  }
  function hideLoader(){
    if (!loader) return;
    loader.classList.remove('is-visible');
  }

  // Toast
  let toastEl, toastTimer;
  function toast(text){
    if (!toastEl) {
      toastEl = el('div','gf-toast');
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = text;
    toastEl.style.opacity = '1';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(()=>{ toastEl.style.opacity = '0'; }, 1400);
  }

  // Expose API
  window.GameFrame = {
    showLoader, hideLoader, toggleFullscreen, setGlobalMute, toast
  };

  // Init when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ()=>{
      ensureToolbar();
      initRuntime();
    });
  } else {
    ensureToolbar();
    initRuntime();
  }
})();

// --- Runtime stability features ---
function initRuntime(){
  try {
    const CFG = Object.assign({
      maxDevicePixelRatio: 1.75,
      resizeDebounceMs: 150,
      autoPauseOnHide: true,
      pixelArt: false,
      debug: /[?&]gfDebug=1/i.test(location.search) || false,
      autoMuteOnPause: true,
      showPauseOverlay: true,
      hints: false,
    }, window.GF_CONFIG || {});

    // Per-game pixel-art opt-in (CSS hook)
    if (CFG.pixelArt) {
      document.body.setAttribute('data-gf-pixel-art','true');
    }

    // Fullscreen button label sync
    const fsBtn = document.querySelector('.gf-btn.gf-btn--primary');
    const syncFS = () => {
      if (!fsBtn) return;
      fsBtn.textContent = document.fullscreenElement ? '⛶ Exit Fullscreen' : '⛶ Fullscreen';
    };
    document.addEventListener('fullscreenchange', syncFS);
    syncFS();

    // Visibility-based pause/resume via custom events
    if (CFG.autoPauseOnHide) {
      document.addEventListener('visibilitychange', () => {
        const evt = new CustomEvent(document.hidden ? 'gf:pause' : 'gf:resume');
        window.dispatchEvent(evt);
      });
      // Mobile back/forward cache handling
      window.addEventListener('pagehide', () => window.dispatchEvent(new CustomEvent('gf:pause')));
      window.addEventListener('pageshow', () => window.dispatchEvent(new CustomEvent('gf:resume')));
    }

    // Resize debounce with DPR cap (emit info for games to react)
    const emitResize = () => {
      const dprRaw = window.devicePixelRatio || 1;
      const dpr = Math.min(dprRaw, CFG.maxDevicePixelRatio);
      const detail = { width: window.innerWidth, height: window.innerHeight, dpr, dprRaw };
      window.dispatchEvent(new CustomEvent('gf:resize', { detail }));
    };
    let rezTimer;
    window.addEventListener('resize', () => {
      clearTimeout(rezTimer);
      rezTimer = setTimeout(emitResize, CFG.resizeDebounceMs);
    }, { passive: true });
    // Fire once initially
    emitResize();

    // iOS/Android audio unlock on first interaction
    const unlockAudio = () => {
      try {
        if (window.__gfAudioCtx == null) {
          const AC = window.AudioContext || window.webkitAudioContext;
          if (AC) window.__gfAudioCtx = new AC();
        }
        if (window.__gfAudioCtx && window.__gfAudioCtx.state === 'suspended') {
          window.__gfAudioCtx.resume();
        }
        if (window.Howler && window.Howler.ctx && window.Howler.ctx.state === 'suspended') {
          window.Howler.ctx.resume();
        }
      } catch (e) {}
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
    window.addEventListener('pointerdown', unlockAudio, { once: true, passive: true });
    window.addEventListener('touchstart', unlockAudio, { once: true, passive: true });
    window.addEventListener('keydown', unlockAudio, { once: true });

    // Global input hygiene to reduce page jank while playing
    const isTypingTarget = (el) => {
      if (!el) return false;
      const t = (el.tagName || '').toLowerCase();
      if (t === 'input' || t === 'textarea' || el.isContentEditable) return true;
      return false;
    };
    // Prevent arrow keys/space from scrolling when a canvas exists
    window.addEventListener('keydown', (e) => {
      try {
        const hasCanvas = !!document.querySelector('canvas');
        if (!hasCanvas) return;
        if (isTypingTarget(e.target)) return;
        const k = e.key;
        if (
          k === ' ' || k === 'Spacebar' ||
          k === 'ArrowUp' || k === 'ArrowDown' || k === 'ArrowLeft' || k === 'ArrowRight' ||
          k === 'PageUp' || k === 'PageDown' || k === 'Home' || k === 'End'
        ) {
          e.preventDefault();
        }
      } catch(_) {}
    }, { capture: true });

    // Focus the first canvas on first pointer interaction (helps keyboard capture on some browsers)
    const focusCanvas = () => {
      const cv = document.querySelector('canvas');
      if (cv && typeof cv.focus === 'function') {
        try { cv.focus({ preventScroll: true }); } catch(_) { try { cv.focus(); } catch(_) {} }
      }
      window.removeEventListener('pointerdown', focusCanvas);
      window.removeEventListener('touchstart', focusCanvas);
    };
    window.addEventListener('pointerdown', focusCanvas, { once: true, passive: true });
    window.addEventListener('touchstart', focusCanvas, { once: true, passive: true });

    // WebGL context loss handling: show loader while restoring
    const canvases = Array.from(document.querySelectorAll('canvas'));
    canvases.forEach(cv => {
      cv.addEventListener('webglcontextlost', (e) => {
        try { e.preventDefault(); } catch(_) {}
        if (window.GameFrame && window.GameFrame.showLoader) {
          window.GameFrame.showLoader('Recovering graphics…');
        }
      }, false);
      cv.addEventListener('webglcontextrestored', () => {
        if (window.GameFrame && window.GameFrame.hideLoader) {
          window.GameFrame.hideLoader();
        }
      }, false);
    });

    // Pause/Resume side-effects (overlay + auto-mute)
    const onPause = () => {
      if (CFG.showPauseOverlay) showPaused();
      if (CFG.autoMuteOnPause) setGlobalMute(true);
    };
    const onResume = () => {
      if (CFG.showPauseOverlay) hidePaused();
      if (CFG.autoMuteOnPause) setGlobalMute(false);
    };
    window.addEventListener('gf:pause', onPause);
    window.addEventListener('gf:resume', onResume);

    // Optional hint
    if (CFG.hints && !('ontouchstart' in window)) {
      setTimeout(() => { try { toast('Tip: Press F for fullscreen'); } catch(_){} }, 1200);
    }

    // Telemetry (optional)
    if (CFG.debug) {
      window.addEventListener('error', (e) => {
        console.error('[GF:error]', e.message, e.error);
      });
      window.addEventListener('unhandledrejection', (e) => {
        console.error('[GF:unhandled]', e.reason);
      });
      let last = performance.now(), frames = 0;
      const tick = () => {
        frames++;
        const now = performance.now();
        if (now - last >= 1000) {
          const fps = frames; frames = 0; last = now;
          const el = document.getElementById('fps-counter');
          if (el) el.textContent = `FPS: ${fps}`;
        }
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }

  } catch (err) {
    console.error('[GF:initRuntime] failed', err);
  }
}
