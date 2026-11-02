import React, { useState } from 'react';
import {
  Check,
  Cpu,
  Database,
  Eye,
  FileUp,
  Gauge,
  HardDrive,
  Image as ImageIcon,
  Layers,
  Play,
  RefreshCw,
  Sparkles,
  Trash2,
  Zap,
} from 'lucide-react';
import {
  AutoOptimizeSchedule,
  ImageTargetFormat,
  LazyPlaceholderStyle,
  OptimizerConfig,
} from '../types/toolkit';
import { calculateMediaQueueSummary } from '../utils/toolkitLogic';

interface OptimizerModulePanelProps {
  config: OptimizerConfig;
  onUpdateConfig: (patch: Partial<OptimizerConfig>) => void;
  onRunInteractiveOptimization: () => void;
  onPurgeCache: () => void;
  onOptimizeSingleImage: (id: string) => void;
  onAddSampleImage: () => void;
}

const UPLOAD_LIMIT_PRESETS = [16, 64, 128, 256, 512, 1024];

const SCHEDULE_OPTIONS: Array<{
  id: AutoOptimizeSchedule;
  label: string;
  desc: string;
}> = [
  {
    id: 'realtime-upload',
    label: 'Valós idejű (Feltöltéskor azonnal)',
    desc: 'Minden új médiatár feltöltést automatikusan tömörít, átméretez és konvertál',
  },
  {
    id: 'hourly-cron',
    label: 'Óránkénti WP-Cron ütemezés',
    desc: 'Háttérben futó automatikus kötegelt optimalizálás óránként',
  },
  {
    id: 'daily-cron',
    label: 'Éjszakai (Napi) automatikus futtatás',
    desc: 'Alacsony terhelésű időszakban optimalizálja a képeket és a gyorsítótárat',
  },
  {
    id: 'manual-only',
    label: 'Kizárólag Kézi (Interaktív gombbal)',
    desc: 'Csak akkor fut le, amikor Ön megnyomja az Optimalizálás gombot',
  },
];

const PLACEHOLDER_OPTIONS: Array<{
  id: LazyPlaceholderStyle;
  label: string;
  desc: string;
}> = [
  { id: 'blurhash', label: 'BlurHash Elmosott Előnézet', desc: 'Finom elmosott képbetöltési átmenet' },
  { id: 'dominant-color', label: 'Domináns Színkitöltés', desc: 'A kép fő színével kitöltött keret' },
  { id: 'shimmer-skeleton', label: 'Shimmer Skeleton Fény', desc: 'Modern pulzáló helykitöltő sáv' },
  { id: 'none', label: 'Natív Üres Keret (0 KB)', desc: 'Csak natív width/height CLS védelem' },
];

