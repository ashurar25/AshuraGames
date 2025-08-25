
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GAMES_DIR = path.resolve(__dirname, '..', 'public', 'games');

function validateGameFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];

  // Check for missing assets
  if (!content.includes('./_assets/game-frame.css')) {
    issues.push('Missing proper game-frame.css reference');
  }

  // Check for JavaScript errors
  if (content.includes('undefined') && content.includes('function')) {
    issues.push('Potential undefined variables');
  }

  // Check for incomplete code
  if (content.includes('...') || content.includes('TODO')) {
    issues.push('Incomplete implementation');
  }

  // Check for canvas setup
  if (content.includes('<canvas') && !content.includes('getContext')) {
    issues.push('Canvas without proper context setup');
  }

  return issues;
}

async function testAllGames() {
  const files = fs.readdirSync(GAMES_DIR);
  const htmlFiles = files.filter(file => file.endsWith('.html') && !file.endsWith('.bak'));

  console.log(`🧪 Testing ${htmlFiles.length} games...`);

  let totalIssues = 0;
  for (const file of htmlFiles) {
    const filePath = path.join(GAMES_DIR, file);
    const issues = validateGameFile(filePath);
    
    if (issues.length > 0) {
      console.log(`❌ ${file}:`);
      issues.forEach(issue => console.log(`   - ${issue}`));
      totalIssues += issues.length;
    } else {
      console.log(`✅ ${file}: OK`);
    }
  }

  console.log(`\n📊 Summary: ${totalIssues} total issues found`);
  if (totalIssues === 0) {
    console.log('🎉 All games are ready to play!');
  }
}

testAllGames().catch(console.error);
