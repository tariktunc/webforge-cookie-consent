#!/usr/bin/env node
// WebForge Cookie Consent — Interactive Setup
// Kullanim: cd src/components/consent && node setup.mjs
//
// Yapilan:
// 1. Proje tokens.config.ts'i (varsa) oku → font, borderWidth, borderRadius cikart
// 2. Kullaniciya sor (token bulunduysa: onaylat; yoksa: girdi al)
// 3. Secilmeyen dilleri sil
// 4. CookieBanner.tsx default'larini guncelle

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const ALL = ['tr', 'en', 'de', 'fr', 'es', 'it', 'ar', 'he', 'ru'];
const DEFAULT_LOCALE = 'tr';
const DEFAULT_FONT = "'Poppins', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const DEFAULT_BORDER_WIDTH = '3px';
const DEFAULT_BORDER_RADIUS = '0.5rem';

function findProjectTokens() {
  const candidates = [
    'src/lib/design-system/tokens.config.ts',
    '../../lib/design-system/tokens.config.ts',
    '../../../lib/design-system/tokens.config.ts',
    '../../../src/lib/design-system/tokens.config.ts',
  ];
  for (const p of candidates) {
    const abs = resolve(process.cwd(), p);
    if (existsSync(abs)) return { path: abs, content: readFileSync(abs, 'utf8') };
  }
  return null;
}

function extract(content, key, fallback) {
  const re = new RegExp(`${key}\\s*:\\s*['"\`]([^'"\`]+)['"\`]`);
  const m = content.match(re);
  return m ? m[1] : fallback;
}

function detectFromTokens(content) {
  const fontFamily = extract(content, 'fontFamily|family|sans', null);
  const radius = extract(content, 'borderRadius|radius\\.md|radius', null);
  const border = extract(content, 'borderWidth|border', null);
  return {
    font: fontFamily ? `'${fontFamily}', system-ui, sans-serif` : null,
    borderRadius: radius,
    borderWidth: border,
  };
}

const rl = createInterface({ input, output });
const ask = (q, def) => rl.question(`${q}${def ? ` (ENTER = ${def})` : ''}: `).then(a => a.trim() || def || '');

console.log('\n🍪 WebForge Cookie Consent — Kurulum');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const tokens = findProjectTokens();
let detected = { font: null, borderRadius: null, borderWidth: null };
if (tokens) {
  console.log(`📐 Proje tokens dosyasi bulundu: ${tokens.path}`);
  detected = detectFromTokens(tokens.content);
  console.log('   Tespit edilen:');
  console.log(`   - Font: ${detected.font ?? '(yok)'}`);
  console.log(`   - Border radius: ${detected.borderRadius ?? '(yok)'}`);
  console.log(`   - Border width: ${detected.borderWidth ?? '(yok)'}\n`);
} else {
  console.log('ℹ️  Proje tokens dosyasi bulunamadi — varsayilanlar kullanilacak.\n');
}

const langsAns = await ask(
  `Hangi dilleri dahil etmek istiyorsunuz?\n[${ALL.join(', ')}]\nVirgulle ayirin`,
  DEFAULT_LOCALE
);
const defaultLocale = await ask('Varsayilan dil', DEFAULT_LOCALE);
const font = await ask('Yazi tipi (font-family)', detected.font || DEFAULT_FONT);
const borderWidth = await ask('Buton border genisligi', detected.borderWidth || DEFAULT_BORDER_WIDTH);
const borderRadius = await ask('Buton kose yuvarliyi (radius)', detected.borderRadius || DEFAULT_BORDER_RADIUS);

rl.close();

const requested = langsAns.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
if (!requested.includes(defaultLocale)) requested.unshift(defaultLocale);

const invalid = requested.filter(l => !ALL.includes(l));
if (invalid.length) {
  console.error(`\n❌ Gecersiz dil(ler): ${invalid.join(', ')}`);
  process.exit(1);
}

const translations = JSON.parse(readFileSync('translations.json', 'utf8'));
const trimmed = Object.fromEntries(
  Object.entries(translations).filter(([k]) => requested.includes(k))
);
writeFileSync('translations.json', JSON.stringify(trimmed, null, 2));

let banner = readFileSync('CookieBanner.tsx', 'utf8');
banner = banner.replace(/const DEFAULT_FONT = .+;/, `const DEFAULT_FONT = ${JSON.stringify(font)};`);
banner = banner.replace(/const DEFAULT_BORDER_WIDTH = .+;/, `const DEFAULT_BORDER_WIDTH = ${JSON.stringify(borderWidth)};`);
banner = banner.replace(/const DEFAULT_BORDER_RADIUS = .+;/, `const DEFAULT_BORDER_RADIUS = ${JSON.stringify(borderRadius)};`);
banner = banner.replace(/locale = '[a-z]{2}'/g, `locale = '${defaultLocale}'`);
writeFileSync('CookieBanner.tsx', banner);

console.log('\n✅ Kurulum tamamlandi.');
console.log(`   Diller:        ${requested.join(', ')}`);
console.log(`   Varsayilan:    ${defaultLocale}`);
console.log(`   Font:          ${font}`);
console.log(`   Border:        ${borderWidth} solid`);
console.log(`   Radius:        ${borderRadius}`);
console.log(`   Bundle azal.:  ~${Math.round((1 - requested.length / ALL.length) * 100)}%\n`);
console.log('Sonraki adim: layout.tsx icine <CookieBanner /> + <ConsentModeInit /> ekleyin.');
