import React, { useState } from 'react';
import {
  EyeOff,
  Eye,
  Lock,
  Link2,
  MessageSquare,
  UserX,
  Key,
  Copy,
  Check,
  FileCode2,
} from 'lucide-react';
import { WpHideConfig, BubblePosition, AuditLogEntry } from '../types/toolkit';
import {
  encryptMasterPassword,
  decryptMasterPasswordForAdmin,
  verifyMasterPasswordAccess,
  maskUserIdentityForPublic,
  sanitizeAndMaskWpOutput,
} from '../utils/toolkitLogic';

interface WpHideModulePanelProps {
  config: WpHideConfig;
  onChange: (updated: Partial<WpHideConfig>) => void;
  onAppendAuditLog?: (entry: AuditLogEntry) => void;
}

const SAMPLE_RAW_WP_HTML = `<!DOCTYPE html>
<html lang="hu">
<head>
  <meta name="generator" content="WordPress 7.1" />
  <link rel="stylesheet" href="https://example.hu/wp-content/themes/astra/style.css?ver=7.1" />
  <script src="https://example.hu/wp-includes/js/wp-emoji-release.min.js?ver=7.1"></script>
</head>
<body>
  <article class="post-101">
    <h1>Prémium Tagoknak Szóló Üzleti Stratégia 2026 és Média Galéria</h1>
    <p class="author">Írta: galandras12 (galandras12@admin.hu)</p>
    <img src="https://example.hu/wp-content/uploads/2026/05/uzleti-terv-diagram.webp" />
    <p>Ez a védett bejegyzés teljes törzsszövege és letölthető média melléklete.</p>
  </article>
</body>
</html>`;

