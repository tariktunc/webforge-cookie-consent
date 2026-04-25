#!/usr/bin/env node
// WebForge Cookie Consent — Interactive Setup
// Kullanim: cd src/components/consent && node setup.mjs
//
// Yapilan: kullaniciya sorar, secilmeyen dilleri translations.json'dan siler,
// CookieBanner default locale'i ayarlar. Bundle ~40% kucur.

import { readFileSync, writeFileSync } from 'node:fs';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const ALL = ['tr', 'en', 'de', 'fr', 'es', 'it', 'ar', 'he', 'ru'];
const DEFAULT = 'tr';

const rl = createInterface({ input, output });

console.log('\n🍪 WebForge Cookie Consent — Kurulum');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log('Mevcut diller:', ALL.join(', '));
console.log(`Varsayilan: ${DEFAULT} (Turkce)\n`);

const langsAns = await rl.question(
  `Hangi dilleri dahil etmek istiyorsunuz?\n` +
  `(virgulle ayirin, ENTER = sadece "${DEFAULT}"): `
);

const defaultAns = await rl.question(
  `\nVarsayilan dil? (ENTER = "${DEFAULT}"): `
);

rl.close();

const requested = langsAns.trim()
  ? langsAns.split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
  : [DEFAULT];

const defaultLocale = (defaultAns.trim() || DEFAULT).toLowerCase();

if (!requested.includes(defaultLocale)) requested.unshift(defaultLocale);

const invalid = requested.filter(l => !ALL.includes(l));
if (invalid.length) {
  console.error(`\n❌ Gecersiz dil(ler): ${invalid.join(', ')}`);
  console.error(`Mevcut: ${ALL.join(', ')}`);
  process.exit(1);
}

const translations = JSON.parse(readFileSync('translations.json', 'utf8'));
const trimmed = Object.fromEntries(
  Object.entries(translations).filter(([k]) => requested.includes(k))
);
writeFileSync('translations.json', JSON.stringify(trimmed, null, 2));

const banner = readFileSync('CookieBanner.tsx', 'utf8');
const updated = banner.replace(
  /locale\?:\s*Locale;\s*\n/,
  `locale?: Locale;\n`
).replace(
  /locale\s*=\s*'[a-z]{2}'/g,
  `locale = '${defaultLocale}'`
);
writeFileSync('CookieBanner.tsx', updated);

console.log('\n✅ Kurulum tamamlandi.');
console.log(`   Diller: ${requested.join(', ')}`);
console.log(`   Varsayilan: ${defaultLocale}`);
console.log(`   Bundle azalmasi: ~${Math.round((1 - requested.length / ALL.length) * 100)}%\n`);
console.log('Sonraki adim: layout.tsx icine <CookieBanner /> + <ConsentModeInit /> ekleyin.');
