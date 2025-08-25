import { readdirSync, readFileSync, writeFileSync, copyFileSync } from 'fs';
import { join, basename } from 'path';

const ROOT = process.cwd();
const gamesDir = join(ROOT, 'public', 'games');
const mapPath = join(ROOT, 'scripts', 'th_localization.json');

function setTitle(content, newTitle){
  // Replace <title>...</title>
  const titleRe = /<title>[\s\S]*?<\/title>/i;
  if (titleRe.test(content)) {
    content = content.replace(titleRe, `<title>${newTitle} - ASHURA Games</title>`);
  }
  return content;
}

function setHeading(content, newHeading){
  // Prefer .game-container h1, else first h1
  const h1ContainerRe = /(\.<\/style>|<\/style>|<\/head>|<body[\s\S]*?)([\s\S]*?)/i; // not used but keep for ref
  const specificH1Re = /(\<div class="game-container"[\s\S]*?\<h1[^>]*\>)([\s\S]*?)(\<\/h1\>)/i;
  if (specificH1Re.test(content)) {
    return content.replace(specificH1Re, (_, pre, _old, post) => `${pre}${newHeading}${post}`);
  }
  const genericH1Re = /(<h1[^>]*>)([\s\S]*?)(<\/h1>)/i;
  if (genericH1Re.test(content)) {
    return content.replace(genericH1Re, (_, pre, _old, post) => `${pre}${newHeading}${post}`);
  }
  return content;
}

function main(){
  const map = JSON.parse(readFileSync(mapPath, 'utf8'));
  const files = readdirSync(gamesDir).filter(f => f.toLowerCase().endsWith('.html'));
  let changed = 0;
  for (const f of files){
    const slug = basename(f, '.html');
    const th = map[slug];
    if (!th) continue;
    const p = join(gamesDir, f);
    let html = readFileSync(p, 'utf8');
    const before = html;
    html = setTitle(html, th);
    html = setHeading(html, th);
    if (html !== before){
      copyFileSync(p, p + '.bak');
      writeFileSync(p, html, 'utf8');
      changed++;
      console.log(`TH title applied: ${f} -> ${th}`);
    } else {
      console.log(`No title change: ${f}`);
    }
  }
  console.log(`Thai title batch done. Files updated: ${changed} / ${files.length}`);
}

main();
