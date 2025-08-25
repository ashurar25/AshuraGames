
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GAMES_DIR = path.resolve(__dirname, '..', 'public', 'games');

// Common fixes for games
const fixes = [
  // Fix CSS references
  {
    search: /href="game-frame\.css"/g,
    replace: 'href="./_assets/game-frame.css"'
  },
  {
    search: /href="_assets\/game-frame\.css"/g,
    replace: 'href="./_assets/game-frame.css"'
  },
  // Fix JS references
  {
    search: /src="game-frame\.js"/g,
    replace: 'src="./_assets/game-frame.js"'
  },
  {
    search: /src="_assets\/game-frame\.js"/g,
    replace: 'src="./_assets/game-frame.js"'
  },
  // Fix common game errors
  {
    search: /requestAnimFrame/g,
    replace: 'requestAnimationFrame'
  },
  // Fix touch controls
  {
    search: /ontouchstart/g,
    replace: 'addEventListener("touchstart"'
  }
];

async function fixGameFiles() {
  const files = fs.readdirSync(GAMES_DIR);
  const htmlFiles = files.filter(file => file.endsWith('.html') && !file.endsWith('.bak'));

  console.log(`🔧 Fixing ${htmlFiles.length} game files...`);

  for (const file of htmlFiles) {
    const filePath = path.join(GAMES_DIR, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    for (const fix of fixes) {
      const newContent = content.replace(fix.search, fix.replace);
      if (newContent !== content) {
        content = newContent;
        changed = true;
      }
    }

    if (changed) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed: ${file}`);
    }
  }

  console.log('🎮 All games fixed!');
}

fixGameFiles().catch(console.error);
