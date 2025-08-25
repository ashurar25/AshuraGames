import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, basename } from 'path';
import { createCanvas, loadImage } from 'canvas';

const ROOT = process.cwd();
const gamesDir = join(ROOT, 'public', 'games');
const thumbsDir = join(ROOT, 'public', 'generated-thumbnails');
const mapPath = join(ROOT, 'scripts', 'th_localization.json');
const thumbsJsonPath = join(gamesDir, 'game-thumbnails.json');

function ensureDirs(){
  if (!existsSync(thumbsDir)) mkdirSync(thumbsDir, { recursive: true });
}

function chooseGradient(key){
  const palettes = [
    ['#1e3c72','#2a5298'],
    ['#0f2027','#203a43','#2c5364'],
    ['#42275a','#734b6d'],
    ['#141e30','#243b55'],
    ['#16222A','#3A6073'],
    ['#1a2a6c','#b21f1f','#fdbb2d'],
  ];
  const idx = Math.abs(hashCode(key)) % palettes.length;
  return palettes[idx];
}

function hashCode(str){
  let h = 0; for (let i=0;i<str.length;i++){ h = ((h<<5)-h) + str.charCodeAt(i); h |= 0; }
  return h;
}

function drawCover(title, key){
  const W = 1024, H = 576;
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');
  // bg gradient
  const pal = chooseGradient(key);
  const grad = ctx.createLinearGradient(0,0,W,H);
  pal.forEach((c,i)=> grad.addColorStop(i/(pal.length-1), c));
  ctx.fillStyle = grad;
  ctx.fillRect(0,0,W,H);
  // subtle glow pattern
  ctx.globalAlpha = 0.25;
  for (let i=0;i<40;i++){
    const x = Math.random()*W, y = Math.random()*H;
    const r = 20 + Math.random()*140;
    const g = ctx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,'rgba(255,255,255,0.7)');
    g.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
  }
  ctx.globalAlpha = 1;
  // frame
  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.lineWidth = 6;
  ctx.strokeRect(18,18,W-36,H-36);
  // title
  ctx.fillStyle = '#fff';
  ctx.shadowColor = 'rgba(0,0,0,0.8)';
  ctx.shadowBlur = 12;
  const maxWidth = W - 120;
  let fontSize = 72;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  const fontFace = "'Noto Sans Thai', 'Prompt', 'Kanit', 'Tahoma', 'Arial', sans-serif";
  while (fontSize > 36){
    ctx.font = `800 ${fontSize}px ${fontFace}`;
    const m = ctx.measureText(title);
    if (m.width <= maxWidth) break;
    fontSize -= 4;
  }
  ctx.fillText(title, 60, H*0.58);
  // subtitle brand
  ctx.shadowBlur = 0;
  ctx.font = `600 28px ${fontFace}`;
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.fillText('ASHURA GAMES', 60, H*0.58 + fontSize*0.75);

  return canvas.toBuffer('image/png');
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
    const buf = drawCover(title, key);
    const outName = `${key}_th_${Date.now()}.png`;
    const outPath = join(thumbsDir, outName);
    writeFileSync(outPath, buf);
    thumbs[key] = `/generated-thumbnails/${outName}`;
    updated++;
    console.log(`Cover generated: ${key} -> ${outName}`);
  }

  writeFileSync(thumbsJsonPath, JSON.stringify(thumbs, null, 2), 'utf8');
  console.log(`Done. Updated ${updated} covers. Thumbnails mapped at ${thumbsJsonPath}`);
}

main();
