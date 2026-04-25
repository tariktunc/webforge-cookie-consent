'use client';

import * as Switch from '@radix-ui/react-switch';
import { useState } from 'react';
import type { Service, Translation, Locale } from './types';
import translations from './translations.json';

type Props = {
  service: Service;
  locale: Locale;
  enabled: boolean;
  disabled?: boolean;
  onToggle: (id: string, value: boolean) => void;
  borderWidth: string;
  borderRadius: string;
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="py-2 border-b border-neutral-100 dark:border-neutral-900 last:border-0">
      <p className="text-[clamp(10px,1.6vw,11px)] font-semibold text-neutral-900 dark:text-neutral-100 uppercase tracking-wide">{label}</p>
      <div className="mt-1 text-[clamp(10px,1.8vw,12px)] text-neutral-600 dark:text-neutral-400 leading-snug">{children}</div>
    </div>
  );
}

function Tags({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {items.map((it) => (
        <span key={it} className="inline-block px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-[clamp(9px,1.5vw,11px)]">
          {it}
        </span>
      ))}
    </div>
  );
}

export function ServiceDetail({ service, locale, enabled, disabled, onToggle, borderWidth, borderRadius }: Props) {
  const [open, setOpen] = useState(false);
  const t = ((translations as Record<Locale, Translation>)[locale] ?? (translations as Record<string, Translation>).en).modal;
  const f = t.fields;

  return (
    <div
      style={{ borderWidth, borderRadius }}
      className="border-solid border-neutral-200 dark:border-neutral-800 overflow-hidden"
    >
      <div className="flex items-start justify-between gap-3 p-3">
        <div className="flex-1 min-w-0">
          <p className="text-[clamp(11px,2.2vw,14px)] font-semibold text-neutral-900 dark:text-neutral-100 leading-tight">{service.name}</p>
          <p className="mt-1 text-[clamp(10px,1.8vw,12px)] text-neutral-600 dark:text-neutral-400 leading-snug line-clamp-2">{service.description}</p>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            className="mt-2 text-[clamp(10px,1.6vw,11px)] font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline-offset-2 hover:underline"
          >
            {open ? t.hideDetails : t.showDetails}
          </button>
        </div>
        <Switch.Root
          checked={enabled}
          disabled={disabled}
          onCheckedChange={(v) => onToggle(service.id, v)}
          aria-label={service.name}
          className="relative h-5 w-9 shrink-0 rounded-full bg-neutral-300 transition data-[state=checked]:bg-neutral-900 disabled:opacity-50 dark:bg-neutral-700 dark:data-[state=checked]:bg-white"
        >
          <Switch.Thumb className="block h-4 w-4 translate-x-0.5 rounded-full bg-white shadow transition data-[state=checked]:translate-x-[18px] dark:bg-neutral-950 dark:data-[state=checked]:bg-neutral-900" />
        </Switch.Root>
      </div>

      {open && (
        <div className="border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-3 space-y-1">
          <Field label={f.processingCompany}>
            <p className="font-medium text-neutral-900 dark:text-neutral-100">{service.processingCompany.name}</p>
            {service.processingCompany.address && <p className="mt-0.5">{service.processingCompany.address}</p>}
          </Field>

          {service.dataProtectionOfficer && (
            <Field label={f.dpo}>
              {service.dataProtectionOfficer.email && (
                <a href={`mailto:${service.dataProtectionOfficer.email}`} className="text-blue-600 dark:text-blue-400 hover:underline break-all">
                  {service.dataProtectionOfficer.email}
                </a>
              )}
              {service.dataProtectionOfficer.url && (
                <a href={service.dataProtectionOfficer.url} target="_blank" rel="noopener noreferrer" className="block text-blue-600 dark:text-blue-400 hover:underline break-all">
                  {service.dataProtectionOfficer.url}
                </a>
              )}
            </Field>
          )}

          <Field label={f.dataPurposes}><Tags items={service.dataPurposes} /></Field>
          <Field label={f.technologiesUsed}><Tags items={service.technologiesUsed} /></Field>
          <Field label={f.dataCollected}><Tags items={service.dataCollected} /></Field>
          <Field label={f.legalBasis}>
            <ul className="list-disc list-inside space-y-0.5">
              {service.legalBasis.map((lb) => <li key={lb}>{lb}</li>)}
            </ul>
          </Field>
          <Field label={f.locationOfProcessing}>{service.locationOfProcessing}</Field>
          <Field label={f.retentionPeriod}>{service.retentionPeriod}</Field>

          {service.transferToThirdCountries && service.transferToThirdCountries.length > 0 && (
            <Field label={f.transferToThirdCountries}><Tags items={service.transferToThirdCountries} /></Field>
          )}

          <Field label={f.dataRecipients}>
            <ul className="list-disc list-inside space-y-0.5">
              {service.dataRecipients.map((r) => <li key={r}>{r}</li>)}
            </ul>
          </Field>

          {service.storageInformation && (
            <Field label={f.storageInformation}>
              {service.storageInformation.maxCookieAgeDays !== undefined && (
                <p>{f.maxCookieAge}: {service.storageInformation.maxCookieAgeDays} days</p>
              )}
              {service.storageInformation.nonCookieStorage !== undefined && (
                <p>{f.nonCookieStorage}: {service.storageInformation.nonCookieStorage ? f.yes : f.no}</p>
              )}
              {service.storageInformation.notes && <p>{service.storageInformation.notes}</p>}
            </Field>
          )}

          {service.privacyPolicyUrl && (
            <Field label={f.privacyPolicy}>
              <a href={service.privacyPolicyUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline break-all">
                {f.readPrivacyPolicy}
              </a>
            </Field>
          )}

          {service.cookiePolicyUrl && (
            <Field label={f.cookiePolicy}>
              <a href={service.cookiePolicyUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline break-all">
                {f.readCookiePolicy}
              </a>
            </Field>
          )}

          {service.storedInformation && service.storedInformation.length > 0 && (
            <Field label={f.storedInformation}>
              <div className="overflow-x-auto -mx-1">
                <table className="w-full text-[clamp(9px,1.5vw,11px)] mt-1">
                  <thead>
                    <tr className="border-b border-neutral-200 dark:border-neutral-800">
                      <th className="text-start font-semibold py-1 px-1">{f.identifier}</th>
                      <th className="text-start font-semibold py-1 px-1">{f.type}</th>
                      <th className="text-start font-semibold py-1 px-1">{f.duration}</th>
                      <th className="text-start font-semibold py-1 px-1">{f.purpose}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {service.storedInformation.map((entry, i) => (
                      <tr key={`${entry.identifier}-${i}`} className="border-b border-neutral-100 dark:border-neutral-900 last:border-0">
                        <td className="py-1 px-1 font-mono break-all">{entry.identifier}</td>
                        <td className="py-1 px-1">{entry.type}</td>
                        <td className="py-1 px-1">{entry.duration ?? '-'}</td>
                        <td className="py-1 px-1">{entry.purpose ?? '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Field>
          )}

          {service.subservices && service.subservices.length > 0 && (
            <Field label={`${f.subservices} (${service.subservices.length} ${f.subserviceCount})`}>
              <ul className="list-disc list-inside space-y-0.5">
                {service.subservices.map((s) => <li key={s.id}>{s.name}</li>)}
              </ul>
            </Field>
          )}
        </div>
      )}
    </div>
  );
}
