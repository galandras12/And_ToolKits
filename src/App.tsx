import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  Calendar,
  Check,
  Code2,
  LayoutDashboard,
  Megaphone,
  Moon,
  RotateCcw,
  Search,
  Share2,
  ShieldCheck,
  Sun,
  Terminal,
  Zap,
} from 'lucide-react';
import {
  ActiveTab,
  AuditLogConfig,
  AuditLogEntry,
  BannerConfig,
  CalendarConfig,
  GdprCategoryId,
  GdprConfig,
  OptimizerConfig,
  PerformanceConfig,
  ScheduledPostItem,
  SearchConfig,
  SocialConfig,
  SocialPlatformId,
  StatsConfig,
  ToolkitState,
} from './types/toolkit';
import {
  INITIAL_AUDIT_ENTRIES,
  INITIAL_STATE,
  calculatePerformanceMetrics,
} from './utils/toolkitLogic';
import { LiveSidebarPreview } from './components/LiveSidebarPreview';
import { CalendarModulePanel } from './components/CalendarModulePanel';
import { SearchModulePanel } from './components/SearchModulePanel';
import { SocialModulePanel } from './components/SocialModulePanel';
import { StatsModulePanel } from './components/StatsModulePanel';
import { GdprCookieModulePanel } from './components/GdprCookieModulePanel';
import { InfoBannerModulePanel } from './components/InfoBannerModulePanel';
import { OptimizerModulePanel } from './components/OptimizerModulePanel';
import { AuditLogModulePanel } from './components/AuditLogModulePanel';
import { OverviewAndExportPanel } from './components/OverviewAndExportPanel';
import { AndWrenchLogo } from './components/AndWrenchLogo';

const STORAGE_KEY = 'and_toolkit_wp_state_v050';

