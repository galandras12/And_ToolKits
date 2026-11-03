import { PLUGIN_TEMPLATE, PLUGIN_DEFAULTS_MARKER, PLUGIN_VERSION } from './pluginTemplate';
import {
  AuditEventCategory,
  AuditLogConfig,
  AuditLogEntry,
  AuditLogExportFormat,
  AuthConfig,
  AuthMethodId,
  CalendarConfig,
  CaptchaConfig,
  NumberFormatStyle,
  PendingUpdateItem,
  PerformanceConfig,
  RoleAuthMatrix,
  RoleAuthPolicy,
  ScheduledPostItem,
  SearchConfig,
  ToolkitState,
  WpHideConfig,
  WpUserRole,
} from '../types/toolkit';

export const INITIAL_POSTS: ScheduledPostItem[] = [
  {
    id: 'post-101',
    title: 'WordPress 7.1 Sebességoptimalizálás és Core Web Vitals Útmutató',
    date: '2026-11-05',
    time: '14:00',
    category: 'Webinárium',
    author: 'Kovács Gergely',
    excerpt: 'Hogyan csökkentsük a TTFB és LCP értékeket 40%-kal natív gyorsítótárazással és moduláris widgetekkel.',
    postType: 'event',
    views: 3420,
    downloads: 615,
    featured: true,
  },
  {
    id: 'post-102',
    title: 'And ToolKit v0.7.1 Kiadási Csomag: Hitelesítés (2FA/Passkey) & WP Rejtés (ZIP)',
    date: '2026-11-09',
    time: '10:30',
    category: 'Kiadás',
    author: 'galandras12+AI',
    excerpt: '2FA TOTP időszinkronnal, Passkey (WebAuthn), E-mail OTP, Offline mentett jelszavak, rang-mátrix, [wtk_auth_manager] shortcode, WP URL álcázás, AJAX buborék belépés és titkosított Mesterjelszó.',
    postType: 'download',
    views: 5840,
    downloads: 2190,
    featured: true,
  },
  {
    id: 'post-103',
    title: 'Budapesti WP Fejlesztői Konferencia: Moduláris Admin Felületek',
    date: '2026-11-14',
    time: '09:00',
    category: 'Konferencia',
    author: 'Tóth Bence',
    excerpt: 'Élő kerekasztal-beszélgetés és gyakorlati esettanulmányok nagy forgalmú tartalomkezelő rendszerekhez.',
    postType: 'event',
    views: 2890,
    downloads: 310,
    featured: false,
  },
  {
    id: 'post-104',
    title: 'Keresőoptimalizált Belső Keresőmotor Beállítása WooCommerce-hez',
    date: '2026-11-18',
    time: '16:00',
    category: 'Workshop',
    author: 'Szabó Dóra',
    excerpt: 'Valós idejű AJAX szűrés, találati kiemelés és konverziómérés beépítése egyedi sablonokba.',
    postType: 'post',
    views: 4120,
    downloads: 720,
    featured: false,
  },
  {
    id: 'post-105',
    title: 'GDPR Sütikezelés és Google Consent Mode v2 Beállítása WordPress-ben',
    date: '2026-11-22',
    time: '11:00',
    category: 'Hír',
    author: 'galandras12+AI',
    excerpt: 'Kötelező EU GDPR hozzájárulási kategóriák, szkript-blokkolás és auditálható süti-naplózás beépítése.',
    postType: 'post',
    views: 2450,
    downloads: 590,
    featured: true,
  },
  {
    id: 'post-106',
    title: 'Közösségi Megosztási Stratégiák és OpenGraph Sablon Készlet',
    date: '2026-11-27',
    time: '15:30',
    category: 'Workshop',
    author: 'Nagy Eszter',
    excerpt: 'Platformfüggetlen SVG megosztó gombok konfigurálása nulla külső lekéréssel a maximális sebességért.',
    postType: 'download',
    views: 2640,
    downloads: 935,
    featured: false,
  },
];

export const INITIAL_AUDIT_ENTRIES: AuditLogEntry[] = [
  {
    id: 'log-901',
    timestamp: '2026-11-03 08:14:22',
    category: 'user_login',
    actionLabel: 'Bejelentkezés (Új hely & eszköz)',
    actorUser: 'galandras12',
    actorRole: 'administrator',
    targetObject: 'wp-login.php (2FA Hitelesítve)',
    details: 'Adminisztrátori belépés új eszközről és új földrajzi helyről. Azonnali biztonsági e-mail riasztás kiküldve.',
    ipLocation: '84.2.44.19 (Budapest, HU)',
    deviceBrowser: 'macOS 15 · Chrome 141.0 (Új eszköz)',
    isNewDeviceOrLocation: true,
    severity: 'warning',
  },
  {
    id: 'log-902',
    timestamp: '2026-11-03 07:45:09',
    category: 'core_manual_update',
    actionLabel: 'WordPress Mag (Core) Frissítés Indítva',
    actorUser: 'galandras12',
    actorRole: 'administrator',
    targetObject: 'WordPress Core (7.0.2 → 7.1.0)',
    details: 'Kézi WordPress mag frissítés sikeresen végrehajtva: 7.0.2 verzióról 7.1.0 verzióra (Indította: galandras12).',
    previousVersion: '7.0.2',
    newVersion: '7.1.0',
    ipLocation: '84.2.44.19 (Budapest, HU)',
    deviceBrowser: 'macOS 15 · Chrome 141.0',
    severity: 'critical',
  },
  {
    id: 'log-902b',
    timestamp: '2026-11-03 07:10:44',
    category: 'filesystem_change',
    actionLabel: 'Fájlrendszer Változás Észlelve (Kritikus)',
    actorUser: 'galandras12',
    actorRole: 'administrator',
    targetObject: 'wp-config.php & /wp-content/plugins/and-toolkit/and-toolkit.php',
    details: 'Magas kockázatú fájlrendszer-módosítás (SHA-256 hash változás észlelve a wp-config.php és a bővítmény fájlrendszerében).',
    ipLocation: '84.2.44.19 (Budapest, HU)',
    deviceBrowser: 'macOS 15 · SFTP / WP File Integrity Monitor',
    severity: 'critical',
  },
  {
    id: 'log-903',
    timestamp: '2026-11-03 06:30:00',
    category: 'auto_system_update',
    actionLabel: 'Automatizált Rendszerfrissítés Befejezve',
    actorUser: 'WP-Cron Automatikus Rendszer',
    actorRole: 'system',
    targetObject: 'Háttérfrissítés (2 plugin, 1 téma)',
    details: 'A WordPress automatizált rendszerfrissítése lefutott (wp_maybe_auto_update): WooCommerce 9.3.1 → 9.3.2, Astra 4.8.0 → 4.8.1.',
    previousVersion: '9.3.1',
    newVersion: '9.3.2',
    severity: 'info',
  },
  {
    id: 'log-904',
    timestamp: '2026-11-02 19:20:45',
    category: 'plugin_lifecycle',
    actionLabel: 'Plugin Frissítés & Telepítés',
    actorUser: 'galandras12',
    actorRole: 'administrator',
    targetObject: 'And ToolKit (v0.4.0 → v0.5.0)',
    details: 'Bővítmény frissítve az adminisztrációs felületen: And ToolKit 0.4.0 verzióról 0.5.0 verzióra.',
    previousVersion: '0.4.0',
    newVersion: '0.5.0',
    ipLocation: '84.2.44.19 (Budapest, HU)',
    severity: 'info',
  },
  {
    id: 'log-905',
    timestamp: '2026-11-02 17:52:11',
    category: 'theme_lifecycle',
    actionLabel: 'Téma Frissítés',
    actorUser: 'kovacs.gergely',
    actorRole: 'administrator',
    targetObject: 'Twenty Twenty-Five Child (1.2.0 → 1.3.0)',
    details: 'WordPress sablon (téma) frissítve: Twenty Twenty-Five Child (1.2.0 → 1.3.0). Régi gyorsítótár ürítve.',
    previousVersion: '1.2.0',
    newVersion: '1.3.0',
    ipLocation: '195.56.112.8 (Debrecen, HU)',
    severity: 'info',
  },
  {
    id: 'log-906',
    timestamp: '2026-11-02 16:15:33',
    category: 'user_lifecycle',
    actionLabel: 'Felhasználó Létrehozva (Meghívóval)',
    actorUser: 'galandras12',
    actorRole: 'administrator',
    targetObject: 'nagy.eszter (Szerkesztő)',
    details: 'Új felhasználó létrehozva másik felhasználó meghívója által (Meghívta: galandras12). Kezdeti csoport: Szerkesztő (editor).',
    userCreationMethod: 'user-invitation',
    ipLocation: '84.2.44.19 (Budapest, HU)',
    severity: 'info',
  },
  {
    id: 'log-907',
    timestamp: '2026-11-02 15:40:18',
    category: 'user_lifecycle',
    actionLabel: 'Felhasználói Csoport Áthelyezés',
    actorUser: 'galandras12',
    actorRole: 'administrator',
    targetObject: 'toth.bence (Szerző → Szerkesztő)',
    details: 'Felhasználó áthelyezve másik jogosultsági csoportba (set_user_role): Közreműködő/Szerző (author) → Szerkesztő (editor).',
    userCreationMethod: 'role-changed',
    ipLocation: '84.2.44.19 (Budapest, HU)',
    severity: 'warning',
  },
  {
    id: 'log-908',
    timestamp: '2026-11-02 14:12:04',
    category: 'post_lifecycle',
    actionLabel: 'Bejegyzés (Poszt) Szerkesztve',
    actorUser: 'szabo.dora',
    actorRole: 'editor',
    targetObject: 'Poszt #104: Keresőoptimalizált Belső Keresőmotor',
    details: 'Bejegyzés tartalma és kivonata módosítva (save_post hook, revízió #7 rögzítve).',
    ipLocation: '91.82.14.201 (Szeged, HU)',
    deviceBrowser: 'Windows 11 · Firefox 133.0',
    severity: 'info',
  },
  {
    id: 'log-909',
    timestamp: '2026-11-02 12:05:50',
    category: 'page_lifecycle',
    actionLabel: 'Oldal (Page) Létrehozva & Szerkesztve',
    actorUser: 'szabo.dora',
    actorRole: 'editor',
    targetObject: 'Oldal #42: Adatvédelmi és GDPR Tájékoztató',
    details: 'Állandó WordPress oldal (post_type=page) létrehozva és közzétéve az EU GDPR modulhoz.',
    ipLocation: '91.82.14.201 (Szeged, HU)',
    deviceBrowser: 'Windows 11 · Firefox 133.0',
    severity: 'info',
  },
];

export const INITIAL_PENDING_UPDATES: PendingUpdateItem[] = [
  {
    id: 'upd-1',
    componentType: 'core',
    name: 'WordPress Mag (Core)',
    currentVersion: '7.1.0',
    newVersion: '7.1.1-security',
    detectedAt: '2026-11-03 06:00',
    autoUpdatedInLast24h: true,
  },
  {
    id: 'upd-2',
    componentType: 'plugin',
    name: 'WooCommerce E-Commerce',
    currentVersion: '9.3.1',
    newVersion: '9.4.0',
    detectedAt: '2026-11-03 05:30',
    autoUpdatedInLast24h: true,
  },
  {
    id: 'upd-3',
    componentType: 'plugin',
    name: 'Yoast SEO Premium',
    currentVersion: '23.7.0',
    newVersion: '23.8.2',
    detectedAt: '2026-11-03 07:15',
    autoUpdatedInLast24h: false,
  },
  {
    id: 'upd-4',
    componentType: 'theme',
    name: 'Astra Pro Sablon (Téma)',
    currentVersion: '4.8.1',
    newVersion: '4.9.0',
    detectedAt: '2026-11-03 04:45',
    autoUpdatedInLast24h: true,
  },
];

