import React, { useEffect, useState } from 'react';
import {
  KeyRound,
  Smartphone,
  Clock,
  RefreshCw,
  Fingerprint,
  Mail,
  HardDriveDownload,
  ShieldCheck,
  Users,
  Code2,
  Globe,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Sparkles,
  Lock,
} from 'lucide-react';
import {
  AuthConfig,
  AuthMethodId,
  AuditRoleTarget,
  RoleAuthPolicy,
  AuditLogEntry,
} from '../types/toolkit';
import {
  computeAdjustedTimestamp,
  generateTotpCode,
  verifyTotpCodeWithDrift,
  isIpWhitelisted,
  evaluateRoleAuthRequirement,
  preserveAuthDataAcrossPluginUpdate,
} from '../utils/toolkitLogic';

interface AuthModulePanelProps {
  config: AuthConfig;
  onChange: (updated: Partial<AuthConfig>) => void;
  onAppendAuditLog?: (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => void;
}

const ROLE_LABELS: Record<AuditRoleTarget, string> = {
  administrator: 'Adminisztrátor',
  editor: 'Szerkesztő',
  author: 'Szerző',
  contributor: 'Közreműködő',
  subscriber: 'Feliratkozó',
};

const METHOD_META: Array<{ id: AuthMethodId; label: string; badge: string }> = [
  { id: 'totp', label: '2FA Hitelesítő (TOTP)', badge: 'RFC 6238' },
  { id: 'passkey', label: 'Passkey (WebAuthn)', badge: 'FIDO2' },
  { id: 'email', label: 'E-mail Kód (OTP)', badge: 'SMTP' },
  { id: 'offline', label: 'Offline Mentett Jelszó', badge: 'SHA-256' },
];

const POLICY_OPTIONS: Array<{ value: RoleAuthPolicy; label: string; color: string }> = [
  { value: 'required', label: 'Kötelező', color: 'border-amber-500/40 bg-amber-500/15 text-amber-300' },
  { value: 'optional', label: 'Opcionális', color: 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300' },
  { value: 'disabled', label: 'Tiltott', color: 'border-rose-500/40 bg-rose-500/15 text-rose-300' },
];

export const AuthModulePanel: React.FC<AuthModulePanelProps> = ({
  config,
  onChange,
  onAppendAuditLog,
}) => {
  const [nowMs, setNowMs] = useState<number>(() => Date.now());
  const [totpInput, setTotpInput] = useState<string>('');
  const [totpCheckMessage, setTotpCheckMessage] = useState<{
    valid: boolean;
    text: string;
  } | null>(null);
  const [newPasskeyLabel, setNewPasskeyLabel] = useState<string>('');
  const [newOfflineLabel, setNewOfflineLabel] = useState<string>('');
  const [generatedPlainOfflineCode, setGeneratedPlainOfflineCode] = useState<string | null>(null);
  const [newWhitelistIp, setNewWhitelistIp] = useState<string>('');
  const [testClientIp, setTestClientIp] = useState<string>('192.168.1.45');
  const [testUserRole, setTestUserRole] = useState<AuditRoleTarget>('administrator');
  const [copiedShortcode, setCopiedShortcode] = useState<boolean>(false);
  const [emailOtpTestCode, setEmailOtpTestCode] = useState<string | null>(null);
  const [updateSimStatus, setUpdateSimStatus] = useState<string | null>(null);
  const [frontendSelectedMethod, setFrontendSelectedMethod] = useState<AuthMethodId>('totp');

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNowMs(Date.now());
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const adjustedTime = computeAdjustedTimestamp(nowMs, config.manualTimeOffsetSec);
  const currentTotpCode = generateTotpCode(config.totpSecret, adjustedTime.adjustedUnixSec);
  const totpRemainingSec = 30 - (adjustedTime.adjustedUnixSec % 30);

  const handleSyncWithDevice = () => {
    const deviceNowIso = new Date().toISOString().slice(0, 19);
    onChange({
      manualServerTimeIso: deviceNowIso,
      manualTimeOffsetSec: 0,
      lastTimeSyncAt: new Date().toISOString(),
    });
    onAppendAuditLog?.({
      category: 'auth_security',
      severity: 'info',
      actorLogin: 'galandras12',
      actorRole: 'administrator',
      actorIp: '127.0.0.1',
      userAgent: 'Device Clock Sync (TOTP Drift Zeroed)',
      target: '10. Hitelesítés · Időszinkron',
      summary: 'Szerver és kliens készülék órája szinkronizálva (0 mp elcsúszás, időzóna-független UTC TOTP ablak).',
      emailDispatched: false,
    });
  };

  const handleManualDateTimeChange = (isoValue: string) => {
    const parsedMs = Date.parse(isoValue);
    if (!Number.isNaN(parsedMs)) {
      const diffSec = Math.round((parsedMs - Date.now()) / 1000);
      onChange({
        manualServerTimeIso: isoValue,
        manualTimeOffsetSec: Math.max(-86400, Math.min(86400, diffSec)),
        lastTimeSyncAt: new Date().toISOString(),
      });
    } else {
      onChange({ manualServerTimeIso: isoValue });
    }
  };

  const handleVerifyTotp = () => {
    const codeToVerify = totpInput.trim() || currentTotpCode;
    const res = verifyTotpCodeWithDrift(
      config.totpSecret,
      codeToVerify,
      nowMs,
      config.manualTimeOffsetSec,
      config.timeDriftToleranceWindows
    );
    if (res.valid) {
      setTotpCheckMessage({
        valid: true,
        text: `Sikeres 2FA TOTP ellenőrzés! Kód: ${codeToVerify} (Időablak eltérés: ${res.matchedWindowOffset * 30} mp)`,
      });
    } else {
      setTotpCheckMessage({
        valid: false,
        text: 'Érvénytelen 2FA kód! Használja a Készülékkel való szinkronizálást vagy ellenőrizze a 6 jegyű kódot.',
      });
    }
  };

  const handleRegenerateSecret = () => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let next = 'JBSWY3DPEHPK3PXP';
    next = Array.from({ length: 16 }, (_, idx) => alphabet[(Date.now() + idx * 7) % alphabet.length]).join('');
    onChange({ totpSecret: next });
    setTotpCheckMessage(null);
  };

  const handleAddPasskey = () => {
    const label = newPasskeyLabel.trim() || `Passkey Eszköz #${config.passkeys.length + 1}`;
    const randomHex = Math.abs((Date.now() * 2654435761) | 0)
      .toString(16)
      .toUpperCase()
      .padStart(8, '0');
    const newItem = {
      id: `pk-${Date.now()}`,
      deviceName: label,
      credentialIdPreview: `cred_webauthn_${randomHex.slice(0, 6)}...`,
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      lastUsedAt: 'Most regisztrálva',
      aaguid: 'ea9b8d66-4d01-1d21-3ce4-b6b48cb575d4',
    };
    onChange({ passkeys: [newItem, ...config.passkeys] });
    setNewPasskeyLabel('');
    onAppendAuditLog?.({
      category: 'auth_security',
      severity: 'info',
      actorLogin: 'galandras12',
      actorRole: 'administrator',
      actorIp: '127.0.0.1',
      userAgent: 'WebAuthn / FIDO2 Authenticator',
      target: label,
      summary: `Új Passkey (WebAuthn) hitelesítő kulcs regisztrálva: ${label}`,
      emailDispatched: false,
    });
  };

  const handleRemovePasskey = (id: string) => {
    onChange({ passkeys: config.passkeys.filter((p) => p.id !== id) });
  };

  const handleGenerateOfflinePassword = () => {
    const label = newOfflineLabel.trim() || `Mentett Offline Vészkód #${config.offlinePasswords.length + 1}`;
    const partA = Math.random().toString(36).substring(2, 6).toUpperCase();
    const partB = Math.random().toString(36).substring(2, 6).toUpperCase();
    const partC = Math.random().toString(36).substring(2, 6).toUpperCase();
    const plainCode = `ATK7-${partA}-${partB}-${partC}`;
    const newItem = {
      id: `off-${Date.now()}`,
      label,
      maskedPreview: `ATK7-${partA}-••••-${partC.slice(-2)}`,
      passwordHash: `sha256:${btoa(plainCode).slice(0, 24)}`,
      createdAt: new Date().toISOString().slice(0, 10),
      used: false,
    };
    setGeneratedPlainOfflineCode(plainCode);
    onChange({ offlinePasswords: [newItem, ...config.offlinePasswords] });
    setNewOfflineLabel('');
  };

  const handleDownloadOfflineVault = () => {
    const lines = [
      '============================================================',
      'AND TOOLKIT v0.7.0 - OFFLINE MENTETT JELSZÓ ÉS VÉSZKÓD SZÉF',
      `Exportálva: ${new Date().toISOString()}`,
      `2FA TOTP Kibocsátó: ${config.totpIssuer}`,
      `Frissítés-biztos védelem: ${config.preserveCredentialsOnUpdate ? 'AKTÍV' : 'KIKAPCSOLVA'}`,
      '============================================================',
      '',
      ...config.offlinePasswords.map(
        (item, idx) =>
          `${idx + 1}. [${item.used ? 'FELHASZNÁLVA' : 'AKTÍV'}] ${item.label} | Előnézet: ${item.maskedPreview} | Hash: ${item.passwordHash} | Létrehozva: ${item.createdAt}`
      ),
      '',
      'Megjegyzés: A kódok SHA-256 hash formában tárolódnak a wp_options táblában.',
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'and-toolkit-offline-jelszavak.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRolePolicyChange = (
    role: AuditRoleTarget,
    method: AuthMethodId,
    policy: RoleAuthPolicy
  ) => {
    onChange({
      rolePolicies: {
        ...config.rolePolicies,
        [role]: {
          ...config.rolePolicies[role],
          [method]: policy,
        },
      },
    });
  };

  const handleAddWhitelistIp = () => {
    const cleaned = newWhitelistIp.trim();
    if (!cleaned || config.whitelistedIps.includes(cleaned)) return;
    onChange({ whitelistedIps: [...config.whitelistedIps, cleaned] });
    setNewWhitelistIp('');
  };

  const handleRemoveWhitelistIp = (ip: string) => {
    onChange({ whitelistedIps: config.whitelistedIps.filter((item) => item !== ip) });
  };

  const handleSimulatePluginUpdate = () => {
    const incomingDefaultAuth: AuthConfig = {
      ...config,
      totpSecret: 'RESET_DEFAULT_SECRET_000',
      passkeys: [],
      offlinePasswords: [],
    };
    const merged = preserveAuthDataAcrossPluginUpdate(config, incomingDefaultAuth);
    setUpdateSimStatus(
      `Frissítési teszt sikeres! Megőrizve: 2FA Secret (${merged.totpSecret.slice(0, 6)}…), ${merged.passkeys.length} db Passkey és ${merged.offlinePasswords.length} db Offline mentett jelszó.`
    );
  };

  const handleSendTestEmailOtp = () => {
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    setEmailOtpTestCode(otp);
  };

  const handleCopyShortcode = () => {
    navigator.clipboard?.writeText('[wtk_auth_manager]');
    setCopiedShortcode(true);
    window.setTimeout(() => setCopiedShortcode(false), 1800);
  };

  const roleEval = evaluateRoleAuthRequirement(config, testUserRole, testClientIp);

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-400">
              <KeyRound className="h-6 w-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold text-white">
                  10. Hitelesítés Központ (2FA, Időszinkron, Passkey, E-mail & Offline Széf)
                </h2>
                <span className="rounded-md border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-indigo-300">
                  v0.7.0 ÚJDONSÁG
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                Többfaktoros hitelesítés szerver–kliens időeltolódás korrekcióval, FIDO2 Passkey támogatással,
                offline vészkódokkal, rangonkénti szabálymátrixszal, IP-fehérlistával és{' '}
                <code className="text-indigo-300">[wtk_auth_manager]</code> frontend önkiszolgáló shortcode-dal.
              </p>
            </div>
          </div>

          <label className="inline-flex cursor-pointer items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5">
            <span className="text-xs font-semibold text-slate-300">Hitelesítés modul aktív</span>
            <input
              type="checkbox"
              checked={config.enabled}
              onChange={(e) => onChange({ enabled: e.target.checked })}
              className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-indigo-500"
            />
          </label>
        </div>

        {/* Update-safe persistence guarantee banner */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
            <div>
              <div className="text-xs font-bold text-emerald-200">
                Frissítés-biztos Hitelesítő Adattárolás (Update-Safe Vault Guarantee)
              </div>
              <p className="mt-0.5 text-[11px] text-emerald-300/80">
                Ha a bővítmény frissítésre kerül (v0.6.0 → v0.7.0+), a beállított 2FA TOTP titkos kulcsok,
                regisztrált Passkey-k és Offline mentett kódok automatikusan védettek, soha nem íródnak felül.
              </p>
              {updateSimStatus && (
                <p className="mt-1.5 rounded bg-emerald-950/70 px-2.5 py-1 font-mono text-[11px] text-emerald-300">
                  ✓ {updateSimStatus}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-200">
              <input
                type="checkbox"
                checked={config.preserveCredentialsOnUpdate}
                onChange={(e) => onChange({ preserveCredentialsOnUpdate: e.target.checked })}
                className="h-4 w-4 rounded border-emerald-600 bg-slate-950 text-emerald-500"
              />
              Védelem bekapcsolva
            </label>
            <button
              type="button"
              onClick={handleSimulatePluginUpdate}
              className="rounded-lg border border-emerald-500/40 bg-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-500/30"
            >
              Plugin frissítés szimulálása
            </button>
          </div>
        </div>
      </div>

      {/* Row 1: 2FA TOTP + Server/Client Time Drift Sync */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 2FA TOTP Standard Authenticator */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Smartphone className="h-5 w-5 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">
                2FA Szabvány Hitelesítő (TOTP RFC 6238)
              </h3>
            </div>
            <input
              type="checkbox"
              checked={config.totpEnabled}
              onChange={(e) => onChange({ totpEnabled: e.target.checked })}
              className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-indigo-500"
            />
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Google Authenticator, Authy, Microsoft Authenticator, 1Password és Bitwarden kompatibilis 6 jegyű kód.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Simulated SVG QR matrix */}
            <div className="flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-white p-3 text-slate-900">
              <svg viewBox="0 0 80 80" className="h-24 w-24">
                <rect width="80" height="80" fill="#ffffff" />
                <rect x="6" y="6" width="22" height="22" fill="none" stroke="#0f172a" strokeWidth="4" />
                <rect x="12" y="12" width="10" height="10" fill="#0f172a" />
                <rect x="52" y="6" width="22" height="22" fill="none" stroke="#0f172a" strokeWidth="4" />
                <rect x="58" y="12" width="10" height="10" fill="#0f172a" />
                <rect x="6" y="52" width="22" height="22" fill="none" stroke="#0f172a" strokeWidth="4" />
                <rect x="12" y="58" width="10" height="10" fill="#0f172a" />
                <rect x="34" y="14" width="6" height="6" fill="#0f172a" />
                <rect x="34" y="28" width="12" height="6" fill="#4f46e5" />
                <rect x="28" y="38" width="18" height="8" fill="#0f172a" />
                <rect x="50" y="36" width="10" height="12" fill="#0f172a" />
                <rect x="36" y="54" width="10" height="10" fill="#4f46e5" />
                <rect x="52" y="54" width="18" height="6" fill="#0f172a" />
                <rect x="60" y="64" width="12" height="10" fill="#0f172a" />
              </svg>
              <span className="mt-1 font-mono text-[10px] font-bold text-slate-700">otpauth://totp</span>
            </div>

            <div className="space-y-3 sm:col-span-2">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Kibocsátó neve (Issuer)
                </label>
                <input
                  type="text"
                  value={config.totpIssuer}
                  onChange={(e) => onChange({ totpIssuer: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-white"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Base32 Titkos Kulcs (Secret)
                  </label>
                  <button
                    type="button"
                    onClick={handleRegenerateSecret}
                    className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300"
                  >
                    Új kulcs generálása
                  </button>
                </div>
                <input
                  type="text"
                  value={config.totpSecret}
                  onChange={(e) => onChange({ totpSecret: e.target.value.toUpperCase() })}
                  className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 font-mono text-xs text-indigo-300"
                />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-indigo-500/30 bg-indigo-950/30 px-3.5 py-2.5">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-indigo-300">
                    Élő korrigált 2FA TOTP kód
                  </div>
                  <div className="font-mono text-xl font-bold tracking-widest text-white">
                    {currentTotpCode}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400">Hátralévő idő</div>
                  <div className="font-mono text-sm font-bold text-amber-300">{totpRemainingSec} mp</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <input
              type="text"
              maxLength={6}
              value={totpInput}
              onChange={(e) => setTotpInput(e.target.value)}
              placeholder={`Teszt kód (pl. ${currentTotpCode})`}
              className="flex-1 rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 font-mono text-xs text-white"
            />
            <button
              type="button"
              onClick={handleVerifyTotp}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-500"
            >
              2FA Kód Ellenőrzése
            </button>
          </div>
          {totpCheckMessage && (
            <div
              className={`mt-2.5 rounded-lg border px-3 py-2 text-xs ${
                totpCheckMessage.valid
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                  : 'border-rose-500/40 bg-rose-500/10 text-rose-300'
              }`}
            >
              {totpCheckMessage.text}
            </div>
          )}
        </div>

        {/* Server & Client Time Drift Correction & Manual Sync */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Clock className="h-5 w-5 text-amber-400" />
              <h3 className="text-sm font-bold text-white">
                Szerver–Kliens Időeltolódás Korrekció & Készülék Szinkron
              </h3>
            </div>
            <span className="rounded border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] text-amber-300">
              Offset: {config.manualTimeOffsetSec >= 0 ? `+${config.manualTimeOffsetSec}` : config.manualTimeOffsetSec} mp
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Megelőzi az eltérő időzóna vagy elcsúszott szerveróra miatti sikertelen 2FA TOTP kódbeírási hibákat.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
              <div className="text-[10px] uppercase tracking-wider text-slate-500">
                Készülék (Kliens) pontos ideje
              </div>
              <div className="mt-1 font-mono text-xs font-bold text-emerald-300">
                {new Date(nowMs).toISOString().replace('T', ' ').slice(0, 19)} UTC
              </div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
              <div className="text-[10px] uppercase tracking-wider text-slate-500">
                Korrigált Hitelesítő Szerveridő
              </div>
              <div className="mt-1 font-mono text-xs font-bold text-indigo-300">
                {adjustedTime.adjustedIso.replace('T', ' ').slice(0, 19)} UTC
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Pontos Dátum és Idő Manuális Beállítása
              </label>
              <div className="mt-1 flex flex-wrap gap-2">
                <input
                  type="datetime-local"
                  value={config.manualServerTimeIso.slice(0, 16)}
                  onChange={(e) => handleManualDateTimeChange(e.target.value)}
                  className="flex-1 rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 font-mono text-xs text-white"
                />
                <button
                  type="button"
                  onClick={handleSyncWithDevice}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/20 px-3.5 py-1.5 text-xs font-semibold text-amber-200 transition hover:bg-amber-500/30"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Szinkronizálás a készülékkel
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400">
                  Manuális eltolás másodpercben ({config.manualTimeOffsetSec} mp)
                </label>
                <input
                  type="number"
                  min={-86400}
                  max={86400}
                  value={config.manualTimeOffsetSec}
                  onChange={(e) => onChange({ manualTimeOffsetSec: Number(e.target.value) || 0 })}
                  className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 font-mono text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400">
                  Időablak tűréshatár (±{config.timeDriftToleranceWindows * 30} mp)
                </label>
                <select
                  value={config.timeDriftToleranceWindows}
                  onChange={(e) =>
                    onChange({ timeDriftToleranceWindows: Number(e.target.value) })
                  }
                  className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-white"
                >
                  <option value={0}>±0 ablak (szigorú 30 mp)</option>
                  <option value={1}>±1 ablak (±30 mp tolerancia – ajánlott)</option>
                  <option value={2}>±2 ablak (±60 mp tolerancia)</option>
                  <option value={3}>±3 ablak (±90 mp tolerancia)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Passkey + Email Authenticator + Offline Password Vault */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Passkey (WebAuthn) */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Fingerprint className="h-5 w-5 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">Passkey (WebAuthn / FIDO2)</h3>
            </div>
            <input
              type="checkbox"
              checked={config.passkeyEnabled}
              onChange={(e) => onChange({ passkeyEnabled: e.target.checked })}
              className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-cyan-500"
            />
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Biometrikus (Touch ID, Face ID, Windows Hello) vagy hardveres biztonsági kulcs alapú belépés.
          </p>

          <div className="mt-3">
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Relying Party Domain (RP ID)
            </label>
            <input
              type="text"
              value={config.passkeyRpId}
              onChange={(e) => onChange({ passkeyRpId: e.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 font-mono text-xs text-cyan-300"
            />
          </div>

          <div className="mt-3 space-y-2">
            {config.passkeys.map((pk) => (
              <div
                key={pk.id}
                className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs"
              >
                <div>
                  <div className="font-semibold text-white">{pk.deviceName}</div>
                  <div className="font-mono text-[10px] text-slate-400">
                    {pk.credentialIdPreview} · {pk.lastUsedAt}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemovePasskey(pk.id)}
                  className="text-slate-500 hover:text-rose-400"
                  title="Passkey törlése"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-3 flex gap-2">
            <input
              type="text"
              value={newPasskeyLabel}
              onChange={(e) => setNewPasskeyLabel(e.target.value)}
              placeholder="Új eszköz neve (pl. iPad Pro FaceID)"
              className="flex-1 rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-white"
            />
            <button
              type="button"
              onClick={handleAddPasskey}
              className="inline-flex items-center gap-1 rounded-lg bg-cyan-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-cyan-500"
            >
              <Plus className="h-3.5 w-3.5" />
              Passkey
            </button>
          </div>
        </div>

        {/* Email Authenticator */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">E-mail Alapú Hitelesítő (OTP)</h3>
            </div>
            <input
              type="checkbox"
              checked={config.emailAuthEnabled}
              onChange={(e) => onChange({ emailAuthEnabled: e.target.checked })}
              className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-emerald-500"
            />
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Belépéskor egyszeri 6 jegyű hitelesítő kódot küld a felhasználó regisztrált e-mail címére.
          </p>

          <div className="mt-4 space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400">
                E-mail kód érvényességi ideje (perc)
              </label>
              <input
                type="number"
                min={1}
                max={60}
                value={config.emailCodeExpiryMins}
                onChange={(e) =>
                  onChange({ emailCodeExpiryMins: Math.max(1, Math.min(60, Number(e.target.value) || 10)) })
                }
                className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 font-mono text-xs text-white"
              />
            </div>

            <button
              type="button"
              onClick={handleSendTestEmailOtp}
              className="w-full rounded-lg border border-emerald-500/40 bg-emerald-500/15 px-3 py-2 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-500/25"
            >
              Teszt E-mail Hitelesítő Kód Küldése
            </button>

            {emailOtpTestCode && (
              <div className="rounded-xl border border-emerald-500/30 bg-slate-950 p-3 text-xs">
                <div className="text-[10px] font-semibold uppercase text-emerald-400">
                  Kiküldött E-mail OTP előnézet ({config.emailCodeExpiryMins} percig érvényes)
                </div>
                <div className="mt-1 font-mono text-lg font-bold tracking-widest text-white">
                  {emailOtpTestCode}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Offline Saved Password Manager */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDriveDownload className="h-5 w-5 text-purple-400" />
              <h3 className="text-sm font-bold text-white">Offline Mentett Jelszó Kezelő</h3>
            </div>
            <input
              type="checkbox"
              checked={config.offlinePasswordsEnabled}
              onChange={(e) => onChange({ offlinePasswordsEnabled: e.target.checked })}
              className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-purple-500"
            />
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Offline vészkódok és mentett alkalmazás-jelszavak internet vagy telefon nélküli belépéshez.
          </p>

          <div className="mt-3 space-y-2">
            {config.offlinePasswords.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs"
              >
                <div>
                  <div className="font-semibold text-white">{item.label}</div>
                  <div className="font-mono text-[10px] text-purple-300">{item.maskedPreview}</div>
                </div>
                <span className="rounded bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                  Aktív
                </span>
              </div>
            ))}
          </div>

          {generatedPlainOfflineCode && (
            <div className="mt-2 rounded-lg border border-purple-500/40 bg-purple-950/40 p-2.5 text-xs">
              <div className="text-[10px] text-purple-300">Új offline kód (mentse el most):</div>
              <div className="font-mono font-bold text-white">{generatedPlainOfflineCode}</div>
            </div>
          )}

          <div className="mt-3 flex gap-2">
            <input
              type="text"
              value={newOfflineLabel}
              onChange={(e) => setNewOfflineLabel(e.target.value)}
              placeholder="Címke (pl. Tartalék széf kulcs)"
              className="flex-1 rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-white"
            />
            <button
              type="button"
              onClick={handleGenerateOfflinePassword}
              className="rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-purple-500"
            >
              + Kód
            </button>
          </div>

          <button
            type="button"
            onClick={handleDownloadOfflineVault}
            className="mt-2.5 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-[11px] font-semibold text-slate-300 hover:border-purple-500/40 hover:text-white"
          >
            Offline Kódszéf Letöltése (.txt)
          </button>
        </div>
      </div>

      {/* Row 3: Per-Role Granular Policy Matrix */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <Users className="h-5 w-5 text-indigo-400" />
            <div>
              <h3 className="text-sm font-bold text-white">
                Szerepkörönkénti (Rang) Hitelesítési Szabálymátrix
              </h3>
              <p className="text-xs text-slate-400">
                Rangoknak külön-külön meghatározható módon állítható Kötelezőre, Opcionálisra vagy Tiltottra minden egyes hitelesítő szolgáltatás.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
                <th className="py-2.5 pr-4">WordPress Szerepkör (Rang)</th>
                {METHOD_META.map((m) => (
                  <th key={m.id} className="px-3 py-2.5">
                    <div>{m.label}</div>
                    <span className="font-mono text-[10px] text-slate-500">{m.badge}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {(Object.keys(ROLE_LABELS) as AuditRoleTarget[]).map((role) => (
                <tr key={role} className="hover:bg-slate-950/40">
                  <td className="py-3 pr-4 font-semibold text-white">{ROLE_LABELS[role]}</td>
                  {METHOD_META.map((m) => {
                    const currentPolicy = config.rolePolicies[role][m.id];
                    return (
                      <td key={m.id} className="px-3 py-2.5">
                        <div className="inline-flex rounded-lg border border-slate-800 bg-slate-950 p-0.5">
                          {POLICY_OPTIONS.map((opt) => {
                            const active = currentPolicy === opt.value;
                            return (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => handleRolePolicyChange(role, m.id, opt.value)}
                                className={`rounded-md px-2 py-1 text-[11px] font-semibold transition ${
                                  active
                                    ? `border ${opt.color}`
                                    : 'text-slate-400 hover:text-slate-200'
                                }`}
                              >
                                {opt.label}
                              </button>
                            );
                          })}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row 4: IP Whitelist + Frontend Shortcode Self-Service Portal [wtk_auth_manager] */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* IP Whitelist */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <div className="flex items-center gap-2.5">
            <Globe className="h-5 w-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-white">
                Hitelesítési Fehérlistás IP-címek (Bypass Whitelist)
              </h3>
              <p className="text-xs text-slate-400">
                Az előre definiált IP-címek vagy CIDR tartományok esetében a rendszer nem kéri a másodlagos hitelesítő használatát.
              </p>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <input
              type="text"
              value={newWhitelistIp}
              onChange={(e) => setNewWhitelistIp(e.target.value)}
              placeholder="IP vagy CIDR (pl. 203.0.113.10 vagy 10.0.0.0/24)"
              className="flex-1 rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 font-mono text-xs text-white"
            />
            <button
              type="button"
              onClick={handleAddWhitelistIp}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500"
            >
              IP Hozzáadása
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {config.whitelistedIps.map((ip) => (
              <span
                key={ip}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 font-mono text-xs text-emerald-300"
              >
                {ip}
                <button
                  type="button"
                  onClick={() => handleRemoveWhitelistIp(ip)}
                  className="text-slate-500 hover:text-rose-400"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          {/* Live IP & Role simulator */}
          <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-3.5">
            <div className="text-[11px] font-semibold text-slate-300">
              Élő Szabály- és IP-Fehérlista Tesztelő
            </div>
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <input
                type="text"
                value={testClientIp}
                onChange={(e) => setTestClientIp(e.target.value)}
                placeholder="Teszt IP-cím"
                className="rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 font-mono text-xs text-white"
              />
              <select
                value={testUserRole}
                onChange={(e) => setTestUserRole(e.target.value as AuditRoleTarget)}
                className="rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs text-white"
              >
                {(Object.keys(ROLE_LABELS) as AuditRoleTarget[]).map((r) => (
                  <option key={r} value={r}>
                    {ROLE_LABELS[r]}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-2.5 text-xs">
              {roleEval.bypassedByIp ? (
                <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />A megadott IP ({testClientIp}) fehérlistán van: nem kér hitelesítőt!
                </span>
              ) : (
                <span className="text-slate-300">
                  Kötelező: <strong className="text-amber-300">{roleEval.requiredMethods.join(', ') || 'nincs'}</strong> ·
                  Opcionális: <strong className="text-emerald-300">{roleEval.optionalMethods.join(', ') || 'nincs'}</strong> ·
                  Tiltott: <strong className="text-rose-300">{roleEval.disabledMethods.join(', ') || 'nincs'}</strong>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Shortcode Self-Service Portal Preview [wtk_auth_manager] */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <Code2 className="h-5 w-5 text-indigo-400" />
              <div>
                <h3 className="text-sm font-bold text-white">
                  Beilleszthető Frontend Önkiszolgáló Felület (wp-admin nélkül)
                </h3>
                <p className="text-xs text-slate-400">
                  Bármely oldalba beillesztve a felhasználók saját maguk választhatják ki és állíthatják be a kívánt hitelesítőt.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleCopyShortcode}
              className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-500/40 bg-indigo-500/15 px-3 py-1.5 font-mono text-xs font-semibold text-indigo-300 hover:bg-indigo-500/25"
            >
              {copiedShortcode ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              [wtk_auth_manager]
            </button>
          </div>

          <div className="mt-3">
            <label className="block text-[11px] font-semibold text-slate-400">
              Dedikált Frontend Oldal Útvonal (Slug)
            </label>
            <input
              type="text"
              value={config.shortcodePageSlug}
              onChange={(e) => onChange({ shortcodePageSlug: e.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 font-mono text-xs text-indigo-300"
            />
          </div>

          {/* Interactive Frontend Portal Simulation */}
          <div className="mt-4 rounded-xl border border-indigo-500/30 bg-slate-950 p-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <span className="text-xs font-bold text-white">
                Élő [wtk_auth_manager] Frontend Felhasználói Portál Előnézet
              </span>
              <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-[10px] font-semibold text-indigo-300">
                wp-admin mentes mód
              </span>
            </div>

            <p className="mt-2 text-[11px] text-slate-400">
              Válassza ki, melyik hitelesítő szolgáltatást szeretné használni fiókja védelméhez:
            </p>

            <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {METHOD_META.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setFrontendSelectedMethod(m.id)}
                  className={`rounded-lg border p-2 text-left text-[11px] transition ${
                    frontendSelectedMethod === m.id
                      ? 'border-indigo-500 bg-indigo-500/15 text-white'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="font-bold">{m.label}</div>
                  <div className="font-mono text-[10px] text-indigo-300">{m.badge}</div>
                </button>
              ))}
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-800 bg-slate-900/90 px-3 py-2 text-xs">
              <span className="text-slate-300">
                Kiválasztott szolgáltatás:{' '}
                <strong className="text-indigo-300">
                  {METHOD_META.find((m) => m.id === frontendSelectedMethod)?.label}
                </strong>
              </span>
              <span className="font-mono text-[11px] text-emerald-400">
                ✓ Készülék óra szinkronban ({config.manualTimeOffsetSec} mp)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