export default function App() {
  const [state, setState] = useState<ToolkitState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...INITIAL_STATE, ...JSON.parse(saved) };
      }
    } catch {
      // ignore storage error
    }
    return INITIAL_STATE;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  // Sync dark mode class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (state.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [state.theme]);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore storage error
    }
  }, [state]);

  const triggerSaveFeedback = (msg = 'Beállítások mentve a WordPress adatbázisba') => {
    setSavedNotice(msg);
    setTimeout(() => setSavedNotice(null), 2400);
  };

  const toggleTheme = () => {
    setState((prev) => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light',
    }));
  };

  const updateCalendar = (patch: Partial<CalendarConfig>) => {
    setState((prev) => ({
      ...prev,
      calendar: { ...prev.calendar, ...patch },
    }));
  };

  const updateSearch = (patch: Partial<SearchConfig>) => {
    setState((prev) => ({
      ...prev,
      search: { ...prev.search, ...patch },
    }));
  };

  const updateSocial = (patch: Partial<SocialConfig>) => {
    setState((prev) => ({
      ...prev,
      social: { ...prev.social, ...patch },
    }));
  };

  const updateStats = (patch: Partial<StatsConfig>) => {
    setState((prev) => ({
      ...prev,
      stats: { ...prev.stats, ...patch },
    }));
  };

  const updateGdpr = (patch: Partial<GdprConfig>) => {
    setState((prev) => ({
      ...prev,
      gdpr: { ...prev.gdpr, ...patch },
    }));
  };

  const updateBanner = (patch: Partial<BannerConfig>) => {
    setState((prev) => ({
      ...prev,
      banner: { ...prev.banner, ...patch },
    }));
  };

  const updateOptimizer = (patch: Partial<OptimizerConfig>) => {
    setState((prev) => ({
      ...prev,
      optimizer: { ...prev.optimizer, ...patch },
    }));
  };

  const updateAuditLog = (patch: Partial<AuditLogConfig>) => {
    setState((prev) => ({
      ...prev,
      auditLog: { ...prev.auditLog, ...patch },
    }));
  };

  const updatePerformance = (patch: Partial<PerformanceConfig>) => {
    setState((prev) => ({
      ...prev,
      performance: { ...prev.performance, ...patch },
    }));
  };

  const handleToggleModule = (
    module:
      | 'calendar'
      | 'search'
      | 'social'
      | 'stats'
      | 'gdpr'
      | 'banner'
      | 'optimizer'
      | 'auditLog',
    enabled: boolean
  ) => {
    setState((prev) => ({
      ...prev,
      [module]: { ...prev[module], enabled },
    }));
  };

  const handleAppendAuditLogEntry = (entry: AuditLogEntry, sendEmail = false) => {
    setState((prev) => ({
      ...prev,
      auditLog: {
        ...prev.auditLog,
        entries: [entry, ...prev.auditLog.entries],
        emailsSentTotal: prev.auditLog.emailsSentTotal + (sendEmail ? 1 : 0),
      },
    }));
    triggerSaveFeedback(
      sendEmail
        ? `Esemény naplózva + E-mail riasztás kiküldve (${state.auditLog.recipientEmail})!`
        : `Új biztonsági esemény rögzítve a WordPress naplóban: ${entry.actionLabel}`
    );
  };

  const handleClearAuditLogs = () => {
    setState((prev) => ({
      ...prev,
      auditLog: {
        ...prev.auditLog,
        entries: INITIAL_AUDIT_ENTRIES,
      },
    }));
    triggerSaveFeedback('Biztonsági eseménynapló alapértelmezett állapotba állítva');
  };

  const handleSendTestDigestEmail = () => {
    const nowStr = new Date().toISOString().slice(0, 19).replace('T', ' ');
    setState((prev) => ({
      ...prev,
      auditLog: {
        ...prev.auditLog,
        lastDigestSentAt: nowStr,
        emailsSentTotal: prev.auditLog.emailsSentTotal + 1,
      },
    }));
    triggerSaveFeedback(
      `24 órás frissítési összefoglaló e-mail elküldve ide: ${state.auditLog.recipientEmail}`
    );
  };

  const handleRunInteractiveOptimization = () => {
    setState((prev) => {
      const targetFmt = prev.optimizer.convertFormat;
      const compressionRatio = Math.max(
        0.18,
        (100 - prev.optimizer.compressionQuality) / 100 +
          (targetFmt === 'avif' ? 0.48 : targetFmt === 'webp' ? 0.38 : 0.15)
      );

      const updatedQueue = prev.optimizer.mediaQueue.map((item) => {
        if (item.status === 'optimized') {
          return item;
        }
        const newSize = Math.max(
          24,
          Math.round(item.originalSizeKb * (1 - Math.min(0.84, compressionRatio)))
        );
        const newFormat: 'WebP' | 'AVIF' | 'JPG' =
          targetFmt === 'avif'
            ? 'AVIF'
            : targetFmt === 'webp'
            ? 'WebP'
            : 'JPG';
        const resizedDims = prev.optimizer.autoResizeEnabled
          ? `${Math.min(prev.optimizer.maxWidthPx, 1920)}×${Math.min(
              prev.optimizer.maxHeightPx,
              1080
            )}`
          : item.originalDimensions;

        return {
          ...item,
          optimizedSizeKb: newSize,
          targetFormat: newFormat,
          resizedDimensions: resizedDims,
          status: 'optimized' as const,
        };
      });

      const nowStr = new Date().toISOString().slice(0, 19).replace('T', ' ');
      return {
        ...prev,
        optimizer: {
          ...prev.optimizer,
          mediaQueue: updatedQueue,
          lastOptimizedAt: nowStr,
          totalOptimizationRuns: prev.optimizer.totalOptimizationRuns + 1,
          speedMetrics: {
            ...prev.optimizer.speedMetrics,
            ttfbMs: Math.max(24, prev.optimizer.speedMetrics.ttfbMs - 4),
            lcpMs: Math.max(520, prev.optimizer.speedMetrics.lcpMs - 45),
            pageSpeedScore: Math.min(
              100,
              prev.optimizer.speedMetrics.pageSpeedScore + 1
            ),
            totalSavedMb: Number(
              (prev.optimizer.speedMetrics.totalSavedMb + 1.8).toFixed(1)
            ),
          },
        },
      };
    });
    triggerSaveFeedback(
      'Kézi Optimalizálás & Sebességmérés lefutott: Képek tömörítve, Lazy Load & Gyorsítótár frissítve!'
    );
  };

  const handlePurgeCache = () => {
    const nowStr = new Date().toISOString().slice(0, 19).replace('T', ' ');
    setState((prev) => ({
      ...prev,
      optimizer: {
        ...prev.optimizer,
        currentCacheSizeMb: 0,
        lastCachePurgedAt: nowStr,
      },
    }));
    triggerSaveFeedback('WordPress Gyorsítótár (Page + Object Cache) sikeresen ürítve!');
  };

  const handleOptimizeSingleImage = (id: string) => {
    setState((prev) => {
      const targetFmt = prev.optimizer.convertFormat;
      const updatedQueue = prev.optimizer.mediaQueue.map((item) => {
        if (item.id !== id) return item;
        const newFormat: 'WebP' | 'AVIF' | 'JPG' =
          targetFmt === 'avif'
            ? 'AVIF'
            : targetFmt === 'webp'
            ? 'WebP'
            : 'JPG';
        const factor =
          targetFmt === 'avif' ? 0.24 : targetFmt === 'webp' ? 0.32 : 0.65;
        const newSize = Math.max(22, Math.round(item.originalSizeKb * factor));
        const resizedDims = prev.optimizer.autoResizeEnabled
          ? `${Math.min(prev.optimizer.maxWidthPx, 1920)}×${Math.min(
              prev.optimizer.maxHeightPx,
              1080
            )}`
          : item.originalDimensions;
        return {
          ...item,
          optimizedSizeKb: newSize,
          targetFormat: newFormat,
          resizedDimensions: resizedDims,
          status: 'optimized' as const,
        };
      });
      return {
        ...prev,
        optimizer: {
          ...prev.optimizer,
          mediaQueue: updatedQueue,
        },
      };
    });
    triggerSaveFeedback('Kép egyedileg tömörítve, átméretezve és konvertálva!');
  };

  const handleAddSampleImage = () => {
    setState((prev) => {
      const isAuto =
        prev.optimizer.autoOptimizeEnabled &&
        prev.optimizer.autoSchedule === 'realtime-upload';
      const newItem = {
        id: `img-${Date.now()}`,
        fileName: `wp71-uj-termekfoto-${prev.optimizer.mediaQueue.length + 1}.png`,
        originalFormat: 'PNG' as const,
        targetFormat:
          prev.optimizer.convertFormat === 'avif'
            ? ('AVIF' as const)
            : ('WebP' as const),
        originalDimensions: '3200×2000',
        resizedDimensions: prev.optimizer.autoResizeEnabled
          ? `${prev.optimizer.maxWidthPx}×${prev.optimizer.maxHeightPx}`
          : '3200×2000',
        originalSizeKb: 2240,
        optimizedSizeKb: isAuto ? 290 : 2240,
        status: isAuto ? ('optimized' as const) : ('pending' as const),
      };
      return {
        ...prev,
        optimizer: {
          ...prev.optimizer,
          mediaQueue: [newItem, ...prev.optimizer.mediaQueue],
        },
      };
    });
    triggerSaveFeedback('Új médiafájl hozzáadva a képfeldolgozási listához!');
  };

  const handleSimulateBannerClick = () => {
    setState((prev) => ({
      ...prev,
      banner: {
        ...prev.banner,
        impressions: prev.banner.impressions + 5,
        clicks: prev.banner.clicks + 1,
      },
    }));
    triggerSaveFeedback('Információs Banner CTA kattintás rögzítve (+1)');
  };

  const handleToggleGdprCategoryDefault = (id: GdprCategoryId) => {
    setState((prev) => ({
      ...prev,
      gdpr: {
        ...prev.gdpr,
        categories: prev.gdpr.categories.map((cat) =>
          cat.id === id && !cat.required
            ? { ...cat, defaultEnabled: !cat.defaultEnabled }
            : cat
        ),
      },
    }));
  };

  const handleRecordGdprConsent = (type: 'all' | 'custom' | 'essential') => {
    setState((prev) => ({
      ...prev,
      gdpr: {
        ...prev.gdpr,
        consentStats: {
          acceptedAll:
            prev.gdpr.consentStats.acceptedAll + (type === 'all' ? 1 : 0),
          customSelection:
            prev.gdpr.consentStats.customSelection + (type === 'custom' ? 1 : 0),
          essentialOnly:
            prev.gdpr.consentStats.essentialOnly + (type === 'essential' ? 1 : 0),
        },
      },
    }));
    triggerSaveFeedback('GDPR süti-hozzájárulás naplózva (+1)');
  };

  const handleAddPost = (newPost: ScheduledPostItem) => {
    setState((prev) => ({
      ...prev,
      posts: [newPost, ...prev.posts],
    }));
    triggerSaveFeedback('Új esemény közzétéve az oldalsáv naptárban');
  };

  const handleDeletePost = (id: string) => {
    setState((prev) => ({
      ...prev,
      posts: prev.posts.filter((p) => p.id !== id),
    }));
  };

  const handleToggleSocialPlatform = (id: SocialPlatformId) => {
    setState((prev) => ({
      ...prev,
      social: {
        ...prev.social,
        platforms: prev.social.platforms.map((p) =>
          p.id === id ? { ...p, enabled: !p.enabled } : p
        ),
      },
    }));
  };

  const handleShareClick = (id: SocialPlatformId) => {
    setState((prev) => ({
      ...prev,
      social: {
        ...prev.social,
        platforms: prev.social.platforms.map((p) =>
          p.id === id ? { ...p, shareCount: p.shareCount + 1 } : p
        ),
      },
      stats: {
        ...prev.stats,
        totals: {
          ...prev.stats.totals,
          shareConversions: prev.stats.totals.shareConversions + 1,
        },
      },
    }));
  };

  const handleTriggerDownload = (postId: string) => {
    setState((prev) => ({
      ...prev,
      posts: prev.posts.map((p) =>
        p.id === postId ? { ...p, downloads: (p.downloads || 0) + 1 } : p
      ),
      stats: {
        ...prev.stats,
        totals: {
          ...prev.stats.totals,
          totalDownloads: prev.stats.totals.totalDownloads + 1,
        },
      },
    }));
    triggerSaveFeedback('Letöltés rögzítve a statisztikai modulban (+1)');
  };

  const handleSimulateTraffic = (visitorsDelta: number, downloadsDelta: number) => {
    setState((prev) => {
      const updatedHistory = [...prev.stats.history];
      if (updatedHistory.length > 0) {
        const lastIdx = updatedHistory.length - 1;
        updatedHistory[lastIdx] = {
          ...updatedHistory[lastIdx],
          uniqueVisitors: updatedHistory[lastIdx].uniqueVisitors + visitorsDelta,
          downloads: updatedHistory[lastIdx].downloads + downloadsDelta,
        };
      }
      return {
        ...prev,
        stats: {
          ...prev.stats,
          totals: {
            ...prev.stats.totals,
            uniqueVisitors: prev.stats.totals.uniqueVisitors + visitorsDelta,
            totalDownloads: prev.stats.totals.totalDownloads + downloadsDelta,
          },
          history: updatedHistory,
        },
      };
    });
    triggerSaveFeedback('Valós idejű látogatói/letöltési számláló frissítve');
  };

  const handleResetAll = () => {
    setState(INITIAL_STATE);
    triggerSaveFeedback('Alapértelmezett And ToolKit v0.5.0 beállítások visszaállítva');
  };

  const activeModulesCount = [
    state.calendar.enabled,
    state.search.enabled,
    state.social.enabled,
    state.stats.enabled,
    state.gdpr.enabled,
    state.banner.enabled,
    state.optimizer.enabled,
    state.auditLog.enabled,
  ].filter(Boolean).length;

  const perf = calculatePerformanceMetrics(state.performance, activeModulesCount);

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Strict 3-Zone Top Navigation Bar */}
      <header className="flex items-center justify-between gap-5 px-6 py-3.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        {/* Zone 1: Brand with custom '& in a wrench' logo */}
        <a
          href="#overview"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('overview');
          }}
          className="inline-flex items-center gap-2.5 text-lg font-extrabold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap shrink-0 font-display"
        >
          <AndWrenchLogo size="sm" />
          <span>And ToolKit</span>
        </a>

        {/* Zone 2: Concise single-line text navigation links */}
        <nav
          aria-label="Fő navigáció"
          className="hidden md:flex items-center gap-3.5 text-sm font-medium text-slate-600 dark:text-slate-400"
        >
          <a
            href="#overview"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('overview');
            }}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              activeTab === 'overview'
                ? 'border-blue-600 text-slate-900 dark:text-slate-100 font-semibold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Vezérlőpult
          </a>
          <a
            href="#calendar"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('calendar');
            }}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              activeTab === 'calendar'
                ? 'border-blue-600 text-slate-900 dark:text-slate-100 font-semibold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Naptár
          </a>
          <a
            href="#search"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('search');
            }}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              activeTab === 'search'
                ? 'border-blue-600 text-slate-900 dark:text-slate-100 font-semibold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Kereső
          </a>
          <a
            href="#social"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('social');
            }}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              activeTab === 'social'
                ? 'border-blue-600 text-slate-900 dark:text-slate-100 font-semibold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Megosztás
          </a>
          <a
            href="#stats"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('stats');
            }}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              activeTab === 'stats'
                ? 'border-blue-600 text-slate-900 dark:text-slate-100 font-semibold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Statisztikák
          </a>
          <a
            href="#gdpr"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('gdpr');
            }}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              activeTab === 'gdpr'
                ? 'border-blue-600 text-slate-900 dark:text-slate-100 font-semibold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            GDPR Cookie
          </a>
          <a
            href="#banner"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('banner');
            }}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              activeTab === 'banner'
                ? 'border-blue-600 text-slate-900 dark:text-slate-100 font-semibold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Info Banner
          </a>
          <a
            href="#optimizer"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('optimizer');
            }}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              activeTab === 'optimizer'
                ? 'border-blue-600 text-slate-900 dark:text-slate-100 font-semibold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Optimalizáló
          </a>
          <a
            href="#audit-log"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('audit-log');
            }}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              activeTab === 'audit-log'
                ? 'border-blue-600 text-slate-900 dark:text-slate-100 font-semibold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Naplózás &amp; E-mail
          </a>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('export')}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap shrink-0"
          >
            PHP Plugin Exportálása
          </button>
        </div>
      </header>

      {/* Secondary Workspace Context & Theme Toolbar */}
      <div className="bg-white/80 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-2.5">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Breadcrumb & Plugin Metadata Summary */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium text-slate-700 dark:text-slate-300">
              WordPress Adminisztráció
            </span>
            <span aria-hidden="true">/</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              And ToolKit
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">Verzió: 0.5.0</span>
            <span aria-hidden="true">·</span>
            <span>
              Készítő: <strong className="text-slate-800 dark:text-slate-200">galandras12+AI</strong>
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
              {activeModulesCount}/8 modul · Betöltés: {perf.estimatedLoadMs}ms ({perf.bundleSizeKb} KB)
            </span>
          </div>

          {/* Workspace Action Controls: Dark/Light Mode + Reset + Save */}
          <div className="flex flex-wrap items-center gap-2">
            {savedNotice && (
              <span
                role="status"
                className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 mr-1"
              >
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>{savedNotice}</span>
              </span>
            )}

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={
                state.theme === 'light'
                  ? 'Váltás sötét módra'
                  : 'Váltás világos módra'
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0"
            >
              {state.theme === 'light' ? (
                <>
                  <Moon className="w-3.5 h-3.5" />
                  <span>Sötét mód</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Világos mód</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleResetAll}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Alaphelyzet</span>
            </button>

            <button
              type="button"
              onClick={() => triggerSaveFeedback()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors whitespace-nowrap shrink-0"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Beállítások Mentése</span>
            </button>
          </div>
        </div>

        {/* Mobile Module Switcher Bar (visible on small screens) */}
        <div
          role="tablist"
          aria-label="Modul választó"
          className="flex md:hidden items-center gap-1.5 overflow-x-auto pt-2.5 pb-0.5"
        >
          {[
            { id: 'overview' as const, label: 'Vezérlőpult', icon: LayoutDashboard },
            { id: 'calendar' as const, label: 'Naptár', icon: Calendar },
            { id: 'search' as const, label: 'Kereső', icon: Search },
            { id: 'social' as const, label: 'Megosztás', icon: Share2 },
            { id: 'stats' as const, label: 'Statisztika', icon: BarChart3 },
            { id: 'gdpr' as const, label: 'GDPR Cookie', icon: ShieldCheck },
            { id: 'banner' as const, label: 'Info Banner', icon: Megaphone },
            { id: 'optimizer' as const, label: 'Optimalizáló', icon: Zap },
            { id: 'audit-log' as const, label: 'Naplózás & E-mail', icon: Terminal },
            { id: 'export' as const, label: 'PHP Kód', icon: Code2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main 1440px Workspace Split: Left Admin Configuration + Right Live WordPress Sidebar */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Admin Configuration Panel (7 cols on large desktop) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 sm:p-6">
            {activeTab === 'overview' && (
              <OverviewAndExportPanel
                mode="overview"
                state={state}
                onNavigateTab={setActiveTab}
                onToggleModule={handleToggleModule}
                onUpdatePerformance={updatePerformance}
              />
            )}

            {activeTab === 'calendar' && (
              <CalendarModulePanel
                config={state.calendar}
                posts={state.posts}
                onUpdateConfig={updateCalendar}
                onAddPost={handleAddPost}
                onDeletePost={handleDeletePost}
              />
            )}

            {activeTab === 'search' && (
              <SearchModulePanel
                config={state.search}
                onUpdateConfig={updateSearch}
              />
            )}

            {activeTab === 'social' && (
              <SocialModulePanel
                config={state.social}
                onUpdateConfig={updateSocial}
                onTogglePlatform={handleToggleSocialPlatform}
                onShareClick={handleShareClick}
              />
            )}

            {activeTab === 'stats' && (
              <StatsModulePanel
                config={state.stats}
                onUpdateConfig={updateStats}
                onSimulateTraffic={handleSimulateTraffic}
              />
            )}

            {activeTab === 'gdpr' && (
              <GdprCookieModulePanel
                config={state.gdpr}
                onUpdateConfig={updateGdpr}
                onToggleCategoryDefault={handleToggleGdprCategoryDefault}
                onRecordConsent={handleRecordGdprConsent}
              />
            )}

            {activeTab === 'banner' && (
              <InfoBannerModulePanel
                config={state.banner}
                onUpdateConfig={updateBanner}
                onSimulateClick={handleSimulateBannerClick}
              />
            )}

            {activeTab === 'optimizer' && (
              <OptimizerModulePanel
                config={state.optimizer}
                onUpdateConfig={updateOptimizer}
                onRunInteractiveOptimization={handleRunInteractiveOptimization}
                onPurgeCache={handlePurgeCache}
                onOptimizeSingleImage={handleOptimizeSingleImage}
                onAddSampleImage={handleAddSampleImage}
              />
            )}

            {activeTab === 'audit-log' && (
              <AuditLogModulePanel
                config={state.auditLog}
                onUpdateConfig={updateAuditLog}
                onAppendLogEntry={handleAppendAuditLogEntry}
                onClearLogs={handleClearAuditLogs}
                onSendTestDigestEmail={handleSendTestDigestEmail}
              />
            )}

            {activeTab === 'export' && (
              <OverviewAndExportPanel
                mode="export"
                state={state}
                onNavigateTab={setActiveTab}
                onToggleModule={handleToggleModule}
                onUpdatePerformance={updatePerformance}
              />
            )}
          </div>

          {/* Right Column: Live WordPress Sidebar Preview (5 cols on large desktop) */}
          <div className="lg:col-span-5">
            <LiveSidebarPreview
              state={state}
              onDeviceChange={(device) =>
                setState((prev) => ({ ...prev, previewDevice: device }))
              }
              onShareClick={handleShareClick}
              onTriggerDownload={handleTriggerDownload}
              onRecordGdprConsent={handleRecordGdprConsent}
              onBannerClick={handleSimulateBannerClick}
              onRunQuickOptimize={handleRunInteractiveOptimization}
            />
          </div>
        </div>
      </main>

      {/* Quiet Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-4">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span>
            And ToolKit v0.5.0 · Készítő: galandras12+AI · Auditálva: WordPress 7.1, PHP 8.0+ &amp; EU GDPR
          </span>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setActiveTab('export')}
              className="hover:text-slate-900 dark:hover:text-slate-200 underline"
            >
              WordPress 7.1 &amp; PHP 8.0 Audit + Forráskód
            </button>
            <span>GPL v2 Licenc</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
