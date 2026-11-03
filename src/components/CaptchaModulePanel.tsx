import React, { useState } from 'react';
import {
  ShieldCheck,
  KeyRound,
  Sliders,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Bot,
  UserCheck,
  Lock,
  Activity,
  FileCode2,
  ShieldAlert,
  Play,
  RotateCcw,
} from 'lucide-react';
import {
  CaptchaConfig,
  CaptchaProvider,
  TurnstileTheme,
  TurnstileWidgetMode,
} from '../types/toolkit';
import {
  evaluateCaptchaVerification,
  getCaptchaSensitivityLabel,
  validateCaptchaKeys,
} from '../utils/toolkitLogic';

interface CaptchaModulePanelProps {
  config: CaptchaConfig;
  onChange: (updates: Partial<CaptchaConfig>) => void;
  onSimulateAttempt: (params: {
    score: number;
    tokenProvided: boolean;
    isLoggedAdmin: boolean;
    surfaceLabel: string;
    actorLabel: string;
  }) => void;
}

const THRESHOLD_PRESETS: Array<{
  value: number;
  title: string;
  subtitle: string;
  badge: string;
}> = [
  {
    value: 0.3,
    title: 'Megengedő',
    subtitle: 'Csak az egyértelmű botokat tiltja',
    badge: '0.3',
  },
  {
    value: 0.5,
    title: 'Kiegyensúlyozott',
    subtitle: 'Google & Cloudflare alapértelmezett',
    badge: '0.5 · Ajánlott',
  },
  {
    value: 0.7,
    title: 'Szigorú',
    subtitle: 'Fokozott védelem gyanús forgalom ellen',
    badge: '0.7',
  },
  {
    value: 0.9,
    title: 'Maximális védelem',
    subtitle: 'Kizárólag magas reputációjú kérések',
    badge: '0.9',
  },
];

const SIMULATOR_PRESETS: Array<{
  label: string;
  actor: string;
  score: number;
  tokenProvided: boolean;
  isLoggedAdmin: boolean;
  surface: string;
}> = [
  {
    label: 'Agresszív Spam Bot (0.15)',
    actor: 'botnet-crawler-185.220.x.x',
    score: 0.15,
    tokenProvided: true,
    isLoggedAdmin: false,
    surface: 'wp-login.php (Bejelentkezés)',
  },
  {
    label: 'Gyanús Scraper / Proxy (0.42)',
    actor: 'headless-chromium-proxy',
    score: 0.42,
    tokenProvided: true,
    isLoggedAdmin: false,
    surface: 'wp-comments-post.php (Komment)',
  },
  {
    label: 'Átlagos Látogató (0.65)',
    actor: 'vendeg_olvaso@example.hu',
    score: 0.65,
    tokenProvided: true,
    isLoggedAdmin: false,
    surface: 'Regisztrációs űrlap',
  },
  {
    label: 'Megbízható Felhasználó (0.92)',
    actor: 'kovacs.peter@example.hu',
    score: 0.92,
    tokenProvided: true,
    isLoggedAdmin: false,
    surface: 'wp-login.php (Bejelentkezés)',
  },
];

