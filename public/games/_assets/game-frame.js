/* Shared Game Frame JS: toolbar, helpers, and loader */
(function(){
  const state = { muted: false, fpsVisible: true };

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
    });
  } else {
    ensureToolbar();
  }
})();