export const WpHideModulePanel: React.FC<WpHideModulePanelProps> = ({
  config,
  onChange,
  onAppendAuditLog,
}) => {
  const [revealMasterPwd, setRevealMasterPwd] = useState<boolean>(false);
  const [newMasterPwdInput, setNewMasterPwdInput] = useState<string>('');
  const [masterPwdSavedNotice, setMasterPwdSavedNotice] = useState<string | null>(null);
  const [newMasterIp, setNewMasterIp] = useState<string>('');
  const [testVisitorLoggedIn, setTestVisitorLoggedIn] = useState<boolean>(false);
  const [testMasterGuestPwd, setTestMasterGuestPwd] = useState<string>('');
  const [testMasterVisitorIp, setTestMasterVisitorIp] = useState<string>('198.51.100.77');
  const [copiedLoginShortcode, setCopiedLoginShortcode] = useState<boolean>(false);
  const [bubblePreviewOpen, setBubblePreviewOpen] = useState<boolean>(true);
  const [bubbleSimUser, setBubbleSimUser] = useState<string>('');
  const [bubbleSimStatus, setBubbleSimStatus] = useState<string | null>(null);

  const decryptedAdminMasterPassword = decryptMasterPasswordForAdmin(
    config.masterPasswordCipher,
    true
  );

  const masterWhitelistIps = config.masterPasswordWhitelistedIps ?? [];

  const handleSaveNewMasterPassword = () => {
    const clean = newMasterPwdInput.trim();
    if (!clean) return;
    const encrypted = encryptMasterPassword(clean);
    onChange({
      masterPasswordCipher: encrypted.cipher,
      masterPasswordHash: encrypted.hash,
    });
    setNewMasterPwdInput('');
    setMasterPwdSavedNotice(
      'Új Mesterjelszó titkosítva (atk_enc_v1 + SHA-256) elmentve! Kódból nem kiolvasható, adminisztrátoroknak felfedhető.'
    );
    onAppendAuditLog?.({
      id: `log-hide-master-${Date.now()}`,
      timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
      category: 'wp_hide_shield',
      actionLabel: 'Mesterjelszó Titkosítva & Frissítve',
      actorUser: 'galandras12',
      actorRole: 'administrator',
      targetObject: '11. WP Rejtés · Mesterjelszó',
      details: 'Weboldal globális Mesterjelszó frissítve és titkosítva eltárolva.',
      ipLocation: '127.0.0.1',
      deviceBrowser: 'And ToolKit Studio',
      severity: 'warning',
    });
  };

  const handleAddMasterIp = () => {
    const cleaned = newMasterIp.trim();
    if (!cleaned || masterWhitelistIps.includes(cleaned)) return;
    onChange({
      masterPasswordWhitelistedIps: [...masterWhitelistIps, cleaned],
    });
    setNewMasterIp('');
  };

  const handleRemoveMasterIp = (ip: string) => {
    onChange({
      masterPasswordWhitelistedIps: masterWhitelistIps.filter((i) => i !== ip),
    });
  };

  const handleCopyLoginShortcode = () => {
    navigator.clipboard?.writeText('[wtk_custom_login]');
    setCopiedLoginShortcode(true);
    window.setTimeout(() => setCopiedLoginShortcode(false), 1800);
  };

  const masterGateCheck = verifyMasterPasswordAccess(
    testMasterGuestPwd,
    config,
    testMasterVisitorIp
  );

  const transformedSource = sanitizeAndMaskWpOutput(SAMPLE_RAW_WP_HTML, config, {
    isUserLoggedIn: testVisitorLoggedIn,
    hasValidMasterPassword: masterGateCheck.granted,
    clientIp: testMasterVisitorIp,
  });

  const sampleIdentityMask = maskUserIdentityForPublic(
    {
      userLogin: 'galandras12_admin',
      email: 'galandras12@cegesdomain.hu',
      userId: 101,
    },
    config
  );

  return (
    <div className="space-y-6">
      {/* v0.7.1: tájékoztató a PHP bővítmény tényleges képességeiről */}
      <div role="note" className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-xs leading-relaxed text-amber-200">
        <strong>Előnézet és tényleges PHP-támogatás:</strong> a letöltött PHP bővítményben jelenleg a <strong>verzió-/generator elrejtés</strong>, a <strong>felhasználó-felderítés tiltása</strong>, a <strong>szerző- és kommentnév-maszkolás</strong>, a <strong>csak tagoknak mód</strong> (REST zárolással), a <strong>mesterjelszó kapu</strong>, a <strong>[wtk_custom_login]</strong> űrlap és az <strong>AJAX belépő buborék</strong> működik. A mesterjelszót a bővítmény kizárólag sózott hash-ként tárolja (az admin sem tekintheti meg). Az <strong>URL-átírás (wp-content/wp-includes/wp-json álcázása) és a wp-login.php áthelyezése</strong> itt csak előnézet: a PHP kód még nem tartalmazza.
      </div>

      {/* Header Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 text-slate-100">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-400">
              <EyeOff className="h-6 w-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold text-white">
                  11. WP Rejtés, Buborék Belépés, Zárolt Tagok-Mód &amp; Mesterjelszó Kapu
                </h2>
                <span className="rounded-md border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-rose-300">
                  v0.7.0 STEALTH SHIELD
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                WordPress nyomok és URL-ek teljes álcázása robotok elől, egyedi belépési kapu és{' '}
                <code className="text-rose-300">[wtk_custom_login]</code> rövidkód, lebegő AJAX buborék belépés,
                forráskód-szivárgás mentes zárolt mód, szerző/e-mail maszkolás és titkosított Mesterjelszó.
              </p>
            </div>
          </div>

          <label className="inline-flex cursor-pointer items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5">
            <span className="text-xs font-semibold text-slate-300">WP Rejtés modul aktív</span>
            <input
              type="checkbox"
              checked={config.enabled}
              onChange={(e) => onChange({ enabled: e.target.checked })}
              className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-rose-500 focus:ring-rose-500"
            />
          </label>
        </div>
      </div>

      {/* Row 1: Hide WP URLs + Hide wp-login/wp-admin & Custom Login Shortcode */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Hide WordPress URLs & Bot Fingerprints */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 text-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Link2 className="h-5 w-5 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">
                WordPress URL-ek &amp; Robot-Ujjlenyomatok Elrejtése
              </h3>
            </div>
            <input
              type="checkbox"
              checked={config.hideWpPaths}
              onChange={(e) => onChange({ hideWpPaths: e.target.checked })}
              className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-indigo-500"
            />
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Átírja a <code className="text-slate-300">/wp-content</code> és{' '}
            <code className="text-slate-300">/wp-includes</code> hivatkozásokat, így a szkenner robotok nem tudják beazonosítani, hogy WordPress motor fut.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400">
                Álcázott wp-content útvonal
              </label>
              <input
                type="text"
                value={config.customContentSlug}
                onChange={(e) => onChange({ customContentSlug: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 font-mono text-xs text-indigo-300"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400">
                Álcázott wp-includes útvonal
              </label>
              <input
                type="text"
                value={config.customIncludesSlug}
                onChange={(e) => onChange({ customIncludesSlug: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 font-mono text-xs text-indigo-300"
              />
            </div>
          </div>

          <div className="mt-4 space-y-2.5">
            <label className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs">
              <span className="text-slate-300">
                WordPress verziószám (<code className="text-slate-400">?ver=7.1</code>), generator meta és readme.html eltávolítása
              </span>
              <input
                type="checkbox"
                checked={config.stripWpVersionMeta}
                onChange={(e) => onChange({ stripWpVersionMeta: e.target.checked })}
                className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-indigo-500"
              />
            </label>

            <label className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs">
              <span className="text-slate-300">
                <code className="text-slate-400">?author=1</code> és REST felhasználó-felderítő végpontok blokkolása (404)
              </span>
              <input
                type="checkbox"
                checked={config.blockAuthorScanning}
                onChange={(e) => onChange({ blockAuthorScanning: e.target.checked })}
                className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-indigo-500"
              />
            </label>
          </div>
        </div>

        {/* Hide wp-login.php & wp-admin + Custom URL + Shortcode */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 text-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Lock className="h-5 w-5 text-amber-400" />
              <h3 className="text-sm font-bold text-white">
                wp-login.php &amp; wp-admin Elrejtése + Egyedi URL / Shortcode
              </h3>
            </div>
            <input
              type="checkbox"
              checked={config.hideDefaultLoginAndAdmin}
              onChange={(e) => onChange({ hideDefaultLoginAndAdmin: e.target.checked })}
              className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-amber-500"
            />
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Elrejti az alapértelmezett <code className="text-slate-300">/wp-login.php</code> és{' '}
            <code className="text-slate-300">/wp-admin</code> címeket, helyette saját URL-t vagy shortcode-os belépőt biztosít.
          </p>

          <div className="mt-4">
            <label className="block text-[11px] font-semibold text-slate-400">
              Saját Bejelentkezési URL (Custom Login Slug)
            </label>
            <input
              type="text"
              value={config.customLoginSlug}
              onChange={(e) => onChange({ customLoginSlug: e.target.value })}
              placeholder="kapu-belepes"
              className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 font-mono text-xs text-amber-300"
            />
          </div>

          <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="flex items-center gap-2 text-xs font-semibold text-white">
                <input
                  type="checkbox"
                  checked={config.enableLoginShortcode}
                  onChange={(e) => onChange({ enableLoginShortcode: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-amber-500"
                />
                Beilleszthető Shortcode Belépő Űrlap engedélyezése
              </label>
              <button
                type="button"
                onClick={handleCopyLoginShortcode}
                className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/15 px-2.5 py-1 font-mono text-xs font-semibold text-amber-300 hover:bg-amber-500/25"
              >
                {copiedLoginShortcode ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                [wtk_custom_login]
              </button>
            </div>
            <p className="mt-1.5 text-[11px] text-slate-400">
              Bármely WordPress oldalba beillesztve megjeleníti a védett bejelentkező felületet anélkül, hogy a látogató a <code className="text-slate-300">wp-login.php</code> címre lépne.
            </p>
          </div>
        </div>
      </div>

      {/* Row 2: AJAX Bubble Login Widget + Hide Usernames & Emails on Posts/Comments */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* AJAX Bubble Login Widget */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 text-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <MessageSquare className="h-5 w-5 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">
                AJAX Alapú Lebegő Buborék Bejelentkező Widget
              </h3>
            </div>
            <input
              type="checkbox"
              checked={config.enableAjaxBubbleLogin}
              onChange={(e) => onChange({ enableAjaxBubbleLogin: e.target.checked })}
              className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-cyan-500"
            />
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Az oldal sarkában lebegő buborékként megnyitható azonnali AJAX bejelentkező ablak oldal-újratöltés nélkül.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400">
                Buborék pozíciója az oldalon
              </label>
              <select
                value={config.bubblePosition}
                onChange={(e) => onChange({ bubblePosition: e.target.value as BubblePosition })}
                className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-white"
              >
                <option value="bottom-right">Jobb alsó sarok</option>
                <option value="bottom-left">Bal alsó sarok</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400">
                Buborék gomb felirata
              </label>
              <input
                type="text"
                value={config.bubbleButtonLabel}
                onChange={(e) => onChange({ bubbleButtonLabel: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-white"
              />
            </div>
          </div>

          {/* Interactive AJAX Bubble Login Simulator */}
          <div className="mt-4 rounded-xl border border-cyan-500/30 bg-slate-950 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-300">
                Interaktív AJAX Buborék Widget Előnézet
              </span>
              <button
                type="button"
                onClick={() => setBubblePreviewOpen((prev) => !prev)}
                className="rounded-lg bg-cyan-600 px-3 py-1 text-[11px] font-bold text-white shadow"
              >
                💬 {config.bubbleButtonLabel}
              </button>
            </div>

            {bubblePreviewOpen && (
              <div className="mt-3 rounded-xl border border-slate-800 bg-slate-900 p-3 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    value={bubbleSimUser}
                    onChange={(e) => setBubbleSimUser(e.target.value)}
                    placeholder="Felhasználónév"
                    className="flex-1 rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-white"
                  />
                  <input
                    type="password"
                    value="••••••••"
                    readOnly
                    className="w-28 rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setBubbleSimStatus(
                        `AJAX wp_signon() válasz: Sikeres belépés (${bubbleSimUser || 'galandras12'})!`
                      )
                    }
                    className="rounded-lg bg-cyan-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-cyan-500"
                  >
                    Belépés
                  </button>
                </div>
                {bubbleSimStatus && (
                  <p className="mt-2 font-mono text-[11px] text-emerald-400">✓ {bubbleSimStatus}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Hide Usernames & Emails on Comments & Posts */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 text-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <UserX className="h-5 w-5 text-purple-400" />
              <h3 className="text-sm font-bold text-white">
                Felhasználónevek és E-mail Címek Elrejtése (Posztok &amp; Kommentek)
              </h3>
            </div>
            <input
              type="checkbox"
              checked={config.hideUsernamesAndEmails}
              onChange={(e) => onChange({ hideUsernamesAndEmails: e.target.checked })}
              className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-purple-500"
            />
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Megakadályozza, hogy adatgyűjtő robotok a bejegyzések szerzőiből vagy a hozzászólásokból kiolvassák a bejelentkezési neveket és e-mail címeket.
          </p>

          <div className="mt-4">
            <label className="block text-[11px] font-semibold text-slate-400">
              Maszkolt szerző álnév sablon a nyilvános felületen (#ID helyettesítéssel)
            </label>
            <input
              type="text"
              value={config.authorAliasPattern}
              onChange={(e) => onChange({ authorAliasPattern: e.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-white"
            />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs">
              <div className="text-[10px] font-bold uppercase text-rose-400">
                Eredeti (Robotok által látható)
              </div>
              <div className="mt-1 font-mono text-slate-300">login: galandras12_admin</div>
              <div className="font-mono text-slate-400">mail: galandras12@cegesdomain.hu</div>
            </div>
            <div className="rounded-xl border border-purple-500/30 bg-purple-950/20 p-3 text-xs">
              <div className="text-[10px] font-bold uppercase text-emerald-400">
                Maszkolt Nyilvános Kimenet
              </div>
              <div className="mt-1 font-mono text-white">
                Szerző: {sampleIdentityMask.publicAuthorName}
              </div>
              <div className="font-mono text-purple-300">
                E-mail: {sampleIdentityMask.publicEmailDisplay}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Logged-In Users Only Mode + Zero Source Code Leak Inspector */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 text-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <FileCode2 className="h-5 w-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-white">
                Kizárólag Bejelentkezett Felhasználók Mód (Átfedés + Forráskód-Szivárgás Védelem)
              </h3>
              <p className="text-xs text-slate-400">
                Bekapcsoláskor minden oldalt, bejegyzést és médiatartalmat zárol a vendégek elől, és a szerveroldali HTML forráskódból (<code className="text-emerald-300">view-source:</code>) is eltávolítja a tartalmat!
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-200">
              <input
                type="checkbox"
                checked={config.membersOnlyMode}
                onChange={(e) => onChange({ membersOnlyMode: e.target.checked })}
                className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-emerald-500"
              />
              Csak bejelentkezett felhasználóknak
            </label>
            <label className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-300">
              <input
                type="checkbox"
                checked={config.stripHtmlSourceForGuests}
                onChange={(e) => onChange({ stripHtmlSourceForGuests: e.target.checked })}
                className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-emerald-500"
              />
              Tartalom törlése a HTML forráskódból is (Zero Source Leak)
            </label>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400">
              Átfedő (Overlay) zárolási főcím
            </label>
            <input
              type="text"
              value={config.membersOnlyOverlayTitle}
              onChange={(e) => onChange({ membersOnlyOverlayTitle: e.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-white"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-400">
              Átfedő tájékoztató szöveg
            </label>
            <input
              type="text"
              value={config.membersOnlyOverlayMessage}
              onChange={(e) => onChange({ membersOnlyOverlayMessage: e.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-white"
            />
          </div>
        </div>

        {/* Live View-Source Inspector */}
        <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
            <span className="font-mono text-xs font-bold text-emerald-300">
              view-source:https://example.hu/uzleti-strategia/ — Élő HTML Forráskód Ellenőrző
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setTestVisitorLoggedIn(false)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                  !testVisitorLoggedIn
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-900 text-slate-400'
                }`}
              >
                Kijelentkezett Vendég / Robot
              </button>
              <button
                type="button"
                onClick={() => setTestVisitorLoggedIn(true)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                  testVisitorLoggedIn
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-900 text-slate-400'
                }`}
              >
                Bejelentkezett Tag
              </button>
            </div>
          </div>
          <pre className="mt-3 max-h-44 overflow-x-auto font-mono text-[11px] leading-relaxed text-slate-300">
            {transformedSource.outputHtml}
          </pre>
        </div>
      </div>

      {/* Row 4: Master Password Site Gate (Encrypted Storage + Admin Reveal + IP Whitelist) */}
      <div className="rounded-2xl border border-amber-500/30 bg-slate-900/90 p-6 text-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Key className="h-5 w-5 text-amber-400" />
            <div>
              <h3 className="text-sm font-bold text-white">
                Egységes Mesterjelszó Kapu (Titkosított Tárolás + Admin Felfedés + IP Fehérlista)
              </h3>
              <p className="text-xs text-slate-400">
                Bekapcsoláskor egy egységes mesterjelszó megadásával engedi csak látni a weboldal bármilyen tartalmát.
                A jelszó titkosítva (<code className="text-amber-300">atk_enc_v1</code>) tárolódik, de másik adminisztrátor számára a felületen megtekinthető.
              </p>
            </div>
          </div>

          <label className="inline-flex cursor-pointer items-center gap-2.5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-xs font-bold text-amber-200">
            <input
              type="checkbox"
              checked={config.masterPasswordEnabled}
              onChange={(e) => onChange({ masterPasswordEnabled: e.target.checked })}
              className="h-4 w-4 rounded border-amber-500 bg-slate-950 text-amber-500"
            />
            Mesterjelszó védelem bekapcsolva
          </label>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Encrypted storage + Admin reveal + Change Master Password */}
          <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-950 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">
                Beállított Mesterjelszó (Adminisztrátori Megtekintés)
              </span>
              <button
                type="button"
                onClick={() => setRevealMasterPwd((prev) => !prev)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-300 hover:bg-amber-500/25"
              >
                {revealMasterPwd ? (
                  <>
                    <EyeOff className="h-3.5 w-3.5" />
                    Jelszó Elrejtése
                  </>
                ) : (
                  <>
                    <Eye className="h-3.5 w-3.5" />
                    Mesterjelszó Megtekintése
                  </>
                )}
              </button>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900 p-3">
              <div className="text-[10px] uppercase tracking-wider text-slate-400">
                {revealMasterPwd
                  ? 'Felfedett Mesterjelszó (Csak Adminisztrátornak látható):'
                  : 'Forráskódban és adatbázisban tárolt titkosított alak (Cipher + Hash):'}
              </div>
              <div className="mt-1 font-mono text-sm font-bold text-amber-300 break-all">
                {revealMasterPwd
                  ? decryptedAdminMasterPassword || '(Nincs beállítva)'
                  : `${config.masterPasswordCipher} · ${config.masterPasswordHash}`}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400">
                Új Mesterjelszó Beállítása (mentéskor automatikusan titkosítva)
              </label>
              <div className="mt-1 flex gap-2">
                <input
                  type="text"
                  value={newMasterPwdInput}
                  onChange={(e) => setNewMasterPwdInput(e.target.value)}
                  placeholder="Írja be az új mesterjelszót..."
                  className="flex-1 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white"
                />
                <button
                  type="button"
                  onClick={handleSaveNewMasterPassword}
                  className="rounded-lg bg-amber-600 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-500"
                >
                  Titkosítás &amp; Mentés
                </button>
              </div>
              {masterPwdSavedNotice && (
                <p className="mt-2 text-xs text-emerald-400">✓ {masterPwdSavedNotice}</p>
              )}
            </div>
          </div>

          {/* Master Password IP Whitelist & Access Tester */}
          <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-950 p-4">
            <div>
              <h4 className="text-xs font-bold text-white">
                Mesterjelszó IP-cím Alapú Fehérlista
              </h4>
              <p className="text-[11px] text-slate-400">
                A fehérlistán szereplő IP-címekről érkező látogatóktól a weboldal nem kéri a Mesterjelszó megadását.
              </p>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newMasterIp}
                onChange={(e) => setNewMasterIp(e.target.value)}
                placeholder="IP vagy CIDR (pl. 198.51.100.25)"
                className="flex-1 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 font-mono text-xs text-white"
              />
              <button
                type="button"
                onClick={handleAddMasterIp}
                className="rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500"
              >
                + Fehérlista IP
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {masterWhitelistIps.map((ip) => (
                <span
                  key={ip}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 font-mono text-xs text-amber-300"
                >
                  {ip}
                  <button
                    type="button"
                    onClick={() => handleRemoveMasterIp(ip)}
                    className="text-slate-500 hover:text-rose-400"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {/* Live Master Gate Tester */}
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-3 text-xs">
              <div className="font-semibold text-slate-300">Élő Mesterjelszó Kapu Szimulátor</div>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <input
                  type="text"
                  value={testMasterVisitorIp}
                  onChange={(e) => setTestMasterVisitorIp(e.target.value)}
                  placeholder="Látogató IP-címe"
                  className="rounded border border-slate-800 bg-slate-950 px-2.5 py-1.5 font-mono text-xs text-white"
                />
                <input
                  type="text"
                  value={testMasterGuestPwd}
                  onChange={(e) => setTestMasterGuestPwd(e.target.value)}
                  placeholder="Beírt mesterjelszó..."
                  className="rounded border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-white"
                />
              </div>
              <div className="mt-2 font-semibold">
                {masterGateCheck.granted ? (
                  <span className="text-emerald-400">
                    ✓ Hozzáférés engedélyezve ({masterGateCheck.reason})
                  </span>
                ) : (
                  <span className="text-rose-400">
                    ✕ {masterGateCheck.reason}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
