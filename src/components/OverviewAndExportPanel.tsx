import React, { useState } from 'react';
import {
  BarChart3,
  Calendar,
  Check,
  Code2,
  Copy,
  Download,
  Gauge,
  Megaphone,
  Search,
  Share2,
  ShieldCheck,
  Sliders,
  Terminal,
  Zap,
  KeyRound,
  EyeOff,
} from 'lucide-react';
import {
  ActiveTab,
  PerformanceConfig,
  ToolkitState,
} from '../types/toolkit';
import {
  auditWordPressPhpCompatibility,
  calculatePerformanceMetrics,
  formatMetricValue,
  generateWordPressPluginPhp,
} from '../utils/toolkitLogic';
import { AndWrenchLogo } from './AndWrenchLogo';

interface OverviewAndExportPanelProps {
  mode: 'overview' | 'export';
  state: ToolkitState;
  onNavigateTab: (tab: ActiveTab) => void;
  onToggleModule: (
    module:
      | 'calendar'
      | 'search'
      | 'social'
      | 'stats'
      | 'gdpr'
      | 'banner'
      | 'optimizer'
      | 'auditLog'
      | 'captcha'
      | 'auth'
      | 'wpHide',
    enabled: boolean
  ) => void;
  onUpdatePerformance: (patch: Partial<PerformanceConfig>) => void;
}

