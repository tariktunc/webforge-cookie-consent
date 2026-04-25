# AI Installation Guide — webforge-cookie-consent

> **Bu dosya AI agent'lar (Claude, GPT, vb.) icin yazilmistir.**
> Insan okumasi icin: [INSTALL.md](./INSTALL.md)
> Amac: kurulum adimlarini deterministik ve hatasiz yurutmek.

---

## 0. ON KOSULLAR (kontrol et, eksikse durum bildir)

```yaml
required:
  - framework: Next.js >= 14 (App Router)
  - language: TypeScript >= 5
  - styling: Tailwind CSS >= 3
peer_deps_to_install:
  - "@radix-ui/react-dialog"
  - "@radix-ui/react-switch"
optional:
  - tokens.config.ts at "src/lib/design-system/tokens.config.ts"
```

**Tara:**
1. `package.json` → next, react, typescript, tailwindcss var mi?
2. `src/app/` → App Router mi (mantar yoktur, /pages yok)?
3. `tailwind.config.ts` → varsa darkMode konfigurasyonu kontrol et

Yoksa: kullaniciya raporla, kurulumu durdur.

---

## 1. PRE-FLIGHT — KULLANICIYA SORULACAK 6 SORU

**Tek mesajda topla.** Cevaplar gelmeden kod yazma.

```
1. DIL: Hangi dilleri dahil etmek istiyorsunuz? (varsayilan: tr)
   Mevcut: tr, en, de, fr, es, it, ar, he, ru
   Format: virgulle ayirin (orn: "tr,en,de") veya ENTER = "tr"

2. VARSAYILAN DIL: (varsayilan: tr)

3. TEMA: light / dark / auto (varsayilan: auto)
   - auto: kullanicinin OS tercihini takip eder
   - light/dark: zorla sabit

4. YAZI TIPI: (varsayilan: Poppins)
   - Proje tokens.config.ts varsa → onu oner
   - Yoksa → Poppins

5. BUTON BORDER: (varsayilan: 3px solid)
   - Proje tokens varsa → onu oner

6. KULLANILAN 3. TARAF SERVISLER:
   Listeyi al. Yaygin secenekler:
   [ ] Google Analytics 4
   [ ] Google Tag Manager
   [ ] Facebook Pixel
   [ ] Yandex Metrika
   [ ] Microsoft Clarity
   [ ] Hotjar
   [ ] LinkedIn Insight
   [ ] TikTok Pixel
   [ ] Cloudflare Analytics
   [ ] Plausible / Umami / Fathom
   [ ] Diger (specify)
```

---

## 2. KURULUM ADIMLARI (deterministik sira)

### 2.1 — Klasor cek
```bash
npx degit tariktunc/webforge-cookie-consent src/components/consent
```

**Dogrula:** `src/components/consent/CookieBanner.tsx` var olmali.

### 2.2 — Bagimliliklar
```bash
npm i @radix-ui/react-dialog @radix-ui/react-switch
```

### 2.3 — Setup script (interaktif)
```bash
cd src/components/consent && node setup.mjs
```

`setup.mjs` size sorar (yukaridaki 1-5. sorulari tekrar sorabilir, ENTER = onceki cevap):
- Diller / varsayilan dil / font / borderWidth / borderRadius
- `tokens.config.ts` varsa otomatik tespit eder

**Dogrula:** `translations.json` sadece secilen dilleri icermeli. `CookieBanner.tsx` icindeki DEFAULT_FONT/BORDER guncellenmis olmali.

### 2.4 — Layout entegrasyonu

`src/app/layout.tsx` (veya `[locale]/layout.tsx`) **head**'ine:
```tsx
import { ConsentModeInit } from '@/components/consent/ConsentModeInit';

<head>
  {/* Poppins font yuklendiyse: */}
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" />
  <ConsentModeInit />
</head>
```

`</body>` hemen oncesine:
```tsx
import { CookieBanner } from '@/components/consent/CookieBanner';
import { exampleServices } from '@/components/consent/services.example'; // veya kendi services dosyaniz
import siteServices from '@/lib/cookie-services'; // kendi yaratacaginiz dosya

<CookieBanner
  locale="tr"
  theme="auto"
  services={siteServices}
/>
```

### 2.5 — Servis verilerini olustur (KRITIK)

**Bu adim kullaniciya sorduklarina dayali olarak SEN OLUSTURURSUN.**

`src/lib/cookie-services.ts` dosyasini yarat. Sablon:

