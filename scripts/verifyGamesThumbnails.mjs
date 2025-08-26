#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const cwd = process.cwd();
const gamesDir = path.join(cwd, 'public', 'games');
const thumbsDir = path.join(cwd, 'public', 'generated-thumbnails');
const mapPath = path.join(gamesDir, 'game-thumbnails.json');

function readJsonSafe(file) {
  try {
    if (fs.existsSync(file)) {
      return JSON.parse(fs.readFileSync(file, 'utf8'));
    }
  } catch (e) {
    console.error('[error] failed to parse JSON:', file, e.message);
  }
  return {};
}

function listGameHtmlBases() {
  const entries = fs.readdirSync(gamesDir, { withFileTypes: true });
  return entries
    .filter(e => e.isFile() && e.name.endsWith('.html') && !e.name.endsWith('.bak'))
    .map(e => e.name.replace(/\.html$/i, ''))
    .sort((a, b) => a.localeCompare(b));
}

function fileExistsFromRel(rel) {
  const normalized = rel.startsWith('/') ? rel.slice(1) : rel;
  const full = path.join(cwd, normalized.split('/').join(path.sep));
  return fs.existsSync(full);
}

function main() {
  const baseNames = listGameHtmlBases();
  const map = readJsonSafe(mapPath);
  const mapKeys = Object.keys(map).sort((a, b) => a.localeCompare(b));

  const missingInMap = baseNames.filter(b => !(b in map));
  const extraInMap = mapKeys.filter(k => !baseNames.includes(k));

  const missingFiles = [];
  const wrongExt = [];
  for (const [k, rel] of Object.entries(map)) {
    if (!fileExistsFromRel(rel)) {
      missingFiles.push({ key: k, path: rel });
    } else {
      const ext = path.extname(rel).toLowerCase();
      if (!['.svg', '.png'].includes(ext)) {
        wrongExt.push({ key: k, path: rel });
      }
    }
  }

  // Orphan files in generated-thumbnails (no map entry)
  let orphanFiles = [];
  if (fs.existsSync(thumbsDir)) {
    const files = fs.readdirSync(thumbsDir).filter(f => f.endsWith('.svg') || f.endsWith('.png'));
    const valueSet = new Set(Object.values(map).map(v => (v.startsWith('/') ? v.slice(1) : v)));
    orphanFiles = files
      .map(f => path.posix.join('public/generated-thumbnails', f))
      .filter(rel => !valueSet.has(rel));
  }

  const summary = {
    totalGamesHtml: baseNames.length,
    totalMapped: mapKeys.length,
    missingMappingCount: missingInMap.length,
    missingMapping: missingInMap,
    missingFilesCount: missingFiles.length,
    missingFiles,
    wrongExtensionCount: wrongExt.length,
    wrongExtension: wrongExt,
    extraMappingKeysCount: extraInMap.length,
    extraMappingKeys: extraInMap,
    orphanThumbnailsCount: orphanFiles.length,
    orphanThumbnails: orphanFiles.slice(0, 50),
  };

  console.log('[verify] games html count       :', summary.totalGamesHtml);
  console.log('[verify] mapped entries          :', summary.totalMapped);
  console.log('[verify] missing mapping count   :', summary.missingMappingCount);
  console.log('[verify] missing files count     :', summary.missingFilesCount);
  console.log('[verify] wrong extension count   :', summary.wrongExtensionCount);
  console.log('[verify] extra mapping keys count:', summary.extraMappingKeysCount);
  console.log('[verify] orphan thumbnails count :', summary.orphanThumbnailsCount);

  if (missingInMap.length) {
    console.log('\n[missing-mapping]', missingInMap);
  }
  if (missingFiles.length) {
    console.log('\n[missing-files]', missingFiles);
  }
  if (extraInMap.length) {
    console.log('\n[extra-mapping-keys]', extraInMap);
  }
  if (orphanFiles.length) {
    console.log('\n[orphan-thumbnails] showing up to 50 entries');
    for (const rel of summary.orphanThumbnails) console.log(' ', rel);
  }

  // exit code 0 to keep it non-blocking. The report is enough for now.
  process.exit(0);
}

main();