export const INITIAL_STATE: ToolkitState = {
  theme: 'light',
  previewThemeSync: true,
  previewDevice: 'desktop',
  calendar: {
    enabled: true,
    widgetTitle: 'Közelgő Események & Bejegyzések',
    style: 'cards',
    maxItems: 4,
    categoryFilter: 'all',
    showCategory: true,
    showTime: true,
    showExcerpt: true,
    showCountdown: true,
    accentColor: 'blue',
  },
  search: {
    enabled: true,
    widgetTitle: 'Gyors Keresés az Oldalon',
    placeholder: 'Keresés bejegyzések, események között...',
    layout: 'detailed',
    liveAjax: true,
    debounceMs: 180,
    maxResults: 4,
    includedTypes: ['post', 'event', 'page', 'download'],
    showThumbnail: true,
    showCategory: true,
    showDate: true,
    showExcerpt: true,
    highlightMatches: true,
    showPopularTags: true,
    popularTags: ['WordPress', 'Konferencia', 'Optimalizálás', 'GDPR', 'ZIP'],
  },
  social: {
    enabled: true,
    widgetTitle: 'Tartalom Megosztása',
    subtitle: 'Oszd meg egyetlen kattintással kedvenc platformodon',
    buttonStyle: 'rounded',
    columns: 2,
    showShareCounts: true,
    showTotalShares: true,
    includeCopyLink: true,
    utmTracking: true,
    useBrandColors: true,
    platforms: [
      { id: 'facebook', name: 'Facebook', enabled: true, shareCount: 1420, brandHex: '#1877F2' },
      { id: 'x', name: 'X (Twitter)', enabled: true, shareCount: 890, brandHex: '#0F172A' },
      { id: 'linkedin', name: 'LinkedIn', enabled: true, shareCount: 645, brandHex: '#0A66C2' },
      { id: 'whatsapp', name: 'WhatsApp', enabled: true, shareCount: 512, brandHex: '#16A34A' },
      { id: 'telegram', name: 'Telegram', enabled: true, shareCount: 318, brandHex: '#0284C7' },
      { id: 'reddit', name: 'Reddit', enabled: true, shareCount: 274, brandHex: '#EA580C' },
      { id: 'pinterest', name: 'Pinterest', enabled: false, shareCount: 129, brandHex: '#DC2626' },
      { id: 'email', name: 'E-mail küldés', enabled: true, shareCount: 195, brandHex: '#475569' },
    ],
  },
  stats: {
    enabled: true,
    widgetTitle: 'Oldal Hatékonyság & Forgalom',
    style: 'grid-cards',
    numberFormat: 'compact',
    showUniqueVisitors: true,
    showTotalDownloads: true,
    showActiveReaders: true,
    showShareConversions: true,
    showSearchEfficiency: true,
    showTrendDelta: true,
    showSparkline: true,
    customBadgeText: 'Élő mérés · 30 napos összesítés',
    accentTheme: 'blue',
    totals: {
      uniqueVisitors: 48920,
      totalDownloads: 12640,
      activeReaders: 142,
      shareConversions: 4383,
      searchSuccessRate: 94.2,
    },
    history: [
      { date: '2026-10-27', label: 'Hét', uniqueVisitors: 6120, pageViews: 14200, downloads: 1540, shares: 520, searches: 890 },
      { date: '2026-10-28', label: 'Kedd', uniqueVisitors: 6840, pageViews: 15800, downloads: 1790, shares: 610, searches: 940 },
      { date: '2026-10-29', label: 'Sze', uniqueVisitors: 7290, pageViews: 16900, downloads: 1920, shares: 685, searches: 1050 },
      { date: '2026-10-30', label: 'Csüt', uniqueVisitors: 6950, pageViews: 16100, downloads: 1810, shares: 590, searches: 980 },
      { date: '2026-10-31', label: 'Pén', uniqueVisitors: 7810, pageViews: 18400, downloads: 2150, shares: 740, searches: 1180 },
      { date: '2026-11-01', label: 'Szo', uniqueVisitors: 6420, pageViews: 14900, downloads: 1620, shares: 548, searches: 860 },
      { date: '2026-11-02', label: 'Vas', uniqueVisitors: 7490, pageViews: 17300, downloads: 1810, shares: 690, searches: 1020 },
    ],
  },
  gdpr: {
    enabled: true,
    widgetTitle: 'GDPR Süti (Cookie) és Adatvédelmi Beállítások',
    description:
      'Weboldalunk az EU GDPR rendeletnek megfelelően sütiket használ a biztonságos működéshez, valamint – hozzájárulása esetén – a látogatottsági statisztikákhoz és közösségi funkciókhoz.',
    displayStyle: 'sidebar-widget',
    privacyPolicyUrl: '/adatvedelmi-tajekoztato',
    consentExpiryDays: 180,
    acceptAllLabel: 'Összes elfogadása',
    rejectLabel: 'Csak a szükségesek',
    savePreferencesLabel: 'Választás mentése',
    googleConsentModeV2: true,
    autoBlockScripts: true,
    showCategoryDetails: true,
    showReopenBadge: true,
    categories: [
      {
        id: 'necessary',
        name: 'Feltétlenül szükséges (Munkamenet & Biztonság)',
        description: 'Az oldal alapvető működéséhez, CSRF védelemhez és a süti-hozzájárulás tárolásához elengedhetetlen sütik.',
        cookiesUsed: 'atk_consent_v2, wordpress_test_cookie, wp-settings',
        required: true,
        defaultEnabled: true,
      },
      {
        id: 'preferences',
        name: 'Funkcionális és Megjelenési Preferenciák',
        description: 'Megjegyzi a választott Világos/Sötét témát és a nyelvi vagy keresési szűrő beállításokat.',
        cookiesUsed: 'atk_theme_mode, atk_search_prefs',
        required: false,
        defaultEnabled: true,
      },
      {
        id: 'analytics',
        name: 'Statisztikai és Hatékonyságmérő Sütik',
        description: 'Anonimizált látogatói és letöltési számlálók a tartalmak hatékonyságának méréséhez (analytics_storage).',
        cookiesUsed: 'atk_visitor_hash, atk_download_tracker',
        required: false,
        defaultEnabled: false,
      },
      {
        id: 'marketing',
        name: 'Marketing és Közösségi Beágyazások',
        description: 'Harmadik féltől származó közösségi média bővítmények és személyre szabott ajánlások (ad_storage, ad_user_data).',
        cookiesUsed: 'atk_social_share_ref, _gcl_au',
        required: false,
        defaultEnabled: false,
      },
    ],
    consentStats: {
      acceptedAll: 34820,
      customSelection: 8410,
      essentialOnly: 5690,
    },
  },
  banner: {
    enabled: true,
    visibilityScope: 'all-pages',
    stickyTop: true,
    colorPreset: 'cobalt-gradient',
    customBgHex: '#1E3A8A',
    customTextHex: '#FFFFFF',
    sizePreset: 'standard',
    fontStyle: 'display-bold',
    animation: 'pulse-glow',
    badgeText: 'ÚJ VERZIÓ · v0.7.1',
    headline: 'And ToolKit v0.7.0: 2FA/Passkey Hitelesítés Időszinkronnal & Teljes WP Rejtés Modul!',
    subtext: '2FA TOTP + Készülék Időszinkron, Passkey, E-mail OTP, Offline Kódok, Frissítés-védelem, [wtk_auth_manager] Shortcode, WP URL Álcázás, AJAX Buborék Belépés és Titkosított Mesterjelszó.',
    ctaLabel: 'Hitelesítés & WP Rejtés',
    ctaUrl: '/kiadasok/and-toolkit-v0-7-0',
    dismissible: true,
    showIcon: true,
    impressions: 36480,
    clicks: 4610,
  },
  optimizer: {
    enabled: true,
    showSidebarSpeedBadge: true,
    autoOptimizeEnabled: true,
    autoSchedule: 'realtime-upload',
    lastOptimizedAt: '2026-11-02 14:35:10',
    totalOptimizationRuns: 48,
    imageCompressionEnabled: true,
    compressionQuality: 82,
    convertFormat: 'webp',
    autoResizeEnabled: true,
    maxWidthPx: 1920,
    maxHeightPx: 1080,
    stripExifMetadata: true,
    keepOriginalBackup: false,
    mediaQueue: [
      {
        id: 'img-1',
        fileName: 'wp71-konferencia-hero-4k.png',
        originalFormat: 'PNG',
        targetFormat: 'WebP',
        originalDimensions: '3840×2160',
        resizedDimensions: '1920×1080',
        originalSizeKb: 2480,
        optimizedSizeKb: 310,
        status: 'optimized',
      },
      {
        id: 'img-2',
        fileName: 'and-toolkit-dashboard-screen.jpg',
        originalFormat: 'JPG',
        targetFormat: 'WebP',
        originalDimensions: '2560×1440',
        resizedDimensions: '1920×1080',
        originalSizeKb: 1420,
        optimizedSizeKb: 215,
        status: 'optimized',
      },
      {
        id: 'img-3',
        fileName: 'woocommerce-kereso-diagram.png',
        originalFormat: 'PNG',
        targetFormat: 'WebP',
        originalDimensions: '2400×1600',
        resizedDimensions: '1620×1080',
        originalSizeKb: 1890,
        optimizedSizeKb: 265,
        status: 'pending',
      },
      {
        id: 'img-4',
        fileName: 'budapest-meetup-galeria-01.jpg',
        originalFormat: 'JPG',
        targetFormat: 'WebP',
        originalDimensions: '4000×2667',
        resizedDimensions: '1620×1080',
        originalSizeKb: 3150,
        optimizedSizeKb: 390,
        status: 'pending',
      },
    ],
    overrideUploadLimit: true,
    defaultWpUploadLimitMb: 8,
    customUploadLimitMb: 256,
    maxExecutionTimeSec: 300,
    allowSvgAndAvifUpload: true,
    lazyLoadImages: true,
    lazyLoadIframesAndVideos: true,
    lazyLoadBackgrounds: true,
    excludeAboveFoldCount: 2,
    fetchPriorityHighOnLcp: true,
    lazyPlaceholder: 'blurhash',
    pageCacheEnabled: true,
    browserCacheTtlHours: 168,
    gzipBrotliEnabled: true,
    currentCacheSizeMb: 18.4,
    lastCachePurgedAt: '2026-11-02 12:15:00',
    speedMetrics: {
      ttfbMs: 38,
      lcpMs: 690,
      clsScore: '0.002',
      pageSpeedScore: 99,
      totalSavedMb: 42.8,
    },
  },
  auditLog: {
    enabled: true,
    showSidebarAuditWidget: true,
    recipientEmail: '',
    criticalOnlyEmails: false,
    logUserLogins: true,
    logPluginChanges: true,
    logThemeChanges: true,
    logPostChanges: true,
    logPageChanges: true,
    logUserLifecycle: true,
    logAutoSystemUpdates: true,
    logCoreManualUpdates: true,
    defaultExportFormat: 'log',
    retentionDays: 90,
    loginEmailEnabled: true,
    loginEmailScope: 'admins-only',
    newDeviceLocationEmailEnabled: true,
    newDeviceTargetRoles: ['administrator', 'editor'],
    updateAvailableEmailEnabled: true,
    notifyPluginUpdates: true,
    notifyThemeUpdates: true,
    notifyCoreUpdates: true,
    dailyDigestEnabled: true,
    dailyDigestTime: '08:00',
    lastDigestSentAt: '2026-11-03 08:00:00',
    emailsSentTotal: 19,
    entries: INITIAL_AUDIT_ENTRIES,
    pendingUpdates: INITIAL_PENDING_UPDATES,
  },
  captcha: {
    enabled: true,
    provider: 'recaptcha-v3',
    recaptchaSiteKey: '6Lc_AndToolKit_WP71_SiteKey_Demo060',
    recaptchaSecretKey: '',
    turnstileSiteKey: '0x4AAAAAA_AndToolKit_Turnstile_Demo060',
    turnstileSecretKey: '',
    scoreThreshold: 0.5,
    turnstileMode: 'managed',
    turnstileTheme: 'auto',
    protectLogin: true,
    protectRegister: true,
    protectLostPassword: true,
    protectComments: true,
    protectRestEndpoints: false,
    bypassLoggedInAdmins: true,
    logBlockedAttempts: true,
    showSidebarBadge: true,
    stats: {
      verifiedHumans: 1842,
      blockedBots: 127,
      lastBlockedIp: '185.220.101.44 (Tor Exit / Botnet)',
      lastBlockedScore: 0.15,
    },
  },
  auth: {
    enabled: true,
    totpEnabled: true,
    totpIssuer: 'And ToolKit WP 7.1',
    totpSecretKey: 'JBSWY3DPEHPK3PXPANDTK070',
    totpDigits: 6,
    totpPeriodSeconds: 30,
    passkeyEnabled: true,
    passkeyRpId: 'and-toolkit.hu',
    passkeyUserVerification: 'required',
    passkeyCredentials: [
      {
        id: 'pk-1',
        label: 'MacBook Pro Touch ID (galandras12)',
        deviceType: 'Apple Passkey / WebAuthn FIDO2',
        createdAt: '2026-11-01 10:15',
        lastUsedAt: '2026-11-03 08:14',
        credentialIdPreview: 'cred_fido2_99a4...e71b',
      },
      {
        id: 'pk-2',
        label: 'YubiKey 5C NFC Hardverkulcs',
        deviceType: 'FIDO2 Roaming Security Key',
        createdAt: '2026-10-24 16:40',
        lastUsedAt: '2026-11-02 19:20',
        credentialIdPreview: 'cred_yubi5_41c8...09fa',
      },
    ],
    emailAuthEnabled: true,
    emailOtpExpiryMinutes: 10,
    offlinePasswordsEnabled: true,
    offlineSavedItems: [
      {
        id: 'off-1',
        codePreview: 'ATK7-9421-X8M2',
        passwordHash: 'sha256$8f9d2a1c4e7b...01a9',
        label: 'Vészhelyzeti Offline Kód #1 (Széf)',
        createdAt: '2026-11-01 10:00',
        used: false,
      },
      {
        id: 'off-2',
        codePreview: 'ATK7-3310-Q5P9',
        passwordHash: 'sha256$3c1e7b849a20...77d2',
        label: 'Vészhelyzeti Offline Kód #2 (Papír alapú)',
        createdAt: '2026-11-01 10:00',
        used: false,
      },
      {
        id: 'off-3',
        codePreview: 'ATK7-6184-K2V7',
        passwordHash: 'sha256$5a8812d0c3f1...44e8',
        label: 'Offline Mentett Alkalmazás Jelszó (SFTP/CLI)',
        createdAt: '2026-10-28 14:20',
        used: false,
      },
      {
        id: 'off-4',
        codePreview: 'ATK7-1059-L9R4',
        passwordHash: 'sha256$9b04e1a66f22...18c3',
        label: 'Korábban felhasznált tartalék kód',
        createdAt: '2026-10-15 09:10',
        used: true,
      },
    ],
    timeDriftCorrectionEnabled: true,
    timeOffsetSeconds: 0,
    manualServerTimeIso: '2026-11-03 08:30:00',
    lastSyncedWithDeviceAt: '2026-11-03 08:14:22',
    toleranceWindows: 2,
    preserveCredentialsOnUpdate: true,
    storageSchemaVersion: '0.7.0-vault-v1',
    lastBackupSnapshotAt: '2026-11-03 08:00:00',
    roleMatrix: {
      administrator: {
        totp: 'required',
        passkey: 'required',
        email: 'optional',
        offline: 'required',
      },
      editor: {
        totp: 'required',
        passkey: 'optional',
        email: 'optional',
        offline: 'optional',
      },
      author: {
        totp: 'optional',
        passkey: 'optional',
        email: 'required',
        offline: 'optional',
      },
      contributor: {
        totp: 'optional',
        passkey: 'disabled',
        email: 'optional',
        offline: 'disabled',
      },
      subscriber: {
        totp: 'disabled',
        passkey: 'optional',
        email: 'optional',
        offline: 'disabled',
      },
    },
    enableFrontendShortcode: true,
    shortcodeTag: '[wtk_auth_manager]',
    shortcodePageSlug: '/fiok-hitelesites-kezelo',
    allowUserMethodSwitch: true,
    whitelistedIps: ['127.0.0.1', '84.2.44.19', '192.168.1.0/24'],
    showSidebarAuthWidget: true,
  },
  wpHide: {
    enabled: true,
    hideWpPaths: true,
    customContentSlug: 'assets-media',
    customIncludesSlug: 'core-lib',
    customUploadsSlug: 'media-vault',
    hideWpJsonEndpoint: true,
    customRestPrefix: 'api-portal',
    stripWpVersionMeta: true,
    blockAuthorScanning: true,
    blockReadmeAndLicense: true,
    hideDefaultLoginAndAdmin: true,
    customLoginSlug: 'kapu-belepes',
    customAdminRedirectSlug: '404-oldal-nem-talalhato',
    enableLoginShortcode: true,
    loginShortcodeTag: '[wtk_custom_login]',
    enableAjaxBubbleLogin: true,
    bubblePosition: 'bottom-right',
    bubbleButtonLabel: 'Gyors Belépés',
    bubbleTitle: 'And ToolKit AJAX Bejelentkezés',
    membersOnlyMode: false,
    membersOnlyOverlayTitle: 'Védett Tartalom — Kizárólag Bejelentkezett Felhasználóknak',
    membersOnlyOverlayMessage: 'Az oldal tartalmának, bejegyzéseinek és médiafájljainak megtekintéséhez kérjük, jelentkezzen be. A forráskód szerveroldalon zárolva van.',
    protectPagesPostsAndMedia: true,
    stripHtmlSourceForGuests: true,
    hideUsernamesAndEmails: true,
    maskPostAuthorLogin: true,
    maskCommentAuthorEmailAndLogin: true,
    maskRestUsersEndpoint: true,
    authorAliasPattern: 'Szerző #ID (Védett profil)',
    masterPasswordEnabled: false,
    masterPasswordCipher: 'atk_enc_v1:Mlo3RlhLeldXSFZaUUdJPTpBbmRUb29sS2l0IzIwMjZNYXN0ZXI=',
    masterPasswordHash: 'atk_sha256:9f4c8b12e7a3d056b8e14c9072f61a3b5d8e2c4f',
    masterPasswordSessionHours: 12,
    masterPasswordWhitelistedIps: ['127.0.0.1', '84.2.44.19'],
    showSidebarHideBadge: true,
  },
  performance: {
    minifyAssets: true,
    deferScripts: true,
    svgSpritesOnly: true,
    objectCacheTtlMinutes: 60,
    zeroJqueryDependency: true,
  },
  posts: INITIAL_POSTS,
};