```typescript
import type { ServicesByCategory } from '@/components/consent/types';

const services: ServicesByCategory = {
  essential: [
    {
      id: 'wf-cookie-consent',
      name: 'Cerez Onayi',
      category: 'essential',
      required: true,
      description: 'Cerez tercihlerinizi saklar.',
      processingCompany: { name: '<MUSTERI_SIRKET_ADI>', address: '<ADRES>' },
      dataProtectionOfficer: { email: '<KVKK_EMAIL>' },
      dataPurposes: ['Yasal yukumluluk', 'Onay saklama'],
      technologiesUsed: ['Cookie', 'localStorage'],
      dataCollected: ['Onay tercihi', 'Onay zamani', 'IP (anonim)'],
      legalBasis: ['GDPR Art. 6.1.c', 'KVKK Madde 5/2-c'],
      locationOfProcessing: 'Turkiye / AB',
      retentionPeriod: '1 yil',
      dataRecipients: ['Site sahibi'],
      privacyPolicyUrl: '<MUSTERI_PRIVACY_URL>',
      storageInformation: { nonCookieStorage: true },
      storedInformation: [
        { identifier: 'wf_consent', type: 'cookie', duration: '365 gun', purpose: 'Onay tercihi' },
      ],
    },
  ],

  analytics: [
    // Eger kullanici "Google Analytics 4" sectiyse:
    // services.example.ts'teki GA4 kaydini kopyala, processingCompany ayni
    // (Google Ireland Limited), proje URL'ini privacyPolicyUrl yapma — Google'inkini kullan
  ],

  marketing: [
    // Facebook Pixel, GTM secilmisse → services.example.ts'ten kopyala
  ],

  functional: [
    // Tema/dil tercihleri → ornekteki gibi
  ],
};

export default services;
```

**Servis sablonlari icin referans:**
- Google Analytics 4 → `services.example.ts` icindeki `google-analytics-4`
- Facebook Pixel → `services.example.ts` icindeki `facebook-pixel`
- Google Tag Manager → `services.example.ts` icindeki `google-tag-manager`
- Tema/Dil tercihleri → `theme-language-prefs`

**ZORUNLU:** Her servis icin 16 alan da doldurulmali (typescript zorunlu olmasa bile GDPR sart):
description, processingCompany, dataProtectionOfficer, dataPurposes,
technologiesUsed, dataCollected, legalBasis, locationOfProcessing,
retentionPeriod, [transferToThirdCountries], dataRecipients,
privacyPolicyUrl, [cookiePolicyUrl], [storageInformation], [storedInformation], [subservices].

`[]` icindekiler optional ama mumkun olduguna doldur.

### 2.6 — Footer'a re-open linki ekle

```tsx
import { openCookiePreferences } from '@/components/consent';

<button onClick={openCookiePreferences}>Cerez Tercihleri</button>
```

### 2.7 — Analitik scriptleri korumaya al

**ZORUNLU:** Consent verilmemisse hicbir analytics/marketing scripti yuklenmemeli.

```tsx
'use client';
import { useConsent } from '@/components/consent';
import Script from 'next/script';

export function Analytics() {
  const { analytics, marketing } = useConsent();
  return (
    <>
      {analytics && <Script src="https://www.googletagmanager.com/gtag/js?id=G-XXX" strategy="afterInteractive" />}
      {marketing && <Script src="https://connect.facebook.net/en_US/fbevents.js" strategy="afterInteractive" />}
    </>
  );
}
```

---

## 3. DOGRULAMA (kurulumdan sonra)

```yaml
checks:
  - file_exists: src/components/consent/CookieBanner.tsx
  - file_exists: src/lib/cookie-services.ts
  - layout_has: <ConsentModeInit /> in <head>
  - layout_has: <CookieBanner /> in <body>
  - typecheck: npm run typecheck → 0 error
  - lint: npm run lint → 0 warning
  - dev: npm run dev → 200 OK
  - banner_visible: ilk ziyarette banner gorunur
  - consent_blocks: consent oncesi GA/FB Pixel scriptleri yuklenmemeli
  - reopen_works: footer link tiklandiginda modal acilir
  - persists: secim kaydedildikten sonra refresh'te banner gorunmez
```

---

## 4. ORTAK HATALAR (yapma)

| Hata | Cozum |
|------|-------|
| `services` prop'u JSON literal olarak inline yazma | Ayri dosyada (`src/lib/cookie-services.ts`) |
| `consent` kontrolu olmadan analytics yuklemek | `useConsent()` hook'u kullan |
| `CookieBanner` `<head>` icine koymak | `<body>` sonuna |
| Pre-tick (varsayilan acik) toggle | Opt-in default zorunlu (KVKK + GDPR) |
| "Reddet" butonunu kucuk yapmak | Esit prominence (boyut/renk/font ayni) |
| `processingCompany.name` bos birakmak | GDPR Art. 13 sart, 3. taraflar icin gercek isim ver |
| `dataPurposes` Turkce ile karistirmak | Tutarli dil kullan, secilen locale ile uyumlu |
| `setup.mjs` calistirmamak | Bundle 9 dil yukler, 40-80% gereksiz yer tutar |

