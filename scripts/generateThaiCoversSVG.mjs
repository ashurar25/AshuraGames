import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, basename } from 'path';

const gamesDir = 'c:/Users/Administrator/AshuraGames/public/games';
const thumbsDir = 'c:/Users/Administrator/AshuraGames/public/generated-thumbnails';
const mapPath = 'c:/Users/Administrator/AshuraGames/scripts/th_localization.json';
const thumbsJsonPath = join(gamesDir, 'game-thumbnails.json');

function ensureDirs(){ if (!existsSync(thumbsDir)) mkdirSync(thumbsDir, { recursive: true }); }

function hashCode(str){ let h=0; for (let i=0;i<str.length;i++){ h=((h<<5)-h)+str.charCodeAt(i); h|=0; } return Math.abs(h); }

function paletteFor(key){
  const palettes = [
    ['#1e3c72','#2a5298'],
    ['#0f2027','#203a43','#2c5364'],
    ['#42275a','#734b6d'],
    ['#141e30','#243b55'],
    ['#16222A','#3A6073'],
    ['#1a2a6c','#b21f1f','#fdbb2d']
  ];
  return palettes[hashCode(key) % palettes.length];
}

function svgCover(title, key){
  const W=1024, H=576; const pal = paletteFor(key);
  const gradStops = pal.map((c,i)=>`<stop offset="${(i/(pal.length-1))*100}%" stop-color="${c}"/>`).join('');
  const fontFamily = `\'Noto Sans Thai\', \'Prompt\', \'Kanit\', Tahoma, Arial, sans-serif`;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">${gradStops}</linearGradient>
    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.35 0"/>
    </filter>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <rect x="18" y="18" width="${W-36}" height="${H-36}" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="6"/>
  <g filter="url(#softGlow)">
    <rect x="0" y="0" width="100%" height="100%" fill="rgba(255,255,255,0.0)"/>
  </g>
  <g>
    <text x="60" y="${Math.round(H*0.58)}" font-family="${fontFamily}" font-weight="800" font-size="72" fill="#fff" dominant-baseline="middle">${title}</text>
    <text x="60" y="${Math.round(H*0.58 + 52)}" font-family="${fontFamily}" font-weight="600" font-size="28" fill="rgba(255,255,255,0.9)">ASHURA GAMES</text>
  </g>
</svg>`;
}

function main(){
  ensureDirs();
  const map = JSON.parse(readFileSync(mapPath,'utf8'));
  const files = readdirSync(gamesDir).filter(f => f.toLowerCase().endsWith('.html'));
  let thumbs = {};
  try { thumbs = JSON.parse(readFileSync(thumbsJsonPath,'utf8')); } catch(_) {}
  let updated = 0;

  for (const f of files){
    const key = basename(f, '.html');
    const title = map[key];
    if (!title) continue;
    const svg = svgCover(title, key);
    const outName = `${key}_th_${Date.now()}.svg`;
    writeFileSync(join(thumbsDir, outName), svg, 'utf8');
    thumbs[key] = `/generated-thumbnails/${outName}`;
    updated++;
    console.log(`[svg] ${key} -> ${outName}`);
  }

  writeFileSync(thumbsJsonPath, JSON.stringify(thumbs, null, 2), 'utf8');
  console.log(`Done. Updated ${updated} covers (SVG). Thumbnails mapped at ${thumbsJsonPath}`);
}

main();