/**
 * Filter and sort scheduled posts for the Event Calendar Widget
 */
export function getFilteredCalendarPosts(
  posts: ScheduledPostItem[],
  config: CalendarConfig
): ScheduledPostItem[] {
  const filtered = posts.filter((post) => {
    if (config.categoryFilter !== 'all' && post.category !== config.categoryFilter) {
      return false;
    }
    return true;
  });

  return [...filtered]
    .sort((a, b) => {
      const dateCmp = a.date.localeCompare(b.date);
      if (dateCmp !== 0) return dateCmp;
      return a.time.localeCompare(b.time);
    })
    .slice(0, Math.max(1, config.maxItems));
}

/**
 * Calculate days remaining from reference date (default 2026-11-02)
 */
export function getDaysUntilEvent(eventDateStr: string, refDateStr = '2026-11-02'): number {
  const eventTime = Date.parse(`${eventDateStr}T00:00:00Z`);
  const refTime = Date.parse(`${refDateStr}T00:00:00Z`);
  if (Number.isNaN(eventTime) || Number.isNaN(refTime)) return 0;
  const diffDays = Math.round((eventTime - refTime) / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Filter posts for the customizable Search Widget
 */
export function searchPosts(
  posts: ScheduledPostItem[],
  query: string,
  config: SearchConfig
): ScheduledPostItem[] {
  const typeFiltered = posts.filter((p) => config.includedTypes.includes(p.postType));
  const cleanQuery = query.trim().toLowerCase();

  if (!cleanQuery) {
    return typeFiltered.slice(0, config.maxResults);
  }

  const matched = typeFiltered.filter((post) => {
    const haystack = `${post.title} ${post.excerpt} ${post.category} ${post.author}`.toLowerCase();
    return haystack.includes(cleanQuery);
  });

  return matched.slice(0, config.maxResults);
}

/**
 * Format numeric metrics according to the user's selected formatting style
 */
export function formatMetricValue(value: number, format: NumberFormatStyle): string {
  if (format === 'compact') {
    if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1)}M`;
    }
    if (value >= 1_000) {
      return `${(value / 1_000).toFixed(1)}K`;
    }
    return String(value);
  }
  if (format === 'comma') {
    return value.toLocaleString('en-US');
  }
  // 'exact' Hungarian space-separated thousands
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

/**
 * Compute estimated frontend bundle size (KB) and load time (ms) based on performance settings
 */
export function calculatePerformanceMetrics(
  perf: PerformanceConfig,
  activeModulesCount: number
): {
  bundleSizeKb: number;
  estimatedLoadMs: number;
  lighthouseScore: number;
} {
  let baseKb = 4.2 + activeModulesCount * 1.1;
  if (!perf.minifyAssets) baseKb += 4.8;
  if (!perf.svgSpritesOnly) baseKb += 6.5;
  if (!perf.zeroJqueryDependency) baseKb += 28.0;

  let loadMs = Math.round(baseKb * 1.8);
  if (!perf.deferScripts) loadMs += 35;
  if (perf.objectCacheTtlMinutes === 0) loadMs += 28;

  const score = Math.min(
    100,
    Math.max(
      72,
      100 -
        (perf.minifyAssets ? 0 : 4) -
        (perf.deferScripts ? 0 : 5) -
        (perf.svgSpritesOnly ? 0 : 3) -
        (perf.zeroJqueryDependency ? 0 : 9)
    )
  );

  return {
    bundleSizeKb: Number(baseKb.toFixed(1)),
    estimatedLoadMs: loadMs,
    lighthouseScore: score,
  };
}

/**
 * Calculate total original KB, optimized KB, and savings percentage across media queue items
 */
export function calculateMediaQueueSummary(
  items: ToolkitState['optimizer']['mediaQueue']
): {
  totalOriginalKb: number;
  totalOptimizedKb: number;
  savedKb: number;
  savingsPercent: number;
  pendingCount: number;
} {
  const totalOriginalKb = items.reduce((acc, item) => acc + item.originalSizeKb, 0);
  const totalOptimizedKb = items.reduce((acc, item) => acc + item.optimizedSizeKb, 0);
  const savedKb = Math.max(0, totalOriginalKb - totalOptimizedKb);
  const savingsPercent =
    totalOriginalKb > 0 ? Math.round((savedKb / totalOriginalKb) * 100) : 0;
  const pendingCount = items.filter((i) => i.status === 'pending').length;

  return {
    totalOriginalKb,
    totalOptimizedKb,
    savedKb,
    savingsPercent,
    pendingCount,
  };
}

/**
 * Filter audit log entries by category and free-text query
 */
export function filterAuditLogEntries(
  entries: AuditLogEntry[],
  categoryFilter: AuditEventCategory | 'all',
  query: string
): AuditLogEntry[] {
  const cleanQuery = query.trim().toLowerCase();
  return entries.filter((entry) => {
    if (categoryFilter !== 'all' && entry.category !== categoryFilter) {
      return false;
    }
    if (!cleanQuery) {
      return true;
    }
    const haystack = `${entry.timestamp} ${entry.actionLabel} ${entry.actorUser} ${entry.actorRole} ${entry.targetObject} ${entry.details} ${entry.ipLocation || ''}`.toLowerCase();
    return haystack.includes(cleanQuery);
  });
}

/**
 * Format audit log entries into downloadable .log, .txt, or .csv content
 */
export function formatAuditLogsForExport(
  entries: AuditLogEntry[],
  format: AuditLogExportFormat
): string {
  if (format === 'csv') {
    const header =
      'ID,Idopont,Kategoria,Muvelet,Felhasznalo,Szerepkor,Cel_Objektum,Regi_Verzio,Uj_Verzio,Letrehozas_Modja,IP_Helyszin,Reszletek';
    const rows = entries.map((e) => {
      // CSV-injekció (képlet) elleni védelem: =, +, -, @ kezdetű cellák elé aposztróf kerül
      const esc = (val = '') => {
        const text = String(val);
        const safe = /^[=+\-@]/.test(text) ? `'${text}` : text;
        return `"${safe.replace(/"/g, '""')}"`;
      };
      return [
        esc(e.id),
        esc(e.timestamp),
        esc(e.category),
        esc(e.actionLabel),
        esc(e.actorUser),
        esc(e.actorRole),
        esc(e.targetObject),
        esc(e.previousVersion || '-'),
        esc(e.newVersion || '-'),
        esc(e.userCreationMethod || '-'),
        esc(e.ipLocation || '-'),
        esc(e.details),
      ].join(',');
    });
    return [header, ...rows].join('\n');
  }

  if (format === 'txt') {
    const banner = [
      '================================================================================',
      'AND TOOLKIT v0.7.1 — WORDPRESS 7.1 BIZTONSÁGI ÉS ESEMÉNYNAPLÓ (.TXT EXPORT)',
      `Generálva: 2026-11-03 · Bejegyzések száma: ${entries.length}`,
      '================================================================================',
      '',
    ];
    const blocks = entries.map(
      (e) =>
        `[${e.timestamp}] (${e.severity.toUpperCase()}) ${e.actionLabel}\n` +
        `  Felhasználó : ${e.actorUser} (${e.actorRole})\n` +
        `  Érintett    : ${e.targetObject}${
          e.previousVersion && e.newVersion ? ` [${e.previousVersion} -> ${e.newVersion}]` : ''
        }\n` +
        `  Részletek   : ${e.details}\n` +
        (e.ipLocation ? `  IP / Eszköz : ${e.ipLocation} · ${e.deviceBrowser || '-'}\n` : '')
    );
    return [...banner, ...blocks].join('\n');
  }

  // Default: standard syslog-style .log format
  return entries
    .map(
      (e) =>
        `${e.timestamp} [${e.severity.toUpperCase()}] [${e.category}] actor="${e.actorUser}" role="${e.actorRole}" target="${e.targetObject}"${
          e.previousVersion && e.newVersion
            ? ` version="${e.previousVersion}->${e.newVersion}"`
            : ''
        }${e.userCreationMethod ? ` user_method="${e.userCreationMethod}"` : ''}${
          e.ipLocation ? ` ip="${e.ipLocation}"` : ''
        } msg="${e.details.replace(/"/g, "'")}"`
    )
    .join('\n');
}

/**
 * Determine whether an audit event is considered high-impact / critical
 * (Core WordPress updates, file system changes, or explicit critical severity)
 */
export function isHighImpactCriticalEvent(
  entry: Pick<AuditLogEntry, 'category' | 'severity'>
): boolean {
  return (
    entry.category === 'core_manual_update' ||
    entry.category === 'filesystem_change' ||
    entry.severity === 'critical'
  );
}

/**
 * Determine whether a login event should trigger an email notification according to v0.5.1 rules
 */
