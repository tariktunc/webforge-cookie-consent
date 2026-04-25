# Contributing

Katki kabul edilir — issue, PR, ceviri, dokuman.

## Lokal calisma

```bash
git clone https://github.com/tariktunc/webforge-cookie-consent.git
cd webforge-cookie-consent
# Bu paketin kendi node_modules'i yok; degit ile cekildigi projede test edin
```

## Pull request kurallari

- Ana branch: `main`
- Yeni ozellik → `feat/<isim>` branch
- Bug fix → `fix/<isim>` branch
- Commit mesaj formati: [Conventional Commits](https://www.conventionalcommits.org/)
- TypeScript strict, eslint warning yok
- Yeni dil eklerken `translations.json`'a obje + `Locale` tipine eklenmeli

## Versiyon

[SemVer](https://semver.org/):
- MAJOR — breaking change (props degisikligi, API kaldirma)
- MINOR — yeni ozellik (geriye uyumlu)
- PATCH — bug fix

## Yeni dil ekleme

1. `translations.json` icine yeni locale objesi ekle (mevcut TR yapisini kopyala)
2. `types.ts` `Locale` tipine kodunu ekle
3. RTL dil ise `CookieBanner.tsx` ve `CookiePreferences.tsx`'te `isRtl` kontrolune ekle
4. PR'i ac, commit mesaji: `feat(i18n): add <language> translation`

## Yeni servis sablonu

Genel servisler icin (GA4, FB Pixel, GTM, vs.) `services.example.ts`'e ekleyin. Tum 16 alani doldurun (GDPR Art. 13/14).

## Kod stili

- 2 space indent
- Single quote string
- Tailwind class siralamasi: `clsx` veya `tailwind-merge` kullan
- React 18+ functional component, hook'lar
- `'use client'` direktifi sadece gerekli yerlerde

## Sorun bildirimi

Issue acmadan once:
- README + INSTALL kontrol et
- Mevcut issue'lara bak
- Hata mesajini tam paylas, reproduce adimlari ver
