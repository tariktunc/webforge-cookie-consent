# Yayim Rehberi — webforge-cookie-consent

Bu klasor open source GitHub repo olarak yayinlanir, sonra her WebForge projesi `degit` ile ceker.

---

## YAYIM ADIMLARI (Tek Sefer)

### 1. Yeni GitHub repo olustur
- Ad: `webforge-cookie-consent`
- Owner: `tariktunc`
- Lisans: **MIT**
- Visibility: **Public**

### 2. Bu klasoru repo'ya yukle

```bash
cd webforge/assets/cookie-consent
git init
git add .
git commit -m "Initial commit — WebForge Cookie Consent v1.0.0"
git branch -M main
git remote add origin https://github.com/tariktunc/webforge-cookie-consent.git
git push -u origin main
```

### 3. Repo dosyalarini hazirla
Repo kokunde su dosyalar olmali:

```
webforge-cookie-consent/
├── README.md            (kullanim + ozellikler)
├── INSTALL.md           (4 yontem ile kurulum)
├── LICENSE              (MIT)
├── CHANGELOG.md         (versiyon notlari)
├── CONTRIBUTING.md      (PR rehberi)
├── package.json         (npm paket olarak yayim icin)
├── tsconfig.json
├── CookieBanner.tsx
├── CookiePreferences.tsx
├── ConsentModeInit.tsx
├── consent-store.ts
├── types.ts
├── translations.json
└── index.ts
```

### 4. (Opsiyonel) npm paket olarak yayinla

```bash
npm login
npm publish --access public
```

`@blakfy/cookie-consent` veya `webforge-cookie-consent` adiyla.

### 5. Release tag

```bash
git tag v1.0.0
git push origin v1.0.0
```

GitHub UI'dan Release notes olustur.

---

## VERSIYON STRATEJISI

- **MAJOR** — breaking change (props degisikligi, API kaldirma)
- **MINOR** — yeni dil, yeni ozellik (geriye uyumlu)
- **PATCH** — bug fix, stil duzeltme

WebForge projeleri her zaman `main` branch'i veya tag'lenmis stable surumu kullanir.

---

## degit ILE ENTEGRASYON (Kullanici Tarafi)

```bash
# En son main:
npx degit tariktunc/webforge-cookie-consent src/components/consent

# Belirli versiyon:
npx degit tariktunc/webforge-cookie-consent#v1.0.0 src/components/consent
```

---

## TOKEN MALIYETI HESABI

| Yontem | Token Maliyeti (yeni proje basi) |
|--------|----------------------------------|
| Sıfırdan jenere | ~12,000 token (LLM) |
| Static klasor (yerel) | ~0 token |
| **degit GitHub'dan cek** | **~0 token (sadece komut)** |

→ Her yeni site icin **12K token tasarruf**.