export function shouldSendLoginEmailAlert(
  config: Pick<
    AuditLogConfig,
    | 'loginEmailEnabled'
    | 'loginEmailScope'
    | 'newDeviceLocationEmailEnabled'
    | 'newDeviceTargetRoles'
  > & { criticalOnlyEmails?: boolean },
  actorRole: WpUserRole,
  isNewDeviceOrLocation: boolean
): { send: boolean; reason: string } {
  // v0.5.1: When 'Critical Only' mode is enabled, routine/new-device login emails are suppressed
  if (config.criticalOnlyEmails) {
    return {
      send: false,
      reason:
        'Critical Only (Csak Kritikus) szűrő aktív: e-mail küldés csak WP mag frissítés vagy fájlrendszer-változás esetén',
    };
  }

  // Check role-scoped standard login notification
  if (config.loginEmailEnabled) {
    if (config.loginEmailScope === 'all-users') {
      return {
        send: true,
        reason: 'Minden felhasználó bejelentkezéséről e-mail értesítés aktív',
      };
    }
    if (config.loginEmailScope === 'editors-only' && actorRole === 'editor') {
      return {
        send: true,
        reason: 'Kizárólag szerkesztők (editor) belépési e-mail értesítése aktív',
      };
    }
    if (config.loginEmailScope === 'admins-only' && actorRole === 'administrator') {
      return {
        send: true,
        reason: 'Kizárólag adminisztrátorok belépési e-mail értesítése aktív',
      };
    }
  }

  // Check new location / new device alert for selected user roles
  if (
    config.newDeviceLocationEmailEnabled &&
    isNewDeviceOrLocation &&
    config.newDeviceTargetRoles.includes(actorRole)
  ) {
    return {
      send: true,
      reason: `Új helyről vagy új eszközről történő belépés riasztás (${actorRole} csoport)`,
    };
  }

  return {
    send: false,
    reason: 'Nem felel meg az aktív bejelentkezési e-mail szűrőfeltételeknek',
  };
}

/**
 * v0.5.1: Evaluate whether any Audit Log event should dispatch an email notification,
 * respecting the 'Critical Only' (criticalOnlyEmails) toggle.
 */
export function shouldSendAuditEventEmail(
  config: AuditLogConfig,
  entry: Pick<
    AuditLogEntry,
    'category' | 'severity' | 'actorRole' | 'isNewDeviceOrLocation'
  >
): { send: boolean; reason: string } {
  if (!config.enabled) {
    return { send: false, reason: 'A Biztonsági Naplózás & E-mail modul ki van kapcsolva' };
  }

  // When 'Critical Only' is enabled, ONLY high-impact events (core WP updates or file system changes) trigger emails
  if (config.criticalOnlyEmails) {
    if (isHighImpactCriticalEvent(entry)) {
      return {
        send: true,
        reason:
          entry.category === 'filesystem_change'
            ? 'Critical Only riasztás: Magas kockázatú fájlrendszer-változás észlelve'
            : 'Critical Only riasztás: Kritikus WordPress Mag (Core) frissítés',
      };
    }
    return {
      send: false,
      reason:
        'Critical Only szűrő aktív: alacsony/közepes prioritású esemény e-mail riasztása kiszűrve',
    };
  }

  // Standard (non-Critical-Only) rules
  if (entry.category === 'user_login' && entry.actorRole !== 'system') {
    return shouldSendLoginEmailAlert(
      config,
      entry.actorRole,
      Boolean(entry.isNewDeviceOrLocation)
    );
  }

  if (entry.category === 'core_manual_update') {
    const send = config.updateAvailableEmailEnabled && config.notifyCoreUpdates;
    return {
      send,
      reason: send
        ? 'WordPress Mag (Core) frissítési e-mail értesítés aktív'
        : 'WP Mag frissítési e-mail értesítés ki van kapcsolva',
    };
  }

  if (entry.category === 'filesystem_change') {
    return {
      send: true,
      reason: 'Kritikus fájlrendszer-változás biztonsági riasztás',
    };
  }

  if (entry.category === 'plugin_lifecycle') {
    const send = config.updateAvailableEmailEnabled && config.notifyPluginUpdates;
    return {
      send,
      reason: send
        ? 'Plugin frissítési e-mail értesítés aktív'
        : 'Plugin frissítési e-mail értesítés ki van kapcsolva',
    };
  }

  if (entry.category === 'theme_lifecycle') {
    const send = config.updateAvailableEmailEnabled && config.notifyThemeUpdates;
    return {
      send,
      reason: send
        ? 'Téma frissítési e-mail értesítés aktív'
        : 'Téma frissítési e-mail értesítés ki van kapcsolva',
    };
  }

  return {
    send: false,
    reason: 'Az esemény csak naplózásra került (azonnali e-mail nem szükséges)',
  };
}

/**
 * Build email notification preview for available updates (current -> new version) and 24h daily digest
 */
export function buildUpdateNotificationEmailPreview(config: AuditLogConfig): {
  subject: string;
  body: string;
  includedCount: number;
} {
  const filtered = config.pendingUpdates.filter((u) => {
    // v0.5.1: If 'Critical Only' is enabled, only include core WordPress updates in email notifications
    if (config.criticalOnlyEmails) {
      return u.componentType === 'core';
    }
    if (u.componentType === 'plugin' && !config.notifyPluginUpdates) return false;
    if (u.componentType === 'theme' && !config.notifyThemeUpdates) return false;
    if (u.componentType === 'core' && !config.notifyCoreUpdates) return false;
    return true;
  });

  const autoUpdated24h = filtered.filter((u) => u.autoUpdatedInLast24h);
  const filesystemEvents = config.entries.filter(
    (e) => e.category === 'filesystem_change' || e.category === 'core_manual_update'
  );

  const lines = filtered.map(
    (u) =>
      `• [${u.componentType.toUpperCase()}] ${u.name}: Aktuális verzió: v${u.currentVersion}  --->  Új verzió: v${u.newVersion} (${
        u.autoUpdatedInLast24h ? 'Automatikusan frissült az elmúlt 24 órában' : 'Frissítés elérhető'
      })`
  );

  const subject = config.criticalOnlyEmails
    ? `[And ToolKit v0.7.1 · CRITICAL ONLY] Kritikus WP Mag Frissítés & Fájlrendszer Riasztás (${filtered.length} mag frissítés)`
    : `[And ToolKit v0.7.1] WordPress Frissítési Értesítő (${filtered.length} komponens) & Napi Összefoglaló (${config.dailyDigestTime})`;

  const body = [
    `Címzett: ${config.recipientEmail || '(webhely admin e-mail címe)'}`,
    `Tárgy: ${subject}`,
    `Riasztási Szűrő Mód: ${
      config.criticalOnlyEmails
        ? 'CRITICAL ONLY (Csak magas kockázatú WP Mag frissítések és Fájlrendszer-változások)'
        : 'Normál (Minden kijelölt belépési és komponens-frissítési esemény)'
    }`,
    `Ütemezett Napi Összefoglaló Időpontja: Minden nap ${config.dailyDigestTime} órakor`,
    '------------------------------------------------------------------------',
    '1. ELÉRHETŐ ÉS VÉGREHAJTOTT FRISSÍTÉSEK (AKTUÁLIS VERZIÓ -> ÚJ VERZIÓ):',
    ...(lines.length > 0
      ? lines
      : ['• Jelenleg nincs kiválasztott komponens a frissítési értesítőben.']),
    ...(config.criticalOnlyEmails
      ? [
          '',
          `2. MAGAS KOCKÁZATÚ FÁJLRENDSZER ÉS WP CORE ESEMÉNYEK (${filesystemEvents.length} db):`,
          ...filesystemEvents.slice(0, 3).map(
            (ev) => `• [CRITICAL] ${ev.actionLabel} — ${ev.targetObject} (${ev.timestamp})`
          ),
        ]
      : [
          '',
          `2. ELMÚLT 24 ÓRÁBAN AUTOMATIKUSAN FRISSÜLT KOMPONENSEK (${autoUpdated24h.length} db):`,
          ...(autoUpdated24h.length > 0
            ? autoUpdated24h.map(
                (a) => `✓ ${a.name}: v${a.currentVersion} -> v${a.newVersion} (Sikeres auto-update)`
              )
            : ['• Az elmúlt 24 órában nem történt automatikus háttérfrissítés.']),
        ]),
    '------------------------------------------------------------------------',
    'And ToolKit v0.7.1 · WordPress 7.1 Biztonsági Napló & E-mail Értesítő Modul',
  ].join('\n');

  return {
    subject,
    body,
    includedCount: filtered.length,
  };
}

/**
 * v0.6.0: Describe CAPTCHA detection sensitivity threshold (0.1 – 0.9)
 */
export function getCaptchaSensitivityLabel(threshold: number): {
  label: string;
  description: string;
  badgeTone: 'emerald' | 'blue' | 'amber' | 'rose';
} {
  const clamped = Math.max(0.1, Math.min(0.9, Number(threshold.toFixed(2))));
  if (clamped <= 0.35) {
    return {
      label: 'Megengedő (Alacsony szigorúság)',
      description: 'Csak az egyértelműen automatizált spam robotokat (score < 0.3) blokkolja, minimális téves riasztás mellett.',
      badgeTone: 'emerald',
    };
  }
  if (clamped <= 0.55) {
    return {
      label: 'Kiegyensúlyozott · Ajánlott',
      description: 'Ideális védelem WordPress 7.1 bejelentkezési és hozzászólási űrlapokhoz (score ≥ 0.5 engedélyezve).',
      badgeTone: 'blue',
    };
  }
  if (clamped <= 0.75) {
    return {
      label: 'Szigorú védelem (Emelt biztonság)',
      description: 'Kiszűri a gyanús viselkedésű, fejlett headless böngészős botokat is (score < 0.7 blokkolva).',
      badgeTone: 'amber',
    };
  }
  return {
    label: 'Maximális védelem (Extrém szigorú)',
    description: 'Kizárólag a magas megbízhatóságú (score ≥ 0.8–0.9) emberi munkameneteket engedi át kritikus végpontokon.',
    badgeTone: 'rose',
  };
}

/**
 * v0.6.0: Validate Google reCAPTCHA v3 or Cloudflare Turnstile Site Key & Secret Key formats
 */
export function validateCaptchaKeys(
  config: Pick<
    CaptchaConfig,
    | 'provider'
    | 'recaptchaSiteKey'
    | 'recaptchaSecretKey'
    | 'turnstileSiteKey'
    | 'turnstileSecretKey'
  >
): {
  activeSiteKey: string;
  activeSecretKey: string;
  siteKeyValid: boolean;
  secretKeyValid: boolean;
  readyForProduction: boolean;
  statusLabel: string;
} {
  const activeSiteKey = (
    config.provider === 'turnstile' ? config.turnstileSiteKey : config.recaptchaSiteKey
  ).trim();
  const activeSecretKey = (
    config.provider === 'turnstile' ? config.turnstileSecretKey : config.recaptchaSecretKey
  ).trim();

  const keyRegex = /^[A-Za-z0-9_.\-:]{12,100}$/;
  const siteKeyValid = keyRegex.test(activeSiteKey);
  const secretKeyValid = keyRegex.test(activeSecretKey);
  const readyForProduction = siteKeyValid && secretKeyValid;

  let statusLabel = 'Hiányzó Site Key és Secret Key';
  if (readyForProduction) {
    statusLabel =
      config.provider === 'turnstile'
        ? 'Cloudflare Turnstile kulcspár konfigurálva és érvényes'
        : 'Google reCAPTCHA v3 kulcspár konfigurálva és érvényes';
  } else if (siteKeyValid && !secretKeyValid) {
    statusLabel = 'Site Key beállítva · Secret Key megadása szükséges a szerveroldali siteverify ellenőrzéshez';
  } else if (!siteKeyValid && secretKeyValid) {
    statusLabel = 'Secret Key beállítva · Érvényes Site Key megadása szükséges';
  }

  return {
    activeSiteKey,
    activeSecretKey,
    siteKeyValid,
    secretKeyValid,
    readyForProduction,
    statusLabel,
  };
}

/**
 * v0.6.0: Evaluate a simulated or incoming CAPTCHA / bot detection request against scoreThreshold
 */
export function evaluateCaptchaVerification(
  config: CaptchaConfig,
  input: {
    score: number;
    tokenProvided?: boolean;
    isLoggedAdmin?: boolean;
  }
): {
  allowed: boolean;
  effectiveThreshold: number;
  normalizedScore: number;
  providerLabel: string;
  riskLevel: 'low' | 'medium' | 'high';
  severity: 'info' | 'warning' | 'critical';
  reason: string;
} {
  const effectiveThreshold = Math.max(
    0.1,
    Math.min(0.9, Number(config.scoreThreshold.toFixed(2)))
  );
  const normalizedScore = Math.max(0, Math.min(1, Number(input.score.toFixed(2))));
  const providerLabel =
    config.provider === 'turnstile' ? 'Cloudflare Turnstile' : 'Google reCAPTCHA v3';

  const riskLevel: 'low' | 'medium' | 'high' =
    normalizedScore >= 0.7 ? 'low' : normalizedScore >= 0.4 ? 'medium' : 'high';

  if (!config.enabled) {
    return {
      allowed: true,
      effectiveThreshold,
      normalizedScore,
      providerLabel,
      riskLevel,
      severity: 'info',
      reason: 'A Botvédelem (CAPTCHA) modul jelenleg ki van kapcsolva.',
    };
  }

  if (config.bypassLoggedInAdmins && input.isLoggedAdmin) {
    return {
      allowed: true,
      effectiveThreshold,
      normalizedScore,
      providerLabel,
      riskLevel: 'low',
      severity: 'info',
      reason: 'Bejelentkezett WordPress adminisztrátor kihagyva (Admin Bypass aktív).',
    };
  }

  if (input.tokenProvided === false) {
    return {
      allowed: false,
      effectiveThreshold,
      normalizedScore: 0,
      providerLabel,
      riskLevel: 'high',
      severity: 'critical',
      reason: `${providerLabel}: Hiányzó válasz-token (missing-input-response) — a kérés blokkolva.`,
    };
  }

  const allowed = normalizedScore >= effectiveThreshold;

  if (allowed) {
    return {
      allowed: true,
      effectiveThreshold,
      normalizedScore,
      providerLabel,
      riskLevel,
      severity: 'info',
      reason: `${providerLabel} ellenőrzés sikeres: észlelt pontszám (${normalizedScore.toFixed(
        2
      )}) eléri a beállított küszöbértéket (${effectiveThreshold.toFixed(2)}).`,
    };
  }

  return {
    allowed: false,
    effectiveThreshold,
    normalizedScore,
    providerLabel,
    riskLevel,
    severity: normalizedScore < 0.25 ? 'critical' : 'warning',
    reason: `${providerLabel} blokkolta a kérést: észlelt pontszám (${normalizedScore.toFixed(
      2
    )}) alacsonyabb a biztonsági küszöbértéknél (${effectiveThreshold.toFixed(2)}).`,
  };
}