export const CaptchaModulePanel: React.FC<CaptchaModulePanelProps> = ({
  config,
  onChange,
  onSimulateAttempt,
}) => {
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [simScore, setSimScore] = useState<number>(0.38);
  const [simValidToken, setSimValidToken] = useState<boolean>(true);
  const [simIsAdmin, setSimIsAdmin] = useState<boolean>(false);
  const [simSurface, setSimSurface] = useState<string>('wp-login.php (Bejelentkezés)');
  const [simActor, setSimActor] = useState<string>('unknown-visitor-91.214.x.x');

  const keyValidation = validateCaptchaKeys(config);
  const sensitivityInfo = getCaptchaSensitivityLabel(config.scoreThreshold);
  const liveSimPreview = evaluateCaptchaVerification(config, {
    score: simScore,
    tokenProvided: simValidToken,
    isLoggedAdmin: simIsAdmin,
  });

  const isRecaptcha = config.provider === 'recaptcha-v3';
  const activeSiteKey = isRecaptcha ? config.recaptchaSiteKey : config.turnstileSiteKey;
  const activeSecretKey = isRecaptcha ? config.recaptchaSecretKey : config.turnstileSecretKey;

  const handleSiteKeyChange = (value: string) => {
    if (isRecaptcha) {
      onChange({ recaptchaSiteKey: value });
    } else {
      onChange({ turnstileSiteKey: value });
    }
  };

  const handleSecretKeyChange = (value: string) => {
    if (isRecaptcha) {
      onChange({ recaptchaSecretKey: value });
    } else {
      onChange({ turnstileSecretKey: value });
    }
  };

  const handleLoadDemoKeys = (provider: CaptchaProvider) => {
    if (provider === 'recaptcha-v3') {
      onChange({
        provider: 'recaptcha-v3',
        recaptchaSiteKey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
        recaptchaSecretKey: '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe',
      });
    } else {
      onChange({
        provider: 'turnstile',
        turnstileSiteKey: '0x4AAAAAAADnPIDROrmt1Wwj',
        turnstileSecretKey: '0x4AAAAAAADnPIDROrmt1Wwj_secret_demo_key',
      });
    }
  };

  const protectedFormsCount = [
    config.protectLogin,
    config.protectRegister,
    config.protectLostPassword,
    config.protectComments,
    config.protectRestEndpoints,
  ].filter(Boolean).length;

  const totalRequests = config.stats.verifiedHumans + config.stats.blockedBots;
  const blockRatePercent =
    totalRequests > 0 ? Math.round((config.stats.blockedBots / totalRequests) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  09. Botvédelem: Google reCAPTCHA v3 &amp; Cloudflare Turnstile
                </h2>
                <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                  v0.6.0 ÚJ MODUL
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
                Opcionálisan választható <strong className="text-slate-900 dark:text-slate-200">Google reCAPTCHA v3</strong> vagy{' '}
                <strong className="text-slate-900 dark:text-slate-200">Cloudflare Turnstile</strong> integráció API-kulcs kezeléssel,
                finomhangolható bot-észlelési küszöbértékkel (<code className="text-emerald-600 dark:text-emerald-300 font-mono">0.1 – 0.9</code>),
                WordPress űrlapvédelemmel és valós idejű Audit Napló összeköttetéssel.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <label className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={config.showSidebarBadge}
                onChange={(e) => onChange({ showSidebarBadge: e.target.checked })}
                className="rounded border-slate-300 dark:border-slate-700 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Oldalsáv védjegy widget
              </span>
            </label>

            <button
              type="button"
              onClick={() => onChange({ enabled: !config.enabled })}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 border ${
                config.enabled
                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  config.enabled ? 'bg-emerald-500' : 'bg-slate-400'
                }`}
              />
              {config.enabled ? 'Botvédelem AKTÍV' : 'Botvédelem KIKAPCSOLVA'}
            </button>
          </div>
        </div>

        {/* Top KPI Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3.5">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Aktív Szolgáltató</span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {isRecaptcha ? 'Google reCAPTCHA v3' : 'Cloudflare Turnstile'}
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-600 dark:text-blue-300 border border-blue-500/30">
                {isRecaptcha ? 'SCORE v3' : config.turnstileMode.toUpperCase()}
              </span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block truncate">
              {keyValidation.readyForProduction ? 'Kulcspár hitelesítve' : 'Site Key aktív · Secret Key opcionális'}
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3.5">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Észlelési Küszöbérték</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">
                &ge; {config.scoreThreshold.toFixed(2)}
              </span>
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate">
                {sensitivityInfo.label.split(' ')[0]}
              </span>
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              Legutóbbi blokkolt: {config.stats.lastBlockedScore.toFixed(2)}
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3.5">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Hitelesített Emberek</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-base font-bold font-mono text-slate-900 dark:text-white">
                {config.stats.verifiedHumans.toLocaleString('hu-HU')}
              </span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">db kérés</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              Védett űrlapok: {protectedFormsCount}/5 felület
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3.5">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Blokkolt Bot Támadások</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-base font-bold font-mono text-rose-600 dark:text-rose-400">
                {config.stats.blockedBots.toLocaleString('hu-HU')}
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                ({blockRatePercent}% szűrve)
              </span>
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block truncate">
              {config.stats.lastBlockedIp}
            </span>
          </div>
        </div>
      </div>

      {/* Step 1: Provider Selection */}
      <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              1. CAPTCHA Szolgáltató Kiválasztása
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Válassz a láthatatlan pontszám-alapú Google reCAPTCHA v3 vagy az adatvédelem-központú Cloudflare Turnstile között.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
            Aktív: <strong className="text-slate-900 dark:text-white">{config.provider}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Google reCAPTCHA v3 Card */}
          <button
            type="button"
            onClick={() => onChange({ provider: 'recaptcha-v3' })}
            className={`text-left p-4 rounded-xl border transition-all ${
              isRecaptcha
                ? 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-500/60'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    Google reCAPTCHA v3
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30">
                    Láthatatlan Score (0.0 – 1.0)
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                  Kattintás és képrejtvény nélküli háttérelemzés. Minden látogatóhoz egy{' '}
                  <code className="text-blue-600 dark:text-blue-300 font-mono">0.0</code> (bot) és{' '}
                  <code className="text-blue-600 dark:text-blue-300 font-mono">1.0</code> (ember) közötti kockázati pontszámot rendel.
                </p>
              </div>
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                  isRecaptcha
                    ? 'border-blue-500 bg-blue-600 text-white'
                    : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900'
                }`}
              >
                {isRecaptcha && <CheckCircle2 className="w-3.5 h-3.5" />}
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
              <span>API: <code className="font-mono">google.com/recaptcha/api/siteverify</code></span>
              <span className="text-blue-600 dark:text-blue-400 font-semibold">
                {isRecaptcha ? 'Kiválasztva' : 'Váltás erre'}
              </span>
            </div>
          </button>

          {/* Cloudflare Turnstile Card */}
          <button
            type="button"
            onClick={() => onChange({ provider: 'turnstile' })}
            className={`text-left p-4 rounded-xl border transition-all ${
              !isRecaptcha
                ? 'bg-amber-50/70 dark:bg-amber-950/25 border-amber-500/60'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    Cloudflare Turnstile
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                    GDPR &amp; Privacy-First
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                  Süti-mentes, adatvédelem-barát alternatíva. Böngésző kriptográfiai kihívásokkal
                  és telemetriai pontszámmal védi a WordPress belépési és űrlap végpontokat.
                </p>
              </div>
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                  !isRecaptcha
                    ? 'border-amber-500 bg-amber-500 text-slate-950'
                    : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900'
                }`}
              >
                {!isRecaptcha && <CheckCircle2 className="w-3.5 h-3.5" />}
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
              <span>API: <code className="font-mono">challenges.cloudflare.com/turnstile</code></span>
              <span className="text-amber-600 dark:text-amber-400 font-semibold">
                {!isRecaptcha ? 'Kiválasztva' : 'Váltás erre'}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Step 2: Key Configuration & Step 3: Threshold Tuning */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* API Keys Configuration */}
        <div className="lg:col-span-6 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                2. API Kulcsok ({isRecaptcha ? 'Google reCAPTCHA v3' : 'Cloudflare Turnstile'})
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Add meg a nyilvános Site Key és a szerveroldali Secret Key kulcsokat.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleLoadDemoKeys(config.provider)}
              className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-semibold border border-slate-200 dark:border-slate-700 transition-colors"
            >
              Teszt kulcspár betöltése
            </button>
          </div>

          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {isRecaptcha
                  ? 'Google reCAPTCHA v3 Site Key (Nyilvános kulcs)'
                  : 'Cloudflare Turnstile Site Key (Nyilvános kulcs)'}
              </label>
              <input
                type="text"
                value={activeSiteKey}
                onChange={(e) => handleSiteKeyChange(e.target.value)}
                placeholder={
                  isRecaptcha
                    ? '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'
                    : '0x4AAAAAAADnPIDROrmt1Wwj'
                }
                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {isRecaptcha
                    ? 'Google reCAPTCHA v3 Secret Key (Titkos szerver kulcs)'
                    : 'Cloudflare Turnstile Secret Key (Titkos szerver kulcs)'}
                </label>
                <button
                  type="button"
                  onClick={() => setShowSecretKey((prev) => !prev)}
                  className="text-[11px] text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1"
                >
                  {showSecretKey ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" /> Elrejtés
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" /> Megjelenítés
                    </>
                  )}
                </button>
              </div>
              <input
                type={showSecretKey ? 'text' : 'password'}
                value={activeSecretKey}
                onChange={(e) => handleSecretKeyChange(e.target.value)}
                placeholder={
                  isRecaptcha
                    ? '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe'
                    : '0x4AAAAAAADnPIDROrmt1Wwj_secret_demo_key'
                }
                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5">
              {keyValidation.readyForProduction ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              )}
              <div className="text-xs">
                <p
                  className={`font-semibold ${
                    keyValidation.readyForProduction
                      ? 'text-emerald-700 dark:text-emerald-300'
                      : 'text-amber-700 dark:text-amber-300'
                  }`}
                >
                  {keyValidation.statusLabel}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Mindkét szolgáltató kulcsai külön-külön elmentésre kerülnek a{' '}
                  <code className="font-mono">wp_options</code> táblában.
                </p>
              </div>
            </div>

            {/* Turnstile Specific Options */}
            {!isRecaptcha && (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Turnstile Widget Mód
                  </label>
                  <select
                    value={config.turnstileMode}
                    onChange={(e) =>
                      onChange({ turnstileMode: e.target.value as TurnstileWidgetMode })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="managed">Managed (Okos adaptív kihívás)</option>
                    <option value="non-interactive">Non-Interactive (Háttér töltőcsík)</option>
                    <option value="invisible">Invisible (Teljesen láthatatlan)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Turnstile Megjelenés (Téma)
                  </label>
                  <select
                    value={config.turnstileTheme}
                    onChange={(e) =>
                      onChange({ turnstileTheme: e.target.value as TurnstileTheme })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="auto">Automatikus (Rendszer alapján)</option>
                    <option value="dark">Sötét mód (Dark)</option>
                    <option value="light">Világos mód (Light)</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Detection Sensitivity / Score Threshold */}
        <div className="lg:col-span-6 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                3. Észlelési Érzékenység &amp; Küszöbérték Beállítása
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Minél magasabb az érték, annál szigorúbb a szűrés. Az ennél alacsonyabb pontszámú kéréseket a WordPress blokkolja.
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
                {config.scoreThreshold.toFixed(2)}
              </span>
              <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-500">
                Küszöb
              </span>
            </div>
          </div>

          {/* Slider */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 space-y-2.5">
            <div className="flex justify-between text-[11px] font-mono text-slate-500">
              <span>0.10 (Megengedő)</span>
              <span>0.50 (Ajánlott)</span>
              <span>0.90 (Maximális)</span>
            </div>
            <input
              type="range"
              min={0.1}
              max={0.9}
              step={0.05}
              value={config.scoreThreshold}
              onChange={(e) => onChange({ scoreThreshold: parseFloat(e.target.value) })}
              aria-label="Bot-észlelési küszöbérték"
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong className="text-slate-900 dark:text-white">{sensitivityInfo.label}:</strong>{' '}
              {sensitivityInfo.description}
            </p>
          </div>

          {/* 4 Preset Buttons */}
          <div className="grid grid-cols-2 gap-2.5">
            {THRESHOLD_PRESETS.map((preset) => {
              const active = Math.abs(config.scoreThreshold - preset.value) < 0.02;
              return (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => onChange({ scoreThreshold: preset.value })}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    active
                      ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-500/60 text-slate-900 dark:text-white'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold">{preset.title}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400">
                      {preset.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    {preset.subtitle}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Step 4: Protected WordPress Surfaces & Security Rules */}
      <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            4. Védett WordPress Űrlapok és Biztonsági Szabályok
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Válaszd ki, mely WordPress végpontokon kényszerítse ki a bővítmény a szerveroldali CAPTCHA token és küszöbérték ellenőrzést.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            {
              key: 'protectLogin' as const,
              title: 'Bejelentkezési űrlap (wp-login.php)',
              desc: 'Brute-force és credential stuffing támadások megállítása belépéskor.',
              hook: 'authenticate',
            },
            {
              key: 'protectRegister' as const,
              title: 'Felhasználói regisztráció',
              desc: 'Tömeges fake-fiók és spam regisztrációk kiszűrése.',
              hook: 'registration_errors',
            },
            {
              key: 'protectLostPassword' as const,
              title: 'Elfelejtett jelszó űrlap',
              desc: 'Email-flooding és jelszó-visszaállító visszaélések tiltása.',
              hook: 'lostpassword_post',
            },
            {
              key: 'protectComments' as const,
              title: 'Hozzászólások (wp-comments-post.php)',
              desc: 'Automata link-spam és kéretlen kommentek megelőzése.',
              hook: 'preprocess_comment',
            },
            {
              key: 'protectRestEndpoints' as const,
              title: 'Publikus REST API végpontok',
              desc: 'Védelem az automatizált API lekérdezések és űrlapbeküldések ellen.',
              hook: 'rest_pre_dispatch',
            },
            {
              key: 'bypassLoggedInAdmins' as const,
              title: 'Bejelentkezett Adminisztrátorok mentesítése',
              desc: 'A manage_options jogosultságú adminokat nem lassítja CAPTCHA ellenőrzés.',
              hook: 'current_user_can',
            },
          ].map((item) => (
            <label
              key={item.key}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                config[item.key]
                  ? 'bg-white dark:bg-slate-900 border-emerald-500/40'
                  : 'bg-white/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-75'
              }`}
            >
              <input
                type="checkbox"
                checked={config[item.key]}
                onChange={(e) => onChange({ [item.key]: e.target.checked })}
                className="mt-0.5 rounded border-slate-300 dark:border-slate-700 text-emerald-600 focus:ring-emerald-500"
              />
              <div className="min-w-0">
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  {item.title}
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {item.desc}
                </p>
                <span className="inline-block mt-2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                  WP Hook: {item.hook}
                </span>
              </div>
            </label>
          ))}
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-800">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={config.logBlockedAttempts}
              onChange={(e) => onChange({ logBlockedAttempts: e.target.checked })}
              className="rounded border-slate-300 dark:border-slate-700 text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-xs text-slate-700 dark:text-slate-300">
              Blokkolt bot kísérletek automatikus rögzítése a <strong>08. Naplózás &amp; E-mail</strong> modulban (<code className="font-mono text-emerald-600 dark:text-emerald-400">bot_protection</code>)
            </span>
          </label>

          <span className="text-[11px] font-mono text-slate-500">
            Shortcode: <code className="text-emerald-600 dark:text-emerald-400">[wtk_captcha_badge]</code>
          </span>
        </div>
      </div>

      {/* Step 5: Interactive Bot Detection & Threshold Simulator */}
      <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              5. Interaktív Bot-Észlelés és Küszöbérték Szimulátor
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Teszteld élőben, hogyan dönt a beállított{' '}
              <code className="text-emerald-600 dark:text-emerald-300 font-mono">
                &ge; {config.scoreThreshold.toFixed(2)}
              </code>{' '}
              küszöbérték különböző látogatói és bot pontszámok esetén!
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {SIMULATOR_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  setSimScore(preset.score);
                  setSimValidToken(preset.tokenProvided);
                  setSimIsAdmin(preset.isLoggedAdmin);
                  setSimSurface(preset.surface);
                  setSimActor(preset.actor);
                }}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300 transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3.5">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-700 dark:text-slate-300 font-semibold">
                  Szimulált látogatói pontszám (Score):
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {simScore.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min={0.05}
                max={0.99}
                step={0.01}
                value={simScore}
                onChange={(e) => setSimScore(parseFloat(e.target.value))}
                aria-label="Szimulált látogatói pontszám"
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>0.05 (Botnet)</span>
                <span>Küszöb: {config.scoreThreshold.toFixed(2)}</span>
                <span>0.99 (Verifikált ember)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Célzott WordPress felület
                </label>
                <select
                  value={simSurface}
                  onChange={(e) => setSimSurface(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                >
                  <option value="wp-login.php (Bejelentkezés)">wp-login.php (Bejelentkezés)</option>
                  <option value="Regisztrációs űrlap">Regisztrációs űrlap</option>
                  <option value="wp-comments-post.php (Komment)">wp-comments-post.php (Komment)</option>
                  <option value="Elfelejtett jelszó űrlap">Elfelejtett jelszó űrlap</option>
                  <option value="WP REST API (/wp-json/)">WP REST API (/wp-json/)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Kliens / IP azonosító
                </label>
                <input
                  type="text"
                  value={simActor}
                  onChange={(e) => setSimActor(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={simValidToken}
                  onChange={(e) => setSimValidToken(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-700 text-blue-600"
                />
                Érvényes kriptográfiai token
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={simIsAdmin}
                  onChange={(e) => setSimIsAdmin(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-700 text-blue-600"
                />
                Bejelentkezett Adminisztrátor
              </label>
            </div>
          </div>

          {/* Live Decision Box */}
          <div
            className={`lg:col-span-5 rounded-xl p-4 border flex flex-col justify-between ${
              liveSimPreview.allowed
                ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-500/40'
                : 'bg-rose-50/70 dark:bg-rose-950/25 border-rose-500/40'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Előnézeti Döntés
                </span>
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                    liveSimPreview.allowed
                      ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/40'
                  }`}
                >
                  {liveSimPreview.allowed ? 'ENGEDÉLYEZVE (HUMÁN)' : 'BLOKKOLVA (BOT GYANÚ)'}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {liveSimPreview.allowed ? (
                  <UserCheck className="w-7 h-7 text-emerald-600 dark:text-emerald-400 shrink-0" />
                ) : (
                  <Bot className="w-7 h-7 text-rose-600 dark:text-rose-400 shrink-0" />
                )}
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Pontszám: {simScore.toFixed(2)} vs. Küszöb: {config.scoreThreshold.toFixed(2)}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                    {liveSimPreview.reason}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  onSimulateAttempt({
                    score: simScore,
                    tokenProvided: simValidToken,
                    isLoggedAdmin: simIsAdmin,
                    surfaceLabel: simSurface,
                    actorLabel: simActor,
                  })
                }
                className="flex-1 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5" />
                Szimuláció Futtatása &amp; Rögzítése
              </button>

              <button
                type="button"
                onClick={() =>
                  onChange({
                    stats: {
                      verifiedHumans: 0,
                      blockedBots: 0,
                      lastBlockedIp: 'Nincs blokkolt IP',
                      lastBlockedScore: simScore,
                    },
                  })
                }
                title="Statisztika nullázása"
                className="px-2.5 py-2 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* WordPress PHP Integration Snippet */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <FileCode2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-600 dark:text-slate-300">
              <span className="font-semibold text-slate-900 dark:text-white">
                WordPress 7.1 &amp; PHP 8.0+ natív integráció:
              </span>{' '}
              A generált <code className="font-mono text-emerald-600 dark:text-emerald-400">and-toolkit.php</code> a{' '}
              <code className="font-mono text-blue-600 dark:text-blue-400">wp_remote_post()</code> függvénnyel végzi a szerveroldali token-ellenőrzést és a{' '}
              <code className="font-mono text-blue-600 dark:text-blue-400">$score &gt;= {config.scoreThreshold.toFixed(2)}</code> kiértékelést.
            </div>
          </div>
          <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 shrink-0 flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5" /> Zero-Trust Verify
          </span>
        </div>
      </div>
    </div>
  );
};
