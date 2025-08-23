import { readdirSync, readFileSync, writeFileSync, copyFileSync } from 'fs';
import { join } from 'path';

const root = 'c:/Users/Administrator/AshuraGames/public/games';

const cssLines = [
  '    <!-- ASHURA:shared-css -->',
  '    <link rel="stylesheet" href="./game-enhancement.css">',
  '    <link rel="stylesheet" href="./game-optimization.css">',
  '    <link rel="stylesheet" href="./_assets/game-frame.css">',
];

const jsLines = [
  '    <!-- ASHURA:shared-js -->',
  '    <script src="./game-optimization.js"></script>',
  '    <script src="./_assets/game-frame.js"></script>',
];

function ensureCss(content) {
  const needEnh = !/href="\.\/game-enhancement\.css"/i.test(content);
  const needOpt = !/href="\.\/game-optimization\.css"/i.test(content);
  const needFrame = !/href="\.\/_assets\/game-frame\.css"/i.test(content);

  if (/ASHURA:shared-css/i.test(content)) {
    // Expand marker in-place if some are missing
    const missing = ['<!-- ASHURA:shared-css -->'];
    if (needEnh) missing.push('    <link rel="stylesheet" href="./game-enhancement.css">');
    if (needOpt) missing.push('    <link rel="stylesheet" href="./game-optimization.css">');
    if (needFrame) missing.push('    <link rel="stylesheet" href="./_assets/game-frame.css">');
    if (missing.length > 1) {
      return content.replace(/<!--\s*ASHURA:shared-css\s*-->/i, missing.join('\n'));
    }
    return content;
  }

  // Build block only for missing lines
  const block = ['<!-- ASHURA:shared-css -->'];
  if (needEnh) block.push('    <link rel="stylesheet" href="./game-enhancement.css">');
  if (needOpt) block.push('    <link rel="stylesheet" href="./game-optimization.css">');
  if (needFrame) block.push('    <link rel="stylesheet" href="./_assets/game-frame.css">');
  if (block.length === 1) return content; // nothing to add

  // Insert after </title> if possible, else right after <head>
  const titleMatch = content.match(/<\/title\s*>/i);
  if (titleMatch) {
    const idx = titleMatch.index + titleMatch[0].length;
    return content.slice(0, idx) + '\r\n' + '    ' + block.join('\n') + '\r\n' + content.slice(idx);
  }
  const headMatch = content.match(/<head[^>]*>/i);
  if (headMatch) {
    const idx = headMatch.index + headMatch[0].length;
    return content.slice(0, idx) + '\r\n' + '    ' + block.join('\n') + '\r\n' + content.slice(idx);
  }
  return content; // couldn't place
}

function ensureJs(content) {
  const needOpt = !/src="\.\/game-optimization\.js"/i.test(content);
  const needFrame = !/src="\.\/_assets\/game-frame\.js"/i.test(content);

  if (/ASHURA:shared-js/i.test(content)) {
    const missing = ['<!-- ASHURA:shared-js -->'];
    if (needOpt) missing.push('    <script src="./game-optimization.js"></script>');
    if (needFrame) missing.push('    <script src="./_assets/game-frame.js"></script>');
    if (missing.length > 1) {
      return content.replace(/<!--\s*ASHURA:shared-js\s*-->/i, missing.join('\n'));
    }
    return content;
  }

  const block = ['<!-- ASHURA:shared-js -->'];
  if (needOpt) block.push('    <script src="./game-optimization.js"></script>');
  if (needFrame) block.push('    <script src="./_assets/game-frame.js"></script>');
  if (block.length === 1) return content;

  const bodyMatch = content.match(/<\/body\s*>/i);
  if (bodyMatch) {
    const idx = bodyMatch.index;
    return content.slice(0, idx) + block.join('\n') + '\r\n' + content.slice(idx);
  }
  return content;
}

function main() {
  const files = readdirSync(root).filter(f => f.toLowerCase().endsWith('.html'));
  let updated = 0;
  for (const fname of files) {
    const path = join(root, fname);
    const original = readFileSync(path, 'utf8');
    let content = original;

    const beforeCss = content;
    content = ensureCss(content);
    const afterCss = content;

    const beforeJs = content;
    content = ensureJs(content);
    const afterJs = content;

    const changed = content !== original;
    if (changed) {
      // backup
      copyFileSync(path, path + '.bak');
      writeFileSync(path, content, { encoding: 'utf8' });
      updated++;
      console.log(`Updated: ${fname}`);
    } else {
      console.log(`No change: ${fname}`);
    }
  }
  console.log(`Batch integration done. Files updated: ${updated} / ${files.length}`);
}

main();
