# WebForge Cookie Consent — Static Drop-In

> **Felsefe:** Tek sefer yazildi, her projede **kopyalanir**. Sifirdan uretilmez.
> Standart: GDPR + KVKK + Google Consent Mode v2 uyumlu, opt-in, esit prominence.

---

## ENTEGRASYON (3 Adim)

### 1. Klasoru kopyala
```bash
cp -r webforge/assets/cookie-consent src/components/consent
```

### 2. Layout'a ekle
```tsx
// src/app/layout.tsx (veya [locale]/layout.tsx)
import { CookieBanner } from '@/components/consent/CookieBanner';
import { ConsentModeInit } from '@/components/consent/ConsentModeInit';

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <ConsentModeInit />
      </head>
      <body>
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
```

### 3. (Opsiyonel) Dil ekle
`translations.json` icine yeni locale objesi yapistir.

---

## OZELLIKLER

| Ozellik | Durum |
|---------|-------|
| GDPR uyumlu | ✅ |
| KVKK uyumlu | ✅ |
| Google Consent Mode v2 | ✅ default `denied` |
| Opt-in (varsayilan kapali) | ✅ |
| "Reddet" / "Kabul" esit prominence | ✅ |
| Pre-tick yasak | ✅ |
| 4 kategori (essential/analytics/marketing/functional) | ✅ |
| localStorage + cookie persistence | ✅ |
| Anonim consent log (GDPR Art. 7(1)) | ✅ |
| SSR FOUC yok | ✅ (cookie'den oku) |
| Radix Dialog (a11y) | ✅ |
| Klavye erisilebilirligi | ✅ |
| 9 dil destegi | ✅ TR, EN, DE, FR, ES, IT, AR (RTL), HE (RTL), RU |
| 280px responsive | ✅ |
| Yazi tipi: default **Poppins**, override edilebilir | ✅ |
| Light / Dark / Auto tema | ✅ (`theme` prop) |
| Re-open butonu (Footer linki) | ✅ |

---

## YASAL UYARILAR

1. **"Reddet" butonu "Kabul" butonu ile ESIT** olmali (renk, boyut, agirlik). KVKK + AB icin zorunlu.
2. **Pre-tick YOK** — kullanici aktif olarak isaretler.
3. **Essential kategorisi** her zaman ON, kullanici kapatamaz (sayfa fonksiyonu icin).
4. **Consent verilmeden HICBIR analytics/marketing scripti** yuklenmez (`ConsentModeInit` halleder).
5. **Consent log** anonim kullanici icin de tutulur (timestamp + version + chosen).

---

## DOSYA YAPISI

```
cookie-consent/
├── README.md               (bu dosya)
├── CookieBanner.tsx        (alt-banner, 3 buton: Kabul / Reddet / Tercihler)
├── CookiePreferences.tsx   (modal, 4 kategori toggle, Radix Dialog)
├── ConsentModeInit.tsx     (head'in ilk satiri, GCM v2 default denied)
├── consent-store.ts        (localStorage + cookie + log)
├── types.ts                (TypeScript tipleri)
├── translations.json       (9 dil)
└── styles.css              (Tailwind override + RTL)
```

---

## RE-OPEN (Footer'a Link)

```tsx
import { openCookiePreferences } from '@/components/consent/consent-store';

<button onClick={openCookiePreferences}>Cerez Tercihlerini Yonet</button>
```

---

## ANALITIK ENTEGRASYON

`consent-store.ts` icindeki `useConsent()` hook ile:

```tsx
const { analytics, marketing } = useConsent();

useEffect(() => {
  if (analytics) {
    // GA4, Plausible vb. yukle
  }
}, [analytics]);
```

Veya GCM v2 ile otomatik:
```tsx
// ConsentModeInit zaten gtag('consent', 'update', ...) tetikler
```