---

## 5. CIKTI RAPORU SABLONU (kullaniciya goster)

```
✅ webforge-cookie-consent v2.1.0 kuruldu

📁 Olusturulan dosyalar:
   - src/components/consent/* (degit ile cekildi)
   - src/lib/cookie-services.ts (sizin servisleriniz)

🔧 Konfigurasyon:
   - Diller: <X, Y, Z>
   - Varsayilan: <X>
   - Tema: <auto/light/dark>
   - Font: <font>
   - Border: <Npx solid>

🛡️ Eklenen servisler:
   - Essential: <count>
   - Analytics: <count>
   - Marketing: <count>
   - Functional: <count>

📋 Yapilacaklar listesi (kullanici icin):
   1. /lib/cookie-services.ts'te <SIRKET_ADI> ve <KVKK_EMAIL> placeholderlarini doldur
   2. <PRIVACY_URL> ve <COOKIE_POLICY_URL> degerlerini gercek URL'lerle degistir
   3. Footer'a <CookiePreferencesButton /> linkini ekle
   4. Test et: npm run dev → ilk ziyarette banner gorunmeli

🔗 Faydali linkler:
   - GitHub: https://github.com/tariktunc/webforge-cookie-consent
   - Docs: ./README.md
   - Examples: ./services.example.ts
```

---

## 6. AI PARSE-FRIENDLY VERI YAPISI

Servisler hakkinda kullanicidan bilgi alirken bu format kullanilabilir:

```yaml
service:
  id: facebook-pixel
  name: Facebook Pixel
  category: marketing
  description: |
    Reklam donusum takibi.
  processingCompany:
    name: Meta Platforms Ireland Ltd.
    address: 4 Grand Canal Square, Dublin, Ireland
  dataProtectionOfficer:
    url: https://www.facebook.com/help/contact/...
  dataPurposes: [Analytics, Marketing, Retargeting]
  technologiesUsed: [Cookies, Pixel]
  dataCollected: [IP, User Agent, Pages visited]
  legalBasis: ['GDPR Art. 6.1.a', 'KVKK Madde 5/1']
  locationOfProcessing: European Union
  retentionPeriod: 2 years
  transferToThirdCountries: [USA, Singapore]
  dataRecipients: [Meta Platforms Ireland Ltd., Meta Platforms Inc.]
  privacyPolicyUrl: https://www.facebook.com/privacy/explanation
  cookiePolicyUrl: https://www.facebook.com/policies/cookies
  storageInformation:
    maxCookieAgeDays: 731
  storedInformation:
    - { identifier: _fbp, type: cookie, duration: 90 days, purpose: User tracking }
    - { identifier: _fbc, type: cookie, duration: 90 days, purpose: Click tracking }
```

---

## 7. SORUN GIDERME

| Sorun | Tani | Cozum |
|-------|------|-------|
| Banner gorunmuyor | `localStorage.wf_consent` var mi? | `localStorage.clear()` yap |
| Toggle calismiyor | Radix Switch import edildi mi? | `npm i @radix-ui/react-switch` |
| Dark mode calismiyor | `tailwind.config` darkMode: 'class' mi? | Theme prop "auto" ise OS'tan okur |
| Font yuklenmiyor | layout'ta Google Fonts link var mi? | head'e link ekle veya `font="inherit"` |
| Hydration error | `'use client'` eksik mi? | CookieBanner zaten 'use client' |
| Modal acilmiyor | Radix Dialog import dogru mu? | `npm i @radix-ui/react-dialog` |

---

## 8. TAMAMLANMA KRITERLERI

```yaml
done_when:
  - npm run dev → banner ilk ziyarette gorunur
  - "Reddet" tikla → banner kapanir, refresh'te tekrar gorunmez
  - "Tercihleri Yonet" tikla → modal acilir, 4 kategori + servisler gorunur
  - Her servis icin "Detaylari Goster" tikla → 16 alan acikca gorunur
  - storedInformation tablosu en az 1 satir gosterir
  - "About this tool" bolumu modal alt kisminda gorunur
  - Footer "Cerez Tercihleri" linki modal acar
  - DevTools Network → consent oncesi sadece essential istek
  - DevTools localStorage → wf_consent kaydi var
  - Lighthouse a11y > 95
  - Tarayici 280px'de yatay scroll yok
```
