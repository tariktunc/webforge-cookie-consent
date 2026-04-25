import type { ServicesByCategory } from './types';

export const exampleServices: ServicesByCategory = {
  essential: [
    {
      id: 'wf-cookie-consent',
      name: 'WebForge Cookie Consent',
      category: 'essential',
      required: true,
      description: 'Bu site icin GDPR/KVKK uyumlu cerez onay yonetim hizmetidir. Kullanici tercihlerini saklar ve yasal yukumlulukleri yerine getirir.',
      processingCompany: {
        name: 'Blakfy',
        address: 'Istanbul, Turkiye',
      },
      dataProtectionOfficer: {
        email: 'kvkk@blakfy.com',
      },
      dataPurposes: ['Yasal yukumluluklere uyum', 'Onay saklama', 'Kullanici tercihleri'],
      technologiesUsed: ['Local storage', 'Cookie'],
      dataCollected: ['Onay verileri', 'Onay zamani', 'Onay turu', 'Banner dili', 'IP adresi (anonim)'],
      legalBasis: ['Art. 6 para. 1 s. 1 lit. c GDPR', 'KVKK Madde 5/2-c (kanuni yukumluluk)'],
      locationOfProcessing: 'Avrupa Birligi / Turkiye',
      retentionPeriod: 'Onay verileri 1 yil saklanir, sonra silinir.',
      dataRecipients: ['Blakfy', 'Site sahibi'],
      privacyPolicyUrl: 'https://blakfy.com/privacy',
      storageInformation: {
        nonCookieStorage: true,
        notes: 'localStorage + cookie',
      },
      storedInformation: [
        { identifier: 'wf_consent', type: 'cookie', duration: '365 gun', purpose: 'Onay tercihi saklama' },
        { identifier: 'wf_consent', type: 'localStorage', duration: 'Kalici', purpose: 'Anlik onay tercihi' },
      ],
    },
  ],

  analytics: [
    {
      id: 'google-analytics-4',
      name: 'Google Analytics 4',
      category: 'analytics',
      description: 'Web sitesi kullanim analitigi hizmeti. Ziyaretci davranisini anonim olarak izler.',
      processingCompany: {
        name: 'Google Ireland Limited',
        address: 'Gordon House, Barrow Street, Dublin 4, Ireland',
      },
      dataProtectionOfficer: {
        url: 'https://support.google.com/policies/contact/general_privacy_form',
      },
      dataPurposes: ['Analitik', 'Kullanici davranisi analizi', 'Performans olcumu'],
      technologiesUsed: ['Cookies', 'Pixel'],
      dataCollected: [
        'IP adresi (anonim)',
        'User agent',
        'Sayfa goruntuleme',
        'Referrer URL',
        'Cihaz bilgileri',
        'Cografi konum (sehir bazinda)',
        'Tiklama davranisi',
        'Oturum suresi',
      ],
      legalBasis: ['Art. 6 para. 1 s. 1 lit. a GDPR', 'KVKK Madde 5/1 (acik riza)'],
      locationOfProcessing: 'Avrupa Birligi',
      retentionPeriod: 'Veriler 14 ay sonra otomatik silinir.',
      transferToThirdCountries: ['Amerika Birlesik Devletleri'],
      dataRecipients: ['Google Ireland Limited', 'Alphabet Inc.', 'Google LLC'],
      privacyPolicyUrl: 'https://policies.google.com/privacy',
      cookiePolicyUrl: 'https://policies.google.com/technologies/cookies',
      storageInformation: {
        maxCookieAgeDays: 730,
      },
      storedInformation: [
        { identifier: '_ga', type: 'cookie', duration: '2 yil', purpose: 'Benzersiz kullanici tanimlayici' },
        { identifier: '_ga_*', type: 'cookie', duration: '2 yil', purpose: 'Oturum durumu' },
        { identifier: '_gid', type: 'cookie', duration: '24 saat', purpose: 'Gunluk kullanici ayrimi' },
      ],
    },
  ],

  marketing: [
    {
      id: 'facebook-pixel',
      name: 'Facebook Pixel',
      category: 'marketing',
      description: 'Meta tarafindan sunulan reklam donusum takibi teknolojisi.',
      processingCompany: {
        name: 'Meta Platforms Ireland Ltd.',
        address: '4 Grand Canal Square, Grand Canal Harbour, Dublin, D02, Ireland',
      },
      dataProtectionOfficer: {
        url: 'https://www.facebook.com/help/contact/1650115808681298',
      },
      dataPurposes: ['Analitik', 'Pazarlama', 'Yeniden hedefleme', 'Reklam', 'Donusum takibi', 'Kisisellestirme'],
      technologiesUsed: ['Cookies', 'Pixel'],
      dataCollected: [
        'Goruntulenen reklamlar',
        'Goruntulenen icerik',
        'Cihaz bilgileri',
        'Cografi konum',
        'HTTP-header',
        'Reklam etkilesimleri',
        'IP adresi',
        'Tiklanan ogeler',
        'Pazarlama bilgisi',
        'Ziyaret edilen sayfalar',
        'Pixel ID',
        'Referrer URL',
        'Kullanim verileri',
        'Kullanici davranisi',
        'Facebook cerez bilgileri',
        'Facebook kullanici ID',
      ],
      legalBasis: ['Art. 6 para. 1 s. 1 lit. a GDPR', 'KVKK Madde 5/1 (acik riza)'],
      locationOfProcessing: 'Avrupa Birligi',
      retentionPeriod: 'Etkilesim verileri 2 yil saklanir.',
      transferToThirdCountries: ['Singapur', 'Birlesik Krallik', 'Amerika Birlesik Devletleri'],
      dataRecipients: ['Meta Platforms Ireland Ltd.', 'Meta Platforms Inc.'],
      privacyPolicyUrl: 'https://www.facebook.com/privacy/explanation',
      cookiePolicyUrl: 'https://www.facebook.com/policies/cookies',
      storageInformation: {
        maxCookieAgeDays: 731,
      },
      storedInformation: [
        { identifier: '_fbp', type: 'cookie', duration: '90 gun', purpose: 'Facebook Pixel kullanici izleme' },
        { identifier: '_fbc', type: 'cookie', duration: '90 gun', purpose: 'Reklam tiklama izleme' },
        { identifier: 'fr', type: 'cookie', duration: '90 gun', purpose: 'Facebook reklam hedefleme' },
      ],
    },
    {
      id: 'google-tag-manager',
      name: 'Google Tag Manager',
      category: 'marketing',
      description: 'Etiket yonetim sistemi. Diger izleme araclarinin scriptlerini merkezi olarak yonetir.',
      processingCompany: {
        name: 'Google Ireland Limited',
        address: 'Gordon House, Barrow Street, Dublin 4, Ireland',
      },
      dataProtectionOfficer: {
        url: 'https://support.google.com/policies/contact/general_privacy_form',
      },
      dataPurposes: ['Etiket yonetimi', 'Pazarlama', 'Analitik'],
      technologiesUsed: ['Web site etiketleri'],
      dataCollected: ['Etiket calistirma verileri', 'Tani verileri'],
      legalBasis: ['Art. 6 para. 1 s. 1 lit. a GDPR'],
      locationOfProcessing: 'Avrupa Birligi',
      retentionPeriod: 'Veriler 14 gun icinde silinir.',
      transferToThirdCountries: ['Singapur', 'Tayvan', 'Sili', 'Amerika Birlesik Devletleri'],
      dataRecipients: ['Alphabet Inc.', 'Google LLC', 'Google Ireland Limited'],
      privacyPolicyUrl: 'https://business.safety.google/privacy/',
      cookiePolicyUrl: 'https://policies.google.com/technologies/cookies',
      subservices: [
        { id: 'google-ajax', name: 'Google AJAX' },
      ],
      storedInformation: [
        { identifier: '_gtm', type: 'cookie', duration: '1 saat', purpose: 'Etiket calistirma kontrolu' },
      ],
    },
  ],

  functional: [
    {
      id: 'theme-language-prefs',
      name: 'Tema ve Dil Tercihleri',
      category: 'functional',
      description: 'Kullanicinin tema (acik/koyu) ve dil tercihlerini hatirlar.',
      processingCompany: {
        name: 'Site sahibi',
      },
      dataPurposes: ['Kullanici tercihlerini hatirlama', 'Kisisellestirme'],
      technologiesUsed: ['Local storage', 'Cookie'],
      dataCollected: ['Tema secimi', 'Dil secimi', 'Font olcegi'],
      legalBasis: ['Art. 6 para. 1 s. 1 lit. a GDPR'],
      locationOfProcessing: 'Tarayicida (kullanici cihazi)',
      retentionPeriod: 'Kullanici silene kadar.',
      dataRecipients: ['Sadece kullanici tarayicisi'],
      storageInformation: {
        maxCookieAgeDays: 365,
        nonCookieStorage: true,
      },
      storedInformation: [
        { identifier: 'theme', type: 'localStorage', duration: 'Kalici', purpose: 'Acik/koyu tema secimi' },
        { identifier: 'lang', type: 'localStorage', duration: 'Kalici', purpose: 'Dil tercihi' },
        { identifier: 'a11y', type: 'cookie', duration: '365 gun', purpose: 'Erisilebilirlik tercihleri' },
      ],
    },
  ],
};
