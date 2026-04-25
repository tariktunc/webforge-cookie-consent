export type ConsentCategory = 'essential' | 'analytics' | 'marketing' | 'functional';

export type ConsentState = {
  essential: true;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
};

export type ServiceConsentState = Record<string, boolean>;

export type ConsentRecord = {
  state: ConsentState;
  services: ServiceConsentState;
  version: string;
  timestamp: string;
  locale: string;
  userAgent: string;
};

export type Locale =
  | 'tr' | 'en' | 'de' | 'fr' | 'es' | 'it' | 'ar' | 'he' | 'ru';

export type Theme = 'light' | 'dark' | 'auto';

export type SubService = {
  id: string;
  name: string;
  description?: string;
};

export type ConsentChangeHandler = (record: ConsentRecord) => void;

export type StorageType = 'cookie' | 'localStorage' | 'sessionStorage' | 'indexedDB' | 'pixel';

export type StorageEntry = {
  identifier: string;
  type: StorageType;
  duration?: string;
  purpose?: string;
};

export type Service = {
  id: string;
  name: string;
  category: ConsentCategory;
  required?: boolean;

  description: string;

  processingCompany: {
    name: string;
    address?: string;
  };

  dataProtectionOfficer?: {
    email?: string;
    url?: string;
  };

  dataPurposes: string[];
  technologiesUsed: string[];
  dataCollected: string[];

  legalBasis: string[];

  locationOfProcessing: string;

  retentionPeriod: string;

  transferToThirdCountries?: string[];

  dataRecipients: string[];

  privacyPolicyUrl?: string;
  cookiePolicyUrl?: string;

  storageInformation?: {
    maxCookieAgeDays?: number;
    nonCookieStorage?: boolean;
    notes?: string;
  };

  storedInformation?: StorageEntry[];

  subservices?: SubService[];
};

export type ServicesByCategory = {
  essential?: Service[];
  analytics?: Service[];
  marketing?: Service[];
  functional?: Service[];
};

export type Translation = {
  banner: {
    title: string;
    description: string;
    accept: string;
    reject: string;
    preferences: string;
  };
  modal: {
    title: string;
    description: string;
    save: string;
    acceptAll: string;
    rejectAll: string;
    close: string;
    serviceCount: string;
    showDetails: string;
    hideDetails: string;
    categories: Record<ConsentCategory, { title: string; description: string }>;
    fields: {
      description: string;
      processingCompany: string;
      dpo: string;
      dataPurposes: string;
      technologiesUsed: string;
      dataCollected: string;
      legalBasis: string;
      locationOfProcessing: string;
      retentionPeriod: string;
      transferToThirdCountries: string;
      dataRecipients: string;
      privacyPolicy: string;
      cookiePolicy: string;
      storageInformation: string;
      storedInformation: string;
      subservices: string;
      subserviceCount: string;
      maxCookieAge: string;
      nonCookieStorage: string;
      identifier: string;
      type: string;
      duration: string;
      purpose: string;
      yes: string;
      no: string;
      readPrivacyPolicy: string;
      readCookiePolicy: string;
      about: string;
      aboutDescription: string;
    };
  };
};
