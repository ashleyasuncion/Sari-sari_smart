/* One-off check: every data-i18n key used in the HTML pages must resolve in
   both the EN and FIL string maps (no missing translations). Parses the maps
   from app.js source since t() is closure-scoped inside the IIFE. */
const fs = require('fs');

const src = fs.readFileSync('app.js', 'utf8');

// Extract `strings = { en: {...}, fil: {...} }` with a brace matcher.
function extractMap(marker) {
  const start = src.indexOf(marker);
  if (start < 0) throw new Error('marker not found: ' + marker);
  const open = src.indexOf('{', start);
  let depth = 0, i = open, inStr = false, quote = '';
  for (; i < src.length; i++) {
    const c = src[i];
    if (inStr) {
      if (c === '\\') { i++; continue; }
      if (c === quote) inStr = false;
      continue;
    }
    if (c === '"' || c === "'") { inStr = true; quote = c; continue; }
    if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) break; }
  }
  return src.slice(open + 1, i);
}

const enMap = extractMap('en: {');
const filMap = extractMap('fil: {');

function hasKey(map, key) {
  // match `key:` at the start of a line (possibly indented), not a substring
  const re = new RegExp('(^|\\n)\\s*' + key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*:');
  return re.test(map);
}

const files = ['expenses.html', 'closing.html', 'day.html', 'help.html', 'reports.html', 'index.html'];
let fails = 0, total = 0;
for (const f of files) {
  const html = fs.readFileSync(f, 'utf8');
  const keys = [...new Set([...html.matchAll(/data-i18n="([^"]+)"/g)].map(m => m[1]))];
  for (const key of keys) {
    total++;
    const en = hasKey(enMap, key);
    const fil = hasKey(filMap, key);
    if (!en || !fil) {
      console.log(`  ✗ ${f}: "${key}" EN=${en ? 'ok' : 'MISSING'} FIL=${fil ? 'ok' : 'MISSING'}`);
      fails++;
    }
  }
  console.log(`${f}: checked ${keys.length} keys`);
}
console.log(fails === 0 ? `ALL ${total} KEYS OK (EN + FIL)` : 'FAILURES: ' + fails);
process.exit(fails > 0 ? 1 : 0);
