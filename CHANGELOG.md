# Changelog

## [2.0.0] — 2026-04-26 (BREAKING)

### Added — Service-Level Granular Consent (Usercentrics parite)
- Yeni `Service` tipi 13+ alanli (description, processingCompany, dpo, dataPurposes,
  technologiesUsed, dataCollected, legalBasis, locationOfProcessing, retentionPeriod,
  transferToThirdCountries, dataRecipients, privacyPolicyUrl, cookiePolicyUrl,
  storageInformation, subservices)
- `services` prop'u CookieBanner ve CookiePreferences'a eklendi
- ServiceDetail bileseni: accordion ile detay expand/collapse
- Her servis icin ayri toggle (kategori toggle'in altinda)
- Kategori basliginda servis sayisi rozeti (orn: "Pazarlama 3")
- Subservice nesting (Google Tag Services → Google AJAX vb.)
- services.example.ts: 5 ornek servis (GA4, FB Pixel, GTM, vs.)
- 9 dilde 21 yeni alan etiketi (description, processingCompany, dpo, ...)
- ServiceConsentState eklendi (Record<serviceId, boolean>)
- consent-store: getServiceConsent(), per-service tracking
- acceptAll(locale, serviceIds), rejectAll(locale, requiredServiceIds) imzalari guncellendi

### Breaking
- `savePreferences(state, locale)` → `savePreferences(state, services, locale)`
- ConsentRecord artik `services: ServiceConsentState` icerir
- CONSENT_VERSION = '2.0.0' (eski 1.x kayitlar yeniden onay alinir)

## [1.0.0] — 2026-04-26

### Added
- CookieBanner (alt-banner, 3 buton: Kabul / Reddet / Tercihler)
- CookiePreferences (Radix Dialog modal, 4 kategori toggle)
- ConsentModeInit (Google Consent Mode v2 default `denied`)
- consent-store (localStorage + cookie + GCM update + event bus)
- 9 dil destegi: TR, EN, DE, FR, ES, IT, AR (RTL), HE (RTL), RU
- Anonim consent log (GDPR Art. 7(1))
- SSR FOUC korumasi
- 280px responsive
- Klavye erisilebilirligi (Radix)
- "Reddet" / "Kabul" esit prominence (KVKK + GDPR uyumlu)
