import React, { useState } from 'react';
import {
  Calendar,
  Check,
  Copy,
  Download,
  Eye,
  FileText,
  Lock,
  Megaphone,
  Monitor,
  Search,
  Share2,
  ShieldCheck,
  Smartphone,
  Terminal,
  TrendingUp,
  Users,
  X,
  Zap,
} from 'lucide-react';
import {
  GdprCategoryId,
  ScheduledPostItem,
  SocialPlatformId,
  ToolkitState,
} from '../types/toolkit';
import {
  formatMetricValue,
  getDaysUntilEvent,
  getFilteredCalendarPosts,
  searchPosts,
} from '../utils/toolkitLogic';
import { getBannerVisualClasses } from './InfoBannerModulePanel';

interface LiveSidebarPreviewProps {
  state: ToolkitState;
  onDeviceChange: (device: 'desktop' | 'mobile') => void;
  onShareClick: (platformId: SocialPlatformId) => void;
  onTriggerDownload: (postId: string) => void;
  onRecordGdprConsent: (type: 'all' | 'custom' | 'essential') => void;
  onBannerClick: () => void;
  onRunQuickOptimize?: () => void;
}

const ACCENT_MAP = {
  blue: {
    bg: 'bg-blue-600 dark:bg-blue-500',
    softBg: 'bg-blue-50 dark:bg-blue-950/50',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800',
  },
  emerald: {
    bg: 'bg-emerald-600 dark:bg-emerald-500',
    softBg: 'bg-emerald-50 dark:bg-emerald-950/50',
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-200 dark:border-emerald-800',
  },
  amber: {
    bg: 'bg-amber-600 dark:bg-amber-500',
    softBg: 'bg-amber-50 dark:bg-amber-950/50',
    text: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-800',
  },
  rose: {
    bg: 'bg-rose-600 dark:bg-rose-500',
    softBg: 'bg-rose-50 dark:bg-rose-950/50',
    text: 'text-rose-600 dark:text-rose-400',
    border: 'border-rose-200 dark:border-rose-800',
  },
  slate: {
    bg: 'bg-slate-800 dark:bg-slate-200',
    softBg: 'bg-slate-100 dark:bg-slate-800',
    text: 'text-slate-700 dark:text-slate-300',
    border: 'border-slate-300 dark:border-slate-700',
  },
};