export const OptimizerModulePanel: React.FC<OptimizerModulePanelProps> = ({
  config,
  onUpdateConfig,
  onRunInteractiveOptimization,
  onPurgeCache,
  onOptimizeSingleImage,
  onAddSampleImage,
}) => {
  const [isRunningNow, setIsRunningNow] = useState(false);

  const queueSummary = calculateMediaQueueSummary(config.mediaQueue);

  const handleInteractiveClick = () => {
    setIsRunningNow(true);
    onRunInteractiveOptimization();
    setTimeout(() => {
      setIsRunningNow(false);
    }, 450);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            07. Kép-, Upload Limit-, Lazy Load és Gyorsítótár Optimalizáló (v0.4.0)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Opcionális képtömörítés, WebP/AVIF konvertálás, átméretezés, WordPress feltöltési limit felülbírálás, teljes körű Lazy Loading és sebességmérő.
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
            Optimalizáló modul aktív
          </span>
        </label>
      </div>

      {/* 1. Interactive Manual Action & Speed Benchmark Hero Card */}
      <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-emerald-400">
              <Zap className="w-3.5 h-3.5" />
              <span>Valós Idejű Sebességmérés &amp; Interaktív Optimalizáló Motor</span>
            </div>
            <h3 className="text-base font-bold">
              Kézi Interaktív Optimalizálás és Betöltési Sebesség Teszt
            </h3>
            <p className="text-xs text-slate-300">
              Utolsó futtatás: <span className="font-mono">{config.lastOptimizedAt}</span> · Összes futtatás:{' '}
              <span className="font-mono">{config.totalOptimizationRuns}×</span> · Megtakarítás:{' '}
              <span className="font-mono text-emerald-400 font-semibold">
                {config.speedMetrics.totalSavedMb.toFixed(1)} MB
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={handleInteractiveClick}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isRunningNow ? 'animate-spin' : ''}`} />
            <span>
              {queueSummary.pendingCount > 0
                ? `Optimalizálás & Sebességmérés Most (${queueSummary.pendingCount} kép vár)`
                : 'Optimalizálás & Sebességmérés Futtatása Most'}
            </span>
          </button>
        </div>

        {/* 4 Speed & Core Web Vitals Readouts */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          <div className="p-3 rounded-lg bg-slate-800/90 border border-slate-700/80">
            <div className="text-[11px] text-slate-400">PageSpeed Index</div>
            <div className="text-xl font-mono font-bold tabular-nums text-emerald-400 mt-0.5">
              {config.speedMetrics.pageSpeedScore}/100
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Core Web Vitals: Zöld</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-800/90 border border-slate-700/80">
            <div className="text-[11px] text-slate-400">Szerver Válaszidő (TTFB)</div>
            <div className="text-xl font-mono font-bold tabular-nums text-white mt-0.5">
              {config.speedMetrics.ttfbMs} ms
            </div>
            <div className="text-[10px] text-emerald-400 mt-0.5">Gyorsítótárazott válasz</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-800/90 border border-slate-700/80">
            <div className="text-[11px] text-slate-400">Legnagyobb Tartalom (LCP)</div>
            <div className="text-xl font-mono font-bold tabular-nums text-blue-400 mt-0.5">
              {config.speedMetrics.lcpMs} ms
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Első {config.excludeAboveFoldCount} kép: fetchpriority=high
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-800/90 border border-slate-700/80">
            <div className="text-[11px] text-slate-400">Elrendezés Elmozdulás (CLS)</div>
            <div className="text-xl font-mono font-bold tabular-nums text-amber-300 mt-0.5">
              {config.speedMetrics.clsScore}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Fix képméret attribútumok</div>
          </div>
        </div>

        {/* Automatic vs Manual Execution Mode */}
        <div className="pt-3 border-t border-slate-800 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={config.autoOptimizeEnabled}
                onChange={(e) =>
                  onUpdateConfig({
                    autoOptimizeEnabled: e.target.checked,
                    autoSchedule: e.target.checked ? 'realtime-upload' : 'manual-only',
                  })
                }
                className="w-4 h-4 rounded border-slate-600 text-emerald-500"
              />
              <span>Opcionális Automatikus Háttér-Optimalizálás Engedélyezése</span>
            </label>
            <span className="text-[11px] font-mono text-slate-400">
              Ütemezés: {config.autoSchedule}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {SCHEDULE_OPTIONS.map((sched) => {
              const active = config.autoSchedule === sched.id;
              return (
                <button
                  key={sched.id}
                  type="button"
                  onClick={() =>
                    onUpdateConfig({
                      autoSchedule: sched.id,
                      autoOptimizeEnabled: sched.id !== 'manual-only',
                    })
                  }
                  className={`text-left p-2.5 rounded-lg border text-xs transition-colors ${
                    active
                      ? 'border-emerald-500 bg-emerald-950/60 text-white'
                      : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-semibold text-slate-100">{sched.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                    {sched.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. WordPress File Upload Limit Override Section */}
      <div className="p-4 rounded-lg bg-slate-50/70 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FileUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                1. WordPress Fájlfeltöltési Limit Kezelése és Felülbírálása (upload_size_limit)
              </h3>
              <p className="text-[11px] text-slate-500">
                Felülbírálja a WordPress alapértelmezett ({config.defaultWpUploadLimitMb} MB) feltöltési korlátját nagy felbontású médiákhoz és csomagokhoz.
              </p>
            </div>
          </div>

          <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={config.overrideUploadLimit}
              onChange={(e) => onUpdateConfig({ overrideUploadLimit: e.target.checked })}
              className="w-4 h-4 rounded border-slate-300 text-blue-600"
            />
            <span>WP Limit Felülbírálása Aktív</span>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="text-[11px] text-slate-500">Alapértelmezett WP Limit</div>
            <div className="text-sm font-mono font-bold text-slate-400 line-through">
              {config.defaultWpUploadLimitMb} MB (upload_max_filesize)
            </div>
            <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              Új felülbírált limit: {config.overrideUploadLimit ? `${config.customUploadLimitMb} MB` : 'Kikapcsolva'}
            </div>
          </div>

          <div className="sm:col-span-2 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700 dark:text-slate-300">
                Maximális Fájlfeltöltési Méret Kiválasztása:
              </span>
              <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                {config.customUploadLimitMb} MB ({config.customUploadLimitMb * 1024} KB)
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {UPLOAD_LIMIT_PRESETS.map((mb) => (
                <button
                  key={mb}
                  type="button"
                  onClick={() =>
                    onUpdateConfig({
                      overrideUploadLimit: true,
                      customUploadLimitMb: mb,
                    })
                  }
                  className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-md border transition-colors ${
                    config.customUploadLimitMb === mb && config.overrideUploadLimit
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-blue-400'
                  }`}
                >
                  {mb} MB
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-200/80 dark:border-slate-800 text-xs">
          <label className="inline-flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={config.allowSvgAndAvifUpload}
              onChange={(e) => onUpdateConfig({ allowSvgAndAvifUpload: e.target.checked })}
              className="rounded border-slate-300 text-blue-600"
            />
            <span>WebP, AVIF és biztonságos SVG MIME-típusok feltöltésének engedélyezése (upload_mimes)</span>
          </label>

          <div className="flex items-center gap-2">
            <label htmlFor="max-exec-time" className="text-slate-600 dark:text-slate-400">
              Max PHP futási idő:
            </label>
            <input
              id="max-exec-time"
              type="number"
              min={30}
              max={1200}
              value={config.maxExecutionTimeSec}
              onChange={(e) =>
                onUpdateConfig({
                  maxExecutionTimeSec: Math.max(30, Number(e.target.value) || 300),
                })
              }
              className="w-20 px-2 py-1 text-xs font-mono rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
            />
            <span className="font-mono text-slate-500">mp</span>
          </div>
        </div>
      </div>

      {/* 3. Image Compression, Format Conversion & Resizing */}
      <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                2. Opcionális Képtömörítés, Konvertálás (WebP / AVIF) és Átméretezés
              </h3>
              <p className="text-[11px] text-slate-500">
                Automatikus vagy kézi veszteségmentes/intelligens tömörítés, újgenerációs formátum-konvertálás és maximális képméret korlátozás.
              </p>
            </div>
          </div>

          <span className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400">
            Átlagos megtakarítás: -{queueSummary.savingsPercent}% ({queueSummary.savedKb} KB)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Compression Quality */}
          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.imageCompressionEnabled}
                  onChange={(e) =>
                    onUpdateConfig({ imageCompressionEnabled: e.target.checked })
                  }
                  className="rounded border-slate-300 text-blue-600"
                />
                <span>Képtömörítés</span>
              </label>
              <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                {config.compressionQuality}%
              </span>
            </div>

            <input
              type="range"
              aria-label="Képtömörítési minőség százalékban"
              min={40}
              max={98}
              value={config.compressionQuality}
              onChange={(e) =>
                onUpdateConfig({ compressionQuality: Number(e.target.value) })
              }
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>40% (Max tömörítés)</span>
              <span>82% (Optimális)</span>
              <span>98% (RAW)</span>
            </div>
          </div>

          {/* Format Conversion */}
          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-2">
            <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Célformátum Konvertálás
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {(
                [
                  { id: 'webp', label: 'WebP' },
                  { id: 'avif', label: 'AVIF' },
                  { id: 'original', label: 'Eredeti' },
                ] as Array<{ id: ImageTargetFormat; label: string }>
              ).map((fmt) => (
                <button
                  key={fmt.id}
                  type="button"
                  onClick={() => onUpdateConfig({ convertFormat: fmt.id })}
                  className={`py-1.5 px-2 text-xs font-mono font-semibold rounded border transition-colors ${
                    config.convertFormat === fmt.id
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {fmt.label}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-500">
              JPG/PNG képek automatikus átalakítása {config.convertFormat.toUpperCase()} formátumba.
            </p>
          </div>

          {/* Auto Resizing Dimensions */}
          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-2">
            <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={config.autoResizeEnabled}
                onChange={(e) => onUpdateConfig({ autoResizeEnabled: e.target.checked })}
                className="rounded border-slate-300 text-blue-600"
              />
              <span>Automatikus Kép-átméretezés</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="opt-max-w" className="block text-[10px] text-slate-500">
                  Max Szélesség (px)
                </label>
                <input
                  id="opt-max-w"
                  type="number"
                  min={640}
                  max={4096}
                  value={config.maxWidthPx}
                  onChange={(e) =>
                    onUpdateConfig({ maxWidthPx: Number(e.target.value) || 1920 })
                  }
                  className="w-full px-2 py-1 text-xs font-mono rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>
              <div>
                <label htmlFor="opt-max-h" className="block text-[10px] text-slate-500">
                  Max Magasság (px)
                </label>
                <input
                  id="opt-max-h"
                  type="number"
                  min={480}
                  max={4096}
                  value={config.maxHeightPx}
                  onChange={(e) =>
                    onUpdateConfig({ maxHeightPx: Number(e.target.value) || 1080 })
                  }
                  className="w-full px-2 py-1 text-xs font-mono rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
          <div className="flex flex-wrap items-center gap-5">
            <label className="inline-flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={config.stripExifMetadata}
                onChange={(e) => onUpdateConfig({ stripExifMetadata: e.target.checked })}
                className="rounded border-slate-300 text-blue-600"
              />
              <span>EXIF és GPS kamera-metaadatok eltávolítása</span>
            </label>
            <label className="inline-flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={config.keepOriginalBackup}
                onChange={(e) => onUpdateConfig({ keepOriginalBackup: e.target.checked })}
                className="rounded border-slate-300 text-blue-600"
              />
              <span>Eredeti JPG/PNG biztonsági másolat megtartása</span>
            </label>
          </div>

          <button
            type="button"
            onClick={onAddSampleImage}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            + Új tesztkép hozzáadása a feldolgozó sorhoz
          </button>
        </div>

        {/* Media Optimization Queue Table */}
        <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 text-slate-500">
                <th className="py-2 px-3">Médiafájl neve</th>
                <th className="py-2 px-2">Konvertálás</th>
                <th className="py-2 px-2">Átméretezés</th>
                <th className="py-2 px-2">Méretcsökkenés</th>
                <th className="py-2 px-3 text-right">Állapot / Művelet</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {config.mediaQueue.map((item) => {
                const savingPct = Math.round(
                  ((item.originalSizeKb - item.optimizedSizeKb) / item.originalSizeKb) * 100
                );
                return (
                  <tr key={item.id}>
                    <td className="py-2 px-3 font-medium text-slate-900 dark:text-slate-100">
                      {item.fileName}
                    </td>
                    <td className="py-2 px-2 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                      {item.originalFormat} →{' '}
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        {config.convertFormat === 'avif' ? 'AVIF' : item.targetFormat}
                      </span>
                    </td>
                    <td className="py-2 px-2 font-mono text-[11px] text-slate-500">
                      {item.originalDimensions} → {item.resizedDimensions}
                    </td>
                    <td className="py-2 px-2 font-mono text-[11px]">
                      <span className="text-slate-400 line-through mr-1.5">
                        {item.originalSizeKb} KB
                      </span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {item.optimizedSizeKb} KB (-{savingPct}%)
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right">
                      {item.status === 'optimized' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                          <Check className="w-3.5 h-3.5" />
                          <span>Optimalizálva</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onOptimizeSingleImage(item.id)}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                          Optimalizálás most
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Comprehensive Lazy Loading Engine */}
      <div className="p-4 rounded-lg bg-slate-50/70 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                3. Teljes Körű Lazy Loading Kezelés (Képek, Iframe, Videók és Háttérképek)
              </h3>
              <p className="text-[11px] text-slate-500">
                Intelligens késleltetett betöltés LCP-védelemmel (az első képernyős képek kizárásával a gyorsabb kirajzolásért).
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
            loading=&quot;lazy&quot; · decoding=&quot;async&quot;
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <label className="flex items-start gap-2.5 p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={config.lazyLoadImages}
              onChange={(e) => onUpdateConfig({ lazyLoadImages: e.target.checked })}
              className="mt-0.5 rounded border-slate-300 text-blue-600"
            />
            <div>
              <div className="font-semibold text-slate-900 dark:text-slate-100">
                Képek Lazy Loading
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Bejegyzés, oldalsáv és galéria &lt;img&gt; elemek késleltetése
              </div>
            </div>
          </label>

          <label className="flex items-start gap-2.5 p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={config.lazyLoadIframesAndVideos}
              onChange={(e) =>
                onUpdateConfig({ lazyLoadIframesAndVideos: e.target.checked })
              }
              className="mt-0.5 rounded border-slate-300 text-blue-600"
            />
            <div>
              <div className="font-semibold text-slate-900 dark:text-slate-100">
                Iframe &amp; Videó Lazy Load
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                YouTube, Vimeo és térkép beágyazások előnézeti cseréje
              </div>
            </div>
          </label>

          <label className="flex items-start gap-2.5 p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={config.lazyLoadBackgrounds}
              onChange={(e) => onUpdateConfig({ lazyLoadBackgrounds: e.target.checked })}
              className="mt-0.5 rounded border-slate-300 text-blue-600"
            />
            <div>
              <div className="font-semibold text-slate-900 dark:text-slate-100">
                CSS Háttérképek (Observer)
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                IntersectionObserver alapú szekció-háttér betöltés
              </div>
            </div>
          </label>

          <label className="flex items-start gap-2.5 p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={config.fetchPriorityHighOnLcp}
              onChange={(e) =>
                onUpdateConfig({ fetchPriorityHighOnLcp: e.target.checked })
              }
              className="mt-0.5 rounded border-slate-300 text-blue-600"
            />
            <div>
              <div className="font-semibold text-slate-900 dark:text-slate-100">
                LCP FetchPriority=&quot;high&quot;
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Kiemelt prioritás az első képernyős vezérképnek
              </div>
            </div>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center pt-1">
          <div>
            <label
              htmlFor="exclude-fold"
              className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              Első N db kép kizárása a Lazy Loadból (Above-the-fold)
            </label>
            <input
              id="exclude-fold"
              type="number"
              min={0}
              max={6}
              value={config.excludeAboveFoldCount}
              onChange={(e) =>
                onUpdateConfig({
                  excludeAboveFoldCount: Math.max(0, Math.min(6, Number(e.target.value))),
                })
              }
              className="w-full px-3 py-1.5 text-xs font-mono rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
            />
          </div>

          <div className="sm:col-span-2">
            <div className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Képbetöltés Előtti Helykitöltő Effekt (Placeholder)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PLACEHOLDER_OPTIONS.map((ph) => (
                <button
                  key={ph.id}
                  type="button"
                  onClick={() => onUpdateConfig({ lazyPlaceholder: ph.id })}
                  className={`p-2 text-left rounded border text-xs transition-colors ${
                    config.lazyPlaceholder === ph.id
                      ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 font-semibold text-slate-900 dark:text-slate-100'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="truncate">{ph.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Cache Management Panel */}
      <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-amber-500" />
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                4. Gyorsítótár (Cache) Kezelés és Tömörítés
              </h3>
              <p className="text-[11px] text-slate-500">
                Aktuális tárolt gyorsítótár méret:{' '}
                <strong className="font-mono text-slate-800 dark:text-slate-200">
                  {config.currentCacheSizeMb.toFixed(1)} MB
                </strong>{' '}
                · Utolsó ürítés: <span className="font-mono">{config.lastCachePurgedAt}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onPurgeCache}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-md hover:bg-rose-100 transition-colors whitespace-nowrap shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Gyorsítótár Ürítése Most (Purge Cache)</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <label className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800 cursor-pointer">
            <span className="font-medium text-slate-800 dark:text-slate-200">
              HTML Oldal-gyorsítótár (Page Cache)
            </span>
            <input
              type="checkbox"
              checked={config.pageCacheEnabled}
              onChange={(e) => onUpdateConfig({ pageCacheEnabled: e.target.checked })}
              className="w-4 h-4 rounded border-slate-300 text-blue-600"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800 cursor-pointer">
            <span className="font-medium text-slate-800 dark:text-slate-200">
              GZIP &amp; Brotli Tömörítés
            </span>
            <input
              type="checkbox"
              checked={config.gzipBrotliEnabled}
              onChange={(e) => onUpdateConfig({ gzipBrotliEnabled: e.target.checked })}
              className="w-4 h-4 rounded border-slate-300 text-blue-600"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800 cursor-pointer">
            <span className="font-medium text-slate-800 dark:text-slate-200">
              Oldalsáv Sebesség-jelvény ([wtk_speed_badge])
            </span>
            <input
              type="checkbox"
              checked={config.showSidebarSpeedBadge}
              onChange={(e) =>
                onUpdateConfig({ showSidebarSpeedBadge: e.target.checked })
              }
              className="w-4 h-4 rounded border-slate-300 text-blue-600"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
