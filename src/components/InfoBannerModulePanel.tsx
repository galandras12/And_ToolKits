import React from 'react';
import {
  Eye,
  Megaphone,
  MousePointerClick,
  Palette,
  Sparkles,
  Type,
  X,
} from 'lucide-react';
import {
  BannerAnimationType,
  BannerColorPreset,
  BannerConfig,
  BannerFontStyle,
  BannerSizePreset,
  BannerVisibilityScope,
} from '../types/toolkit';
import { formatMetricValue } from '../utils/toolkitLogic';

interface InfoBannerModulePanelProps {
  config: BannerConfig;
  onUpdateConfig: (patch: Partial<BannerConfig>) => void;
  onSimulateClick: () => void;
}

const SCOPE_OPTIONS: Array<{
  id: BannerVisibilityScope;
  label: string;
  hook: string;
  desc: string;
}> = [
  {
    id: 'all-pages',
    label: 'Minden oldalon állandóan',
    hook: 'wp_body_open (Globális)',
    desc: 'A teljes WordPress weboldal összes aloldalán és bejegyzésén megjelenik',
  },
  {
    id: 'homepage-only',
    label: 'Csak a Főoldalon',
    hook: 'is_front_page()',
    desc: 'Kizárólag a nyitóoldalon (főoldalon) jelenik meg a látogatóknak',
  },
  {
    id: 'blog-posts',
    label: 'Csak Bejegyzések és Események felett',
    hook: 'is_singular()',
    desc: 'Cikkek, hírek és eseményoldalak fejlécében jelenik meg',
  },
  {
    id: 'sidebar-only',
    label: 'Csak Oldalsáv Widgetként',
    hook: '[wtk_info_banner]',
    desc: 'Kizárólag az oldalsávba vagy blokkba helyezett rövidkódként jelenik meg',
  },
];

const COLOR_PRESETS: Array<{
  id: BannerColorPreset;
  label: string;
  previewClass: string;
}> = [
  {
    id: 'cobalt-gradient',
    label: 'Kobaltkék Gradiens',
    previewClass: 'bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-600 text-white',
  },
  {
    id: 'emerald-aurora',
    label: 'Smaragdzöld Aurora',
    previewClass: 'bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-600 text-white',
  },
  {
    id: 'amber-highlight',
    label: 'Borostyán Figyelemfelkeltő',
    previewClass: 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-slate-950',
  },
  {
    id: 'rose-alert',
    label: 'Rubinvörös Sürgős Sáv',
    previewClass: 'bg-gradient-to-r from-rose-600 via-red-600 to-rose-600 text-white',
  },
  {
    id: 'slate-obsidian',
    label: 'Obszidián Prémium Sötét',
    previewClass: 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-slate-100',
  },
  {
    id: 'custom',
    label: 'Egyedi HEX Színkód',
    previewClass: 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100',
  },
];

const SIZE_PRESETS: Array<{
  id: BannerSizePreset;
  label: string;
  desc: string;
}> = [
  { id: 'compact', label: 'Kompakt Keskeny (S)', desc: 'Keskeny, 1 soros felső sáv (36px)' },
  { id: 'standard', label: 'Normál Információs (M)', desc: 'Kiegyensúlyozott fejrész sáv (54px)' },
  { id: 'large-hero', label: 'Kiemelt Hero Banner (L)', desc: 'Többsoros nagy közlemény alcímmel (80px)' },
];

const FONT_STYLES: Array<{
  id: BannerFontStyle;
  label: string;
  sampleClass: string;
}> = [
  { id: 'sans-clean', label: 'Modern Sans (DM Sans)', sampleClass: 'font-sans font-medium' },
  { id: 'display-bold', label: 'Karakteres Vastag (Jakarta)', sampleClass: 'font-display font-bold tracking-tight' },
  { id: 'serif-editorial', label: 'Klasszikus Serif (Editorial)', sampleClass: 'font-serif italic font-semibold' },
  { id: 'mono-tech', label: 'Technikai Monospace (JetBrains)', sampleClass: 'font-mono font-semibold' },
];

