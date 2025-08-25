import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join, basename } from 'path';

const gamesDir = 'c:/Users/Administrator/AshuraGames/public/games';
const thumbsDir = 'c:/Users/Administrator/AshuraGames/public/generated-thumbnails';
const thumbsJsonPath = join(gamesDir, 'game-thumbnails.json');

function listSlugs() {
  const files = readdirSync(gamesDir).filter(f => f.toLowerCase().endsWith('.html'));
  return files.map(f => basename(f, '.html'));
}

function latestForSlug(slug, names) {
  const prefix = `${slug}_th_`;
  const cand = names.filter(n => n.startsWith(prefix) && n.toLowerCase().endsWith('.png'));
  if (cand.length === 0) return null;
  // filenames have timestamp; pick lexicographically max
  cand.sort();
  return cand[cand.length - 1];
}

function main(){
  const slugs = listSlugs();
  const files = readdirSync(thumbsDir).filter(f => f.toLowerCase().endsWith('.png'));
  let current = {};
  try { current = JSON.parse(readFileSync(thumbsJsonPath,'utf8')); } catch(_) {}
  let updated = 0;
  const out = { ...current };

  for (const slug of slugs) {
    const file = latestForSlug(slug, files);
    if (file) {
      const url = `/generated-thumbnails/${file}`;
      if (out[slug] !== url) {
        out[slug] = url;
        updated++;
        console.log(`[sync] ${slug} -> ${url}`);
      }
    }
  }

  writeFileSync(thumbsJsonPath, JSON.stringify(out, null, 2), 'utf8');
  console.log(`Sync complete. Updated ${updated} mappings. Written: ${thumbsJsonPath}`);
}

main();
