import React from 'react';
import { Check, Lock, ShieldCheck } from 'lucide-react';
import {
  GdprCategoryId,
  GdprConfig,
  GdprDisplayStyle,
} from '../types/toolkit';
import { formatMetricValue } from '../utils/toolkitLogic';

interface GdprCookieModulePanelProps {
  config: GdprConfig;
  onUpdateConfig: (patch: Partial<GdprConfig>) => void;
  onToggleCategoryDefault: (id: GdprCategoryId) => void;
  onRecordConsent: (type: 'all' | 'custom' | 'essential') => void;
}

const DISPLAY_STYLES: Array<{
  id: GdprDisplayStyle;
  label: string;
  desc: string;
}> = [
  {
    id: 'sidebar-widget',
    label: 'Oldalsáv GDPR Widget',
    desc: 'Beágyazott süti- és adatvédelmi vezérlő közvetlenül a WordPress oldalsávban',
  },
  {
    id: 'bottom-bar',
    label: 'Alsó Teljes Szélességű Sáv',
    desc: 'Klasszikus rögzített alsó GDPR tájékoztató sáv gyors elfogadó gombokkal',
  },
  {
    id: 'floating-card',
    label: 'Lebegő Sarokkártya',
    desc: 'Kompakt adatvédelmi kártya a képernyő sarkában vagy oldalsáv alján',
  },
  {
    id: 'modal-center',
    label: 'Középső Fókusz Ablak',
    desc: 'Kiemelt hozzájárulási ablak részletes kategória-kapcsolókkal',
  },
];

