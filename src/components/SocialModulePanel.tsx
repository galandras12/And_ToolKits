import React from 'react';
import { Share2 } from 'lucide-react';
import {
  SocialButtonStyle,
  SocialConfig,
  SocialPlatformId,
} from '../types/toolkit';
import { formatMetricValue } from '../utils/toolkitLogic';

interface SocialModulePanelProps {
  config: SocialConfig;
  onUpdateConfig: (patch: Partial<SocialConfig>) => void;
  onTogglePlatform: (id: SocialPlatformId) => void;
  onShareClick: (id: SocialPlatformId) => void;
}

const BUTTON_STYLES: Array<{
  id: SocialButtonStyle;
  label: string;
  desc: string;
}> = [
  { id: 'rounded', label: 'Kerekített (Rounded)', desc: 'Modern 6px lekerekített gombok' },
  { id: 'pill', label: 'Kapszula (Pill)', desc: 'Teljesen kerekített gombforma' },
  { id: 'square', label: 'Éles (Square)', desc: 'Minimalista derékszögű gombok' },
  { id: 'icon-only', label: 'Kompakt Csak Ikon', desc: '4 oszlopos helytakarékos ikonsáv' },
  { id: 'minimal-outline', label: 'Vékony Keretes', desc: 'Színsemleges keretes megjelenés' },
];

export const SocialModulePanel: React.FC<SocialModulePanelProps> = ({
  config,
  onUpdateConfig,
  onTogglePlatform,
  onShareClick,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            03. Platformfüggetlen Közösségi Megosztás Oldalsáv Widget
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Nulla külső követőkódot használó, villámgyors SVG közösségi megosztó gombok testreszabható elrendezéssel.
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
            Megosztó widget aktív
          </span>
        </label>
      </div>

      {/* Button Style Selector */}
      <div className="space-y-3">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Gomb Stílus és Geometria
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {BUTTON_STYLES.map((st) => {
            const active = config.buttonStyle === st.id;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => onUpdateConfig({ buttonStyle: st.id })}
                className={`p-3 rounded-lg border text-left transition-colors ${
                  active
                    ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-600 dark:border-blue-500'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  {st.label}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{st.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* General Settings */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
        <div>
          <label
            htmlFor="social-title"
            className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
          >
            Widget Címe
          </label>
          <input
            id="social-title"
            type="text"
            value={config.widgetTitle}
            onChange={(e) => onUpdateConfig({ widgetTitle: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-slate-100"
          />
        </div>

        <div>
          <label
            htmlFor="social-subtitle"
            className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
          >
            Alcím / Felhívás (CTA)
          </label>
          <input
            id="social-subtitle"
            type="text"
            value={config.subtitle}
            onChange={(e) => onUpdateConfig({ subtitle: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-slate-100"
          />
        </div>

        <div>
          <label
            htmlFor="social-columns"
            className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
          >
            Oszlopok Száma az Oldalsávban
          </label>
          <select
            id="social-columns"
            value={config.columns}
            onChange={(e) => onUpdateConfig({ columns: Number(e.target.value) as 1 | 2 | 4 })}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-slate-100"
          >
            <option value={1}>1 oszlop (Teljes szélességű gombok)</option>
            <option value={2}>2 oszlop (Kiegyensúlyozott rács)</option>
            <option value={4}>4 oszlop (Kompakt sáv)</option>
          </select>
        </div>

        <div className="sm:col-span-3 flex flex-wrap items-center gap-5 pt-1">
          <label className="inline-flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={config.useBrandColors}
              onChange={(e) => onUpdateConfig({ useBrandColors: e.target.checked })}
              className="rounded border-slate-300 text-blue-600"
            />
            <span>Hivatalos márkaszínek használata</span>
          </label>
          <label className="inline-flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={config.showShareCounts}
              onChange={(e) => onUpdateConfig({ showShareCounts: e.target.checked })}
              className="rounded border-slate-300 text-blue-600"
            />
            <span>Megosztásszám megjelenítése a gombokon</span>
          </label>
          <label className="inline-flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={config.showTotalShares}
              onChange={(e) => onUpdateConfig({ showTotalShares: e.target.checked })}
              className="rounded border-slate-300 text-blue-600"
            />
            <span>Összesített számláló a fejlécben</span>
          </label>
          <label className="inline-flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={config.includeCopyLink}
              onChange={(e) => onUpdateConfig({ includeCopyLink: e.target.checked })}
              className="rounded border-slate-300 text-blue-600"
            />
            <span>„Link másolása” gomb megjelenítése</span>
          </label>
          <label className="inline-flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={config.utmTracking}
              onChange={(e) => onUpdateConfig({ utmTracking: e.target.checked })}
              className="rounded border-slate-300 text-blue-600"
            />
            <span>Automatikus UTM paraméterek (?utm_source=webtoolkit)</span>
          </label>
        </div>
      </div>

      {/* Platforms Table */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-white dark:bg-slate-900">
        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Share2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Közösségi Platformok Engedélyezése és Mérőszámok</span>
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-50/70 dark:bg-slate-950/50">
                <th className="py-2.5 px-4">Állapot</th>
                <th className="py-2.5 px-3">Platform neve</th>
                <th className="py-2.5 px-3">Márkaszín (HEX)</th>
                <th className="py-2.5 px-3 text-right">Eddigi megosztások</th>
                <th className="py-2.5 px-4 text-right">Teszt megosztás</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {config.platforms.map((platform) => (
                <tr
                  key={platform.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-2.5 px-4">
                    <input
                      type="checkbox"
                      aria-label={`${platform.name} engedélyezése`}
                      checked={platform.enabled}
                      onChange={() => onTogglePlatform(platform.id)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer"
                    />
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">
                    {platform.name}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-500 dark:text-slate-400">
                    <span className="inline-flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-xs shrink-0"
                        style={{ backgroundColor: platform.brandHex }}
                      />
                      <span>{platform.brandHex}</span>
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono font-semibold tabular-nums text-right text-slate-800 dark:text-slate-200">
                    {formatMetricValue(platform.shareCount, 'exact')}
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => onShareClick(platform.id)}
                      className="px-2.5 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded hover:bg-blue-600 hover:text-white transition-colors whitespace-nowrap"
                    >
                      +1 Megosztás teszt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
