import React, { useState } from 'react';
import {
  Bell,
  Check,
  Clock,
  Download,
  FileSpreadsheet,
  FileText,
  Mail,
  PlusCircle,
  RefreshCw,
  Search,
  ShieldAlert,
  Terminal,
  Trash2,
  UserCheck,
  UserPlus,
} from 'lucide-react';
import {
  AuditEventCategory,
  AuditLogConfig,
  AuditLogEntry,
  AuditLogExportFormat,
  LoginNotificationScope,
  WpUserRole,
} from '../types/toolkit';
import {
  buildUpdateNotificationEmailPreview,
  filterAuditLogEntries,
  formatAuditLogsForExport,
  shouldSendLoginEmailAlert,
} from '../utils/toolkitLogic';

interface AuditLogModulePanelProps {
  config: AuditLogConfig;
  onUpdateConfig: (patch: Partial<AuditLogConfig>) => void;
  onAppendLogEntry: (entry: AuditLogEntry, sendEmail?: boolean) => void;
  onClearLogs: () => void;
  onSendTestDigestEmail: () => void;
}

const CATEGORY_META: Record<
  AuditEventCategory,
  { label: string; hook: string; badgeClass: string }
> = {
  user_login: {
    label: 'Bejelentkezés',
    hook: 'wp_login',
    badgeClass: 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/70 border-blue-200 dark:border-blue-800',
  },
  plugin_lifecycle: {
    label: 'Plugin Művelet',
    hook: 'upgrader_process_complete / deleted_plugin',
    badgeClass: 'text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/70 border-purple-200 dark:border-purple-800',
  },
  theme_lifecycle: {
    label: 'Téma Művelet',
    hook: 'upgrader_process_complete / switch_theme',
    badgeClass: 'text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/70 border-indigo-200 dark:border-indigo-800',
  },
  post_lifecycle: {
    label: 'Poszt (Bejegyzés)',
    hook: 'save_post / before_delete_post',
    badgeClass: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 border-emerald-200 dark:border-emerald-800',
  },
  page_lifecycle: {
    label: 'Oldal (Page)',
    hook: 'save_post_page / before_delete_post',
    badgeClass: 'text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/70 border-teal-200 dark:border-teal-800',
  },
  user_lifecycle: {
    label: 'Felhasználó & Csoport',
    hook: 'user_register / set_user_role / delete_user',
    badgeClass: 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/70 border-amber-200 dark:border-amber-800',
  },
  auto_system_update: {
    label: 'Automatikus Rendszerfrissítés',
    hook: 'automatic_updates_complete',
    badgeClass: 'text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/70 border-cyan-200 dark:border-cyan-800',
  },
  core_manual_update: {
    label: 'WP Mag (Core) Frissítés',
    hook: '_core_updated_successfully',
    badgeClass: 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/70 border-rose-200 dark:border-rose-800',
  },
};

const ROLE_LABELS: Record<WpUserRole, string> = {
  administrator: 'Adminisztrátor (administrator)',
  editor: 'Szerkesztő (editor)',
  author: 'Szerző (author)',
  contributor: 'Közreműködő (contributor)',
  subscriber: 'Feliratkozó (subscriber)',
};