function renderHighlightedText(text: string, query: string, enabled: boolean) {
  if (!enabled || !query.trim()) return text;
  const clean = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${clean})`, 'gi'));
  return parts.map((part, idx) =>
    part.toLowerCase() === query.trim().toLowerCase() ? (
      <mark
        key={idx}
        className="bg-amber-200/80 dark:bg-amber-500/30 text-slate-900 dark:text-amber-100 px-0.5 rounded-xs font-medium"
      >
        {part}
      </mark>
    ) : (
      part
    )
  );
}

function SocialSvgIcon({ id }: { id: SocialPlatformId }) {
  switch (id) {
    case 'facebook':
      return (
        <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
        </svg>
      );
    case 'x':
      return (
        <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
        </svg>
      );
    case 'whatsapp':
      return (
        <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23-1.48 0-2.93-.39-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.188 8.188 0 0 1-1.26-4.38c.01-4.54 3.7-8.24 8.25-8.24" />
        </svg>
      );
    case 'telegram':
      return (
        <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
      );
    case 'reddit':
      return (
        <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10zm6.27-9.73c.09.42.13.85.13 1.29 0 3.42-3.83 6.19-8.55 6.19-4.72 0-8.55-2.77-8.55-6.19 0-.44.04-.87.13-1.29a1.76 1.76 0 0 1-.68-1.39c0-.98.8-1.77 1.77-1.77.47 0 .9.19 1.22.49 1.76-1.2 4.18-1.97 6.88-2.04l1.43-4.49a.42.42 0 0 1 .5-.28l3.18.71c.29-.52.84-.88 1.48-.88.94 0 1.7.76 1.7 1.7s-.76 1.7-1.7 1.7-1.7-.76-1.7-1.7l-2.81-.63-1.25 3.92c2.64.09 5.01.85 6.75 2.03.32-.3.75-.49 1.22-.49.98 0 1.77.8 1.77 1.77 0 .56-.26 1.07-.68 1.39z" />
        </svg>
      );
    case 'pinterest':
      return (
        <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.592 0 12.017 0z" />
        </svg>
      );
    case 'email':
      return (
        <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
        </svg>
      );
  }
}

export const LiveSidebarPreview: React.FC<LiveSidebarPreviewProps> = ({
  state,
  onDeviceChange,
  onShareClick,
  onTriggerDownload,
  onRecordGdprConsent,
  onBannerClick,
  onRunQuickOptimize,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [lastSharedPlatform, setLastSharedPlatform] = useState<string | null>(null);
  const [selectedPostModal, setSelectedPostModal] = useState<ScheduledPostItem | null>(null);
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number | null>(5);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [visitorConsentSaved, setVisitorConsentSaved] = useState<'all' | 'custom' | 'essential' | null>(null);
  const [visitorCookiePrefs, setVisitorCookiePrefs] = useState<Record<GdprCategoryId, boolean>>({
    necessary: true,
    preferences: true,
    analytics: true,
    marketing: false,
  });

  const calendarPosts = getFilteredCalendarPosts(state.posts, state.calendar);
  const searchResults = searchPosts(state.posts, searchQuery, state.search);
  const enabledSocials = state.social.platforms.filter((p) => p.enabled);
  const totalSocialShares = state.social.platforms.reduce((acc, p) => acc + p.shareCount, 0);

  const calAccent = ACCENT_MAP[state.calendar.accentColor] || ACCENT_MAP.blue;
  const statsAccent = ACCENT_MAP[state.stats.accentTheme] || ACCENT_MAP.blue;

  const handleCopyLink = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePlatformShare = (id: SocialPlatformId, name: string) => {
    onShareClick(id);
    setLastSharedPlatform(name);
    setTimeout(() => setLastSharedPlatform(null), 2200);
  };

  const handleVisitorCookieAction = (type: 'all' | 'custom' | 'essential') => {
    onRecordGdprConsent(type);
    setVisitorConsentSaved(type);
  };

  // Generate November 2026 calendar days (Nov 1, 2026 is Sunday -> in Monday-first HU calendar it's col 7)
  const eventDaysMap = new Map<number, ScheduledPostItem[]>();
  state.posts.forEach((p) => {
    if (p.date.startsWith('2026-11-')) {
      const dayNum = parseInt(p.date.slice(8, 10), 10);
      if (!Number.isNaN(dayNum)) {
        const list = eventDaysMap.get(dayNum) || [];
        list.push(p);
        eventDaysMap.set(dayNum, list);
      }
    }
  });

  return (
    <aside
      aria-label="WordPress Oldalsáv Élő Előnézet"
      className="flex flex-col bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden"
    >
      {/* Preview Header Bar */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Élő Oldalsáv Előnézet
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            WordPress 7.1 Frontend Widget Sáv · PHP 8.0+ · Azonnali szinkron
          </p>
        </div>

        {/* Responsive Viewport Switcher */}
        <div
          role="group"
          aria-label="Előnézeti képernyőméret"
          className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg"
        >
          <button
            type="button"
            onClick={() => onDeviceChange('desktop')}
            aria-label="Asztali oldalsáv nézet"
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              state.previewDevice === 'desktop'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Asztali</span>
          </button>
          <button
            type="button"
            onClick={() => onDeviceChange('mobile')}
            aria-label="Mobil reszponzív nézet"
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              state.previewDevice === 'mobile'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobil (360px)</span>
          </button>
        </div>
      </div>

      {/* Simulated WordPress Sidebar Container */}
      <div className="p-4 flex justify-center">
        <div
          className={`w-full transition-all duration-200 space-y-5 ${
            state.previewDevice === 'mobile'
              ? 'max-w-[340px] border-x-2 border-dashed border-slate-300 dark:border-slate-700 px-3 py-2'
              : 'max-w-full'
          }`}
        >
          {/* 0. PERSISTENT INFO BANNER PREVIEW (v0.3.0) */}
          {state.banner.enabled && (
            <section aria-label="Információs Banner Előnézet">
              {bannerDismissed ? (
                <div className="px-3 py-2 rounded-lg bg-slate-200/70 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400">
                    Információs banner bezárva a látogató által
                  </span>
                  <button
                    type="button"
                    onClick={() => setBannerDismissed(false)}
                    className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Banner újranyitása
                  </button>
                </div>
              ) : (
                (() => {
                  const bVis = getBannerVisualClasses(state.banner);
                  const scopeLabel =
                    state.banner.visibilityScope === 'homepage-only'
                      ? 'Csak Főoldal'
                      : state.banner.visibilityScope === 'all-pages'
                      ? 'Minden Oldal'
                      : state.banner.visibilityScope === 'blog-posts'
                      ? 'Bejegyzések'
                      : 'Oldalsáv';
                  return (
                    <div
                      style={bVis.inlineStyle}
                      className={`rounded-lg border border-black/10 dark:border-white/10 transition-all overflow-hidden ${bVis.containerClass} ${bVis.sizeClass} ${bVis.animClass}`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5 opacity-85 text-[10px] font-mono">
                        <span>
                          {state.banner.badgeText || 'INFO'} · {scopeLabel}
                        </span>
                        <span>[wtk_info_banner]</span>
                      </div>
                      <div
                        className={`flex items-start gap-2 ${
                          state.banner.animation === 'marquee' ? 'atk-anim-marquee' : ''
                        }`}
                      >
                        {state.banner.showIcon && (
                          <Megaphone className="w-4 h-4 shrink-0 mt-0.5 opacity-95" />
                        )}
                        <div className={`min-w-0 flex-1 ${bVis.fontClass}`}>
                          <div className="leading-snug">{state.banner.headline}</div>
                          {state.banner.sizePreset === 'large-hero' && state.banner.subtext && (
                            <p className="text-[11px] opacity-90 font-normal not-italic mt-1">
                              {state.banner.subtext}
                            </p>
                          )}
                        </div>
                        {state.banner.dismissible && (
                          <button
                            type="button"
                            onClick={() => setBannerDismissed(true)}
                            aria-label="Információs banner bezárása"
                            className="p-0.5 rounded hover:bg-black/20 shrink-0"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      {state.banner.ctaLabel && (
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={onBannerClick}
                            className="px-2.5 py-1 text-[11px] font-semibold rounded bg-white text-slate-900 hover:bg-slate-100 transition-colors"
                          >
                            {state.banner.ctaLabel} →
                          </button>
                          <span className="text-[10px] font-mono opacity-80">
                            {state.banner.clicks} kattintás
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })()
              )}
            </section>
          )}

          {/* 1. SEARCH WIDGET PREVIEW */}
          {state.search.enabled && (
            <section
              aria-label="Kereső Widget Előnézet"
              className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {state.search.widgetTitle}
                </h3>
                <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                  [wtk_search]
                </span>
              </div>

              {/* Search Input Box */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  role="searchbox"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={state.search.placeholder}
                  aria-label="Keresés a WordPress oldalsávban"
                  className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Keresés törlése"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Popular Quick Filter Buttons */}
              {state.search.showPopularTags && state.search.popularTags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 mr-0.5">
                    Gyorskeresés:
                  </span>
                  {state.search.popularTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setSearchQuery(searchQuery === tag ? '' : tag)}
                      className={`px-2 py-0.5 text-[11px] rounded transition-colors whitespace-nowrap shrink-0 ${
                        searchQuery.toLowerCase() === tag.toLowerCase()
                          ? 'bg-blue-600 text-white font-medium'
                          : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}

              {/* Customizable Search Results List */}
              <div className="pt-1 divide-y divide-slate-100 dark:divide-slate-800/80">
                {searchResults.length === 0 ? (
                  <div className="py-5 text-center space-y-2">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Nincs találat erre a kifejezésre: „{searchQuery}”
                    </p>
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Szűrés alaphelyzetbe állítása
                    </button>
                  </div>
                ) : (
                  searchResults.map((item) => (
                    <article
                      key={item.id}
                      className={`py-2.5 first:pt-1 last:pb-0 flex items-start gap-2.5 ${
                        state.search.layout === 'compact-cards'
                          ? 'px-2.5 my-1 rounded-md bg-slate-50/70 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80'
                          : ''
                      }`}
                    >
                      {state.search.showThumbnail && (
                        <div
                          aria-hidden="true"
                          className="w-10 h-10 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 flex items-center justify-center shrink-0 text-slate-600 dark:text-slate-400"
                        >
                          {item.postType === 'download' ? (
                            <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          ) : item.postType === 'event' ? (
                            <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          ) : (
                            <FileText className="w-4 h-4" />
                          )}
                        </div>
                      )}

                      <div className="min-w-0 flex-1 space-y-1">
                        <button
                          type="button"
                          onClick={() => setSelectedPostModal(item)}
                          className="text-left text-xs font-semibold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2"
                        >
                          {renderHighlightedText(
                            item.title,
                            searchQuery,
                            state.search.highlightMatches
                          )}
                        </button>

                        {/* Zero-Pill Unboxed Metadata with · separators */}
                        {(state.search.showCategory || state.search.showDate) && (
                          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                            {state.search.showCategory && <span>{item.category}</span>}
                            {state.search.showCategory && state.search.showDate && (
                              <span aria-hidden="true">·</span>
                            )}
                            {state.search.showDate && (
                              <span className="font-mono tabular-nums">{item.date}</span>
                            )}
                            {item.postType === 'download' && (
                              <>
                                <span aria-hidden="true">·</span>
                                <button
                                  type="button"
                                  onClick={() => onTriggerDownload(item.id)}
                                  className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline inline-flex items-center gap-0.5"
                                >
                                  Letöltés ({item.downloads || 0})
                                </button>
                              </>
                            )}
                          </div>
                        )}

                        {state.search.showExcerpt && state.search.layout !== 'minimal' && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                            {renderHighlightedText(
                              item.excerpt,
                              searchQuery,
                              state.search.highlightMatches
                            )}
                          </p>
                        )}
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>
          )}

          {/* 2. EVENT CALENDAR WIDGET PREVIEW */}
          {state.calendar.enabled && (
            <section
              aria-label="Esemény Naptár Widget Előnézet"
              className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {state.calendar.widgetTitle}
                </h3>
                <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                  [wtk_calendar]
                </span>
              </div>

              {/* STYLE A: MONTHLY GRID VIEW */}
              {state.calendar.style === 'grid' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300 px-1">
                    <span>2026. November</span>
                    <span className="text-[11px] text-slate-500 font-mono tabular-nums">
                      {calendarPosts.length} esemény
                    </span>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-medium text-slate-400">
                    <span>H</span>
                    <span>K</span>
                    <span>Sze</span>
                    <span>Cs</span>
                    <span>P</span>
                    <span>Szo</span>
                    <span>V</span>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {/* Empty slots before Nov 1 (Sunday) */}
                    {[1, 2, 3, 4, 5, 6].map((empty) => (
                      <div key={`empty-${empty}`} className="h-7" />
                    ))}
                    {Array.from({ length: 30 }, (_, idx) => {
                      const day = idx + 1;
                      const dayEvents = eventDaysMap.get(day);
                      const hasEvent = Boolean(dayEvents && dayEvents.length > 0);
                      const isSelected = selectedCalendarDay === day;
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => setSelectedCalendarDay(day)}
                          aria-label={`2026. november ${day}.${hasEvent ? ` (${dayEvents?.length} bejegyzés)` : ''}`}
                          className={`h-7 rounded text-xs font-mono tabular-nums transition-colors flex flex-col items-center justify-center relative ${
                            isSelected
                              ? `${calAccent.bg} text-white font-semibold`
                              : hasEvent
                              ? `${calAccent.softBg} ${calAccent.text} font-semibold border ${calAccent.border}`
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                          }`}
                        >
                          <span>{day}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Selected Day Event Details */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    {selectedCalendarDay && eventDaysMap.get(selectedCalendarDay) ? (
                      eventDaysMap.get(selectedCalendarDay)!.map((ev) => (
                        <div
                          key={ev.id}
                          className="p-2.5 rounded-md bg-slate-50 dark:bg-slate-900 space-y-1"
                        >
                          <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                            {ev.title}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                            {ev.date} · {ev.time} · {ev.category}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500 dark:text-slate-400 py-1">
                        Erre a napra nincs ütemezett bejegyzés. Kattints egy kiemelt napra (pl. 5, 9, 14, 18).
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* STYLE B: CARDS VIEW */}
              {state.calendar.style === 'cards' && (
                <div className="space-y-2.5">
                  {calendarPosts.map((post) => {
                    const daysLeft = getDaysUntilEvent(post.date);
                    return (
                      <article
                        key={post.id}
                        className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 space-y-1.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                            <span className="font-mono tabular-nums font-medium text-slate-700 dark:text-slate-300">
                              {post.date}
                            </span>
                            {state.calendar.showTime && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span className="font-mono tabular-nums">{post.time}</span>
                              </>
                            )}
                            {state.calendar.showCategory && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span className={calAccent.text}>{post.category}</span>
                              </>
                            )}
                          </div>
                          {state.calendar.showCountdown && daysLeft >= 0 && (
                            <span className="text-[11px] font-mono tabular-nums text-slate-500 dark:text-slate-400 shrink-0">
                              {daysLeft === 0 ? 'Ma' : `${daysLeft} nap múlva`}
                            </span>
                          )}
                        </div>

                        <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                          <button
                            type="button"
                            onClick={() => setSelectedPostModal(post)}
                            className="text-left hover:underline"
                          >
                            {post.title}
                          </button>
                        </h4>

                        {state.calendar.showExcerpt && (
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                            {post.excerpt}
                          </p>
                        )}
                      </article>
                    );
                  })}
                </div>
              )}

              {/* STYLE C: COMPACT LIST VIEW */}
              {state.calendar.style === 'compact' && (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {calendarPosts.map((post) => {
                    const dayNum = post.date.slice(8, 10);
                    const monthShort = 'NOV';
                    return (
                      <div
                        key={post.id}
                        className="py-2.5 first:pt-0 last:pb-0 flex items-center gap-3"
                      >
                        <div
                          className={`w-10 h-10 rounded-md ${calAccent.softBg} border ${calAccent.border} flex flex-col items-center justify-center shrink-0`}
                        >
                          <span className="text-[9px] font-bold tracking-wider text-slate-500 dark:text-slate-400">
                            {monthShort}
                          </span>
                          <span className={`text-xs font-mono font-bold tabular-nums ${calAccent.text}`}>
                            {dayNum}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <button
                            type="button"
                            onClick={() => setSelectedPostModal(post)}
                            className="text-left text-xs font-medium text-slate-900 dark:text-slate-100 hover:underline truncate block w-full"
                          >
                            {post.title}
                          </button>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                            {state.calendar.showTime && (
                              <span className="font-mono tabular-nums">{post.time}</span>
                            )}
                            {state.calendar.showTime && state.calendar.showCategory && (
                              <span aria-hidden="true">·</span>
                            )}
                            {state.calendar.showCategory && <span>{post.category}</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* STYLE D: TIMELINE VIEW */}
              {state.calendar.style === 'timeline' && (
                <div className="relative pl-4 space-y-3 before:content-[''] before:absolute before:left-1.5 before:top-1.5 before:bottom-1.5 before:w-px before:bg-slate-200 dark:before:bg-slate-800">
                  {calendarPosts.map((post) => (
                    <div key={post.id} className="relative space-y-0.5">
                      <span
                        aria-hidden="true"
                        className={`w-2 h-2 rounded-full ${calAccent.bg} absolute -left-[13px] top-1.5`}
                      />
                      <div className="text-[11px] font-mono tabular-nums text-slate-500 dark:text-slate-400">
                        {post.date} {state.calendar.showTime ? `· ${post.time}` : ''}
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedPostModal(post)}
                        className="text-left text-xs font-semibold text-slate-900 dark:text-slate-100 hover:underline block"
                      >
                        {post.title}
                      </button>
                      {state.calendar.showCategory && (
                        <div className={`text-[11px] ${calAccent.text}`}>{post.category}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* 3. SOCIAL SHARE WIDGET PREVIEW */}
          {state.social.enabled && (
            <section
              aria-label="Közösségi Megosztás Widget Előnézet"
              className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {state.social.widgetTitle}
                  </h3>
                  {state.social.subtitle && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {state.social.subtitle}
                    </p>
                  )}
                </div>
                {state.social.showTotalShares && (
                  <div className="text-right">
                    <div className="text-xs font-mono font-bold tabular-nums text-slate-900 dark:text-slate-100">
                      {formatMetricValue(totalSocialShares, 'exact')}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">megosztás</div>
                  </div>
                )}
              </div>

              {lastSharedPlatform && (
                <div
                  role="status"
                  className="px-3 py-1.5 rounded bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center justify-between"
                >
                  <span>Megosztva itt: {lastSharedPlatform} (+1)</span>
                  <Check className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`grid gap-2 ${
                  state.social.buttonStyle === 'icon-only'
                    ? 'grid-cols-4'
                    : state.social.columns === 1
                    ? 'grid-cols-1'
                    : state.social.columns === 4
                    ? 'grid-cols-4'
                    : 'grid-cols-2'
                }`}
              >
                {enabledSocials.map((platform) => {
                  const radiusClass =
                    state.social.buttonStyle === 'pill'
                      ? 'rounded-full'
                      : state.social.buttonStyle === 'square'
                      ? 'rounded-none'
                      : 'rounded-md';

                  const colorClasses =
                    state.social.buttonStyle === 'minimal-outline'
                      ? 'bg-transparent border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900'
                      : state.social.useBrandColors
                      ? 'text-white hover:opacity-90'
                      : 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:opacity-90';

                  return (
                    <button
                      key={platform.id}
                      type="button"
                      onClick={() => handlePlatformShare(platform.id, platform.name)}
                      aria-label={`Megosztás: ${platform.name}`}
                      style={
                        state.social.useBrandColors && state.social.buttonStyle !== 'minimal-outline'
                          ? { backgroundColor: platform.brandHex }
                          : undefined
                      }
                      className={`flex items-center justify-between gap-2 px-3 py-2 text-xs font-medium transition-opacity whitespace-nowrap shrink-0 ${radiusClass} ${colorClasses}`}
                    >
                      <span className="flex items-center gap-2 min-w-0 truncate">
                        <SocialSvgIcon id={platform.id} />
                        {state.social.buttonStyle !== 'icon-only' && (
                          <span className="truncate">{platform.name}</span>
                        )}
                      </span>
                      {state.social.showShareCounts && state.social.buttonStyle !== 'icon-only' && (
                        <span className="text-[11px] font-mono tabular-nums opacity-85 shrink-0">
                          {formatMetricValue(platform.shareCount, 'compact')}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {state.social.includeCopyLink && (
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium rounded-md bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Közvetlen hivatkozás vágólapra másolva!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Oldal hivatkozásának másolása {state.social.utmTracking ? '(UTM)' : ''}</span>
                    </>
                  )}
                </button>
              )}
            </section>
          )}

          {/* 4. STATISTICS & EFFICIENCY COUNTER WIDGET PREVIEW */}
          {state.stats.enabled && (
            <section
              aria-label="Statisztika Widget Előnézet"
              className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {state.stats.widgetTitle}
                  </h3>
                  {state.stats.customBadgeText && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {state.stats.customBadgeText}
                    </p>
                  )}
                </div>
                <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                  [wtk_stats]
                </span>
              </div>

              {/* Build visible metric items */}
              {(() => {
                const items = [
                  state.stats.showUniqueVisitors && {
                    key: 'visitors',
                    label: 'Egyedi látogatók',
                    value: formatMetricValue(
                      state.stats.totals.uniqueVisitors,
                      state.stats.numberFormat
                    ),
                    delta: '+14.8%',
                    icon: Users,
                  },
                  state.stats.showTotalDownloads && {
                    key: 'downloads',
                    label: 'Letöltések száma',
                    value: formatMetricValue(
                      state.stats.totals.totalDownloads,
                      state.stats.numberFormat
                    ),
                    delta: '+22.4%',
                    icon: Download,
                  },
                  state.stats.showActiveReaders && {
                    key: 'readers',
                    label: 'Aktív olvasók most',
                    value: formatMetricValue(
                      state.stats.totals.activeReaders,
                      state.stats.numberFormat
                    ),
                    delta: 'Élő',
                    icon: Eye,
                  },
                  state.stats.showShareConversions && {
                    key: 'shares',
                    label: 'Megosztási elérés',
                    value: formatMetricValue(
                      state.stats.totals.shareConversions,
                      state.stats.numberFormat
                    ),
                    delta: '+9.1%',
                    icon: Share2,
                  },
                ].filter(Boolean) as Array<{
                  key: string;
                  label: string;
                  value: string;
                  delta: string;
                  icon: React.ComponentType<{ className?: string }>;
                }>;

                if (state.stats.style === 'clean-list') {
                  return (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      {items.map((m) => (
                        <div
                          key={m.key}
                          className="py-2 first:pt-0 last:pb-0 flex items-center justify-between text-xs"
                        >
                          <span className="text-slate-600 dark:text-slate-400">{m.label}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold tabular-nums text-slate-900 dark:text-slate-100">
                              {m.value}
                            </span>
                            {state.stats.showTrendDelta && (
                              <span className="text-[11px] font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
                                {m.delta}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                }

                if (state.stats.style === 'horizontal-strip') {
                  return (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                      {items.map((m) => (
                        <div
                          key={m.key}
                          className="p-2 rounded bg-slate-50 dark:bg-slate-900 text-center space-y-0.5"
                        >
                          <div className={`text-sm font-mono font-bold tabular-nums ${statsAccent.text}`}>
                            {m.value}
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                            {m.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                }

                if (state.stats.style === 'featured-hero') {
                  const primary = items[0];
                  const rest = items.slice(1);
                  return (
                    <div className="space-y-2.5">
                      {primary && (
                        <div
                          className={`p-3.5 rounded-lg ${statsAccent.softBg} border ${statsAccent.border} flex items-center justify-between`}
                        >
                          <div>
                            <div className="text-xs text-slate-600 dark:text-slate-300">
                              {primary.label}
                            </div>
                            <div
                              className={`text-2xl font-mono font-bold tabular-nums ${statsAccent.text}`}
                            >
                              {primary.value}
                            </div>
                          </div>
                          {state.stats.showTrendDelta && (
                            <div className="text-xs font-mono tabular-nums text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                              <TrendingUp className="w-3.5 h-3.5" />
                              <span>{primary.delta}</span>
                            </div>
                          )}
                        </div>
                      )}
                      {rest.length > 0 && (
                        <div className="grid grid-cols-3 gap-2">
                          {rest.map((m) => (
                            <div
                              key={m.key}
                              className="p-2 rounded bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800"
                            >
                              <div className="text-xs font-mono font-bold tabular-nums text-slate-900 dark:text-slate-100">
                                {m.value}
                              </div>
                              <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                                {m.label}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                // Default: 'grid-cards'
                return (
                  <div className="grid grid-cols-2 gap-2.5">
                    {items.map((m) => {
                      const IconComp = m.icon;
                      return (
                        <div
                          key={m.key}
                          className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 space-y-1"
                        >
                          <div className="flex items-center justify-between text-slate-400 dark:text-slate-500">
                            <IconComp className="w-3.5 h-3.5" />
                            {state.stats.showTrendDelta && (
                              <span className="text-[10px] font-mono tabular-nums text-emerald-600 dark:text-emerald-400 font-medium">
                                {m.delta}
                              </span>
                            )}
                          </div>
                          <div className="text-base font-mono font-bold tabular-nums text-slate-900 dark:text-slate-100">
                            {m.value}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {m.label}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}

              {/* Mini Sparkline Bar Row */}
              {state.stats.showSparkline && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 mb-1.5">
                    <span>Heti látogatói aktivitás</span>
                    <span className="font-mono tabular-nums">
                      Keresési hatékonyság: {state.stats.totals.searchSuccessRate}%
                    </span>
                  </div>
                  <div className="grid grid-cols-7 gap-1.5 items-end h-10 pt-1">
                    {state.stats.history.map((day) => {
                      const heightPct = Math.max(
                        20,
                        Math.min(100, Math.round((day.uniqueVisitors / 8000) * 100))
                      );
                      return (
                        <div key={day.date} className="flex flex-col items-center gap-1 h-full justify-end">
                          <div
                            style={{ height: `${heightPct}%` }}
                            className={`w-full rounded-t-xs ${statsAccent.bg} opacity-80`}
                            title={`${day.label}: ${day.uniqueVisitors} látogató`}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* 5. GDPR COOKIE CONSENT WIDGET / BANNER PREVIEW */}
          {state.gdpr.enabled && (
            <section
              aria-label="GDPR Cookie Kezelő Widget Előnézet"
              className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-4 space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {state.gdpr.widgetTitle}
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                  [wtk_cookie_consent]
                </span>
              </div>

              {visitorConsentSaved ? (
                <div className="p-3 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-200 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" />
                      <span>
                        GDPR Hozzájárulás Rögzítve (
                        {visitorConsentSaved === 'all'
                          ? 'Összes kategória'
                          : visitorConsentSaved === 'custom'
                          ? 'Egyéni beállítás'
                          : 'Csak szükséges'}
                        )
                      </span>
                    </span>
                    <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-300">
                      {state.gdpr.consentExpiryDays} napig érvényes
                    </span>
                  </div>
                  {state.gdpr.showReopenBadge && (
                    <button
                      type="button"
                      onClick={() => setVisitorConsentSaved(null)}
                      className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Süti (Cookie) beállítások módosítása / visszavonása
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {state.gdpr.description}{' '}
                    <a
                      href={state.gdpr.privacyPolicyUrl}
                      onClick={(e) => e.preventDefault()}
                      className="text-blue-600 dark:text-blue-400 underline"
                    >
                      Adatvédelmi tájékoztató
                    </a>
                  </p>

                  {state.gdpr.showCategoryDetails && (
                    <div className="space-y-1.5 pt-1">
                      {state.gdpr.categories.map((cat) => (
                        <label
                          key={cat.id}
                          className="flex items-center justify-between gap-2 p-2 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 text-xs cursor-pointer"
                        >
                          <div className="min-w-0">
                            <div className="font-medium text-slate-800 dark:text-slate-200 truncate">
                              {cat.name}
                            </div>
                            <div className="text-[10px] font-mono text-slate-400 truncate">
                              {cat.cookiesUsed}
                            </div>
                          </div>
                          {cat.required ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 shrink-0">
                              <Lock className="w-3 h-3" />
                              <span>Kötelező</span>
                            </span>
                          ) : (
                            <input
                              type="checkbox"
                              checked={visitorCookiePrefs[cat.id]}
                              onChange={(e) =>
                                setVisitorCookiePrefs((prev) => ({
                                  ...prev,
                                  [cat.id]: e.target.checked,
                                }))
                              }
                              className="w-4 h-4 rounded border-slate-300 text-blue-600 shrink-0"
                            />
                          )}
                        </label>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleVisitorCookieAction('all')}
                      className="flex-1 py-2 px-3 text-xs font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap"
                    >
                      {state.gdpr.acceptAllLabel}
                    </button>
                    {state.gdpr.showCategoryDetails && (
                      <button
                        type="button"
                        onClick={() => handleVisitorCookieAction('custom')}
                        className="py-2 px-3 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors whitespace-nowrap"
                      >
                        {state.gdpr.savePreferencesLabel}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleVisitorCookieAction('essential')}
                      className="py-2 px-3 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 rounded-md border border-slate-200 dark:border-slate-800 transition-colors whitespace-nowrap"
                    >
                      {state.gdpr.rejectLabel}
                    </button>
                  </div>
                </>
              )}
            </section>
          )}

          {/* 6. SPEED & MEDIA OPTIMIZER STATUS WIDGET ([wtk_speed_badge] · v0.4.0) */}
          {state.optimizer.enabled && state.optimizer.showSidebarSpeedBadge && (
            <section
              aria-label="Optimalizáló Sebesség Jelvény Előnézet"
              className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-4 space-y-2.5"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Optimalizáló &amp; Lazy Load Állapot
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                  [wtk_speed_badge]
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {state.optimizer.speedMetrics.pageSpeedScore}/100
                  </div>
                  <div className="text-[10px] text-slate-500">PageSpeed</div>
                </div>
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <div className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100">
                    {state.optimizer.convertFormat.toUpperCase()}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {state.optimizer.compressionQuality}% tömörítés
                  </div>
                </div>
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <div className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                    {state.optimizer.customUploadLimitMb} MB
                  </div>
                  <div className="text-[10px] text-slate-500">WP Upload</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
                <span className="font-mono">
                  TTFB: {state.optimizer.speedMetrics.ttfbMs}ms · Lazy Load:{' '}
                  {state.optimizer.lazyLoadImages ? 'Aktív' : 'Inaktív'}
                </span>
                {onRunQuickOptimize && (
                  <button
                    type="button"
                    onClick={onRunQuickOptimize}
                    className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Sebességmérés →
                  </button>
                )}
              </div>
            </section>
          )}

          {/* 7. SECURITY AUDIT LOG & EMAIL ALERT WIDGET ([wtk_security_badge] · v0.5.0) */}
          {state.auditLog.enabled && state.auditLog.showSidebarAuditWidget && (
            <section
              aria-label="Biztonsági Napló és E-mail Értesítő Widget Előnézet"
              className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-4 space-y-2.5"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Biztonsági Audit &amp; E-mail Őr
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                  [wtk_security_badge]
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <div className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100">
                    {state.auditLog.entries.length} db
                  </div>
                  <div className="text-[10px] text-slate-500">Naplózott esemény</div>
                </div>
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <div className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                    .{state.auditLog.defaultExportFormat.toUpperCase()}
                  </div>
                  <div className="text-[10px] text-slate-500">Napló formátum</div>
                </div>
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {state.auditLog.dailyDigestTime}
                  </div>
                  <div className="text-[10px] text-slate-500">24h Összefoglaló</div>
                </div>
              </div>

              {state.auditLog.entries[0] && (
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800 text-[11px] space-y-0.5">
                  <div className="flex items-center justify-between font-mono text-[10px] text-slate-400">
                    <span>Legutóbbi esemény:</span>
                    <span>{state.auditLog.entries[0].timestamp.slice(11)}</span>
                  </div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {state.auditLog.entries[0].actionLabel} · {state.auditLog.entries[0].actorUser}
                  </div>
                </div>
              )}
            </section>
          )}
        </div>
      </div>

      {/* Post Quick Preview Modal inside Sidebar */}
      {selectedPostModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-post-title"
          className="m-4 p-4 rounded-lg bg-white dark:bg-slate-950 border-2 border-blue-500/80 space-y-2.5"
        >
          <div className="flex items-start justify-between gap-2">
            <h4
              id="modal-post-title"
              className="text-xs font-bold text-slate-900 dark:text-slate-100"
            >
              {selectedPostModal.title}
            </h4>
            <button
              type="button"
              onClick={() => setSelectedPostModal(null)}
              aria-label="Előnézet bezárása"
              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono tabular-nums">
            {selectedPostModal.date} · {selectedPostModal.time} · {selectedPostModal.category} · Szerző:{' '}
            {selectedPostModal.author}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {selectedPostModal.excerpt}
          </p>
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] font-mono tabular-nums text-slate-500">
              Megtekintések: {selectedPostModal.views}
            </span>
            {selectedPostModal.postType === 'download' && (
              <button
                type="button"
                onClick={() => onTriggerDownload(selectedPostModal.id)}
                className="px-2.5 py-1 text-xs font-medium bg-emerald-600 text-white rounded hover:bg-emerald-700 inline-flex items-center gap-1"
              >
                <Download className="w-3 h-3" />
                <span>Csomag letöltése ({selectedPostModal.downloads || 0})</span>
              </button>
            )}
          </div>
        </div>
      )}
    </aside>
  );
};
