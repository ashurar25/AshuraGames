
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, basename } from 'path';

const ROOT = process.cwd();
const gamesDir = join(ROOT, 'public', 'games');
const thumbsDir = join(ROOT, 'public', 'modern-covers');
const mapPath = join(ROOT, 'scripts', 'th_localization.json');
const thumbsJsonPath = join(gamesDir, 'game-thumbnails.json');

function ensureDirs() {
  if (!existsSync(thumbsDir)) mkdirSync(thumbsDir, { recursive: true });
}

function hashCode(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h) + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function getGameTheme(key) {
  const themes = {
    // Action Games - เรดออเรนจ์
    action: {
      gradient: ['#FF6B6B', '#FF8E53', '#FF6B35'],
      accent: '#FFD93D',
      pattern: 'lightning'
    },
    // Puzzle Games - เปอร์เปิล
    puzzle: {
      gradient: ['#667EEA', '#764BA2', '#A8EDEA'],
      accent: '#F093FB',
      pattern: 'geometric'
    },
    // Racing Games - เบลู์เทอร์ควอยซ์
    racing: {
      gradient: ['#4FACFE', '#00F2FE', '#43E97B'],
      accent: '#38EF7D',
      pattern: 'speed'
    },
    // Sports Games - เกรนออเรนจ์
    sports: {
      gradient: ['#FA709A', '#FEE140', '#FFB75E'],
      accent: '#ED4264',
      pattern: 'dynamic'
    },
    // Strategy Games - ดีพเบลู์
    strategy: {
      gradient: ['#2196F3', '#21CBF3', '#009688'],
      accent: '#4CAF50',
      pattern: 'grid'
    },
    // Arcade Games - ไนอ้อนพิ้งค์
    arcade: {
      gradient: ['#F093FB', '#F5576C', '#4FACFE'],
      accent: '#43E97B',
      pattern: 'retro'
    },
    // Casual Games - พาสเทล
    casual: {
      gradient: ['#FFECD2', '#FCB69F', '#FF9A9E'],
      accent: '#A8EDEA',
      pattern: 'soft'
    }
  };

  const categoryMapping = {
    '2048': 'puzzle',
    'cube-runner': 'action',
    'racing': 'racing',
    'volleyball': 'sports',
    'basketball': 'sports',
    'soccer': 'sports',
    'asteroid': 'action',
    'breakout': 'arcade',
    'bubble': 'arcade',
    'chess': 'strategy',
    'cooking': 'casual',
    'cosmic': 'action',
    'crystal': 'action',
    'cyber': 'action',
    'dancing': 'casual',
    'dragon': 'action',
    'runner': 'action',
    'fashion': 'casual',
    'flappy': 'arcade',
    'galactic': 'action',
    'snake': 'arcade',
    'medieval': 'strategy',
    'memory': 'puzzle',
    'neon': 'arcade',
    'neural': 'strategy',
    'ninja': 'action',
    'pacman': 'arcade',
    'particle': 'action',
    'pixel': 'casual',
    'portal': 'action',
    'puzzle': 'puzzle',
    'quantum': 'action',
    'space': 'action',
    'tetris': 'puzzle',
    'tower': 'strategy'
  };

  for (const [keyword, category] of Object.entries(categoryMapping)) {
    if (key.toLowerCase().includes(keyword)) {
      return themes[category];
    }
  }
  
  return themes.arcade; // Default
}

