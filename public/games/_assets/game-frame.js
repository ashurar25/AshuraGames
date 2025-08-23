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
  }, window.GF_CONFIG || {});

  function el(tag, cls, html){
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

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

    right.appendChild(fsBtn);
    right.appendChild(muteBtn);
    right.appendChild(fpsBtn);

    bar.appendChild(left);
    bar.appendChild(right);
    document.body.appendChild(bar);
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