const ANIMATION_TYPES: Array<{
  id: BannerAnimationType;
  label: string;
  desc: string;
}> = [
  { id: 'none', label: 'Statikus (Nincs)', desc: 'Fix, mozdulatlan megjelenés' },
  { id: 'pulse-glow', label: 'Pulzáló Fény (Pulse Glow)', desc: 'Finom fénykeret-lüktetés' },
  { id: 'slide-down', label: 'Lebegő Mozgás (Slide Bounce)', desc: 'Lágy függőleges lebegés' },
  { id: 'shimmer', label: 'Színátmenet Hullám (Shimmer)', desc: 'Mozgó gradiens háttérfény' },
  { id: 'marquee', label: 'Hírszalag Mozgás (Marquee)', desc: 'Vízszintesen sikló szövegsáv' },
];

export function getBannerVisualClasses(config: BannerConfig): {
  containerClass: string;
  fontClass: string;
  sizeClass: string;
  animClass: string;
  inlineStyle?: React.CSSProperties;
} {
  const presetObj =
    COLOR_PRESETS.find((c) => c.id === config.colorPreset) || COLOR_PRESETS[0];

  const containerClass =
    config.colorPreset === 'custom' ? '' : presetObj.previewClass;

  const inlineStyle: React.CSSProperties | undefined =
    config.colorPreset === 'custom'
      ? {
          backgroundColor: config.customBgHex || '#1E3A8A',
          color: config.customTextHex || '#FFFFFF',
        }
      : undefined;

  const fontClass =
    config.fontStyle === 'display-bold'
      ? 'font-display font-bold tracking-tight'
      : config.fontStyle === 'serif-editorial'
      ? 'font-serif italic'
      : config.fontStyle === 'mono-tech'
      ? 'font-mono'
      : 'font-sans';

  const sizeClass =
    config.sizePreset === 'compact'
      ? 'px-3 py-1.5 text-xs'
      : config.sizePreset === 'large-hero'
      ? 'px-5 py-4 text-sm'
      : 'px-4 py-2.5 text-xs sm:text-sm';

  const animClass =
    config.animation === 'pulse-glow'
      ? 'atk-anim-pulse-glow'
      : config.animation === 'slide-down'
      ? 'atk-anim-slide-down'
      : config.animation === 'shimmer'
      ? 'atk-anim-shimmer'
      : '';

  return { containerClass, fontClass, sizeClass, animClass, inlineStyle };
}