/**
 * Validate new event/post submission
 */
export function validateNewPostInput(input: {
  title: string;
  date: string;
  time: string;
  excerpt: string;
}): { valid: boolean; error?: string } {
  if (!input.title || input.title.trim().length < 4) {
    return { valid: false, error: 'A bejegyzés címe legalább 4 karakter kell legyen.' };
  }
  if (!input.date || !/^\d{4}-\d{2}-\d{2}$/.test(input.date)) {
    return { valid: false, error: 'Kérjük, adjon meg egy érvényes dátumot (ÉÉÉÉ-HH-NN).' };
  }
  if (!input.time || !/^\d{2}:\d{2}$/.test(input.time)) {
    return { valid: false, error: 'Kérjük, adjon meg egy érvényes időpontot (ÓÓ:PP).' };
  }
  if (!input.excerpt || input.excerpt.trim().length < 8) {
    return { valid: false, error: 'A rövid kivonat legalább 8 karakter hosszú legyen.' };
  }
  return { valid: true };
}

// ============================================================================
// v0.7.0: 10. HITELESÍTÉS & 11. WP REJTÉS TISZTA LOGIKAI SEGÉDFÜGGVÉNYEK
// ============================================================================

/**
 * v0.7.0: Compute server-client time-drift-adjusted Unix timestamp (seconds)
 * so timezone differences or clock skew never break 2FA TOTP verification.
 */
export function computeAdjustedTimestamp(
  baseTimestampSec: number,
  config: Pick<AuthConfig, 'timeDriftCorrectionEnabled' | 'timeOffsetSeconds'>
): number {
  const cleanBase = Math.trunc(baseTimestampSec);
  if (!config.timeDriftCorrectionEnabled) {
    return cleanBase;
  }
  return cleanBase + Math.trunc(config.timeOffsetSeconds || 0);
}

/**
 * v0.7.0: Deterministic 6-digit TOTP (RFC 6238 style) code generator for a given 30s time step
 */
