import { readdirSync, readFileSync } from 'fs';
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

function extractGF(content){
  const re = /window\.GF_CONFIG\s*=\s*\{([\s\S]*?)\};/i;
  const m = content.match(re);
  return m ? m[1] : null;
}

function findKV(block, key){
  if (!block) return undefined;
  const re = new RegExp(`${key}\\s*:\\s*([^,}]+)`, 'i');
  const m = block.match(re);
  if (!m) return undefined;
  const raw = m[1].trim();
  if (/^(true|false)$/i.test(raw)) return raw.toLowerCase() === 'true';
  const num = Number(raw);
  if (!Number.isNaN(num)) return num;
  return raw.replace(/^['"]|['"]$/g, '');
}

function verifyOne(fname, content){
  const { isPixel, isHeavy } = classify(fname);
  const gf = extractGF(content);
  const issues = [];
  if (!gf) {
    issues.push('GF_CONFIG not found');
    return { issues };
  }

  // Common flags
  if (findKV(gf, 'showPauseOverlay') !== true) issues.push('showPauseOverlay should be true');
  if (findKV(gf, 'autoMuteOnPause') !== true) issues.push('autoMuteOnPause should be true');
  if (findKV(gf, 'debug') !== false) issues.push('debug should be false');

  if (isPixel) {
    if (findKV(gf, 'pixelArt') !== true) issues.push('pixelArt should be true (pixel games)');
    const dpr = findKV(gf, 'maxDevicePixelRatio');
    if (!(typeof dpr === 'number' && dpr <= 1.25)) issues.push('maxDevicePixelRatio should be <= 1.25 (pixel games)');
    if (findKV(gf, 'resizeDebounceMs') !== 120) issues.push('resizeDebounceMs should be 120 (pixel games)');
  } else if (isHeavy) {
    if (findKV(gf, 'maxDevicePixelRatio') !== 1.5) issues.push('maxDevicePixelRatio should be 1.5 (heavy 3D)');
    if (findKV(gf, 'resizeDebounceMs') !== 180) issues.push('resizeDebounceMs should be 180 (heavy 3D)');
    if (findKV(gf, 'autoPauseOnHide') !== true) issues.push('autoPauseOnHide should be true (heavy 3D)');
    if (findKV(gf, 'hints') !== true) issues.push('hints should be true (heavy 3D)');
  } else {
    if (findKV(gf, 'resizeDebounceMs') !== 150) issues.push('resizeDebounceMs should be 150 (default)');
  }

  return { issues };
}

function main(){
  const files = readdirSync(root).filter(f => f.toLowerCase().endsWith('.html'));
  let totalIssues = 0;
  for (const fname of files) {
    const path = join(root, fname);
    const content = readFileSync(path, 'utf8');
    const { issues } = verifyOne(fname, content);
    if (issues.length) {
      totalIssues += issues.length;
      console.log(`Mismatch: ${fname}`);
      for (const i of issues) console.log(`  - ${i}`);
    } else {
      console.log(`OK: ${fname}`);
    }
  }
  if (totalIssues > 0) {
    console.log(`\nVerification finished with ${totalIssues} issue(s).`);
    process.exitCode = 1;
  } else {
    console.log('\nVerification passed. No issues found.');
  }
}

main();
