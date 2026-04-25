'use client';

import { useEffect, useState } from 'react';
import { acceptAll, rejectAll, hasConsent, CHANGE_EVENT } from './consent-store';
import { CookiePreferences } from './CookiePreferences';
import translations from './translations.json';
import type { Locale, Theme, Translation } from './types';

type Props = {
  locale?: Locale;
  theme?: Theme;
  font?: string;
};

const DEFAULT_FONT = "'Poppins', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

function useThemeClass(theme: Theme) {
  const [resolved, setResolved] = useState<'light' | 'dark'>('light');
  useEffect(() => {
    if (theme === 'light' || theme === 'dark') {
      setResolved(theme);
      return;
    }
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const update = () => setResolved(mql.matches ? 'dark' : 'light');
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, [theme]);
  return resolved;
}

export function CookieBanner({ locale = 'en', theme = 'auto', font = DEFAULT_FONT }: Props) {
  const [visible, setVisible] = useState(false);
  const [prefsOpen, setPrefsOpen] = useState(false);
  const t = (translations as Record<Locale, Translation>)[locale] ?? (translations as Record<string, Translation>).en;
  const isRtl = locale === 'ar' || locale === 'he';
  const resolvedTheme = useThemeClass(theme);
  const themeClass = resolvedTheme === 'dark' ? 'wf-cc dark' : 'wf-cc';

  useEffect(() => {
    setVisible(!hasConsent());
    const cb = () => setVisible(false);
    window.addEventListener(CHANGE_EVENT, cb);
    return () => window.removeEventListener(CHANGE_EVENT, cb);
  }, []);

  if (!visible && !prefsOpen) return null;

  return (
    <div className={themeClass} style={{ fontFamily: font }}>
      {visible && (
        <div
          role="region"
          aria-label="Cookie consent"
          dir={isRtl ? 'rtl' : 'ltr'}
          className="fixed inset-x-0 bottom-0 z-[9999] border-t border-neutral-200 bg-white/95 p-4 shadow-2xl backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/95"
        >
          <div className="mx-auto flex max-w-[1001px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1 text-sm text-neutral-700 dark:text-neutral-200">
              <p className="font-semibold">{t.banner.title}</p>
              <p className="mt-1 text-neutral-600 dark:text-neutral-400">{t.banner.description}</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => setPrefsOpen(true)}
                className="min-h-[44px] rounded-md border border-neutral-300 px-4 text-sm font-medium text-neutral-900 hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-900"
              >
                {t.banner.preferences}
              </button>
              <button
                type="button"
                onClick={() => rejectAll(locale)}
                className="min-h-[44px] rounded-md border border-neutral-300 bg-white px-4 text-sm font-semibold text-neutral-900 hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
              >
                {t.banner.reject}
              </button>
              <button
                type="button"
                onClick={() => acceptAll(locale)}
                className="min-h-[44px] rounded-md bg-neutral-900 px-4 text-sm font-semibold text-white hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
              >
                {t.banner.accept}
              </button>
            </div>
          </div>
        </div>
      )}
      <CookiePreferences
        locale={locale}
        theme={theme}
        font={font}
        open={prefsOpen}
        onOpenChange={setPrefsOpen}
      />
    </div>
  );
}