export const GdprCookieModulePanel: React.FC<GdprCookieModulePanelProps> = ({
  config,
  onUpdateConfig,
  onToggleCategoryDefault,
  onRecordConsent,
}) => {
  const totalConsents =
    config.consentStats.acceptedAll +
    config.consentStats.customSelection +
    config.consentStats.essentialOnly;

  const acceptAllPct =
    totalConsents > 0
      ? ((config.consentStats.acceptedAll / totalConsents) * 100).toFixed(1)
      : '0.0';
  const customPct =
    totalConsents > 0
      ? ((config.consentStats.customSelection / totalConsents) * 100).toFixed(1)
      : '0.0';
  const essentialPct =
    totalConsents > 0
      ? ((config.consentStats.essentialOnly / totalConsents) * 100).toFixed(1)
      : '0.0';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            05. GDPR Kötelező Süti (Cookie) és Adatvédelmi Hozzájárulás Kezelő
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            EU GDPR és ePrivacy irányelveknek megfelelő süti-hozzájárulási felület Google Consent Mode v2 támogatással és visszavonható engedélyekkel.
          </p>
        </div>

        <label className="inline-flex items-center gap-2.5 cursor-pointer select-none shrink-0">
          <input
            type="checkbox"
            checked={config.enabled}
            onChange={(e) => onUpdateConfig({ enabled: e.target.checked })}
            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
            GDPR Cookie modul aktív
          </span>
        </label>
      </div>

      {/* Display Style Selector */}
      <div className="space-y-3">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Megjelenítési Elrendezés és Pozíció
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DISPLAY_STYLES.map((st) => {
            const active = config.displayStyle === st.id;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => onUpdateConfig({ displayStyle: st.id })}
                className={`p-3.5 rounded-lg border text-left transition-colors ${
                  active
                    ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-600 dark:border-blue-500'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {st.label}
                  </span>
                  <span className="text-xs font-mono text-blue-600 dark:text-blue-400">
                    {active ? 'Kiválasztva' : 'Választás'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{st.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Text, URLs & Button Labels Customizer */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
        <div className="sm:col-span-2">
          <label
            htmlFor="gdpr-widget-title"
            className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
          >
            Sütikezelő Fejléc Címe
          </label>
          <input
            id="gdpr-widget-title"
            type="text"
            value={config.widgetTitle}
            onChange={(e) => onUpdateConfig({ widgetTitle: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-slate-100"
          />
        </div>

        <div>
          <label
            htmlFor="gdpr-expiry-days"
            className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
          >
            Hozzájárulás Tárolása (Napok)
          </label>
          <input
            id="gdpr-expiry-days"
            type="number"
            min={30}
            max={365}
            value={config.consentExpiryDays}
            onChange={(e) =>
              onUpdateConfig({ consentExpiryDays: Math.max(30, Number(e.target.value) || 180) })
            }
            className="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-slate-100"
          />
        </div>

        <div className="sm:col-span-3">
          <label
            htmlFor="gdpr-description"
            className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
          >
            GDPR Tájékoztató Szöveg
          </label>
          <textarea
            id="gdpr-description"
            rows={2}
            value={config.description}
            onChange={(e) => onUpdateConfig({ description: e.target.value })}
            className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-slate-100 leading-relaxed"
          />
        </div>

        <div>
          <label
            htmlFor="gdpr-accept-label"
            className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
          >
            „Összes elfogadása” Gomb Felirata
          </label>
          <input
            id="gdpr-accept-label"
            type="text"
            value={config.acceptAllLabel}
            onChange={(e) => onUpdateConfig({ acceptAllLabel: e.target.value })}
            className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-slate-100"
          />
        </div>

        <div>
          <label
            htmlFor="gdpr-reject-label"
            className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
          >
            „Elutasítás / Csak szükséges” Felirat
          </label>
          <input
            id="gdpr-reject-label"
            type="text"
            value={config.rejectLabel}
            onChange={(e) => onUpdateConfig({ rejectLabel: e.target.value })}
            className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-slate-100"
          />
        </div>

        <div>
          <label
            htmlFor="gdpr-privacy-url"
            className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
          >
            Adatvédelmi Tájékoztató URL
          </label>
          <input
            id="gdpr-privacy-url"
            type="text"
            value={config.privacyPolicyUrl}
            onChange={(e) => onUpdateConfig({ privacyPolicyUrl: e.target.value })}
            className="w-full px-3 py-1.5 text-xs font-mono bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-slate-100"
          />
        </div>

        {/* Technical GDPR Toggles */}
        <div className="sm:col-span-3 flex flex-wrap items-center gap-5 pt-2">
          <label className="inline-flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={config.googleConsentModeV2}
              onChange={(e) => onUpdateConfig({ googleConsentModeV2: e.target.checked })}
              className="rounded border-slate-300 text-blue-600"
            />
            <span>Google Consent Mode v2 jelzések küldése</span>
          </label>
          <label className="inline-flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={config.autoBlockScripts}
              onChange={(e) => onUpdateConfig({ autoBlockScripts: e.target.checked })}
              className="rounded border-slate-300 text-blue-600"
            />
            <span>Nem szükséges szkriptek előzetes blokkolása hozzájárulásig</span>
          </label>
          <label className="inline-flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={config.showCategoryDetails}
              onChange={(e) => onUpdateConfig({ showCategoryDetails: e.target.checked })}
              className="rounded border-slate-300 text-blue-600"
            />
            <span>Részletes kategória-kapcsolók megjelenítése</span>
          </label>
          <label className="inline-flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={config.showReopenBadge}
              onChange={(e) => onUpdateConfig({ showReopenBadge: e.target.checked })}
              className="rounded border-slate-300 text-blue-600"
            />
            <span>Módosítás / Hozzájárulás visszavonása gomb megjelenítése</span>
          </label>
        </div>
      </div>

      {/* 4 GDPR Cookie Categories Table */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-white dark:bg-slate-900">
        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>GDPR Süti Kategóriák és Alapértelmezett Állapotok</span>
          </h3>
          <span className="text-xs text-slate-500 font-mono">EU 2016/679 (GDPR)</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 text-[11px] font-semibold text-slate-500">
                <th className="py-2.5 px-4">Kategória és Leírás</th>
                <th className="py-2.5 px-3">Kezelt Sütik (Cookies)</th>
                <th className="py-2.5 px-3">Típus</th>
                <th className="py-2.5 px-4 text-right">Alapértelmezett</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {config.categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">
                      {cat.name}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {cat.description}
                    </p>
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                    {cat.cookiesUsed}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    {cat.required ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                        <Lock className="w-3 h-3" />
                        <span>Kötelező</span>
                      </span>
                    ) : (
                      <span className="text-slate-500 dark:text-slate-400">Opcionális (Opt-in)</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <input
                      type="checkbox"
                      aria-label={`Alapértelmezett állapot: ${cat.name}`}
                      checked={cat.required ? true : cat.defaultEnabled}
                      disabled={cat.required}
                      onChange={() => onToggleCategoryDefault(cat.id)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 disabled:opacity-50 cursor-pointer"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Consent Audit Statistics */}
      <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Naplózott Látogatói Hozzájárulások Aránya ({formatMetricValue(totalConsents, 'exact')} döntés)
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onRecordConsent('all')}
              className="px-2.5 py-1 text-xs font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded hover:bg-emerald-100 transition-colors"
            >
              +1 Összes elfogadása teszt
            </button>
            <button
              type="button"
              onClick={() => onRecordConsent('essential')}
              className="px-2.5 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-200 transition-colors"
            >
              +1 Csak szükséges teszt
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800">
            <div className="text-xs text-slate-500">Összes süti elfogadva</div>
            <div className="text-lg font-mono font-bold tabular-nums text-emerald-600 dark:text-emerald-400 mt-0.5">
              {formatMetricValue(config.consentStats.acceptedAll, 'exact')} ({acceptAllPct}%)
            </div>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800">
            <div className="text-xs text-slate-500">Egyéni kategória választás</div>
            <div className="text-lg font-mono font-bold tabular-nums text-blue-600 dark:text-blue-400 mt-0.5">
              {formatMetricValue(config.consentStats.customSelection, 'exact')} ({customPct}%)
            </div>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800">
            <div className="text-xs text-slate-500">Csak a szükséges sütik</div>
            <div className="text-lg font-mono font-bold tabular-nums text-slate-700 dark:text-slate-300 mt-0.5">
              {formatMetricValue(config.consentStats.essentialOnly, 'exact')} ({essentialPct}%)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
