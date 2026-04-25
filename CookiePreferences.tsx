'use client';

import * as Dialog from '@radix-ui/react-dialog';
import * as Switch from '@radix-ui/react-switch';
import { useEffect, useState } from 'react';
import {
  acceptAll,
  rejectAll,
  savePreferences,
  getConsent,
  getServiceConsent,
  useOpenPreferencesEvent,
} from './consent-store';
import { ServiceDetail } from './ServiceDetail';
import { BlakfyBadge } from './BlakfyBadge';
import translations from './translations.json';
import type {
  ConsentState,
  Locale,
  Theme,
  Translation,
  ConsentCategory,
  ServicesByCategory,
  ServiceConsentState,
} from './types';

type Props = {
  locale?: Locale;
  theme?: Theme;
  font?: string;
  borderWidth?: string;
  borderRadius?: string;
  blakfyBadgeUrl?: string;
  services?: ServicesByCategory;
  open: boolean;
  onOpenChange: (v: boolean) => void;
};

const CATEGORIES: ConsentCategory[] = ['essential', 'analytics', 'marketing', 'functional'];

function collectServiceIds(services: ServicesByCategory, filter?: (cat: ConsentCategory) => boolean): string[] {
  return CATEGORIES
    .filter((c) => !filter || filter(c))
    .flatMap((c) => services[c]?.map((s) => s.id) ?? []);
}

