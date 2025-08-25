import { readdirSync, readFileSync, writeFileSync, copyFileSync } from 'fs';
import { join } from 'path';

const root = 'c:/Users/Administrator/AshuraGames/public/games';

const PIXEL_KEYS = [
  'tetris','snake','pong','pixel','flappy','pacman','memory-cards','puzzle-blocks','bubble-shooter','gulper-snake','2048'
];
const HEAVY3D_KEYS = [
  '3d','webgl','maze','racing','space-invaders-3d','quantum-shooter-webgl','cosmic-defender-webgl','dragon-flight-3d','galactic-defender-3d','tower-defense-3d','portal-escape-3d','space-mining-3d','neural-network-3d','endless-runner-3d','ninja-runner-3d','cyber-runner-3d','crystal-caverns-3d','chess-master-3d','cooking-master-3d','basketball-shots-3d','volleyball-championship','neon-maze-3d','3d-cube-runner','3d-racing-webgl'
];

function classify(name){
  const n = name.toLowerCase();
  const isPixel = PIXEL_KEYS.some(k => n.includes(k));
  const isHeavy = HEAVY3D_KEYS.some(k => n.includes(k));
  return { isPixel, isHeavy };
}

function buildConfig({ isPixel, isHeavy }){
  const base = [];
  base.push('<script>');
  base.push('  window.GF_CONFIG = {');
  // Common UX/stability flags
  base.push('    showPauseOverlay: true,');
  base.push('    autoMuteOnPause: true,');
  if (isPixel) {
    base.push('    pixelArt: true,');
    base.push('    maxDevicePixelRatio: 1.25,');
    base.push('    resizeDebounceMs: 120,');
  }
  if (isHeavy) {
    base.push('    maxDevicePixelRatio: 1.5,');
    base.push('    resizeDebounceMs: 180,');
    base.push('    autoPauseOnHide: true,');
    base.push('    hints: true,');
  }
  if (!isPixel && !isHeavy) {
    base.push('    resizeDebounceMs: 150,');
  }
  base.push('    debug: false');
  base.push('  };');
  base.push('</script>');
  return base.join('\n');
}

function insertOrUpdateConfig(content, block){
  const markerRe = /<!--\s*ASHURA:gf-config\s*-->/i;
  const configScriptRe = /<script>\s*window\.GF_CONFIG\s*=\s*\{[\s\S]*?\};\s*<\/script>/i;

  // If marker exists, replace the GF_CONFIG block following it (if present), else insert our block after marker
  if (markerRe.test(content)) {
    // Replace existing <script>window.GF_CONFIG...</script> after marker
    const parts = content.split(markerRe);
    if (parts.length >= 2) {
      const head = parts[0];
      const tail = parts.slice(1).join('<!-- ASHURA:gf-config -->');
      const replacedTail = configScriptRe.test(tail)
        ? tail.replace(configScriptRe, block)
        : (block + '\n' + tail);
      return head + '<!-- ASHURA:gf-config -->' + replacedTail;
    }
  }

  // If any GF_CONFIG exists without marker, replace first occurrence
  if (configScriptRe.test(content)) {
    return content.replace(configScriptRe, (m)=> block);
  }

  // Otherwise insert before shared game-frame.js include when available
  const gfIncludeRe = /<script[^>]+src=["']\.\/_assets\/game-frame\.js["'][^>]*><\/script>/i;
  const m = content.match(gfIncludeRe);
  if (m) {
    const idx = m.index;
    const before = content.slice(0, idx);
    const after = content.slice(idx);
    const marker = '<!-- ASHURA:gf-config -->\n';
    return before + marker + block + '\n' + after;
  }

  // Fallback: insert before closing body
  const bodyMatch = content.match(/<\/body\s*>/i);
  if (bodyMatch) {
    const idx = bodyMatch.index;
    const marker = '<!-- ASHURA:gf-config -->\n';
    return content.slice(0, idx) + marker + block + '\n' + content.slice(idx);
  }
  return content;
}

function main(){
  const files = readdirSync(root).filter(f => f.toLowerCase().endsWith('.html'));
  let updated = 0;
  for (const fname of files) {
    const path = join(root, fname);
    let content = readFileSync(path, 'utf8');
    const original = content;

    const cls = classify(fname);
    const block = buildConfig(cls);
    content = insertOrUpdateConfig(content, block);

    if (content !== original) {
      copyFileSync(path, path + '.bak');
      writeFileSync(path, content, { encoding: 'utf8' });
      updated++;
      console.log(`GF_CONFIG inserted: ${fname} (${cls.isPixel ? 'pixel' : cls.isHeavy ? 'heavy3d' : 'default'})`);
    } else {
      console.log(`No change: ${fname}`);
    }
  }
  console.log(`GF_CONFIG batch done. Files updated: ${updated} / ${files.length}`);
}

main();