export const InfoBannerModulePanel: React.FC<InfoBannerModulePanelProps> = ({
  config,
  onUpdateConfig,
  onSimulateClick,
}) => {
  const { containerClass, fontClass, sizeClass, animClass, inlineStyle } =
    getBannerVisualClasses(config);

  const ctrPercent =
    config.impressions > 0
      ? ((config.clicks / config.impressions) * 100).toFixed(1)
      : '0.0';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              06. Állandó Főoldali / Globális Információs Banner (v0.3.0)
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Színben, méretben, betűstílusban és animációban szabadon testreszabható információs sáv a főoldalra vagy minden oldalra.
          </p>
        </div>

        <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={config.enabled}
            onChange={(e) => onUpdateConfig({ enabled: e.target.checked })}
            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            Információs Banner aktív
          </span>
        </label>
      </div>

      {/* Live Full-Width Banner Preview Box */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Élő Információs Banner Előnézet ({config.visibilityScope === 'homepage-only' ? 'Csak Főoldalon' : config.visibilityScope === 'all-pages' ? 'Minden Oldalon' : config.visibilityScope === 'blog-posts' ? 'Bejegyzésekben' : 'Oldalsávban'})
          </span>
          <span className="font-mono text-[11px] text-slate-400">
            [wtk_info_banner]
          </span>
        </div>

        <div
          style={inlineStyle}
          className={`rounded-lg border border-black/10 dark:border-white/10 transition-all overflow-hidden ${containerClass} ${sizeClass} ${animClass}`}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div
              className={`flex flex-wrap items-center gap-2.5 min-w-0 flex-1 ${
                config.animation === 'marquee' ? 'atk-anim-marquee' : ''
              }`}
            >
              {config.showIcon && <Megaphone className="w-4 h-4 shrink-0 opacity-95" />}
              {config.badgeText && (
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider rounded bg-black/25 text-white shrink-0">
                  {config.badgeText}
                </span>
              )}
              <div className={`min-w-0 ${fontClass}`}>
                <span className="leading-snug">{config.headline}</span>
                {config.sizePreset === 'large-hero' && config.subtext && (
                  <p className="text-xs opacity-90 font-normal not-italic mt-0.5">
                    {config.subtext}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {config.ctaLabel && (
                <button
                  type="button"
                  onClick={onSimulateClick}
                  className="px-3 py-1 text-xs font-semibold rounded bg-white text-slate-900 hover:bg-slate-100 transition-colors whitespace-nowrap shadow-2xs"
                >
                  {config.ctaLabel} →
                </button>
              )}
              {config.dismissible && (
                <span
                  title="Bezárható gomb engedélyezve"
                  className="p-1 rounded hover:bg-black/20 opacity-80"
                >
                  <X className="w-3.5 h-3.5" />
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 1. Visibility Scope (Main Page vs All Pages) */}
      <div className="space-y-2.5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          1. Megjelenési Hely (Főoldalon vagy Minden Oldalon)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {SCOPE_OPTIONS.map((opt) => {
            const active = config.visibilityScope === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onUpdateConfig({ visibilityScope: opt.id })}
                className={`text-left p-3 rounded-lg border transition-colors ${
                  active
                    ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-slate-900 dark:text-slate-100'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold">{opt.label}</span>
                  <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400">
                    {opt.hook}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  {opt.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Color Theme & Custom Hex Picker */}
      <div className="p-4 rounded-lg bg-slate-50/70 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              2. Színséma és Egyedi HEX Színválasztó
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Aktív: {config.colorPreset}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {COLOR_PRESETS.map((preset) => {
            const active = config.colorPreset === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onUpdateConfig({ colorPreset: preset.id })}
                className={`p-2.5 rounded-lg border text-left transition-all ${
                  active
                    ? 'border-blue-600 ring-2 ring-blue-500/20 bg-white dark:bg-slate-900'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                }`}
              >
                <div
                  className={`h-5 w-full rounded mb-2 border border-black/10 ${preset.previewClass}`}
                  style={
                    preset.id === 'custom'
                      ? { backgroundColor: config.customBgHex }
                      : undefined
                  }
                />
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {preset.label}
                </div>
              </button>
            );
          })}
        </div>

        {config.colorPreset === 'custom' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div>
              <label
                htmlFor="banner-bg-hex"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
              >
                Egyedi Háttérszín (HEX)
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="banner-bg-hex"
                  type="color"
                  value={config.customBgHex}
                  onChange={(e) => onUpdateConfig({ customBgHex: e.target.value })}
                  className="w-9 h-9 rounded border border-slate-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={config.customBgHex}
                  onChange={(e) => onUpdateConfig({ customBgHex: e.target.value })}
                  className="flex-1 px-3 py-1.5 text-xs font-mono rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="banner-text-hex"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
              >
                Egyedi Betűszín (HEX)
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="banner-text-hex"
                  type="color"
                  value={config.customTextHex}
                  onChange={(e) => onUpdateConfig({ customTextHex: e.target.value })}
                  className="w-9 h-9 rounded border border-slate-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={config.customTextHex}
                  onChange={(e) => onUpdateConfig({ customTextHex: e.target.value })}
                  className="flex-1 px-3 py-1.5 text-xs font-mono rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Size, Font Style & Animation Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Size Preset */}
        <div className="p-3.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            3. Banner Mérete
          </div>
          <div className="space-y-1.5">
            {SIZE_PRESETS.map((sz) => (
              <button
                key={sz.id}
                type="button"
                onClick={() => onUpdateConfig({ sizePreset: sz.id })}
                className={`w-full text-left p-2.5 rounded-md border text-xs transition-colors ${
                  config.sizePreset === sz.id
                    ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 font-semibold text-slate-900 dark:text-slate-100'
                    : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <div>{sz.label}</div>
                <div className="text-[11px] font-normal text-slate-500 mt-0.5">
                  {sz.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Font Style */}
        <div className="p-3.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <Type className="w-3.5 h-3.5 text-blue-600" />
            <span>4. Betűstílus</span>
          </div>
          <div className="space-y-1.5">
            {FONT_STYLES.map((ft) => (
              <button
                key={ft.id}
                type="button"
                onClick={() => onUpdateConfig({ fontStyle: ft.id })}
                className={`w-full text-left p-2.5 rounded-md border text-xs transition-colors ${
                  config.fontStyle === ft.id
                    ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-slate-900 dark:text-slate-100'
                    : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <div className={ft.sampleClass}>{ft.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Animation Style */}
        <div className="p-3.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>5. Animáció Típusa</span>
          </div>
          <div className="space-y-1.5">
            {ANIMATION_TYPES.map((an) => (
              <button
                key={an.id}
                type="button"
                onClick={() => onUpdateConfig({ animation: an.id })}
                className={`w-full text-left p-2 rounded-md border text-xs transition-colors ${
                  config.animation === an.id
                    ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 font-semibold text-slate-900 dark:text-slate-100'
                    : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <div>{an.label}</div>
                <div className="text-[10px] font-normal text-slate-500">
                  {an.desc}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 6. Content & CTA Editor */}
      <div className="p-4 rounded-lg bg-slate-50/70 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          6. Információs Banner Szövegezése és Gomb Beállításai
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="banner-badge"
              className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              Kiemelt Címke (Badge)
            </label>
            <input
              id="banner-badge"
              type="text"
              value={config.badgeText}
              onChange={(e) => onUpdateConfig({ badgeText: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="banner-headline"
              className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              Fő Információs Üzenet
            </label>
            <input
              id="banner-headline"
              type="text"
              value={config.headline}
              onChange={(e) => onUpdateConfig({ headline: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="banner-cta-label"
              className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              CTA Gomb Felirata
            </label>
            <input
              id="banner-cta-label"
              type="text"
              value={config.ctaLabel}
              onChange={(e) => onUpdateConfig({ ctaLabel: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label
              htmlFor="banner-cta-url"
              className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              CTA Cél URL
            </label>
            <input
              id="banner-cta-url"
              type="text"
              value={config.ctaUrl}
              onChange={(e) => onUpdateConfig({ ctaUrl: e.target.value })}
              className="w-full px-3 py-2 text-xs font-mono rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label
              htmlFor="banner-subtext"
              className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              Másodlagos Alcím (Hero méretnél)
            </label>
            <input
              id="banner-subtext"
              type="text"
              value={config.subtext}
              onChange={(e) => onUpdateConfig({ subtext: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 pt-1">
          <label className="inline-flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={config.stickyTop}
              onChange={(e) => onUpdateConfig({ stickyTop: e.target.checked })}
              className="rounded border-slate-300 text-blue-600"
            />
            <span>Rögzítés az oldal tetejére görgetéskor (Sticky Top)</span>
          </label>

          <label className="inline-flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={config.dismissible}
              onChange={(e) => onUpdateConfig({ dismissible: e.target.checked })}
              className="rounded border-slate-300 text-blue-600"
            />
            <span>Látogató által bezárható (X gomb)</span>
          </label>

          <label className="inline-flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={config.showIcon}
              onChange={(e) => onUpdateConfig({ showIcon: e.target.checked })}
              className="rounded border-slate-300 text-blue-600"
            />
            <span>Hangszóró (Megaphone) ikon megjelenítése</span>
          </label>
        </div>
      </div>

      {/* Banner Conversion Stats */}
      <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <div>
              <div className="text-[11px] text-slate-500">Megjelenések</div>
              <div className="text-sm font-mono font-bold tabular-nums text-slate-900 dark:text-slate-100">
                {formatMetricValue(config.impressions, 'exact')}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <MousePointerClick className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <div>
              <div className="text-[11px] text-slate-500">CTA Kattintások</div>
              <div className="text-sm font-mono font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                {formatMetricValue(config.clicks, 'exact')} ({ctrPercent}% CTR)
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onSimulateClick}
          className="px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          +1 Banner CTA kattintás tesztelése
        </button>
      </div>
    </div>
  );
};