export const OverviewAndExportPanel: React.FC<OverviewAndExportPanelProps> = ({
  mode,
  state,
  onNavigateTab,
  onToggleModule,
  onUpdatePerformance,
}) => {
  const [copiedPhp, setCopiedPhp] = useState(false);

  const activeCount = [
    state.calendar.enabled,
    state.search.enabled,
    state.social.enabled,
    state.stats.enabled,
    state.gdpr.enabled,
    state.banner.enabled,
    state.optimizer.enabled,
    state.auditLog.enabled,
    state.captcha.enabled,
    state.auth.enabled,
    state.wpHide.enabled,
  ].filter(Boolean).length;

  const perfMetrics = calculatePerformanceMetrics(state.performance, activeCount);
  const phpSource = generateWordPressPluginPhp(state);
  const auditReport = auditWordPressPhpCompatibility(phpSource, state);

  const handleCopyPhp = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(phpSource).catch(() => {});
    }
    setCopiedPhp(true);
    setTimeout(() => setCopiedPhp(false), 2200);
  };

  const handleDownloadPhp = () => {
    const blob = new Blob([phpSource], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'and-toolkit.php';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (mode === 'export') {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-start gap-3">
            <AndWrenchLogo size="lg" />
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                And ToolKit v0.7.1 — WordPress 7.1 &amp; PHP 8.0+ Forráskód (and-toolkit.php)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Készítő: <strong className="text-slate-800 dark:text-slate-200">galandras12+AI</strong> · Verzió: <span className="font-mono">0.7.1</span> · Célkörnyezet: <span className="font-mono">WordPress 7.1 / PHP 8.0+ / GDPR / Optimalizáló / Audit / CAPTCHA / Hitelesítés &amp; WP Rejtés</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleCopyPhp}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors whitespace-nowrap"
            >
              {copiedPhp ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>PHP kód vágólapra másolva</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Forráskód másolása</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleDownloadPhp}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              <span>and-toolkit.php Letöltése</span>
            </button>
          </div>
        </div>

        {/* WordPress 7.1, PHP 8.0 & GDPR Compatibility Audit Matrix */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-white dark:bg-slate-900">
          <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 bg-slate-50/70 dark:bg-slate-950/50">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                WordPress 7.1, PHP 8.0, EU GDPR, Optimalizáló, Audit, Botvédelem, Hitelesítés &amp; WP Rejtés Jelentés (v0.7.1)
              </h3>
            </div>
            <span className="text-xs font-mono font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
              {auditReport.passedCount}/{auditReport.totalCount} ellenőrzés sikeres (100%)
            </span>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {auditReport.checks.map((item) => (
              <div key={item.id} className="p-3.5 flex items-start justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                      {item.category}
                    </span>
                    <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {item.title}
                    </span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">
                  <Check className="w-3.5 h-3.5" />
                  <span>kompatibilis</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Shortcodes Reference Table */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-white dark:bg-slate-900">
          <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Regisztrált WordPress 7.1 Rövidkódok (11 Shortcode), Filterek és REST Végpontok
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 text-slate-500">
                  <th className="py-2.5 px-4">Modul megnevezése</th>
                  <th className="py-2.5 px-3">Rövidkód (Shortcode)</th>
                  <th className="py-2.5 px-3">Aktív sablon / stílus</th>
                  <th className="py-2.5 px-4">PHP 8.0 Osztály / Hook</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-slate-900 dark:text-slate-100">
                    01. Esemény Naptár Widget
                  </td>
                  <td className="py-2.5 px-3 font-mono text-blue-600 dark:text-blue-400">
                    [wtk_calendar style=&quot;{state.calendar.style}&quot; limit=&quot;{state.calendar.maxItems}&quot;]
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                    {state.calendar.style}
                  </td>
                  <td className="py-2.5 px-4 font-mono text-slate-500">
                    And_ToolKit_Plugin::render_calendar_widget
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-slate-900 dark:text-slate-100">
                    02. Testreszabható Élő Kereső
                  </td>
                  <td className="py-2.5 px-3 font-mono text-blue-600 dark:text-blue-400">
                    [wtk_search layout=&quot;{state.search.layout}&quot; ajax=&quot;true&quot;]
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                    {state.search.layout}
                  </td>
                  <td className="py-2.5 px-4 font-mono text-slate-500">
                    REST: /wp-json/and-toolkit/v1/search
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-slate-900 dark:text-slate-100">
                    03. Közösségi Megosztás Gombok
                  </td>
                  <td className="py-2.5 px-3 font-mono text-blue-600 dark:text-blue-400">
                    [wtk_social style=&quot;{state.social.buttonStyle}&quot; cols=&quot;{state.social.columns}&quot;]
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                    {state.social.buttonStyle} ({state.social.columns} oszlop)
                  </td>
                  <td className="py-2.5 px-4 font-mono text-slate-500">
                    And_ToolKit_Plugin::render_social_widget
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-slate-900 dark:text-slate-100">
                    04. Hatékonyság &amp; Látogatói Számláló
                  </td>
                  <td className="py-2.5 px-3 font-mono text-blue-600 dark:text-blue-400">
                    [wtk_stats style=&quot;{state.stats.style}&quot; format=&quot;{state.stats.numberFormat}&quot;]
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                    {state.stats.style}
                  </td>
                  <td className="py-2.5 px-4 font-mono text-slate-500">
                    REST: /wp-json/and-toolkit/v1/track-download
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-slate-900 dark:text-slate-100">
                    05. GDPR Cookie (Süti) Hozzájárulás Kezelő
                  </td>
                  <td className="py-2.5 px-3 font-mono text-blue-600 dark:text-blue-400">
                    [wtk_cookie_consent style=&quot;{state.gdpr.displayStyle}&quot;]
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                    {state.gdpr.displayStyle} (GCM v2)
                  </td>
                  <td className="py-2.5 px-4 font-mono text-slate-500">
                    REST: /wp-json/and-toolkit/v1/cookie-consent
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-slate-900 dark:text-slate-100">
                    06. Állandó Információs Banner (v0.3.0)
                  </td>
                  <td className="py-2.5 px-3 font-mono text-blue-600 dark:text-blue-400">
                    [wtk_info_banner scope=&quot;{state.banner.visibilityScope}&quot; anim=&quot;{state.banner.animation}&quot;]
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                    {state.banner.colorPreset} · {state.banner.sizePreset} · {state.banner.fontStyle}
                  </td>
                  <td className="py-2.5 px-4 font-mono text-slate-500">
                    Action: wp_body_open / is_front_page()
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-slate-900 dark:text-slate-100">
                    07. Kép-, Upload Limit-, Lazy Load &amp; Cache Optimalizáló (v0.4.0)
                  </td>
                  <td className="py-2.5 px-3 font-mono text-blue-600 dark:text-blue-400">
                    [wtk_speed_badge]
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                    {state.optimizer.convertFormat.toUpperCase()} ({state.optimizer.compressionQuality}%) · {state.optimizer.customUploadLimitMb} MB Limit
                  </td>
                  <td className="py-2.5 px-4 font-mono text-slate-500">
                    Filter: upload_size_limit, big_image_size_threshold
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-slate-900 dark:text-slate-100">
                    08. Biztonsági Audit Naplózás &amp; E-mail Értesítő (v0.5.2)
                  </td>
                  <td className="py-2.5 px-3 font-mono text-blue-600 dark:text-blue-400">
                    [wtk_security_badge]
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                    .{state.auditLog.defaultExportFormat.toUpperCase()} Export · {state.auditLog.criticalOnlyEmails ? 'Critical Only' : 'Normál'} · {state.auditLog.dailyDigestTime}
                  </td>
                  <td className="py-2.5 px-4 font-mono text-slate-500">
                    Hook: wp_login, upgrader_process_complete, user_register
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-slate-900 dark:text-slate-100">
                    09. Botvédelem: Google reCAPTCHA v3 &amp; Cloudflare Turnstile (v0.6.0)
                  </td>
                  <td className="py-2.5 px-3 font-mono text-blue-600 dark:text-blue-400">
                    [wtk_captcha_badge]
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                    {state.captcha.provider === 'turnstile' ? 'Cloudflare Turnstile' : 'Google reCAPTCHA v3'} · Küszöb: &ge;{state.captcha.scoreThreshold.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-4 font-mono text-slate-500">
                    Hook: authenticate, registration_errors, preprocess_comment
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-slate-900 dark:text-slate-100">
                    10. Hitelesítés: 2FA TOTP, Időszinkron, Passkey, E-mail &amp; Offline Kódok (v0.7.1)
                  </td>
                  <td className="py-2.5 px-3 font-mono text-blue-600 dark:text-blue-400">
                    [wtk_auth_manager]
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                    TOTP + {(state.auth.passkeyCredentials ?? []).length} Passkey + {(state.auth.offlineSavedItems ?? []).length} Offline kód · Offset: {state.auth.timeOffsetSeconds} mp
                  </td>
                  <td className="py-2.5 px-4 font-mono text-slate-500">
                    REST: /wp-json/and-toolkit/v1/auth-sync-time
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-slate-900 dark:text-slate-100">
                    11. WP Rejtés, AJAX Buborék Belépés &amp; Mesterjelszó Kapu (v0.7.1)
                  </td>
                  <td className="py-2.5 px-3 font-mono text-blue-600 dark:text-blue-400">
                    [wtk_custom_login]
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                    {state.wpHide.customLoginSlug} · {state.wpHide.membersOnlyMode ? 'Tagoknak Zárolt' : 'Nyilvános'} · {state.wpHide.masterPasswordEnabled ? 'Mesterjelszó Aktív' : 'Mesterjelszó Kész'}
                  </td>
                  <td className="py-2.5 px-4 font-mono text-slate-500">
                    REST: /wp-json/and-toolkit/v1/bubble-login · template_redirect
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Code Viewer */}
        <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 text-slate-100 p-4 overflow-x-auto">
          <pre className="text-xs font-mono leading-relaxed">{phpSource}</pre>
        </div>

        {/* GitHub Repository & Release Panel */}
        <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                GitHub Közzététel Előkészítve (v0.7.1 Release)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                A gyökérkönyvtárban az önálló <code className="font-mono">/and-toolkit.php</code> és a látványos <code className="font-mono">/README.md</code> frissítve a <code className="font-mono">0.7.1</code> Hitelesítés (2FA, Időszinkron, Passkey, Offline kódok) és WP Rejtés &amp; Mesterjelszó modulokkal.
              </p>
            </div>
            <span className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400">
              Git: main · tag: v0.7.1
            </span>
          </div>
          <div className="p-3 rounded-md bg-slate-950 text-slate-200 text-xs font-mono overflow-x-auto space-y-1">
            <div className="text-slate-400"># Feltöltés saját GitHub tárolóba (vagy használja a felső sávban a GitHub szinkronizációt):</div>
            <div>git remote add origin https://github.com/galandras12/and-toolkit.git</div>
            <div>git push -u origin main --tags</div>
          </div>
        </div>
      </div>
    );
  }

  // OVERVIEW MODE
  return (
    <div className="space-y-6">
      {/* Overview Header with Custom Wrench-& Logo, Version 0.7.1 & Author galandras12+AI */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-start sm:items-center gap-3.5">
          <AndWrenchLogo size="lg" />
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              And ToolKit Központi Vezérlőpult
            </h2>
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">
                Verzió: 0.7.1
              </span>
              <span aria-hidden="true">·</span>
              <span>
                Készítő: <strong className="text-slate-800 dark:text-slate-200">galandras12+AI</strong>
              </span>
              <span aria-hidden="true">·</span>
              <span>WordPress 7.1 Admin, GDPR, Info Banner, Optimalizáló, Audit, CAPTCHA, Hitelesítés &amp; WP Rejtés</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigateTab('export')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-md hover:opacity-90 transition-opacity whitespace-nowrap shrink-0"
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>PHP Plugin Kód &amp; Audit</span>
        </button>
      </div>

      {/* 5 Core Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Module 1: Event Calendar */}
        <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-md bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    01. Esemény Naptár Widget
                  </h3>
                  <div className="text-xs text-slate-500">
                    Stílus: {state.calendar.style} · {state.posts.length} közelgő bejegyzés
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                aria-label="Esemény Naptár modul engedélyezése"
                checked={state.calendar.enabled}
                onChange={(e) => onToggleModule('calendar', e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer"
              />
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Közelgő bejegyzések, webináriumok és események megjelenítése az oldalsávban 4 választható vizuális sablonnal és visszaszámlálóval.
            </p>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-mono text-slate-400">[wtk_calendar]</span>
            <button
              type="button"
              onClick={() => onNavigateTab('calendar')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Naptár testreszabása</span>
            </button>
          </div>
        </div>

        {/* Module 2: Advanced Search */}
        <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-md bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Search className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    02. Fejlett Kereső Widget
                  </h3>
                  <div className="text-xs text-slate-500">
                    Elrendezés: {state.search.layout} · {state.search.debounceMs}ms AJAX
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                aria-label="Fejlett Kereső modul engedélyezése"
                checked={state.search.enabled}
                onChange={(e) => onToggleModule('search', e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer"
              />
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Azonnali találati lista bélyegképekkel, kulcsszó-kiemeléssel, tartalomtípus szűrőkkel és népszerű gyors-címkékkel.
            </p>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-mono text-slate-400">[wtk_search]</span>
            <button
              type="button"
              onClick={() => onNavigateTab('search')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Kereső beállítása</span>
            </button>
          </div>
        </div>

        {/* Module 3: Social Share */}
        <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-md bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    03. Közösségi Megosztás Widget
                  </h3>
                  <div className="text-xs text-slate-500">
                    {state.social.platforms.filter((p) => p.enabled).length} aktív csatorna ·{' '}
                    {state.social.buttonStyle}
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                aria-label="Közösségi Megosztás modul engedélyezése"
                checked={state.social.enabled}
                onChange={(e) => onToggleModule('social', e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer"
              />
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Platformfüggetlen, külső JavaScript nélküli SVG megosztó gombok megosztásszámlálóval, UTM követéssel és linkmásolással.
            </p>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-mono text-slate-400">[wtk_social]</span>
            <button
              type="button"
              onClick={() => onNavigateTab('social')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Gombok testreszabása</span>
            </button>
          </div>
        </div>

        {/* Module 4: Statistics & Efficiency */}
        <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-md bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    04. Statisztika &amp; Hatékonyság Modul
                  </h3>
                  <div className="text-xs text-slate-500 font-mono tabular-nums">
                    {formatMetricValue(state.stats.totals.uniqueVisitors, 'exact')} látogató ·{' '}
                    {formatMetricValue(state.stats.totals.totalDownloads, 'exact')} letöltés
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                aria-label="Statisztika modul engedélyezése"
                checked={state.stats.enabled}
                onChange={(e) => onToggleModule('stats', e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer"
              />
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Sütimentes látogatói és letöltési számláló, amely személyre szabott formázással közvetlenül az oldalsávban is megjeleníthető.
            </p>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-mono text-slate-400">[wtk_stats]</span>
            <button
              type="button"
              onClick={() => onNavigateTab('stats')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Mérőszámok és kinézet</span>
            </button>
          </div>
        </div>

        {/* Module 5: GDPR Cookie Consent */}
        <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-md bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    05. GDPR Kötelező Süti (Cookie) Kezelő
                  </h3>
                  <div className="text-xs text-slate-500">
                    Elrendezés: {state.gdpr.displayStyle} · GCM v2 · {state.gdpr.consentExpiryDays} nap
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                aria-label="GDPR Cookie modul engedélyezése"
                checked={state.gdpr.enabled}
                onChange={(e) => onToggleModule('gdpr', e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer"
              />
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Az EU GDPR által előírt süti-hozzájárulási felület 4 granuláris kategóriával, szkript-blokkolással és módosítható preferenciákkal.
            </p>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-mono text-slate-400">[wtk_cookie_consent]</span>
            <button
              type="button"
              onClick={() => onNavigateTab('gdpr')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>GDPR Cookie testreszabása</span>
            </button>
          </div>
        </div>

        {/* Module 6: Persistent Customizable Info Banner */}
        <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-md bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Megaphone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    06. Állandó Információs Banner (v0.3.0)
                  </h3>
                  <div className="text-xs text-slate-500">
                    {state.banner.visibilityScope === 'homepage-only' ? 'Csak Főoldal' : 'Minden Oldal'} · {state.banner.colorPreset} · {state.banner.animation}
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                aria-label="Információs Banner modul engedélyezése"
                checked={state.banner.enabled}
                onChange={(e) => onToggleModule('banner', e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer"
              />
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Színben, méretben, betűstílusban és animációban testreszabható figyelemfelkeltő információs banner főoldali vagy globális megjelenítéssel.
            </p>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-mono text-slate-400">[wtk_info_banner]</span>
            <button
              type="button"
              onClick={() => onNavigateTab('banner')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Banner szín, betű és animáció</span>
            </button>
          </div>
        </div>

        {/* Module 7: Dedicated Media, Upload Limit, Lazy Load & Speed Optimizer (v0.4.0) */}
        <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-md bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    07. Kép-, Upload Limit-, Lazy Load &amp; Cache Optimalizáló (v0.4.0)
                  </h3>
                  <div className="text-xs text-slate-500 font-mono">
                    {state.optimizer.convertFormat.toUpperCase()} ({state.optimizer.compressionQuality}%) · WP Limit: {state.optimizer.customUploadLimitMb} MB · TTFB: {state.optimizer.speedMetrics.ttfbMs}ms
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                aria-label="Optimalizáló modul engedélyezése"
                checked={state.optimizer.enabled}
                onChange={(e) => onToggleModule('optimizer', e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer"
              />
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Opcionális képtömörítés, WebP/AVIF konvertálás és átméretezés, a WordPress alapértelmezett fájlfeltöltési korlátjának felülbírálása ({state.optimizer.defaultWpUploadLimitMb} MB → {state.optimizer.customUploadLimitMb} MB) és teljes körű Lazy Loading.
            </p>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-mono text-slate-400">[wtk_speed_badge]</span>
            <button
              type="button"
              onClick={() => onNavigateTab('optimizer')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Optimalizáló megnyitása</span>
            </button>
          </div>
        </div>

        {/* Module 8: Security Audit Logging & Email Notification Center (New in v0.5.0) */}
        <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-md bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Terminal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    08. Biztonsági Naplózás &amp; E-mail Értesítés (v0.5.2)
                  </h3>
                  <div className="text-xs text-slate-500 font-mono">
                    {state.auditLog.entries.length} esemény · .{state.auditLog.defaultExportFormat.toUpperCase()} export · {state.auditLog.criticalOnlyEmails ? 'Critical Only' : `Napi: ${state.auditLog.dailyDigestTime}`}
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                aria-label="Naplózás és E-mail modul engedélyezése"
                checked={state.auditLog.enabled}
                onChange={(e) => onToggleModule('auditLog', e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer"
              />
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Naplózza a bejelentkezéseket (új hely/eszköz riasztással), a plugin/téma/poszt/oldal/felhasználó műveleteket, az automatikus és WP mag frissítéseket (.log/.txt/.csv mentéssel és verziókövető e-mail értesítőkkel).
            </p>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-mono text-slate-400">[wtk_security_badge]</span>
            <button
              type="button"
              onClick={() => onNavigateTab('audit-log')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Naplózás &amp; E-mail szabályok</span>
            </button>
          </div>
        </div>

        {/* Module 9: Bot Protection — Google reCAPTCHA v3 & Cloudflare Turnstile (New in v0.6.0) */}
        <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-md bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    09. Botvédelem: Google reCAPTCHA v3 &amp; Cloudflare Turnstile (v0.6.0)
                  </h3>
                  <div className="text-xs text-slate-500 font-mono">
                    Aktív: {state.captcha.provider === 'turnstile' ? 'Cloudflare Turnstile' : 'Google reCAPTCHA v3'} · Küszöbérték: &ge; {state.captcha.scoreThreshold.toFixed(2)} · {state.captcha.stats.blockedBots} blokkolt bot
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                aria-label="Botvédelem modul engedélyezése"
                checked={state.captcha.enabled}
                onChange={(e) => onToggleModule('captcha', e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer"
              />
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Opcionálisan választható Google reCAPTCHA v3 vagy Cloudflare Turnstile konfigurációs felület Site Key / Secret Key kezeléssel, finomhangolható észlelési küszöbértékkel (0.1–0.9) és élő bot-szimulátorral.
            </p>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-mono text-slate-400">[wtk_captcha_badge]</span>
            <button
              type="button"
              onClick={() => onNavigateTab('captcha')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Botvédelem &amp; Küszöbérték beállítása</span>
            </button>
          </div>
        </div>

        {/* Module 10: Hitelesítés (2FA, Time Drift Sync, Passkey, Email, Offline Vault) (New in v0.7.1) */}
        <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-md bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    10. Hitelesítés: 2FA, Időszinkron, Passkey &amp; Offline Széf (v0.7.1)
                  </h3>
                  <div className="text-xs text-slate-500 font-mono">
                    TOTP + {(state.auth.passkeyCredentials ?? []).length} Passkey + {(state.auth.offlineSavedItems ?? []).length} Offline kód · Offset: {state.auth.timeOffsetSeconds} mp
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                aria-label="Hitelesítés modul engedélyezése"
                checked={state.auth.enabled}
                onChange={(e) => onToggleModule('auth', e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer"
              />
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              2FA szabvány hitelesítő (RFC 6238), szerver–kliens időelcsúszás korrekció és készülékszinkron, WebAuthn Passkey, E-mail OTP, frissítés-biztos Offline mentett jelszavak, rangonkénti szabálymátrix, IP fehérlista és wp-admin mentes shortcode felület.
            </p>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-mono text-slate-400">[wtk_auth_manager]</span>
            <button
              type="button"
              onClick={() => onNavigateTab('auth')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Hitelesítés &amp; Szabályok megnyitása</span>
            </button>
          </div>
        </div>

        {/* Module 11: WP Rejtés, Bubble Login, Members-Only Zero Source Leak & Master Password (New in v0.7.1) */}
        <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4 md:col-span-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-md bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                  <EyeOff className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    11. WP Rejtés, AJAX Buborék Belépés, Zárolt Mód &amp; Mesterjelszó (v0.7.1)
                  </h3>
                  <div className="text-xs text-slate-500 font-mono">
                    Belépő: {state.wpHide.customLoginSlug} · Tartalom: {state.wpHide.customContentSlug} · Mesterjelszó: {state.wpHide.masterPasswordEnabled ? 'AKTÍV' : 'KÉSZENLÉTBEN'}
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                aria-label="WP Rejtés modul engedélyezése"
                checked={state.wpHide.enabled}
                onChange={(e) => onToggleModule('wpHide', e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer"
              />
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              WordPress URL-ek álcázása robotok elől, wp-login.php és wp-admin elrejtése egyedi URL-lel vagy shortcode-dal, lebegő AJAX buborék bejelentkező widget, forráskód-szivárgás mentes csak-tagoknak mód, felhasználónév/e-mail maszkolás és titkosított Mesterjelszó admin felfedéssel és IP fehérlistával.
            </p>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-mono text-slate-400">[wtk_custom_login]</span>
            <button
              type="button"
              onClick={() => onNavigateTab('wp-hide')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>WP Rejtés &amp; Mesterjelszó beállítása</span>
            </button>
          </div>
        </div>
      </div>

      {/* Fast Loading Time & Performance Optimization Panel */}
      <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Gyors Betöltési Idő és Teljesítmény Optimalizálás
            </h3>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono tabular-nums">
            <span className="text-slate-600 dark:text-slate-400">
              Frontend csomagméret: <strong className="text-slate-900 dark:text-slate-100">{perfMetrics.bundleSizeKb} KB</strong>
            </span>
            <span className="text-slate-600 dark:text-slate-400">
              Becsült betöltés: <strong className="text-emerald-600 dark:text-emerald-400">{perfMetrics.estimatedLoadMs} ms</strong>
            </span>
            <span className="text-slate-600 dark:text-slate-400">
              PageSpeed index: <strong className="text-blue-600 dark:text-blue-400">{perfMetrics.lighthouseScore}/100</strong>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <label className="flex items-start gap-2.5 p-3 rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={state.performance.minifyAssets}
              onChange={(e) => onUpdatePerformance({ minifyAssets: e.target.checked })}
              className="mt-0.5 rounded border-slate-300 text-blue-600"
            />
            <div>
              <div className="font-semibold text-slate-900 dark:text-slate-100">
                CSS/JS Minifikálás
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Tömörített inline stíluslapok (-4.8 KB)
              </div>
            </div>
          </label>

          <label className="flex items-start gap-2.5 p-3 rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={state.performance.zeroJqueryDependency}
              onChange={(e) =>
                onUpdatePerformance({ zeroJqueryDependency: e.target.checked })
              }
              className="mt-0.5 rounded border-slate-300 text-blue-600"
            />
            <div>
              <div className="font-semibold text-slate-900 dark:text-slate-100">
                Natív Vanilla JS (Zero-jQuery)
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Nem tölti be a jQuery könyvtárat (-28 KB)
              </div>
            </div>
          </label>

          <label className="flex items-start gap-2.5 p-3 rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={state.performance.svgSpritesOnly}
              onChange={(e) => onUpdatePerformance({ svgSpritesOnly: e.target.checked })}
              className="mt-0.5 rounded border-slate-300 text-blue-600"
            />
            <div>
              <div className="font-semibold text-slate-900 dark:text-slate-100">
                Beágyazott SVG Ikonok
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Nulla külső ikonfont lekérés (-6.5 KB)
              </div>
            </div>
          </label>

          <label className="flex items-start gap-2.5 p-3 rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={state.performance.deferScripts}
              onChange={(e) => onUpdatePerformance({ deferScripts: e.target.checked })}
              className="mt-0.5 rounded border-slate-300 text-blue-600"
            />
            <div>
              <div className="font-semibold text-slate-900 dark:text-slate-100">
                Aszinkron Script Defer
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Blokkolásmentes első kirajzolás (-35 ms)
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* WordPress 7.1, PHP 8.0 & GDPR Live Compatibility Audit Summary */}
      <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              WordPress 7.1, PHP 8.0+, EU GDPR, Optimalizáló, Audit, Botvédelem, Hitelesítés &amp; WP Rejtés Audit (v0.7.1)
            </h3>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="font-mono font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
              {auditReport.passedCount}/{auditReport.totalCount} modul- és kódaudit sikeres
            </span>
            <button
              type="button"
              onClick={() => onNavigateTab('export')}
              className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Részletes audit és PHP kód →
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {auditReport.checks.slice(0, 6).map((chk) => (
            <div
              key={chk.id}
              className="flex items-center justify-between gap-2 px-3 py-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800"
            >
              <span className="text-slate-700 dark:text-slate-300 truncate">{chk.title}</span>
              <span className="font-mono text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">
                OK
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
