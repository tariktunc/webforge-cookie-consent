# Hizli Kurulum — WebForge Cookie Consent

> **Tek komut, 30 saniye, hazir.**
> Open source: [github.com/tariktunc/webforge-cookie-consent](https://github.com/tariktunc/webforge-cookie-consent)
> Lisans: MIT

---

## YONTEM 1 — degit (ONERILEN, hizli + temiz)

`degit` git geçmişi olmadan klasörü kopyalar, en hafif yöntem.

```bash
# 1. Klasoru cek
npx degit tariktunc/webforge-cookie-consent src/components/consent

# 2. Bagimliliklar
npm i @radix-ui/react-dialog @radix-ui/react-switch

# 3. Dil secimi (interaktif — varsayilan: TR)
cd src/components/consent && node setup.mjs
```

`setup.mjs` size sorar:
- Hangi dilleri dahil etmek istiyorsunuz? (virgulle, ENTER = sadece TR)
- Varsayilan dil? (ENTER = TR)

Secilmeyen diller `translations.json`'dan **silinir** → bundle ~40% kucur.

**Bitti.** `src/components/consent/` icinde sadece sectiginiz diller hazir.

---

## YONTEM 2 — npm paket (tek komut)

```bash
npm i @blakfy/cookie-consent
```

Sonra:
```tsx
import { CookieBanner, ConsentModeInit } from '@blakfy/cookie-consent';
import '@blakfy/cookie-consent/styles.css';
```

---

## YONTEM 3 — git submodule (gelistirme katkisi icin)

```bash
git submodule add https://github.com/tariktunc/webforge-cookie-consent.git src/components/consent
git submodule update --init --recursive
```

---

## YONTEM 4 — Manuel ZIP

1. https://github.com/tariktunc/webforge-cookie-consent → "Download ZIP"
2. ZIP'i ac, klasoru `src/components/consent/` olarak kopyala
3. Bagimliliklari kur: `npm i @radix-ui/react-dialog @radix-ui/react-switch`

---

## ENTEGRASYON (Tum Yontemlerde Ortak)

### Adim 1 — Layout'a ekle

```tsx
// src/app/layout.tsx
import { ConsentModeInit } from '@/components/consent/ConsentModeInit';
import { CookieBanner } from '@/components/consent/CookieBanner';

export default function RootLayout({ children, params }: { children: React.ReactNode, params: { locale?: string } }) {
  return (
    <html lang={params.locale ?? 'tr'}>
      <head>
        <ConsentModeInit />
      </head>
      <body>
        {children}
        <CookieBanner locale={params.locale as any ?? 'tr'} />
      </body>
    </html>
  );
}
```

### Adim 2 — Footer'a "Tercihleri Yonet" linki

```tsx
import { openCookiePreferences } from '@/components/consent';

<button onClick={openCookiePreferences}>Cerez Tercihleri</button>
```

### Adim 3 — Analitik scriptleri korumaya al

```tsx
'use client';
import { useConsent } from '@/components/consent';
import Script from 'next/script';

export function Analytics() {
  const { analytics } = useConsent();
  if (!analytics) return null;
  return <Script src="https://www.googletagmanager.com/gtag/js?id=G-XXX" strategy="afterInteractive" />;
}
```

---

## DESTEKLENEN DILLER

`tr` (default), `en`, `de`, `fr`, `es`, `it`, `ar` (RTL), `he` (RTL), `ru`

Yeni dil eklemek icin: `translations.json`'a obje ekleyin → PR gonderin.

---

## SIK SORULAR

**S: Renkleri/font'u nasıl ozellestiririm?**
C: Tum stillemes Tailwind class'lari ile yapilmistir. Component'i kopyaladiktan sonra dogrudan className'leri duzenleyin.

**S: Google Consent Mode v2 calisir mi?**
C: Evet, `ConsentModeInit` zaten GCM v2 default `denied` ile baslatir. Kullanici secim yapinca `consent update` tetiklenir.

**S: KVKK uyumlu mu?**
C: Evet. Opt-in default, "Reddet" "Kabul" esit prominence, 4 kategori toggle, anonim consent log. KVKK Madde 5 ve 8 ile uyumlu.

**S: SSR FOUC olur mu?**
C: Hayir. `CookieBanner` sadece consent verilmemis ise render edilir, cookie'den ilk paint dogru deger okunur.

**S: Bundle size?**
C: Gzip ~6KB (Radix Dialog + Switch dahil hesaplanmadi, onlar zaten projede var).

---

## KATKI

PR ve issue'lar acik. Daha fazla bilgi: [CONTRIBUTING.md](./CONTRIBUTING.md)