function createModernSVG(title, key) {
  const W = 1200, H = 675; // 16:9 ratio
  const theme = getGameTheme(key);
  const gradId = `grad_${hashCode(key)}`;
  const patternId = `pattern_${hashCode(key)}`;
  
  const gradStops = theme.gradient.map((color, i) => 
    `<stop offset="${(i / (theme.gradient.length - 1)) * 100}%" stop-color="${color}"/>`
  ).join('');

  let pattern = '';
  switch (theme.pattern) {
    case 'lightning':
      pattern = `
        <g opacity="0.15" stroke="${theme.accent}" stroke-width="3" fill="none">
          <path d="M200,100 L250,200 L180,180 L220,280"/>
          <path d="M800,150 L850,250 L780,230 L820,330"/>
          <path d="M1000,80 L1050,180 L980,160 L1020,260"/>
        </g>`;
      break;
    case 'geometric':
      pattern = `
        <g opacity="0.12" fill="${theme.accent}">
          <polygon points="150,100 200,150 150,200 100,150"/>
          <polygon points="900,200 950,250 900,300 850,250"/>
          <circle cx="300" cy="400" r="40"/>
          <circle cx="1000" cy="500" r="35"/>
        </g>`;
      break;
    case 'speed':
      pattern = `
        <g opacity="0.2" stroke="${theme.accent}" stroke-width="4">
          <path d="M0,200 Q300,180 600,200"/>
          <path d="M0,300 Q400,280 800,300"/>
          <path d="M0,400 Q500,380 1000,400"/>
        </g>`;
      break;
    case 'dynamic':
      pattern = `
        <g opacity="0.15" fill="${theme.accent}">
          <circle cx="200" cy="200" r="15"/>
          <circle cx="800" cy="300" r="20"/>
          <circle cx="1000" cy="150" r="12"/>
          <path d="M100,500 Q300,450 500,500 Q700,550 900,500"/>
        </g>`;
      break;
    case 'grid':
      pattern = `
        <g opacity="0.1" stroke="${theme.accent}" stroke-width="2">
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="${theme.accent}" stroke-width="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)"/>
        </g>`;
      break;
    case 'retro':
      pattern = `
        <g opacity="0.2" fill="${theme.accent}">
          <rect x="100" y="100" width="20" height="20"/>
          <rect x="200" y="200" width="20" height="20"/>
          <rect x="800" y="150" width="20" height="20"/>
          <rect x="900" y="300" width="20" height="20"/>
          <rect x="1000" y="250" width="20" height="20"/>
        </g>`;
      break;
    default: // soft
      pattern = `
        <g opacity="0.1">
          <circle cx="200" cy="200" r="60" fill="${theme.accent}"/>
          <circle cx="900" cy="400" r="80" fill="${theme.accent}"/>
        </g>`;
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="100%">
      ${gradStops}
    </linearGradient>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <filter id="textShadow">
      <feDropShadow dx="3" dy="3" stdDeviation="6" flood-color="rgba(0,0,0,0.7)"/>
    </filter>
  </defs>
  
  <!-- Background -->
  <rect width="100%" height="100%" fill="url(#${gradId})"/>
  
  <!-- Pattern Overlay -->
  ${pattern}
  
  <!-- Subtle overlay for depth -->
  <rect width="100%" height="100%" fill="url(#${gradId})" opacity="0.3"/>
  
  <!-- Main Content Area -->
  <g filter="url(#textShadow)">
    <!-- Game Title -->
    <text x="80" y="${H * 0.65}" 
          font-family="'Kanit', 'Prompt', 'Noto Sans Thai', Arial, sans-serif" 
          font-weight="800" 
          font-size="64" 
          fill="white">
      ${title}
    </text>
    
    <!-- Brand -->
    <text x="80" y="${H * 0.65 + 60}" 
          font-family="'Kanit', 'Prompt', 'Noto Sans Thai', Arial, sans-serif" 
          font-weight="600" 
          font-size="24" 
          fill="rgba(255,255,255,0.9)">
      ASHURA GAMES
    </text>
  </g>
  
  <!-- Decorative accent -->
  <circle cx="${W - 150}" cy="150" r="8" fill="${theme.accent}" opacity="0.8" filter="url(#glow)"/>
  <circle cx="${W - 120}" cy="120" r="5" fill="white" opacity="0.6"/>
  <circle cx="${W - 180}" cy="180" r="6" fill="${theme.accent}" opacity="0.7"/>
</svg>`;
}

function main() {
  ensureDirs();
  
  const map = JSON.parse(readFileSync(mapPath, 'utf8'));
  const files = readdirSync(gamesDir).filter(f => f.toLowerCase().endsWith('.html'));
  
  let thumbs = {};
  try {
    thumbs = JSON.parse(readFileSync(thumbsJsonPath, 'utf8'));
  } catch(_) {}
  
  let updated = 0;

  for (const f of files) {
    const key = basename(f, '.html');
    const title = map[key];
    if (!title) continue;
    
    const svg = createModernSVG(title, key);
    const outName = `${key}_modern_${Date.now()}.svg`;
    const outPath = join(thumbsDir, outName);
    
    writeFileSync(outPath, svg, 'utf8');
    thumbs[key] = `/modern-covers/${outName}`;
    
    updated++;
    console.log(`[modern] ${key} -> ${outName}`);
  }

  writeFileSync(thumbsJsonPath, JSON.stringify(thumbs, null, 2), 'utf8');
  console.log(`🎨 สร้างปกเกมใหม่ ${updated} เกม - ปกกราฟิกสวยงามแบบใหม่!`);
}

main();