export const AuditLogModulePanel: React.FC<AuditLogModulePanelProps> = ({
  config,
  onUpdateConfig,
  onAppendLogEntry,
  onClearLogs,
  onSendTestDigestEmail,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<AuditEventCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showExportPreview, setShowExportPreview] = useState(false);
  const [downloadedFormat, setDownloadedFormat] = useState<AuditLogExportFormat | null>(null);

  const filteredEntries = filterAuditLogEntries(config.entries, categoryFilter, searchQuery);
  const exportPreviewText = formatAuditLogsForExport(
    filteredEntries,
    config.defaultExportFormat
  );
  const emailPreview = buildUpdateNotificationEmailPreview(config);

  const handleDownloadLogFile = (format: AuditLogExportFormat) => {
    onUpdateConfig({ defaultExportFormat: format });
    const content = formatAuditLogsForExport(filteredEntries, format);
    const mimeType =
      format === 'csv'
        ? 'text/csv;charset=utf-8'
        : 'text/plain;charset=utf-8';
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `and-toolkit-audit-2026-11-03.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadedFormat(format);
    setTimeout(() => setDownloadedFormat(null), 2400);
  };

  const toggleNewDeviceRole = (role: WpUserRole) => {
    const exists = config.newDeviceTargetRoles.includes(role);
    const updated = exists
      ? config.newDeviceTargetRoles.filter((r) => r !== role)
      : [...config.newDeviceTargetRoles, role];
    onUpdateConfig({ newDeviceTargetRoles: updated });
  };

  const simulateEvent = (type: 'new-login' | 'plugin-update' | 'user-invite' | 'core-update') => {
    const nowStr = new Date().toISOString().slice(0, 19).replace('T', ' ');
    if (type === 'new-login') {
      const check = shouldSendLoginEmailAlert(config, 'editor', true);
      onAppendLogEntry(
        {
          id: `log-${Date.now()}`,
          timestamp: nowStr,
          category: 'user_login',
          actionLabel: 'Bejelentkezés (Új helyről & eszközről)',
          actorUser: 'szabo.dora',
          actorRole: 'editor',
          targetObject: 'wp-login.php (Új IP & Böngésző)',
          details: `Szerkesztői belépés új helyről (Bécs, AT) és új eszközről.${
            check.send ? ` E-mail riasztás kiküldve (${check.reason}).` : ''
          }`,
          ipLocation: '193.170.14.88 (Bécs, AT)',
          deviceBrowser: 'iPadOS 18 · Mobile Safari (Új eszköz)',
          isNewDeviceOrLocation: true,
          severity: 'warning',
        },
        check.send
      );
      return;
    }

    if (type === 'plugin-update') {
      onAppendLogEntry(
        {
          id: `log-${Date.now()}`,
          timestamp: nowStr,
          category: 'plugin_lifecycle',
          actionLabel: 'Plugin Frissítés (v9.3.1 → v9.4.0)',
          actorUser: 'galandras12',
          actorRole: 'administrator',
          targetObject: 'WooCommerce E-Commerce (9.3.1 → 9.4.0)',
          details: 'Plugin sikeresen frissítve az admin felületen: 9.3.1 verzióról 9.4.0 verzióra.',
          previousVersion: '9.3.1',
          newVersion: '9.4.0',
          ipLocation: '84.2.44.19 (Budapest, HU)',
          severity: 'info',
        },
        config.updateAvailableEmailEnabled && config.notifyPluginUpdates
      );
      return;
    }

    if (type === 'user-invite') {
      onAppendLogEntry(
        {
          id: `log-${Date.now()}`,
          timestamp: nowStr,
          category: 'user_lifecycle',
          actionLabel: 'Felhasználó Létrehozva (Regisztrációs Űrlap)',
          actorUser: 'horvath.peter',
          actorRole: 'subscriber',
          targetObject: 'horvath.peter (Feliratkozó)',
          details: 'Új felhasználó regisztrált a nyilvános WordPress regisztrációs űrlap használatával (Mód: registration-form).',
          userCreationMethod: 'registration-form',
          ipLocation: '81.182.40.12 (Győr, HU)',
          severity: 'info',
        },
        false
      );
      return;
    }

    // core-update
    onAppendLogEntry(
      {
        id: `log-${Date.now()}`,
        timestamp: nowStr,
        category: 'core_manual_update',
        actionLabel: 'WordPress Mag (Core) Frissítés',
        actorUser: 'galandras12',
        actorRole: 'administrator',
        targetObject: 'WordPress Core (7.1.0 → 7.1.1-security)',
        details: 'WordPress mag biztonsági frissítés elindítva és befejezve (Indította: galandras12).',
        previousVersion: '7.1.0',
        newVersion: '7.1.1-security',
        ipLocation: '84.2.44.19 (Budapest, HU)',
        severity: 'critical',
      },
      config.updateAvailableEmailEnabled && config.notifyCoreUpdates
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            08. Biztonsági Audit Naplózás &amp; E-mail Értesítés Modul (v0.5.0)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Teljes körű WordPress 7.1 eseménynapló (.log, .txt, .csv mentéssel), bejelentkezési riasztásokkal és verziókövető e-mail értesítőkkel.
          </p>
        </div>

        <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer shrink-0">
          <input
            type="checkbox"
            checked={config.enabled}
            onChange={(e) => onUpdateConfig({ enabled: e.target.checked })}
            className="w-4 h-4 rounded border-slate-300 text-blue-600"
          />
          <span>Naplózás &amp; E-mail modul aktív</span>
        </label>
      </div>

      {/* Hero Status & Quick Export Bar */}
      <div className="p-5 rounded-xl bg-slate-900 text-white space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-semibold uppercase tracking-wider">
              <Terminal className="w-3.5 h-3.5" />
              <span>Valós Idejű WordPress Eseménynapló &amp; Fájl Exportáló</span>
            </div>
            <h3 className="text-base font-bold">
              Naplófájl Mentése (.log / .txt / .csv) &amp; Azonnali Esemény Rögzítés
            </h3>
            <p className="text-xs text-slate-400">
              Rögzített események: <span className="font-mono text-white font-semibold">{config.entries.length} db</span> · Kiküldött e-mail riasztások:{' '}
              <span className="font-mono text-emerald-400 font-semibold">{config.emailsSentTotal} db</span> · Címzett:{' '}
              <span className="font-mono text-blue-300">{config.recipientEmail}</span>
            </p>
          </div>

          {/* .log / .txt / .csv Download Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleDownloadLogFile('log')}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Mentés .LOG fájlba</span>
            </button>
            <button
              type="button"
              onClick={() => handleDownloadLogFile('txt')}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span>Mentés .TXT fájlba</span>
            </button>
            <button
              type="button"
              onClick={() => handleDownloadLogFile('csv')}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-amber-400" />
              <span>Mentés .CSV fájlba</span>
            </button>
          </div>
        </div>

        {downloadedFormat && (
          <div
            role="status"
            className="px-3.5 py-2 rounded-lg bg-emerald-950/90 border border-emerald-700 text-emerald-200 text-xs flex items-center justify-between"
          >
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>
                Naplófájl sikeresen exportálva és letöltve: <strong className="font-mono">and-toolkit-audit-2026-11-03.{downloadedFormat}</strong> ({filteredEntries.length} sor)
              </span>
            </span>
          </div>
        )}

        {/* Interactive Event Simulator Bar */}
        <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="text-slate-400 font-medium">
            Élő esemény tesztelése (azonnal naplózza és ellenőrzi az e-mail szabályokat):
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => simulateEvent('new-login')}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-blue-300 border border-slate-700 font-medium cursor-pointer"
            >
              + Belépés új helyről/eszközről
            </button>
            <button
              type="button"
              onClick={() => simulateEvent('plugin-update')}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-purple-300 border border-slate-700 font-medium cursor-pointer"
            >
              + Plugin frissítés (9.3.1→9.4.0)
            </button>
            <button
              type="button"
              onClick={() => simulateEvent('user-invite')}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 font-medium cursor-pointer"
            >
              + Új felhasználó (Űrlap)
            </button>
            <button
              type="button"
              onClick={() => simulateEvent('core-update')}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-rose-300 border border-slate-700 font-medium cursor-pointer"
            >
              + WP Mag (Core) frissítés
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: 8 Audited Event Types Configuration */}
      <section className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              1. Naplózott WordPress Eseménytípusok (8/8 Kötelező Audit Kategória)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            Megőrzési idő: {config.retentionDays} nap
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          {[
            {
              key: 'logUserLogins' as const,
              title: 'Felhasználói Bejelentkezések (wp_login)',
              desc: 'Melyik felhasználó, mikor, milyen IP címről és eszközről jelentkezett be.',
            },
            {
              key: 'logPluginChanges' as const,
              title: 'Plugin Telepítés, Frissítés és Törlés',
              desc: 'Rögzíti a bővítmények telepítését, verziófrissítését és eltávolítását.',
            },
            {
              key: 'logThemeChanges' as const,
              title: 'Téma (Sablon) Telepítés, Frissítés és Törlés',
              desc: 'Naplózza a WordPress témák telepítését, frissítését, váltását és törlését.',
            },
            {
              key: 'logPostChanges' as const,
              title: 'Bejegyzés (Poszt) Létrehozás, Szerkesztés & Törlés',
              desc: 'Melyik felhasználó mikor hoz létre, módosít vagy töröl egy blogbejegyzést.',
            },
            {
              key: 'logPageChanges' as const,
              title: 'Oldal (Page) Létrehozás, Szerkesztés & Törlés',
              desc: 'Melyik felhasználó mikor hoz létre, szerkeszt át vagy töröl egy statikus oldalt.',
            },
            {
              key: 'logUserLifecycle' as const,
              title: 'Felhasználó Létrehozás Módja, Csoportváltás & Törlés',
              desc: 'Regisztrációs űrlap / Meghívó / Admin létrehozás, szerepkör-áthelyezés vagy törlés.',
            },
            {
              key: 'logAutoSystemUpdates' as const,
              title: 'Automatizált WordPress Rendszerfrissítések',
              desc: 'Mikor végez az automatizált háttérfrissítéssel a WordPress (automatic_updates_complete).',
            },
            {
              key: 'logCoreManualUpdates' as const,
              title: 'WordPress Mag (Core) Frissítés Indítója & Ideje',
              desc: 'Mikor és ki indította el a WordPress alaprendszer (Core) frissítését.',
            },
          ].map((item) => (
            <label
              key={item.key}
              className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={config[item.key]}
                onChange={(e) => onUpdateConfig({ [item.key]: e.target.checked })}
                className="mt-0.5 rounded border-slate-300 text-blue-600"
              />
              <div>
                <div className="font-semibold text-slate-900 dark:text-slate-100">
                  {item.title}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">{item.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </section>

      {/* SECTION 2: Email Notification Settings (Login Scope + New Device/Location) */}
      <section className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              2. Bejelentkezési és Új Hely / Új Eszköz E-mail Értesítések
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Értesítési e-mail cím:</span>
            <input
              type="email"
              value={config.recipientEmail}
              onChange={(e) => onUpdateConfig({ recipientEmail: e.target.value })}
              aria-label="Értesítési e-mail cím"
              className="px-2.5 py-1 text-xs font-mono rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        {/* 2A: Standard Login Notification Scope */}
        <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                A) E-mail értesítés felhasználói bejelentkezésről
              </div>
              <p className="text-[11px] text-slate-500">
                Válassza ki, hogy minden felhasználó, kizárólag a szerkesztők, vagy kizárólag az adminisztrátorok belépésekor küldjön e-mailt.
              </p>
            </div>
            <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={config.loginEmailEnabled}
                onChange={(e) => onUpdateConfig({ loginEmailEnabled: e.target.checked })}
                className="w-4 h-4 rounded border-slate-300 text-blue-600"
              />
              <span>Bejelentkezési E-mail Aktív</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            {(
              [
                {
                  id: 'all-users',
                  title: 'Minden felhasználó belépésekor',
                  desc: 'Admin, szerkesztő, szerző és feliratkozó is',
                },
                {
                  id: 'editors-only',
                  title: 'Kizárólag Szerkesztők (Editors)',
                  desc: 'Csak az editor csoport belépésekor',
                },
                {
                  id: 'admins-only',
                  title: 'Kizárólag Adminisztrátorok',
                  desc: 'Csak administrator belépésekor',
                },
              ] as Array<{ id: LoginNotificationScope; title: string; desc: string }>
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                disabled={!config.loginEmailEnabled}
                onClick={() => onUpdateConfig({ loginEmailScope: opt.id })}
                className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                  config.loginEmailScope === opt.id
                    ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/60 text-slate-900 dark:text-slate-100'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                } ${!config.loginEmailEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="font-bold text-xs">{opt.title}</div>
                <div className="text-[11px] opacity-80 mt-0.5">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 2B: New Device / New Location Alert for Optional User Roles */}
        <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                B) E-mail riasztás Új Helyről (IP/Ország) vagy Új Eszközről történő bejelentkezéskor
              </div>
              <p className="text-[11px] text-slate-500">
                Opcionálisan ki-be kapcsolható riasztás, ha a kijelölt felhasználói csoportok valamelyikében ismeretlen eszközről vagy új helyről lépnek be.
              </p>
            </div>
            <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={config.newDeviceLocationEmailEnabled}
                onChange={(e) =>
                  onUpdateConfig({ newDeviceLocationEmailEnabled: e.target.checked })
                }
                className="w-4 h-4 rounded border-slate-300 text-blue-600"
              />
              <span>Új Hely / Eszköz Riasztás Aktív</span>
            </label>
          </div>

          <div className="space-y-1.5">
            <div className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
              Megfigyelt felhasználói csoportok (szerepkörök) új hely/eszköz esetén:
            </div>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(ROLE_LABELS) as WpUserRole[]).map((role) => {
                const selected = config.newDeviceTargetRoles.includes(role);
                return (
                  <button
                    key={role}
                    type="button"
                    disabled={!config.newDeviceLocationEmailEnabled}
                    onClick={() => toggleNewDeviceRole(role)}
                    className={`px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                      selected
                        ? 'bg-amber-600 text-white border-amber-600'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                    } ${!config.newDeviceLocationEmailEnabled ? 'opacity-50' : ''}`}
                  >
                    {selected ? '✓ ' : '+ '}
                    {ROLE_LABELS[role]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Update Available Notifications (Current -> New Version) & 24h Daily Digest */}
      <section className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              3. Frissítési Verzió Értesítő (Aktuális → Új Verzió) &amp; 24 Órás Napi Összefoglaló
            </h3>
          </div>
          <button
            type="button"
            onClick={onSendTestDigestEmail}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors cursor-pointer"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Teszt Összefoglaló E-mail Küldése Most</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 3A: Available Update Email Alert */}
          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  C) Új Frissítés Érkezése E-mail (Verziószám Megjelöléssel)
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  E-mail küldése, ha egy pluginhoz, témához vagy WordPress maghoz frissítés érkezik, feltüntetve az aktuális és az új verziószámot.
                </p>
              </div>
              <input
                type="checkbox"
                aria-label="Frissítés érkezése e-mail értesítés engedélyezése"
                checked={config.updateAvailableEmailEnabled}
                onChange={(e) =>
                  onUpdateConfig({ updateAvailableEmailEnabled: e.target.checked })
                }
                className="w-4 h-4 rounded border-slate-300 text-blue-600 mt-0.5"
              />
            </div>

            <div className="space-y-1.5 text-xs pt-1">
              <label className="flex items-center justify-between p-2 rounded bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 cursor-pointer">
                <span>Plugin frissítések (aktuális → új verzió)</span>
                <input
                  type="checkbox"
                  checked={config.notifyPluginUpdates}
                  onChange={(e) => onUpdateConfig({ notifyPluginUpdates: e.target.checked })}
                  className="rounded border-slate-300 text-blue-600"
                />
              </label>
              <label className="flex items-center justify-between p-2 rounded bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 cursor-pointer">
                <span>Téma (Sablon) frissítések (aktuális → új verzió)</span>
                <input
                  type="checkbox"
                  checked={config.notifyThemeUpdates}
                  onChange={(e) => onUpdateConfig({ notifyThemeUpdates: e.target.checked })}
                  className="rounded border-slate-300 text-blue-600"
                />
              </label>
              <label className="flex items-center justify-between p-2 rounded bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 cursor-pointer">
                <span>WordPress Mag (Core) verziófrissítések</span>
                <input
                  type="checkbox"
                  checked={config.notifyCoreUpdates}
                  onChange={(e) => onUpdateConfig({ notifyCoreUpdates: e.target.checked })}
                  className="rounded border-slate-300 text-blue-600"
                />
              </label>
            </div>
          </div>

          {/* 3B: 24-Hour Automatic Update Daily Digest at Custom Time */}
          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    D) Napi E-mail Összefoglaló (Elmúlt 24 óra automatikus frissítéseiről)
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Ha az elmúlt 24 órában automatikusan frissült egy plugin, téma vagy WP mag verzió, a megadott időpontban összefoglalót küld.
                  </p>
                </div>
                <input
                  type="checkbox"
                  aria-label="Napi 24 órás összefoglaló e-mail engedélyezése"
                  checked={config.dailyDigestEnabled}
                  onChange={(e) =>
                    onUpdateConfig({ dailyDigestEnabled: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 mt-0.5"
                />
              </div>

              <div className="pt-2 space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Opcionális napi kézbesítési időpont (WP-Cron):
                </label>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <input
                    type="time"
                    value={config.dailyDigestTime}
                    onChange={(e) => onUpdateConfig({ dailyDigestTime: e.target.value })}
                    aria-label="Napi összefoglaló időpontja"
                    className="px-3 py-1.5 text-xs font-mono font-bold rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                  />
                  <div className="flex items-center gap-1">
                    {['06:00', '08:00', '12:00', '18:00'].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => onUpdateConfig({ dailyDigestTime: preset })}
                        className={`px-2 py-1 text-[11px] font-mono rounded border cursor-pointer ${
                          config.dailyDigestTime === preset
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/70 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
              <span>Utolsó összefoglaló: {config.lastDigestSentAt}</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400">
                24h auto-frissítés: {config.pendingUpdates.filter((u) => u.autoUpdatedInLast24h).length} db
              </span>
            </div>
          </div>
        </div>

        {/* Live Email Body Preview showing Current Version -> New Version */}
        <div className="p-3.5 rounded-lg bg-slate-950 text-slate-200 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>GENERÁLT E-MAIL ÉRTESÍTŐ ELŐNÉZET (AKTUÁLIS VERZIÓ → ÚJ VERZIÓ)</span>
            <span>wp_mail() sablon</span>
          </div>
          <pre className="text-[11px] font-mono leading-relaxed whitespace-pre-wrap text-emerald-300">
            {emailPreview.body}
          </pre>
        </div>
      </section>

      {/* SECTION 4: Filterable Live Audit Log Table & .log/.txt/.csv Raw View */}
      <section className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              4. Rögzített Eseménynapló ({filteredEntries.length} bejegyzés)
            </h3>
            <p className="text-[11px] text-slate-500">
              Minden bejelentkezés, plugin/téma/poszt/oldal/felhasználó művelet és rendszerfrissítés időbélyeggel.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowExportPreview((prev) => !prev)}
              className="px-2.5 py-1.5 text-xs font-medium rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
            >
              {showExportPreview
                ? 'Táblázatos nézet mutatása'
                : `Nyers .${config.defaultExportFormat.toUpperCase()} fájl előnézet`}
            </button>
            <button
              type="button"
              onClick={onClearLogs}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Napló alaphelyzetbe</span>
            </button>
          </div>
        </div>

        {/* Category Filter & Search Input */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setCategoryFilter('all')}
              className={`px-2.5 py-1 text-xs rounded-md font-medium cursor-pointer ${
                categoryFilter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              Összes ({config.entries.length})
            </button>
            {(Object.keys(CATEGORY_META) as AuditEventCategory[]).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 text-xs rounded-md font-medium cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {CATEGORY_META[cat].label}
              </button>
            ))}
          </div>

          <div className="relative min-w-[210px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Szűrés felhasználó, IP, verzió..."
              aria-label="Keresés a biztonsági naplóban"
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        {showExportPreview ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Export formátum kiválasztása:
                </span>
                {(['log', 'txt', 'csv'] as AuditLogExportFormat[]).map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => onUpdateConfig({ defaultExportFormat: fmt })}
                    className={`px-2.5 py-1 text-xs font-mono font-bold rounded uppercase cursor-pointer ${
                      config.defaultExportFormat === fmt
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    .{fmt}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => handleDownloadLogFile(config.defaultExportFormat)}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                .{config.defaultExportFormat.toUpperCase()} fájl letöltése →
              </button>
            </div>
            <pre className="p-3.5 rounded-lg bg-slate-950 text-slate-200 text-[11px] font-mono overflow-x-auto leading-relaxed max-h-80">
              {exportPreviewText}
            </pre>
          </div>
        ) : (
          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-500">
                  <th className="py-2.5 px-3">Időpont</th>
                  <th className="py-2.5 px-3">Kategória / Hook</th>
                  <th className="py-2.5 px-3">Felhasználó</th>
                  <th className="py-2.5 px-3">Művelet &amp; Érintett elem</th>
                  <th className="py-2.5 px-3">Részletek / Verzió / Mód</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredEntries.map((entry) => {
                  const meta = CATEGORY_META[entry.category];
                  return (
                    <tr key={entry.id} className="align-top hover:bg-slate-50/70 dark:hover:bg-slate-950/40">
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                        {entry.timestamp}
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 text-[11px] font-semibold rounded border ${meta.badgeClass}`}
                        >
                          {meta.label}
                        </span>
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                          {meta.hook}
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">
                          {entry.actorUser}
                        </div>
                        <div className="text-[10px] font-mono text-slate-500">
                          {entry.actorRole}
                        </div>
                        {entry.ipLocation && (
                          <div className="text-[10px] font-mono text-slate-400">
                            {entry.ipLocation}
                          </div>
                        )}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">
                          {entry.actionLabel}
                        </div>
                        <div className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                          {entry.targetObject}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 space-y-1 max-w-xs">
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                          {entry.details}
                        </p>
                        {entry.previousVersion && entry.newVersion && (
                          <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                            Verzióváltás: v{entry.previousVersion} → v{entry.newVersion}
                          </div>
                        )}
                        {entry.userCreationMethod && (
                          <div className="text-[11px] font-mono text-amber-600 dark:text-amber-400 font-semibold">
                            Felhasználói művelet módja: {entry.userCreationMethod}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};
