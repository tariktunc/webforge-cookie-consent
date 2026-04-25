# Test Strategy

Bu paket bir **drop-in component library**. Test'ler tuketici proje icinde calisir.

## Onerilen Test Setup

Tuketici projeniz (Next.js + Playwright) icin:

```ts
// tests/cookie-consent.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('banner ilk ziyarette gorunur', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('region', { name: /cookie consent/i })).toBeVisible();
});

test('Reddet butonu banner'i kapatir', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /reddet/i }).click();
  await expect(page.getByRole('region', { name: /cookie consent/i })).not.toBeVisible();
  await page.reload();
  await expect(page.getByRole('region', { name: /cookie consent/i })).not.toBeVisible();
});

test('Modal acilir, 4 kategori gorunur', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /tercihleri yonet/i }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByText('Zorunlu')).toBeVisible();
  await expect(page.getByText('Analitik')).toBeVisible();
  await expect(page.getByText('Pazarlama')).toBeVisible();
  await expect(page.getByText('Islevsel')).toBeVisible();
});

test('A11y: 0 violation', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2aa', 'wcag22aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});

test('Consent kaydi localStorage + cookie', async ({ page, context }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /^kabul/i }).click();
  const ls = await page.evaluate(() => localStorage.getItem('wf_consent'));
  expect(ls).not.toBeNull();
  const cookies = await context.cookies();
  expect(cookies.find((c) => c.name === 'wf_consent')).toBeDefined();
});

test('GCM v2 update tetiklenir', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => { (window as any).dataLayer = []; });
  await page.getByRole('button', { name: /^kabul/i }).click();
  const dataLayer = await page.evaluate(() => (window as any).dataLayer);
  const consentUpdate = dataLayer.find((entry: any[]) => entry[0] === 'consent' && entry[1] === 'update');
  expect(consentUpdate).toBeDefined();
});
```

## Cover edilmesi onerilen senaryolar

- [x] Banner gorunurlugu
- [x] Reddet/Kabul/Tercihler butonlari
- [x] Modal 4 kategori + servisler
- [x] Toggle calisir
- [x] localStorage + cookie persistence
- [x] GCM v2 update
- [x] axe-core 0 violation
- [ ] RTL render (AR, HE)
- [ ] Re-open via openCookiePreferences()
- [ ] onConsentChange callback firing
- [ ] cookieDomain prop multi-subdomain