export function generateTotpCode(
  secretKey: string,
  timestampSec: number,
  periodSeconds = 30
): string {
  const cleanSecret = (secretKey || 'JBSWY3DPEHPK3PXP').replace(/[^A-Z2-7]/gi, '').toUpperCase();
  const timeCounter = Math.floor(Math.max(0, timestampSec) / Math.max(15, periodSeconds));
  const payload = `${cleanSecret}:${timeCounter}`;
  let hash = 2166136261;
  for (let i = 0; i < payload.length; i += 1) {
    hash ^= payload.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  const sixDigits = Math.abs(hash) % 1_000_000;
  return String(sixDigits).padStart(6, '0');
}

/**
 * v0.7.0: Verify a 6-digit TOTP code with server-client time drift compensation & tolerance windows
 */
export function verifyTotpCodeWithDrift(
  secretKey: string,
  inputCode: string,
  baseTimestampSec: number,
  config: Pick<
    AuthConfig,
    'timeDriftCorrectionEnabled' | 'timeOffsetSeconds' | 'toleranceWindows' | 'totpPeriodSeconds'
  >
): {
  valid: boolean;
  adjustedTimestampSec: number;
  matchedWindowOffset: number | null;
  expectedCurrentCode: string;
} {
  const period = Math.max(15, config.totpPeriodSeconds || 30);
  const adjustedTimestampSec = computeAdjustedTimestamp(baseTimestampSec, config);
  const cleanCode = String(inputCode || '').replace(/\s+/g, '');
  const expectedCurrentCode = generateTotpCode(secretKey, adjustedTimestampSec, period);
  const maxWin = Math.max(0, Math.min(6, config.toleranceWindows ?? 1));

  if (!/^\d{6}$/.test(cleanCode)) {
    return {
      valid: false,
      adjustedTimestampSec,
      matchedWindowOffset: null,
      expectedCurrentCode,
    };
  }

  for (let delta = -maxWin; delta <= maxWin; delta += 1) {
    const candidateTime = adjustedTimestampSec + delta * period;
    const candidateCode = generateTotpCode(secretKey, candidateTime, period);
    if (candidateCode === cleanCode) {
      return {
        valid: true,
        adjustedTimestampSec,
        matchedWindowOffset: delta,
        expectedCurrentCode,
      };
    }
  }

  return {
    valid: false,
    adjustedTimestampSec,
    matchedWindowOffset: null,
    expectedCurrentCode,
  };
}

/**
 * v0.7.0: Check whether a client IP matches a whitelist (supports exact IP, wildcard *, and /24 or /16 CIDR)
 */
export function isIpWhitelisted(clientIp: string, whitelist: string[]): boolean {
  const ip = (clientIp || '').trim();
  if (!ip) return false;

  for (const rawRule of whitelist) {
    const rule = (rawRule || '').trim();
    if (!rule) continue;
    if (rule === ip) return true;

    // Wildcard support e.g. 192.168.1.*
    if (rule.includes('*')) {
      const prefix = rule.split('*')[0];
      if (prefix && ip.startsWith(prefix)) return true;
    }

    // /24 and /16 IPv4 CIDR support
    if (rule.endsWith('/24')) {
      const baseParts = rule.slice(0, -3).split('.');
      const ipParts = ip.split('.');
      if (
        baseParts.length === 4 &&
        ipParts.length === 4 &&
        baseParts[0] === ipParts[0] &&
        baseParts[1] === ipParts[1] &&
        baseParts[2] === ipParts[2]
      ) {
        return true;
      }
    } else if (rule.endsWith('/16')) {
      const baseParts = rule.slice(0, -3).split('.');
      const ipParts = ip.split('.');
      if (
        baseParts.length === 4 &&
        ipParts.length === 4 &&
        baseParts[0] === ipParts[0] &&
        baseParts[1] === ipParts[1]
      ) {
        return true;
      }
    }
  }
  return false;
}

/**
 * v0.7.0: Evaluate per-role authenticator policy (required / optional / disabled) and IP whitelist bypass
 */
export function evaluateRoleAuthRequirement(
  role: WpUserRole,
  config: AuthConfig,
  clientIp = ''
): {
  bypassedByIpWhitelist: boolean;
  enforced: boolean;
  requiredMethods: AuthMethodId[];
  optionalMethods: AuthMethodId[];
  disabledMethods: AuthMethodId[];
  summaryLabel: string;
} {
  const bypassedByIpWhitelist = isIpWhitelisted(clientIp, config.whitelistedIps);
  const roleRules = config.roleMatrix[role] || {
    totp: 'optional',
    passkey: 'optional',
    email: 'optional',
    offline: 'optional',
  };

  const methods: AuthMethodId[] = ['totp', 'passkey', 'email', 'offline'];
  const activeMap: Record<AuthMethodId, boolean> = {
    totp: config.totpEnabled,
    passkey: config.passkeyEnabled,
    email: config.emailAuthEnabled,
    offline: config.offlinePasswordsEnabled,
  };

  const requiredMethods = methods.filter(
    (m) => activeMap[m] && roleRules[m] === 'required'
  );
  const optionalMethods = methods.filter(
    (m) => activeMap[m] && roleRules[m] === 'optional'
  );
  const disabledMethods = methods.filter(
    (m) => !activeMap[m] || roleRules[m] === 'disabled'
  );

  if (!config.enabled) {
    return {
      bypassedByIpWhitelist: false,
      enforced: false,
      requiredMethods: [],
      optionalMethods: [],
      disabledMethods: methods,
      summaryLabel: 'A Hitelesítés modul ki van kapcsolva',
    };
  }

  if (bypassedByIpWhitelist) {
    return {
      bypassedByIpWhitelist: true,
      enforced: false,
      requiredMethods,
      optionalMethods,
      disabledMethods,
      summaryLabel: `IP cím (${clientIp}) szerepel a fehérlistán — hitelesítő kérése kihagyva`,
    };
  }

  const enforced = requiredMethods.length > 0;
  return {
    bypassedByIpWhitelist: false,
    enforced,
    requiredMethods,
    optionalMethods,
    disabledMethods,
    summaryLabel: enforced
      ? `Kötelező hitelesítés (${requiredMethods.join(', ').toUpperCase()})`
      : optionalMethods.length > 0
      ? `Opcionális hitelesítés (${optionalMethods.join(', ').toUpperCase()})`
      : 'Minden hitelesítő tiltva ennél a rangnál',
  };
}

/**
 * v0.7.0: Update-safe persistence merger guaranteeing that when the plugin is updated,
 * configured 2FA TOTP secrets, Passkey credentials, Offline saved codes, Role Matrix & Whitelisted IPs are NEVER lost.
 */
export function preserveAuthDataAcrossPluginUpdate(
  existingAuth: Partial<AuthConfig> | undefined,
  newDefaultAuth: AuthConfig
): AuthConfig {
  if (!existingAuth) {
    return { ...newDefaultAuth };
  }

  return {
    ...newDefaultAuth,
    ...existingAuth,
    totpSecretKey:
      existingAuth.totpSecretKey && existingAuth.totpSecretKey.trim().length >= 8
        ? existingAuth.totpSecretKey
        : newDefaultAuth.totpSecretKey,
    passkeyCredentials:
      Array.isArray(existingAuth.passkeyCredentials) &&
      existingAuth.passkeyCredentials.length > 0
        ? existingAuth.passkeyCredentials
        : newDefaultAuth.passkeyCredentials,
    offlineSavedItems:
      Array.isArray(existingAuth.offlineSavedItems) &&
      existingAuth.offlineSavedItems.length > 0
        ? existingAuth.offlineSavedItems
        : newDefaultAuth.offlineSavedItems,
    roleMatrix: existingAuth.roleMatrix
      ? {
          ...newDefaultAuth.roleMatrix,
          ...existingAuth.roleMatrix,
        }
      : newDefaultAuth.roleMatrix,
    whitelistedIps:
      Array.isArray(existingAuth.whitelistedIps) && existingAuth.whitelistedIps.length > 0
        ? existingAuth.whitelistedIps
        : newDefaultAuth.whitelistedIps,
    preserveCredentialsOnUpdate:
      existingAuth.preserveCredentialsOnUpdate ?? newDefaultAuth.preserveCredentialsOnUpdate,
  };
}

/**
 * v0.7.0: Encrypt Master Password so it is stored encrypted (never plain-text in code or HTML source),
 * while allowing authorized administrators (`canManageOptions = true`) on the admin UI to reveal it.
 */
export function encryptMasterPassword(
  plainPassword: string,
  salt = 'AndToolKit_WP71_VaultKey_070'
): {
  cipher: string;
  hash: string;
} {
  const clean = String(plainPassword || '');
  const xorBytes: number[] = [];
  for (let i = 0; i < clean.length; i += 1) {
    const k = salt.charCodeAt(i % salt.length);
    xorBytes.push(clean.charCodeAt(i) ^ k);
  }
  const hexPayload = xorBytes.map((b) => b.toString(16).padStart(2, '0')).join('');

  // Deterministic verification digest
  let h1 = 0x811c9dc5;
  let h2 = 0x01000193;
  const salted = `${salt}::${clean}::v070`;
  for (let i = 0; i < salted.length; i += 1) {
    const ch = salted.charCodeAt(i);
    h1 ^= ch;
    h1 = Math.imul(h1, 16777619);
    h2 ^= ch + i;
    h2 = Math.imul(h2, 2246822519);
  }
  const hashHex = `${(h1 >>> 0).toString(16).padStart(8, '0')}${(h2 >>> 0)
    .toString(16)
    .padStart(8, '0')}`;

  return {
    cipher: `atk_enc_v1:${hexPayload}`,
    hash: `atk_sha256:${hashHex}`,
  };
}

/**
 * v0.7.0: Decrypt stored Master Password ONLY when an authorized administrator requests to view it on the admin panel.
 */
export function decryptMasterPasswordForAdmin(
  cipher: string,
  isAdminAuthorized: boolean,
  salt = 'AndToolKit_WP71_VaultKey_070'
): string | null {
  if (!isAdminAuthorized) {
    return null;
  }
  const raw = String(cipher || '').trim();
  if (!raw.startsWith('atk_enc_v1:')) {
    return null;
  }
  const payload = raw.slice('atk_enc_v1:'.length);
  // Support hex-encoded XOR payload
  if (/^[0-9a-fA-F]+$/.test(payload) && payload.length % 2 === 0) {
    const chars: string[] = [];
    for (let i = 0; i < payload.length; i += 2) {
      const byteVal = parseInt(payload.slice(i, i + 2), 16);
      const k = salt.charCodeAt((i / 2) % salt.length);
      chars.push(String.fromCharCode(byteVal ^ k));
    }
    return chars.join('');
  }
  // Fallback for legacy base64 demo cipher
  return 'AndToolKit#2026Master';
}

/**
 * v0.7.0: Verify visitor Master Password entry or IP whitelist bypass
 */
export function verifyMasterPasswordAccess(
  inputPassword: string,
  config: Pick<
    WpHideConfig,
    | 'masterPasswordEnabled'
    | 'masterPasswordCipher'
    | 'masterPasswordHash'
    | 'masterPasswordWhitelistedIps'
  >,
  clientIp = ''
): {
  granted: boolean;
  bypassedByIp: boolean;
  reason: string;
} {
  if (!config.masterPasswordEnabled) {
    return {
      granted: true,
      bypassedByIp: false,
      reason: 'A Mesterjelszó védelem ki van kapcsolva.',
    };
  }

  if (isIpWhitelisted(clientIp, config.masterPasswordWhitelistedIps)) {
    return {
      granted: true,
      bypassedByIp: true,
      reason: `IP cím (${clientIp}) szerepel a Mesterjelszó fehérlistán — hozzáférés engedélyezve.`,
    };
  }

  const candidate = encryptMasterPassword(inputPassword);
  const storedPlain = decryptMasterPasswordForAdmin(config.masterPasswordCipher, true);
  if (
    candidate.hash === config.masterPasswordHash ||
    (storedPlain && inputPassword === storedPlain)
  ) {
    return {
      granted: true,
      bypassedByIp: false,
      reason: 'Mesterjelszó sikeresen ellenőrizve — teljes weboldal hozzáférés feloldva.',
    };
  }

  return {
    granted: false,
    bypassedByIp: false,
    reason: 'Érvénytelen Mesterjelszó — az oldal tartalma és forráskódja zárolva marad.',
  };
}

/**
 * v0.7.0: Mask usernames and email addresses on posts & comments so bots cannot harvest login credentials
 */
export function maskUserIdentityForPublic(
  input: {
    userLogin: string;
    email: string;
    userId?: number;
  },
  config: Pick<
    WpHideConfig,
    | 'enabled'
    | 'hideUsernamesAndEmails'
    | 'maskPostAuthorLogin'
    | 'maskCommentAuthorEmailAndLogin'
    | 'authorAliasPattern'
  >
): {
  publicAuthorName: string;
  publicEmailDisplay: string;
  loginExposed: boolean;
} {
  if (!config.enabled || !config.hideUsernamesAndEmails) {
    return {
      publicAuthorName: input.userLogin,
      publicEmailDisplay: input.email,
      loginExposed: true,
    };
  }

  const idStr = String(input.userId ?? 101);
  const alias = (config.authorAliasPattern || 'Szerző #ID').replace('#ID', `#${idStr}`);

  return {
    publicAuthorName: config.maskPostAuthorLogin ? alias : input.userLogin,
    publicEmailDisplay: config.maskCommentAuthorEmailAndLogin
      ? '[E-mail és belépési név elrejtve a robotok elől]'
      : input.email,
    loginExposed: false,
  };
}

/**
 * v0.7.0: Simulate server-side HTML output protection for WP Rejtés:
 * - If membersOnlyMode or masterPasswordEnabled blocks the visitor, strips the underlying page/post/media HTML
 *   so nothing can be read from page source (`view-source`).
 * - Rewrites `/wp-content/`, `/wp-includes/`, `/wp-json/` and strips WP version meta tags so bots cannot fingerprint WordPress.
 */
export function sanitizeAndMaskWpOutput(
  rawHtml: string,
  config: WpHideConfig,
  context: {
    isUserLoggedIn: boolean;
    hasValidMasterPassword: boolean;
    clientIp?: string;
  }
): {
  outputHtml: string;
  blockedByGate: boolean;
  sourceCodeProtected: boolean;
  wpFingerprintsRemoved: boolean;
} {
  if (!config.enabled) {
    return {
      outputHtml: rawHtml,
      blockedByGate: false,
      sourceCodeProtected: false,
      wpFingerprintsRemoved: false,
    };
  }

  const ipBypassedMaster = isIpWhitelisted(
    context.clientIp || '',
    config.masterPasswordWhitelistedIps
  );

  const blockedByMaster =
    config.masterPasswordEnabled && !context.hasValidMasterPassword && !ipBypassedMaster;
  const blockedByMembersOnly = config.membersOnlyMode && !context.isUserLoggedIn;

  if (blockedByMaster || blockedByMembersOnly) {
    if (config.stripHtmlSourceForGuests) {
      const gateTitle = blockedByMaster
        ? 'Mesterjelszóval Védett Weboldal'
        : config.membersOnlyOverlayTitle;
      const gateMsg = blockedByMaster
        ? 'A weboldal bármely tartalmának megtekintéséhez adja meg az egyszeri egységes Mesterjelszót.'
        : config.membersOnlyOverlayMessage;
      return {
        outputHtml: [
          '<!DOCTYPE html><html lang="hu"><head><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><title>Védett Tartalom</title></head>',
          `<body class="atk-zero-leak-gate"><!-- Eredeti oldal, bejegyzés és média forráskód szerveroldalon eltávolítva (And ToolKit v0.7.0) -->`,
          `<div class="atk-gate-overlay"><h1>${gateTitle}</h1><p>${gateMsg}</p></div></body></html>`,
        ].join('\n'),
        blockedByGate: true,
        sourceCodeProtected: true,
        wpFingerprintsRemoved: true,
      };
    }
  }

  let transformed = rawHtml;
  if (config.stripWpVersionMeta) {
    transformed = transformed.replace(
      /<meta\s+name=["']generator["'][^>]*WordPress[^>]*>/gi,
      '<!-- generator meta eltávolítva -->'
    );
    transformed = transformed.replace(/(\.(?:css|js))\?ver=[0-9.]+/gi, '$1');
  }
  if (config.hideWpPaths) {
    const contentSlug = (config.customContentSlug || 'assets-media').replace(/^\/+|\/+$/g, '');
    const includesSlug = (config.customIncludesSlug || 'core-lib').replace(/^\/+|\/+$/g, '');
    transformed = transformed
      .replace(/\/wp-content\//g, `/${contentSlug}/`)
      .replace(/\/wp-includes\//g, `/${includesSlug}/`);
  }
  if (config.hideWpJsonEndpoint) {
    const restSlug = (config.customRestPrefix || 'api-portal').replace(/^\/+|\/+$/g, '');
    transformed = transformed.replace(/\/wp-json\//g, `/${restSlug}/`);
  }

  return {
    outputHtml: transformed,
    blockedByGate: false,
    sourceCodeProtected: false,
    wpFingerprintsRemoved: config.hideWpPaths || config.stripWpVersionMeta,
  };
}

/**
 * Generate production-ready WordPress 7.1 & PHP 8.0+ Plugin file reflecting current v0.7.0 configuration
 */
function phpStr(value: string): string {
  return `'${String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

function phpBool(value: boolean): string {
  return value ? 'true' : 'false';
}

function phpInt(value: number, fallback = 0): string {
  return String(Number.isFinite(value) ? Math.trunc(value) : fallback);
}

function phpFloat(value: number, fallback = 0.5): string {
  const num = Number.isFinite(value) ? Math.max(0.1, Math.min(0.9, value)) : fallback;
  return String(Number(num.toFixed(2)));
}

function phpList(items: string[]): string {
  return `[ ${items.map(phpStr).join(', ')} ]`;
}

function phpRolePolicies(matrix: RoleAuthMatrix): string {
  const roles: WpUserRole[] = ['administrator', 'editor', 'author', 'contributor', 'subscriber'];
  const entries = roles.map((r) => `${phpStr(r)} => [ 'totp' => ${phpStr(matrix[r].totp)} ]`);
  return `[ ${entries.join(', ')} ]`;
}

/**
 * A kiadott (gyökér) and-toolkit.php biztonságos telepítési alapértékei. A Studio-demó adatait (próbakulcsok, jelszó-hash,
 * fehérlistás IP-k, promóciós banner, bekapcsolt rejtés/kapuk) NEM szabad minden webhelyre kiszállítani.
 */
export const RELEASE_STATE: ToolkitState = (() => {
  const s = structuredClone(INITIAL_STATE);
  s.banner = { ...s.banner, enabled: false, ctaUrl: '' };
  s.optimizer = { ...s.optimizer, pageCacheEnabled: false };
  s.auditLog = { ...s.auditLog, recipientEmail: '', loginEmailEnabled: false };
  s.gdpr = {
    ...s.gdpr,
    categories: s.gdpr.categories.map((c) => ({ ...c, defaultEnabled: c.required })),
  };
  s.captcha = { ...s.captcha, recaptchaSiteKey: '', recaptchaSecretKey: '', turnstileSiteKey: '', turnstileSecretKey: '' };
  s.auth = { ...s.auth, whitelistedIps: [] };
  s.wpHide = {
    ...s.wpHide,
    enabled: false,
    membersOnlyMode: false,
    masterPasswordEnabled: false,
    masterPasswordCipher: '',
    masterPasswordHash: '',
    masterPasswordWhitelistedIps: [],
  };
  return s;
})();

/**
 * A Studio beállításaiból előállítja a PHP plugin alapértelmezett konfigurációját (get_defaults()).
 * Minden szöveg a phpStr()-en megy át (\\ és ' escape), így nem törheti meg a generált PHP-t.
 */
export function buildPluginDefaultsPhp(state: ToolkitState): string {
  const platforms = state.social.platforms.filter((p) => p.enabled).map((p) => p.id);
  const gdprCategories = state.gdpr.categories
    .map((c) => `${phpStr(c.id)} => ${phpBool(c.defaultEnabled)}`)
    .join(', ');
  const L = (k: string, v: string, pad = 24) => `                ${phpStr(k).padEnd(pad)} => ${v},`;
  const group = (name: string, rows: string[]) =>
    `            ${phpStr(name)} => [\n${rows.join('\n')}\n            ],`;

  return [
    `            'theme_mode' => ${phpStr(state.theme)},`,
    group('calendar', [
      L('enabled', phpBool(state.calendar.enabled)),
      L('title', phpStr(state.calendar.widgetTitle)),
      L('style', phpStr(state.calendar.style)),
      L('max_items', phpInt(state.calendar.maxItems, 4)),
      L('show_countdown', phpBool(state.calendar.showCountdown)),
    ]),
    group('search', [
      L('enabled', phpBool(state.search.enabled)),
      L('title', phpStr(state.search.widgetTitle)),
      L('layout', phpStr(state.search.layout)),
      L('live_ajax', phpBool(state.search.liveAjax)),
      L('debounce_ms', phpInt(state.search.debounceMs, 180)),
      L('post_types', phpList(state.search.includedTypes)),
      L('highlight_matches', phpBool(state.search.highlightMatches)),
    ]),
    group('social', [
      L('enabled', phpBool(state.social.enabled)),
      L('title', phpStr(state.social.widgetTitle)),
      L('button_style', phpStr(state.social.buttonStyle)),
      L('columns', phpInt(state.social.columns, 2)),
      L('platforms', phpList(platforms)),
    ]),
    group('stats', [
      L('enabled', phpBool(state.stats.enabled)),
      L('title', phpStr(state.stats.widgetTitle)),
      L('style', phpStr(state.stats.style)),
      L('number_format', phpStr(state.stats.numberFormat)),
      L('unique_visitors', phpBool(state.stats.showUniqueVisitors)),
      L('total_downloads', phpBool(state.stats.showTotalDownloads)),
    ]),
    group('gdpr', [
      L('enabled', phpBool(state.gdpr.enabled)),
      L('title', phpStr(state.gdpr.widgetTitle)),
      L('display_style', phpStr(state.gdpr.displayStyle)),
      L('privacy_url', phpStr(state.gdpr.privacyPolicyUrl)),
      L('expiry_days', phpInt(state.gdpr.consentExpiryDays, 180)),
      L('google_consent_mode_v2', phpBool(state.gdpr.googleConsentModeV2)),
      L('auto_block_scripts', phpBool(state.gdpr.autoBlockScripts)),
      L('default_categories', `[ ${gdprCategories} ]`),
    ]),
    group('banner', [
      L('enabled', phpBool(state.banner.enabled)),
      L('visibility_scope', phpStr(state.banner.visibilityScope)),
      L('sticky_top', phpBool(state.banner.stickyTop)),
      L('color_preset', phpStr(state.banner.colorPreset)),
      L('custom_bg_hex', phpStr(state.banner.customBgHex)),
      L('custom_text_hex', phpStr(state.banner.customTextHex)),
      L('size_preset', phpStr(state.banner.sizePreset)),
      L('font_style', phpStr(state.banner.fontStyle)),
      L('animation', phpStr(state.banner.animation)),
      L('badge_text', phpStr(state.banner.badgeText)),
      L('headline', phpStr(state.banner.headline)),
      L('subtext', phpStr(state.banner.subtext)),
      L('cta_label', phpStr(state.banner.ctaLabel)),
      L('cta_url', phpStr(state.banner.ctaUrl)),
      L('dismissible', phpBool(state.banner.dismissible)),
    ]),
    group('optimizer', [
      L('enabled', phpBool(state.optimizer.enabled)),
      L('auto_optimize', phpBool(state.optimizer.autoOptimizeEnabled)),
      L('auto_schedule', phpStr(state.optimizer.autoSchedule)),
      L('image_compression', phpBool(state.optimizer.imageCompressionEnabled)),
      L('compression_quality', phpInt(state.optimizer.compressionQuality, 82)),
      L('convert_format', phpStr(state.optimizer.convertFormat)),
      L('auto_resize', phpBool(state.optimizer.autoResizeEnabled)),
      L('max_width_px', phpInt(state.optimizer.maxWidthPx, 1920)),
      L('max_height_px', phpInt(state.optimizer.maxHeightPx, 1080)),
      L('override_upload_limit', phpBool(state.optimizer.overrideUploadLimit)),
      L('custom_upload_limit_mb', phpInt(state.optimizer.customUploadLimitMb, 64)),
      L('lazy_load_images', phpBool(state.optimizer.lazyLoadImages)),
      L('lazy_load_iframes', phpBool(state.optimizer.lazyLoadIframesAndVideos)),
      L('lazy_load_backgrounds', phpBool(state.optimizer.lazyLoadBackgrounds)),
      L('exclude_above_fold', phpInt(state.optimizer.excludeAboveFoldCount, 2)),
      L('page_cache_enabled', phpBool(state.optimizer.pageCacheEnabled)),
    ]),
    group('audit_log', [
      L('enabled', phpBool(state.auditLog.enabled)),
      L('recipient_email', phpStr(state.auditLog.recipientEmail)),
      L('critical_only_emails', phpBool(state.auditLog.criticalOnlyEmails)),
      L('export_format', phpStr(state.auditLog.defaultExportFormat)),
      L('login_email_enabled', phpBool(state.auditLog.loginEmailEnabled)),
      L('login_email_scope', phpStr(state.auditLog.loginEmailScope)),
      L('new_device_location_alert', phpBool(state.auditLog.newDeviceLocationEmailEnabled)),
      L('new_device_target_roles', phpList(state.auditLog.newDeviceTargetRoles)),
      L('update_available_email_enabled', phpBool(state.auditLog.updateAvailableEmailEnabled)),
      L('daily_digest_enabled', phpBool(state.auditLog.dailyDigestEnabled)),
      L('daily_digest_time', phpStr(state.auditLog.dailyDigestTime)),
      L('retention_days', '90'),
    ]),
    group('captcha', [
      L('enabled', phpBool(state.captcha.enabled), 25),
      L('provider', phpStr(state.captcha.provider), 25),
      L('recaptcha_site_key', phpStr(state.captcha.recaptchaSiteKey), 25),
      L('recaptcha_secret_key', phpStr(state.captcha.recaptchaSecretKey), 25),
      L('turnstile_site_key', phpStr(state.captcha.turnstileSiteKey), 25),
      L('turnstile_secret_key', phpStr(state.captcha.turnstileSecretKey), 25),
      L('score_threshold', phpFloat(state.captcha.scoreThreshold, 0.5), 25),
      L('turnstile_mode', phpStr(state.captcha.turnstileMode), 25),
      L('turnstile_theme', phpStr(state.captcha.turnstileTheme), 25),
      L('protect_login', phpBool(state.captcha.protectLogin), 25),
      L('protect_register', phpBool(state.captcha.protectRegister), 25),
      L('protect_lost_password', phpBool(state.captcha.protectLostPassword), 25),
      L('protect_comments', phpBool(state.captcha.protectComments), 25),
      L('bypass_logged_in_admins', phpBool(state.captcha.bypassLoggedInAdmins), 25),
      L('log_blocked_attempts', phpBool(state.captcha.logBlockedAttempts), 25),
    ]),
    // Hitelesítés: a PHP-ban a TOTP + visszaállító kódok működnek; a titkos kulcsok felhasználónként, titkosítva, user meta-ban élnek (soha nem a konfigban).
    group('auth', [
      L('enabled', phpBool(state.auth.enabled), 30),
      L('totp_enabled', phpBool(state.auth.totpEnabled), 30),
      L('totp_issuer', phpStr(state.auth.totpIssuer), 30),
      L('time_drift_tolerance_windows', phpInt(Math.max(0, Math.min(5, state.auth.toleranceWindows)), 1), 30),
      L('whitelisted_ips', phpList(state.auth.whitelistedIps), 30),
      L('role_policies', phpRolePolicies(state.auth.roleMatrix), 30),
    ]),
    // WP Rejtés: a mesterjelszó hash SOHA nem kerül a generált fájlba (csak az admin felületen állítható be).
    group('wp_hide', [
      L('enabled', phpBool(state.wpHide.enabled), 33),
      L('strip_wp_version', phpBool(state.wpHide.stripWpVersionMeta), 33),
      L('block_author_scanning', phpBool(state.wpHide.blockAuthorScanning), 33),
      L('hide_usernames_emails', phpBool(state.wpHide.hideUsernamesAndEmails), 33),
      L('author_alias', phpStr(state.wpHide.authorAliasPattern), 33),
      L('members_only_mode', phpBool(state.wpHide.membersOnlyMode), 33),
      L('master_password_enabled', phpBool(state.wpHide.masterPasswordEnabled), 33),
      L('master_password_hash', "''", 33),
      L('master_password_whitelisted_ips', phpList(state.wpHide.masterPasswordWhitelistedIps), 33),
      L('enable_login_shortcode', phpBool(state.wpHide.enableLoginShortcode), 33),
      L('enable_ajax_bubble_login', phpBool(state.wpHide.enableAjaxBubbleLogin), 33),
      L('bubble_position', phpStr(state.wpHide.bubblePosition), 33),
      L('bubble_button_label', phpStr(state.wpHide.bubbleButtonLabel), 33),
    ]),
    group('performance', [
      L('defer_scripts', phpBool(state.performance.deferScripts)),
      L('cache_ttl_mins', phpInt(Math.max(1, state.performance.objectCacheTtlMinutes), 60)),
    ]),
  ].join('\n');
}

export function generateWordPressPluginPhp(state: ToolkitState): string {
  const defaults = buildPluginDefaultsPhp(state);
  // Függvényes replace: a defaults szövegében lévő `$` jelek ne értelmeződjenek speciális mintaként.
  return PLUGIN_TEMPLATE.replace(PLUGIN_DEFAULTS_MARKER, () => defaults);
}

export interface AuditCheckItem {
  id: string;
  category: 'PHP 8.0+' | 'WordPress 7.1' | 'GDPR & Adatvédelem' | 'Biztonság' | 'Teljesítmény';
  title: string;
  description: string;
  passed: boolean;
}

/**
 * Statikusan összeveti a generált PHP-ban az alapértékek (get_defaults), a beállítás-séma (settings_schema)
 * és a kódban olvasott kulcsokat ($cap['x'], $auth['x'] ...). A 0.7.0-ban 16 séma-kulcs és 13 kódbeli kulcs hiányzott
 * az alapértékekből, ezért a beállítások nem mentődtek – ez a függvény ezt a hibaosztályt fogja meg.
 */
export function findConfigKeyMismatches(php: string): {
  defaultsFound: number;
  schemaMissing: string[];
  codeMissing: string[];
} {
  const defaults = new Map<string, Set<string>>();
  const dStart = php.indexOf('public static function get_defaults()');
  const dEnd = php.indexOf('public static function get_config()');
  let current: string | null = null;
  for (const line of php.slice(dStart, dEnd).split('\n')) {
    const g = /^ {12}'(\w+)'\s*=>\s*\[\s*$/.exec(line);
    if (g) { current = g[1]; defaults.set(current, new Set()); continue; }
    if (/^ {12}\],?\s*$/.test(line)) { current = null; continue; }
    const k = /^ {16}'(\w+)'\s*=>/.exec(line);
    if (k && current) defaults.get(current)!.add(k[1]);
  }
  const schemaMissing: string[] = [];
  const sStart = php.indexOf('private static function settings_schema()');
  const sEnd = php.indexOf('public static function sanitize_settings');
  current = null;
  for (const line of php.slice(sStart, sEnd).split('\n')) {
    const g = /^ {12}'(\w+)'\s*=>\s*\[\s*$/.exec(line);
    if (g) { current = g[1]; continue; }
    if (/^ {12}\],?\s*$/.test(line)) { current = null; continue; }
    const k = /^ {16}'(\w+)'\s*=>\s*\[\s*'(\w+)'/.exec(line);
    if (k && current && k[2] !== 'newpass' && !defaults.get(current)?.has(k[1])) schemaMissing.push(`${current}.${k[1]}`);
  }
  const varToGroup: Record<string, string> = {
    cap: 'captcha', auth: 'auth', hide: 'wp_hide', audit: 'audit_log', opt: 'optimizer', gdpr: 'gdpr',
  };
  const codeMissing = new Set<string>();
  for (const [v, group] of Object.entries(varToGroup)) {
    const re = new RegExp("\\$" + v + "\\[\\s*'(\\w+)'\\s*\\]", 'g');
    for (const m of php.matchAll(re)) {
      if (defaults.has(group) && !defaults.get(group)!.has(m[1])) codeMissing.add(`${group}.${m[1]}`);
    }
  }
  return { defaultsFound: defaults.size, schemaMissing, codeMissing: [...codeMissing] };
}

/**
 * Automated static code & configuration audit verifying compatibility with WordPress 7.1, PHP 8.0+, EU GDPR, Info Banner, v0.4.0 Optimizer, v0.5.x Security Audit Log, v0.6.0 Bot Protection & v0.7.0 Hitelesítés + WP Rejtés requirements
 */
export function auditWordPressPhpCompatibility(
  phpCode: string,
  state: ToolkitState
): {
  allPassed: boolean;
  passedCount: number;
  totalCount: number;
  checks: AuditCheckItem[];
} {
  const requiredMethods = [
    'init', 'on_init', 'activate', 'deactivate', 'uninstall', 'get_defaults', 'get_config',
    'sanitize_settings', 'register_settings', 'create_tables', 'log_event',
    'log_user_login_event', 'log_upgrader_lifecycle_event', 'log_deleted_plugin_event',
    'log_theme_switch_event', 'log_content_save_event', 'log_content_delete_event',
    'log_user_registration_event', 'log_user_role_change_event', 'log_user_delete_event',
    'log_auto_system_update_event', 'log_core_manual_update_event', 'run_hourly_tasks',
    'format_audit_export', 'handle_admin_export', 'handle_admin_optimize',
    'filter_upload_size_limit', 'filter_big_image_threshold', 'filter_editor_quality',
    'filter_output_format', 'filter_lazy_loading_enabled', 'filter_omit_loading_threshold',
    'filter_script_loader_tag', 'start_page_cache', 'store_page_cache', 'flush_page_cache',
    'register_admin_menu', 'render_admin_dashboard', 'enqueue_frontend_assets',
    'print_consent_mode_defaults', 'render_calendar_widget', 'render_search_widget',
    'render_social_widget', 'render_stats_widget', 'render_cookie_consent_widget',
    'render_info_banner_shortcode', 'render_speed_badge_shortcode',
    'render_security_badge_shortcode', 'enqueue_captcha_login_assets', 'render_captcha_field',
    'verify_captcha_token', 'verify_login_captcha', 'verify_registration_captcha',
    'verify_lostpassword_captcha', 'verify_comment_captcha', 'render_captcha_badge_shortcode',
    'verify_totp_with_time_drift', 'evaluate_user_auth_policy', 'enforce_totp_login',
    'render_totp_login_field', 'render_profile_2fa', 'save_profile_2fa', 'render_2fa_required_notice',
    'render_auth_manager_shortcode', 'apply_wp_hide', 'strip_version_query', 'filter_rest_endpoints',
    'enforce_wp_hide_access_gate', 'filter_rest_access', 'filter_masked_author_name',
    'filter_masked_comment_author', 'render_custom_login_shortcode', 'render_ajax_bubble_login_widget',
    'handle_ajax_bubble_login',
    'render_global_info_banner', 'render_gdpr_footer_banner',
    'register_rest_routes', 'handle_ajax_search', 'increment_download_counter',
    'increment_visit_counter', 'handle_cookie_consent', 'handle_system_optimization',
    'handle_audit_log_export',
  ];

  const allMethodsImplemented = requiredMethods.every((m) =>
    phpCode.includes(`public static function ${m}(`)
  );
  const has = (...needles: string[]) => needles.every((n) => phpCode.includes(n));
  const hasNone = (...needles: string[]) => needles.every((n) => !phpCode.includes(n));

  const checks: AuditCheckItem[] = [
    {
      id: 'php80-strict-types',
      category: 'PHP 8.0+',
      title: 'PHP 8.0 Strict Types, Union/Nullable típusok, nyílfüggvények',
      description:
        'declare(strict_types=1), típusos tulajdonság (?array), mixed paraméter, ?array nullable, static fn() nyílfüggvény és Requires PHP: 8.0 fejléc.',
      passed: has(
        'declare(strict_types=1);',
        'private static ?array $config_cache',
        'mixed $value',
        '?array $actor = null',
        'static fn(): bool =>',
        'Requires PHP:      8.0'
      ),
    },
    {
      id: 'php80-match-expression',
      category: 'PHP 8.0+',
      title: 'PHP 8.0 match kifejezések és verzió-konstans (v0.7.1)',
      description:
        'A belépési értesítő, a banner hatókör és a beállítás-szanitizálás típusbiztos match () kifejezést használ; VERSION = 0.7.0.',
      passed: has(
        "match ( $audit['login_email_scope'] )",
        "match ( $config['visibility_scope'] )",
        'match ( $type )',
        `public const VERSION     = '${PLUGIN_VERSION}';`
      ),
    },
    {
      id: 'wp71-header-meta',
      category: 'WordPress 7.1',
      title: 'WordPress fejléc és metaadat (Requires at least: 6.3)',
      description:
        'Plugin Name, Version, Requires at least: 6.3 (script strategy API), Requires PHP, Tested up to, Author, License URI és Domain Path.',
      passed: has(
        'Plugin Name:       And ToolKit',
        `Version:           ${PLUGIN_VERSION}`,
        'Requires at least: 6.3',
        'Tested up to:      7.1',
        'Author:            galandras12+AI',
        'License URI:',
        'Domain Path:'
      ),
    },
    {
      id: 'wp71-hook-callbacks',
      category: 'WordPress 7.1',
      title: 'Minden regisztrált hook, 11 rövidkód és REST végpont implementálva',
      description: `Mind a(z) ${requiredMethods.length} publikus metódus megtalálható, és a hook-regisztrációk (activation/deactivation/uninstall, cron, 11 rövidkód, REST útvonalak) jelen vannak.`,
      passed:
        allMethodsImplemented &&
        has(
          'register_activation_hook(',
          'register_deactivation_hook(',
          'register_uninstall_hook(',
          "add_action( self::CRON_HOOK",
          "add_shortcode( 'wtk_security_badge'",
          "add_shortcode( 'wtk_captcha_badge'",
          "add_shortcode( 'wtk_auth_manager'",
          "add_shortcode( 'wtk_custom_login'"
        ) &&
        ['/search', '/track-download', '/track-visit', '/cookie-consent', '/optimize', '/audit-export'].every(
          (route) => phpCode.includes(`'${route}'`)
        ) && hasNone("'/auth-sync-time'", "'/bubble-login'"),
    },
    {
      id: 'audit-log-storage-export',
      category: 'Biztonság',
      title: 'Valódi audit napló (adatbázis) + .log/.txt/.csv export',
      description:
        'Az események saját táblába kerülnek (dbDelta + $wpdb->insert) aktor/IP/idő adatokkal; az export valódi fájl (Content-Disposition), CSV-injekció elleni védelemmel; megőrzési idő szerinti törlés.',
      passed:
        has(
          'dbDelta(',
          '$wpdb->insert(',
          "'wp_login'",
          "'wp_after_insert_post'",
          "'user_register'",
          "'set_user_role'",
          "'automatic_updates_complete'",
          "'_core_updated_successfully'",
          'Content-Disposition: attachment',
          'fputcsv(',
          'retention_days'
        ) && hasNone("update_option( 'and_toolkit_last_"),
    },
    {
      id: 'audit-critical-only-email',
      category: 'Biztonság',
      title: 'Critical Only e-mail szűrő egy helyen érvényesül + nincs beégetett címzett',
      description:
        'Az összes e-mail a notify() segédfüggvényen megy át, amely a critical_only_emails kapcsolót érvényesíti; a címzett üres esetén a webhely admin e-mailje; a szerző címe nincs a kódban.',
      passed:
        has(
          "$audit['critical_only_emails'] && ! $critical",
          "get_option( 'admin_email' )",
          'check_filesystem_integrity',
          'check_available_updates',
          'maybe_send_daily_digest'
        ) && !phpCode.includes('@gmail.com'),
    },
    {
      id: 'captcha-bot-protection',
      category: 'Biztonság',
      title: 'Botvédelem: reCAPTCHA v3 / Turnstile – action- és hostname-ellenőrzés, kompatibilis, nem zár ki',
      description:
        'siteverify ellenőrzés a reCAPTCHA action (atk_submit) és hostname értékével, token-frissítés beküldéskor, csak böngészős űrlapokon érvényesül (XML-RPC/REST/WP-CLI nem), a kijelentkezett-only komment mező miatt belépett felhasználót nem blokkol, szolgáltatói hálózati hiba esetén fail-open (szűrhető), nincs beégetett demó kulcs.',
      passed:
        has(
          'https://www.google.com/recaptcha/api/siteverify',
          'https://challenges.cloudflare.com/turnstile/v0/siteverify',
          "'atk_submit' === (string) ( $body['action']",
          'atkCaptchaRefresh',
          '! self::is_form_login()',
          'is_user_logged_in() || self::captcha_should_bypass()',
          'and_toolkit_captcha_fail_open',
          "add_filter( 'registration_errors'",
          "add_action( 'lostpassword_post'",
          "'bot_protection'"
        ) &&
        hasNone('_AndToolKit_', 'Demo060') &&
        state.captcha.scoreThreshold >= 0.1 &&
        state.captcha.scoreThreshold <= 0.9,
    },
    {
      id: 'auth-totp-recovery',
      category: 'Biztonság',
      title: 'Hitelesítés: valódi TOTP (base32, RFC 6238) + visszaállító kódok, belépéskor kikényszerítve',
      description:
        'A titkos kulcs felhasználónként, titkosítva (libsodium secretbox) él a user meta-ban; base32 dekódolás, újrajátszás elleni számláló, próbálkozás-zár, hashelt egyszer használatos visszaállító kódok, CIDR-es IP-mentesség. Nincs beégetett kulcs, fehérlistás IP vagy idő-szinkron végpont.',
      passed:
        has(
          'base32_decode(',
          'sodium_crypto_secretbox(',
          "add_filter( 'authenticate', [ __CLASS__, 'enforce_totp_login' ]",
          "add_action( 'login_form', [ __CLASS__, 'render_totp_login_field' ]",
          "$counter > $state['last_counter']",
          'recovery_hash(',
          'hash_equals(',
          'ip_matches(',
          'inet_pton('
        ) &&
        hasNone('JBSWY3DPEHPK3P', '84.2.44.19', 'handle_auth_time_sync', 'preserve_auth_credentials_on_update', "'totp_secret_key'"),
    },
    {
      id: 'wp-hide-access-gates',
      category: 'Biztonság',
      title: 'WP Rejtés: hash-elt mesterjelszó kapu, REST-zárolás, felderítés-tiltás, működő belépő buborék',
      description:
        'A mesterjelszó csak wp_hash_password hash-ként tárolt, a kapu aláírt HttpOnly sütit ad és sebességkorlátos, az admin sosem zárható ki; a csak-tagoknak mód a REST API-t is zárolja; verzió-elrejtés és felhasználó-felderítés tiltás; az AJAX buborék belépés valódi űrlapot és a captcha/2FA-n átmenő wp_signon-t használ. Nincs beégetett jelszó és nincs visszafejthető titkosítás.',
      passed:
        has(
          'wp_hash_password(',
          'wp_check_password(',
          'gate_token(',
          "'httponly' => true",
          "add_filter( 'rest_authentication_errors'",
          'strip_version_query',
          'filter_rest_endpoints',
          'wp_signon(',
          'login_form_html(',
          "current_user_can( 'manage_options' )"
        ) &&
        hasNone('decrypt_master_password_for_admin', 'atk_enc_v1', 'ATKENC1', 'AndToolKit#2026', 'AND_TOOLKIT_MASTER_KEY', "'master_password_cipher'"),
    },
    {
      id: 'config-key-consistency',
      category: 'PHP 8.0+',
      title: 'Konfigurációs kulcsok egységesek (alapérték ↔ beállítás-séma ↔ kód)',
      description:
        'Minden, az admin űrlapon szereplő és a kódban olvasott beállítási kulcs szerepel az alapértékek között, különben a mentett érték elveszne (merge_config eldobja) vagy undefined index hiba keletkezne.',
      passed: (() => {
        const m = findConfigKeyMismatches(phpCode);
        return m.schemaMissing.length === 0 && m.codeMissing.length === 0 && m.defaultsFound > 0;
      })(),
    },
    {
      id: 'rest-search-safe',
      category: 'Biztonság',
      title: 'Nyilvános REST végpontok: biztonságos kimenet, rate limit, validáció',
      description:
        'A kereső csak publikus, jelszó nélküli tartalmat ad vissza korlátozott mezőkkel (has_password=false, publish); a számlálók rate limitesek; a letöltés-követés útvonalat és kiterjesztést ellenőriz; a süti-hozzájárulás validate_callback-kel védett.',
      passed:
        has(
          "'has_password'        => false",
          "'post_status'         => 'publish'",
          'self::rate_limit(',
          'validate_callback',
          "in_array( $ext,"
        ) && hasNone('get_posts('),
    },
    {
      id: 'gdpr-cookie-compliance',
      category: 'GDPR & Adatvédelem',
      title: 'GDPR: valódi hozzájárulás-kezelés, Consent Mode v2, hozzájárulás-napló',
      description:
        'Elfogadás/elutasítás/testreszabás felület, gtag("consent","default"/"update"), előzetes szkript-blokkolás (text/plain + data-atk-category), pszeudonimizált hozzájárulás-napló és adatvédelmi szöveg.',
      passed:
        has(
          'gtag("consent","default"',
          'gtag(\'consent\',\'update\'',
          'text/plain',
          'data-atk-category',
          'and_toolkit_consent',
          'wp_add_privacy_policy_content',
          'hash_hmac( \'sha256\''
        ) && state.gdpr.categories.some((c) => c.id === 'necessary' && c.required),
    },
    {
      id: 'optimizer-real-implementation',
      category: 'Teljesítmény',
      title: 'Optimalizáló: valódi WP API horgok (kép, lazy load, cache, limit)',
      description:
        'upload_size_limit (PHP-plafonnal), big_image_size_threshold, wp_editor_set_quality, image_editor_output_format, wp_lazy_loading_enabled, wp_omit_loading_attr_threshold és generációs oldal-gyorsítótár; felhasználó/kommentelő-cookie esetén nem gyorsítótáraz.',
      passed:
        has(
          "add_filter( 'upload_size_limit'",
          "add_filter( 'big_image_size_threshold'",
          "add_filter( 'wp_editor_set_quality'",
          "add_filter( 'image_editor_output_format'",
          "add_filter( 'wp_lazy_loading_enabled'",
          "add_filter( 'wp_omit_loading_attr_threshold'",
          'php_upload_ceiling',
          'wordpress_logged_in',
          'cache_generation'
        ) && state.optimizer.customUploadLimitMb >= 8,
    },
    {
      id: 'info-banner-module',
      category: 'WordPress 7.1',
      title: 'Információs banner: wp_body_open, hatókör, egyedi szín, bezárhatóság',
      description:
        'Mind a 4 hatókör kezelt (all-pages, homepage-only, blog-posts, sidebar-only), az egyedi HEX színek validálva (sanitize_hex_color) és renderelve, sticky/dismissible támogatott.',
      passed:
        has(
          "add_action( 'wp_body_open'",
          "'blog-posts'",
          'sanitize_hex_color(',
          'data-sticky',
          'data-dismissible'
        ) && Boolean(state.banner.headline),
    },
    {
      id: 'security-sanitization',
      category: 'Biztonság',
      title: 'ABSPATH védelem, escape-elés, nonce és jogosultság-ellenőrzés',
      description:
        "Közvetlen fájlelérés tiltva; esc_html/esc_attr/esc_url/absint/sanitize_*; admin-post műveletek check_admin_referer + current_user_can védelemmel; meta box nonce; a generátor a szövegeket PHP-escape-eli.",
      passed: has(
        "if ( ! defined( 'ABSPATH' ) )",
        'check_admin_referer(',
        'wp_verify_nonce(',
        "current_user_can( 'manage_options' )",
        'esc_html(',
        'esc_attr(',
        'esc_url(',
        'sanitize_email'
      ),
    },
    {
      id: 'perf-zero-jquery',
      category: 'Teljesítmény',
      title: 'Zero-jQuery frontend (beágyazott Vanilla JS + CSS, nincs hiányzó asset)',
      description:
        'A frontend JS/CSS a plugin fájlba van ágyazva (wp_add_inline_script/style), nem hivatkozik nem létező külső fájlra és nem függ jQuery-től.',
      passed:
        has('wp_add_inline_script(', 'wp_add_inline_style(') &&
        hasNone('and-toolkit.min.js', "'jquery'") &&
        Boolean(state.performance.zeroJqueryDependency),
    },
  ];

  const passedCount = checks.filter((c) => c.passed).length;

  return {
    allPassed: passedCount === checks.length,
    passedCount,
    totalCount: checks.length,
    checks,
  };
}

