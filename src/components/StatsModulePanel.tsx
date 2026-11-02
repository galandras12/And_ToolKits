import React from 'react';
import { BarChart3, Download, Plus, Users } from 'lucide-react';
import {
  NumberFormatStyle,
  StatsConfig,
  StatsWidgetStyle,
} from '../types/toolkit';
import { formatMetricValue } from '../utils/toolkitLogic';

interface StatsModulePanelProps {
  config: StatsConfig;
  onUpdateConfig: (patch: Partial<StatsConfig>) => void;
  onSimulateTraffic: (visitorsDelta: number, downloadsDelta: number) => void;
}

const STATS_STYLES: Array<{
  id: StatsWidgetStyle;
  label: string;
  desc: string;
}> = [
  {
    id: 'grid-cards',
    label: '2×2 Kártya Rács',
    desc: 'Átlátható mérőszám kártyák ikonokkal és százalékos növekedéssel',
  },
  {
    id: 'featured-hero',
    label: 'Kiemelt Főszámláló + Rács',
    desc: 'Hangsúlyos egyedi látogató számláló a másodlagos mutatók felett',
  },
  {
    id: 'clean-list',
    label: 'Minimalista Soros Lista',
    desc: 'Letisztult táblázatos sorok keskeny blog oldalsávokhoz',
  },
  {
    id: 'horizontal-strip',
    label: 'Kompakt Horizontális Sáv',
    desc: '4 oszlopos mini statisztikai sáv láblécbe vagy oldalsáv tetejére',
  },
];

