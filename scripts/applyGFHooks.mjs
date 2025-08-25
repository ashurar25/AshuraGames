#!/usr/bin/env node
/*
  Batch-apply Game Frame hooks and UI addons to all games.
  - Adds an FPS overlay <div id="fps-counter"> if missing
  - Injects a small generic GF hooks script (id="gf-hooks") if missing:
      * gf:pause/gf:resume -> toggles window.__GF_RUNNING (non-breaking default)
      * gf:resize -> resizes the first <canvas> (if present) using DPR cap from GF event
                     and updates WebGL viewport if a context is available
  - Cleans up the marker <!-- ASHURA:shared-js --> if present

  Safe defaults: does not assume engine variables; operates on DOM-only.
*/

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, '..');
const GAMES_DIR = path.resolve(ROOT, '..', 'public', 'games');

const FPS_DIV = '<div id="fps-counter" style="position:fixed;top:64px;right:12px;z-index:7000;color:#fff;font:600 12px/1 ui-sans-serif;display:block"></div>';

const HOOKS_SCRIPT = `\n<script id="gf-hooks">\n(function(){\n  if (window.__GF_HOOKS_INSTALLED__) return;\n  window.__GF_HOOKS_INSTALLED__ = true;\n  // generic run-state flag (games may opt-in to read this)\n  if (window.__GF_RUNNING == null) window.__GF_RUNNING = true;\n\n  function resizeFirstCanvas(detail){\n    try {\n      const cv = document.querySelector('canvas');\n      if (!cv || !detail) return;\n      const dpr = Math.max(1, detail.dpr || detail.dprRaw || window.devicePixelRatio || 1);\n      const cssW = Math.max(0, Math.floor(detail.width || window.innerWidth));\n      const cssH = Math.max(0, Math.floor(detail.height || window.innerHeight));\n      const pxW = Math.max(1, Math.floor(cssW * dpr));\n      const pxH = Math.max(1, Math.floor(cssH * dpr));\n      cv.style.width = cssW + 'px';\n      cv.style.height = cssH + 'px';\n      cv.width = pxW;\n      cv.height = pxH;\n      // try WebGL viewport if present\n      let gl = cv.__gl || cv.getContext('webgl') || cv.getContext('experimental-webgl');\n      if (gl) { try { gl.viewport(0,0,cv.width,cv.height); } catch(_){} cv.__gl = gl; }\n    } catch(_){}\n  }\n\n  window.addEventListener('gf:pause', function(){ window.__GF_RUNNING = false; }, { passive: true });\n  window.addEventListener('gf:resume', function(){ window.__GF_RUNNING = true; }, { passive: true });\n  window.addEventListener('gf:resize', function(e){ resizeFirstCanvas((e && e.detail) || {}); }, { passive: true });\n})();\n</script>\n`;

function shouldSkip(file){
  const name = path.basename(file).toLowerCase();
  if (!name.endsWith('.html')) return true;
  if (name.endsWith('.bak')) return true;
  if (file.toLowerCase().includes(path.sep + '_assets' + path.sep)) return true;
  return false;
}

function addFpsDiv(html){
  if (/id=["']fps-counter["']/i.test(html)) return { html, changed: false };
  // insert before closing body if possible, else append
  if (/<\/body>/i.test(html)) {
    const newHtml = html.replace(/<\/body>/i, match => `  ${FPS_DIV}\n${match}`);
    return { html: newHtml, changed: true };
  }
  return { html: html + '\n' + FPS_DIV + '\n', changed: true };
}

function addHooksScript(html){
  if (/<script[^>]+id=["']gf-hooks["']/i.test(html)) return { html, changed: false };
  if (/<\/body>/i.test(html)) {
    const newHtml = html.replace(/<\/body>/i, match => `${HOOKS_SCRIPT}\n${match}`);
    return { html: newHtml, changed: true };
  }
  return { html: html + '\n' + HOOKS_SCRIPT + '\n', changed: true };
}

function cleanMarker(html){
  if (!/<!--\s*ASHURA:shared-js\s*-->/i.test(html)) return { html, changed: false };
  const newHtml = html.replace(/<!--\s*ASHURA:shared-js\s*-->/gi, '');
  return { html: newHtml, changed: true };
}

function processFile(full){
  const original = fs.readFileSync(full, 'utf8');
  let html = original;
  let changed = false;

  const a = addFpsDiv(html); html = a.html; changed = changed || a.changed;
  const b = addHooksScript(html); html = b.html; changed = changed || b.changed;
  const c = cleanMarker(html); html = c.html; changed = changed || c.changed;

  if (!changed) return { changed: false };

  // backup once
  const bak = full + '.bak';
  try {
    if (!fs.existsSync(bak)) fs.copyFileSync(full, bak);
  } catch (e) {
    console.warn('Backup failed for', full, e.message);
  }
  fs.writeFileSync(full, html, 'utf8');
  return { changed: true };
}

function main(){
  if (!fs.existsSync(GAMES_DIR)) {
    console.error('Games directory not found:', GAMES_DIR);
    process.exit(1);
  }
  const entries = fs.readdirSync(GAMES_DIR);
  let total = 0, modified = 0;
  for (const entry of entries) {
    const full = path.join(GAMES_DIR, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) continue; // only top-level HTML files
    if (shouldSkip(full)) continue;
    total++;
    const res = processFile(full);
    if (res.changed) modified++;
  }
  console.log(`[GFHooks] Processed ${total} games, modified ${modified}.`);
}

main();
