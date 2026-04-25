'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import type { ConsentState, ConsentRecord, ServiceConsentState } from './types';

const VERSION = '2.0.0';
const STORAGE_KEY = 'wf_consent';
const COOKIE_KEY = 'wf_consent';
const COOKIE_DAYS = 365;
const OPEN_EVENT = 'wf:consent:open';
const CHANGE_EVENT = 'wf:consent:change';

const DEFAULT_STATE: ConsentState = {
  essential: true,
  analytics: false,
  marketing: false,
  functional: false,
};

let _cookieDomain: string | undefined = undefined;

export function setCookieDomain(domain: string | undefined) {
  _cookieDomain = domain;
}

function setCookie(name: string, value: string, days: number) {
  const d = new Date();
  d.setTime(d.getTime() + days * 864e5);
  const domainPart = _cookieDomain ? `;domain=${_cookieDomain}` : '';
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${d.toUTCString()};path=/${domainPart};SameSite=Lax`;
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

function readConsent(): ConsentRecord | null {
  if (typeof window === 'undefined') return null;
  const fromLs = window.localStorage.getItem(STORAGE_KEY);
  if (fromLs) {
    try { return JSON.parse(fromLs); } catch { /* fall through */ }
  }
  const fromCookie = getCookie(COOKIE_KEY);
  if (fromCookie) {
    try { return JSON.parse(fromCookie); } catch { /* fall through */ }
  }
  return null;
}

function writeConsent(state: ConsentState, services: ServiceConsentState, locale: string): ConsentRecord {
  const record: ConsentRecord = {
    state: { ...state, essential: true },
    services,
    version: VERSION,
    timestamp: new Date().toISOString(),
    locale,
    userAgent: navigator.userAgent,
  };
  const json = JSON.stringify(record);
  window.localStorage.setItem(STORAGE_KEY, json);
  setCookie(COOKIE_KEY, json, COOKIE_DAYS);
  pushToGCM(record.state);
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: record }));
  return record;
}

function pushToGCM(state: ConsentState) {
  if (typeof window === 'undefined') return;
  const w = window as unknown as { dataLayer?: unknown[]; gtag?: (...a: unknown[]) => void };
  w.dataLayer = w.dataLayer || [];
  const gtag = w.gtag || ((...args: unknown[]) => { w.dataLayer!.push(args); });
  gtag('consent', 'update', {
    ad_storage: state.marketing ? 'granted' : 'denied',
    ad_user_data: state.marketing ? 'granted' : 'denied',
    ad_personalization: state.marketing ? 'granted' : 'denied',
    analytics_storage: state.analytics ? 'granted' : 'denied',
    functionality_storage: state.functional ? 'granted' : 'denied',
    personalization_storage: state.functional ? 'granted' : 'denied',
    security_storage: 'granted',
  });
}

export function acceptAll(locale = 'en', allServiceIds: string[] = []): ConsentRecord {
  const services: ServiceConsentState = Object.fromEntries(allServiceIds.map((id) => [id, true]));
  return writeConsent({ essential: true, analytics: true, marketing: true, functional: true }, services, locale);
}

export function rejectAll(locale = 'en', requiredServiceIds: string[] = []): ConsentRecord {
  const services: ServiceConsentState = Object.fromEntries(requiredServiceIds.map((id) => [id, true]));
  return writeConsent({ ...DEFAULT_STATE }, services, locale);
}

export function savePreferences(
  state: Partial<ConsentState>,
  services: ServiceConsentState,
  locale = 'en',
): ConsentRecord {
  return writeConsent({ ...DEFAULT_STATE, ...state, essential: true }, services, locale);
}

export function hasConsent(): boolean {
  return readConsent() !== null;
}

export function getConsent(): ConsentState {
  return readConsent()?.state ?? DEFAULT_STATE;
}

export function getServiceConsent(): ServiceConsentState {
  return readConsent()?.services ?? {};
}

export function openCookiePreferences() {
  window.dispatchEvent(new CustomEvent(OPEN_EVENT));
}

function subscribe(cb: () => void) {
  window.addEventListener(CHANGE_EVENT, cb);
  return () => window.removeEventListener(CHANGE_EVENT, cb);
}

function snapshot(): string { return JSON.stringify(getConsent()); }
function serverSnapshot(): string { return JSON.stringify(DEFAULT_STATE); }

export function useConsent(): ConsentState {
  const json = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  return JSON.parse(json) as ConsentState;
}

export function useConsentDecided(): boolean {
  const [decided, setDecided] = useState(false);
  useEffect(() => {
    setDecided(hasConsent());
    const cb = () => setDecided(true);
    window.addEventListener(CHANGE_EVENT, cb);
    return () => window.removeEventListener(CHANGE_EVENT, cb);
  }, []);
  return decided;
}

export function useOpenPreferencesEvent(handler: () => void) {
  useEffect(() => {
    window.addEventListener(OPEN_EVENT, handler);
    return () => window.removeEventListener(OPEN_EVENT, handler);
  }, [handler]);
}

export const CONSENT_VERSION = VERSION;
export { CHANGE_EVENT, OPEN_EVENT };
