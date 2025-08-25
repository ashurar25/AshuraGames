import { readdirSync, readFileSync, writeFileSync, unlinkSync, existsSync } from 'fs';
import { join, basename } from 'path';

const ROOT = process.cwd();
const gamesDir = join(ROOT, 'public', 'games');
const thumbsDir = join(ROOT, 'public', 'generated-thumbnails');
const thumbsJsonPath = join(gamesDir, 'game-thumbnails.json');

function listSlugs() {
  const files = readdirSync(gamesDir).filter(f => f.toLowerCase().endsWith('.html'));
  return files.map(f => basename(f, '.html'));
}

function chooseLatestForSlug(slug, names) {
  const prefix = `${slug}_th_`;
  const svg = names.filter(n => n.startsWith(prefix) && n.toLowerCase().endsWith('.svg')).sort();
  const png = names.filter(n => n.startsWith(prefix) && n.toLowerCase().endsWith('.png')).sort();
  // Prefer latest SVG if available, else latest PNG
  const chosen = svg.length ? svg[svg.length - 1] : (png.length ? png[png.length - 1] : null);
  const all = [...svg, ...png];
  const obsolete = new Set(all);
  if (chosen) obsolete.delete(chosen);
  return { chosen, obsolete: Array.from(obsolete) };
}

function main(){
  if (!existsSync(gamesDir)) {
    console.error(`Games directory not found: ${gamesDir}`);
    process.exitCode = 1;
    return;
  }
  if (!existsSync(thumbsDir)) {
    console.error(`Thumbnails directory not found: ${thumbsDir}`);
    process.exitCode = 1;
    return;
  }

  const slugs = listSlugs();
  const files = readdirSync(thumbsDir).filter(f => /\.(png|svg)$/i.test(f));
  let current = {};
  try { current = JSON.parse(readFileSync(thumbsJsonPath,'utf8')); } catch(_) {}
  let updated = 0;
  const out = { ...current };

  for (const slug of slugs) {
    const { chosen, obsolete } = chooseLatestForSlug(slug, files);
    if (chosen) {
      const url = `/generated-thumbnails/${chosen}`;
      if (out[slug] !== url) {
        out[slug] = url;
        updated++;
        console.log(`[sync] ${slug} -> ${url}`);
      }
      // Remove obsolete covers for this slug
      for (const name of obsolete) {
        try {
          unlinkSync(join(thumbsDir, name));
          console.log(`[cleanup] removed ${name}`);
        } catch (_) {
          // ignore
        }
      }
    }
  }

  writeFileSync(thumbsJsonPath, JSON.stringify(out, null, 2), 'utf8');
  console.log(`Sync complete. Updated ${updated} mappings. Written: ${thumbsJsonPath}`);
}

main();