export function CookiePreferences({
  locale = 'en',
  theme = 'auto',
  font,
  borderWidth = '3px',
  borderRadius = '0.5rem',
  blakfyBadgeUrl,
  services = {},
  open,
  onOpenChange,
}: Props) {
  const t = (translations as Record<Locale, Translation>)[locale] ?? (translations as Record<string, Translation>).en;
  const isRtl = locale === 'ar' || locale === 'he';
  const [state, setState] = useState<ConsentState>(() => getConsent());
  const [serviceState, setServiceState] = useState<ServiceConsentState>(() => getServiceConsent());
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    if (theme === 'light' || theme === 'dark') { setResolvedTheme(theme); return; }
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const update = () => setResolvedTheme(mql.matches ? 'dark' : 'light');
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, [theme]);

  useEffect(() => {
    if (open) {
      setState(getConsent());
      setServiceState(getServiceConsent());
    }
  }, [open]);

  useOpenPreferencesEvent(() => onOpenChange(true));

  const toggleCategory = (cat: ConsentCategory, value: boolean) => {
    if (cat === 'essential') return;
    setState((s) => ({ ...s, [cat]: value }));
    const ids = services[cat]?.filter((sv) => !sv.required).map((sv) => sv.id) ?? [];
    setServiceState((ss) => {
      const next = { ...ss };
      ids.forEach((id) => { next[id] = value; });
      return next;
    });
  };

  const toggleService = (id: string, value: boolean) => {
    setServiceState((ss) => ({ ...ss, [id]: value }));
  };

  const onAcceptAll = () => {
    const allIds = collectServiceIds(services);
    acceptAll(locale, allIds);
    onOpenChange(false);
  };

  const onRejectAll = () => {
    const requiredIds = collectServiceIds(services, () => true)
      .filter((id) => CATEGORIES.some((c) => services[c]?.some((s) => s.id === id && (s.required || c === 'essential'))));
    rejectAll(locale, requiredIds);
    onOpenChange(false);
  };

  const onSave = () => {
    savePreferences(state, serviceState, locale);
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={`${resolvedTheme === 'dark' ? 'dark' : ''} fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0`} />
        <Dialog.Content
          dir={isRtl ? 'rtl' : 'ltr'}
          style={font ? { fontFamily: font } : undefined}
          className={`${resolvedTheme === 'dark' ? 'dark' : ''} fixed left-1/2 top-1/2 z-[10000] w-[min(640px,calc(100%-1rem))] max-h-[90vh] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg bg-white p-4 sm:p-6 shadow-xl focus:outline-none dark:bg-neutral-950 data-[state=open]:animate-in data-[state=closed]:animate-out`}
        >
          <Dialog.Title className="text-[clamp(14px,3vw,18px)] font-semibold text-neutral-900 dark:text-neutral-100 leading-tight">
            {t.modal.title}
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-[clamp(11px,2vw,14px)] text-neutral-600 dark:text-neutral-400 leading-snug">
            {t.modal.description}
          </Dialog.Description>

          <div className="mt-6 space-y-5">
            {CATEGORIES.map((cat) => {
              const meta = t.modal.categories[cat];
              const list = services[cat] ?? [];
              const checked = state[cat];
              const disabled = cat === 'essential';
              const count = list.length;
              const hasServices = Object.values(services).some((arr) => arr && arr.length > 0);
              if (!hasServices && cat !== 'essential' && count === 0) return null;
              return (
                <div key={cat} className="space-y-2">
                  <div
                    style={{ borderWidth, borderRadius }}
                    className="flex items-start justify-between gap-3 sm:gap-4 border-solid border-neutral-200 dark:border-neutral-800 p-3 sm:p-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-[clamp(11px,2.2vw,14px)] font-semibold text-neutral-900 dark:text-neutral-100 leading-tight">{meta.title}</p>
                        {count > 0 && (
                          <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-neutral-900 text-white text-[clamp(9px,1.5vw,11px)] font-semibold dark:bg-white dark:text-neutral-900">
                            {count}
                          </span>
                        )}
                        {(() => {
                          const subCount = list.reduce((acc, s) => acc + (s.subservices?.length ?? 0), 0);
                          return subCount > 0 ? (
                            <span className="inline-flex items-center px-1.5 h-5 rounded-full bg-blue-100 text-blue-900 text-[clamp(9px,1.5vw,11px)] font-medium dark:bg-blue-900/40 dark:text-blue-200">
                              +{subCount} {t.modal.fields.subserviceCount}
                            </span>
                          ) : null;
                        })()}
                      </div>
                      <p className="mt-1 text-[clamp(10px,1.8vw,12px)] text-neutral-600 dark:text-neutral-400 leading-snug">{meta.description}</p>
                    </div>
                    <Switch.Root
                      checked={checked}
                      disabled={disabled}
                      onCheckedChange={(v) => toggleCategory(cat, v)}
                      aria-label={meta.title}
                      className="relative h-6 w-11 shrink-0 rounded-full bg-neutral-300 transition data-[state=checked]:bg-neutral-900 disabled:opacity-50 dark:bg-neutral-700 dark:data-[state=checked]:bg-white"
                    >
                      <Switch.Thumb className="block h-5 w-5 translate-x-0.5 rounded-full bg-white shadow transition data-[state=checked]:translate-x-[22px] dark:bg-neutral-950 dark:data-[state=checked]:bg-neutral-900" />
                    </Switch.Root>
                  </div>

                  {list.length > 0 && (
                    <div className="ms-2 sm:ms-4 space-y-2">
                      {list.map((service) => (
                        <ServiceDetail
                          key={service.id}
                          service={service}
                          locale={locale}
                          enabled={service.required ? true : (serviceState[service.id] ?? checked)}
                          disabled={service.required || disabled}
                          onToggle={toggleService}
                          borderWidth={borderWidth}
                          borderRadius={borderRadius}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onRejectAll}
              style={{ borderWidth, borderRadius }}
              className="min-h-[44px] border-solid border-neutral-300 px-3 sm:px-4 text-[clamp(11px,2.2vw,14px)] font-medium text-neutral-900 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-900 whitespace-nowrap"
            >
              {t.modal.rejectAll}
            </button>
            <button
              type="button"
              onClick={onSave}
              style={{ borderWidth, borderRadius }}
              className="min-h-[44px] border-solid border-neutral-300 px-3 sm:px-4 text-[clamp(11px,2.2vw,14px)] font-medium text-neutral-900 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-900 whitespace-nowrap"
            >
              {t.modal.save}
            </button>
            <button
              type="button"
              onClick={onAcceptAll}
              style={{ borderRadius }}
              className="min-h-[44px] bg-neutral-900 px-3 sm:px-4 text-[clamp(11px,2.2vw,14px)] font-semibold text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 whitespace-nowrap"
            >
              {t.modal.acceptAll}
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <p className="text-[clamp(11px,2vw,13px)] font-semibold text-neutral-900 dark:text-neutral-100">{t.modal.fields.about}</p>
            <p className="mt-1 text-[clamp(10px,1.8vw,12px)] text-neutral-600 dark:text-neutral-400 leading-snug">{t.modal.fields.aboutDescription}</p>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800 flex justify-center">
            <BlakfyBadge url={blakfyBadgeUrl} />
          </div>

          <Dialog.Close
            aria-label={t.modal.close}
            className="absolute right-4 top-4 rounded p-1 text-neutral-500 hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:hover:bg-neutral-800 rtl:left-4 rtl:right-auto"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 5l10 10M15 5L5 15"/></svg>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
