export type ConsentCategory = 'essential' | 'analytics' | 'marketing' | 'functional';

export type ConsentState = {
  essential: true;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
};

export type ConsentRecord = {
  state: ConsentState;
  version: string;
  timestamp: string;
  locale: string;
  userAgent: string;
};

export type Locale =
  | 'tr' | 'en' | 'de' | 'fr' | 'es' | 'it' | 'ar' | 'he' | 'ru';

export type Theme = 'light' | 'dark' | 'auto';

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
    categories: Record<ConsentCategory, { title: string; description: string }>;
  };
};