export const StatsModulePanel: React.FC<StatsModulePanelProps> = ({
  config,
  onUpdateConfig,
  onSimulateTraffic,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            04. Hatékonyságmérő Statisztika Modul és Oldalsáv Számláló
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Kövesse nyomon az egyedi látogatók, fájlletöltések és megosztások számát, és jelenítse meg őket formázva az oldalsávban.
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
            Statisztika widget aktív
          </span>
        </label>
      </div>

      {/* Top KPI Summary Strip + Live Traffic Simulator Buttons */}
      <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            <span>Valós Idejű Hatékonysági Mutatók (30 Napos Összesítés)</span>
          </h3>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onSimulateTraffic(150, 0)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-md hover:bg-blue-100 transition-colors whitespace-nowrap shrink-0"
            >
              <Users className="w-3.5 h-3.5" />
              <span>+150 Egyedi látogató tesztelése</span>
            </button>
            <button
              type="button"
              onClick={() => onSimulateTraffic(0, 45)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-md hover:bg-emerald-100 transition-colors whitespace-nowrap shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>+45 Letöltés szimulálása</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800">
            <div className="text-xs text-slate-500 dark:text-slate-400">Egyedi látogatók</div>
            <div className="text-xl font-mono font-bold tabular-nums text-slate-900 dark:text-slate-100 mt-0.5">
              {formatMetricValue(config.totals.uniqueVisitors, config.numberFormat)}
            </div>
            <div className="text-[11px] font-mono tabular-nums text-emerald-600 dark:text-emerald-400 mt-0.5">
              +14.8% az előző hónaphoz
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800">
            <div className="text-xs text-slate-500 dark:text-slate-400">Összes letöltés</div>
            <div className="text-xl font-mono font-bold tabular-nums text-slate-900 dark:text-slate-100 mt-0.5">
              {formatMetricValue(config.totals.totalDownloads, config.numberFormat)}
            </div>
            <div className="text-[11px] font-mono tabular-nums text-emerald-600 dark:text-emerald-400 mt-0.5">
              +22.4% konverzió
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800">
            <div className="text-xs text-slate-500 dark:text-slate-400">Megosztási interakciók</div>
            <div className="text-xl font-mono font-bold tabular-nums text-slate-900 dark:text-slate-100 mt-0.5">
              {formatMetricValue(config.totals.shareConversions, config.numberFormat)}
            </div>
            <div className="text-[11px] font-mono tabular-nums text-blue-600 dark:text-blue-400 mt-0.5">
              8 közösségi csatornán
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800">
            <div className="text-xs text-slate-500 dark:text-slate-400">Keresési találati arány</div>
            <div className="text-xl font-mono font-bold tabular-nums text-slate-900 dark:text-slate-100 mt-0.5">
              {config.totals.searchSuccessRate}%
            </div>
            <div className="text-[11px] font-mono tabular-nums text-slate-500 mt-0.5">
              Átlagos válaszidő: 18ms
            </div>
          </div>
        </div>

        {/* 7-Day Daily Breakdown Table */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
                <th className="py-2 px-3">Nap / Dátum</th>
                <th className="py-2 px-3 text-right">Egyedi látogatók</th>
                <th className="py-2 px-3 text-right">Oldalmegtekintések</th>
                <th className="py-2 px-3 text-right">Letöltések</th>
                <th className="py-2 px-3 text-right">Megosztások</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70 font-mono tabular-nums">
              {config.history.map((day) => (
                <tr key={day.date} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-2 px-3 font-sans font-medium text-slate-800 dark:text-slate-200">
                    {day.label} ({day.date})
                  </td>
                  <td className="py-2 px-3 text-right text-slate-900 dark:text-slate-100 font-semibold">
                    {formatMetricValue(day.uniqueVisitors, config.numberFormat)}
                  </td>
                  <td className="py-2 px-3 text-right text-slate-600 dark:text-slate-400">
                    {formatMetricValue(day.pageViews, config.numberFormat)}
                  </td>
                  <td className="py-2 px-3 text-right text-emerald-600 dark:text-emerald-400 font-medium">
                    {formatMetricValue(day.downloads, config.numberFormat)}
                  </td>
                  <td className="py-2 px-3 text-right text-blue-600 dark:text-blue-400">
                    {formatMetricValue(day.shares, config.numberFormat)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sidebar Widget Visual Style Selector */}
      <div className="space-y-3">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Oldalsáv Statisztika Widget Megjelenési Formátuma
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {STATS_STYLES.map((st) => {
            const active = config.style === st.id;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => onUpdateConfig({ style: st.id })}
                className={`p-3.5 rounded-lg border text-left transition-colors ${
                  active
                    ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-600 dark:border-blue-500'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {st.label}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{st.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Formatting & Displayed Metrics Customization */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
        <div>
          <label
            htmlFor="stats-widget-title"
            className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
          >
            Oldalsáv Widget Címe
          </label>
          <input
            id="stats-widget-title"
            type="text"
            value={config.widgetTitle}
            onChange={(e) => onUpdateConfig({ widgetTitle: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-slate-100"
          />
        </div>

        <div>
          <label
            htmlFor="stats-number-format"
            className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
          >
            Számformátum Formázása
          </label>
          <select
            id="stats-number-format"
            value={config.numberFormat}
            onChange={(e) =>
              onUpdateConfig({ numberFormat: e.target.value as NumberFormatStyle })
            }
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-slate-100"
          >
            <option value="compact">Kompakt rövidített (pl. 48.9K, 12.6K)</option>
            <option value="exact">Magyar ezres tagolás (pl. 48 920, 12 640)</option>
            <option value="comma">Nemzetközi vesszős (pl. 48,920, 12,640)</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="stats-badge-text"
            className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
          >
            Időszak / Alcím Felirat
          </label>
          <input
            id="stats-badge-text"
            type="text"
            value={config.customBadgeText}
            onChange={(e) => onUpdateConfig({ customBadgeText: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-slate-100"
          />
        </div>

        <div className="sm:col-span-2 flex flex-wrap items-center gap-4 pt-2">
          <label className="inline-flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={config.showUniqueVisitors}
              onChange={(e) => onUpdateConfig({ showUniqueVisitors: e.target.checked })}
              className="rounded border-slate-300 text-blue-600"
            />
            <span>Egyedi látogatók száma</span>
          </label>
          <label className="inline-flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={config.showTotalDownloads}
              onChange={(e) => onUpdateConfig({ showTotalDownloads: e.target.checked })}
              className="rounded border-slate-300 text-blue-600"
            />
            <span>Letöltések száma</span>
          </label>
          <label className="inline-flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={config.showActiveReaders}
              onChange={(e) => onUpdateConfig({ showActiveReaders: e.target.checked })}
              className="rounded border-slate-300 text-blue-600"
            />
            <span>Aktív olvasók száma</span>
          </label>
          <label className="inline-flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={config.showShareConversions}
              onChange={(e) => onUpdateConfig({ showShareConversions: e.target.checked })}
              className="rounded border-slate-300 text-blue-600"
            />
            <span>Megosztások száma</span>
          </label>
          <label className="inline-flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={config.showTrendDelta}
              onChange={(e) => onUpdateConfig({ showTrendDelta: e.target.checked })}
              className="rounded border-slate-300 text-blue-600"
            />
            <span>Százalékos növekedés (+%)</span>
          </label>
          <label className="inline-flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={config.showSparkline}
              onChange={(e) => onUpdateConfig({ showSparkline: e.target.checked })}
              className="rounded border-slate-300 text-blue-600"
            />
            <span>Heti mini grafikon (Sparkline)</span>
          </label>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Színséma:</span>
          {(['blue', 'emerald', 'amber', 'slate'] as const).map((theme) => (
            <button
              key={theme}
              type="button"
              onClick={() => onUpdateConfig({ accentTheme: theme })}
              aria-label={`Statisztika színséma: ${theme}`}
              className={`w-6 h-6 rounded-full border-2 ${
                config.accentTheme === theme
                  ? 'scale-110 border-slate-900 dark:border-white'
                  : 'border-transparent opacity-75'
              } ${
                theme === 'blue'
                  ? 'bg-blue-600'
                  : theme === 'emerald'
                  ? 'bg-emerald-600'
                  : theme === 'amber'
                  ? 'bg-amber-500'
                  : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
