import { PLUGIN_TEMPLATE, PLUGIN_DEFAULTS_MARKER } from './pluginTemplate';
import {
  AuditEventCategory,
  AuditLogConfig,
  AuditLogEntry,
  AuditLogExportFormat,
  CalendarConfig,
  NumberFormatStyle,
  PendingUpdateItem,
  PerformanceConfig,
  ScheduledPostItem,
  SearchConfig,
  ToolkitState,
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
    title: 'And ToolKit v0.5.2 Kiadási Csomag és Audit Napló Dokumentáció (ZIP)',
    date: '2026-11-09',
    time: '10:30',
    category: 'Kiadás',
    author: 'galandras12+AI',
    excerpt: 'Teljes REST API végpontok, GDPR Cookie Consent Mode v2, Képoptimalizáló és Biztonsági Audit Napló modul (Critical Only szűrővel).',
    postType: 'download',
    views: 5180,
    downloads: 1840,
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
    badgeText: 'ÚJ VERZIÓ · v0.5.2',
    headline: 'And ToolKit v0.5.2: valódi audit napló adatbázissal, fájl-export és biztonsági javítások!',
    subtext: 'Adatbázisban tárolt napló, valódi .log/.txt/.csv letöltés, javított nyilvános REST végpontok és működő GDPR süti-kezelő.',
    ctaLabel: 'Naplózás megnyitása',
    ctaUrl: '/kiadasok/and-toolkit-v0-5-2',
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
      'AND TOOLKIT v0.5.2 — WORDPRESS 7.1 BIZTONSÁGI ÉS ESEMÉNYNAPLÓ (.TXT EXPORT)',
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
    ? `[And ToolKit v0.5.2 · CRITICAL ONLY] Kritikus WP Mag Frissítés & Fájlrendszer Riasztás (${filtered.length} mag frissítés)`
    : `[And ToolKit v0.5.2] WordPress Frissítési Értesítő (${filtered.length} komponens) & Napi Összefoglaló (${config.dailyDigestTime})`;

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
    'And ToolKit v0.5.1 · WordPress 7.1 Biztonsági Napló & E-mail Értesítő Modul',
  ].join('\n');

  return {
    subject,
    body,
    includedCount: filtered.length,
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

/**
 * Generate production-ready WordPress 7.1 & PHP 8.0+ Plugin file reflecting current v0.5.0 configuration
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

function phpList(items: string[]): string {
  return `[ ${items.map(phpStr).join(', ')} ]`;
}

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
 * Automated static code & configuration audit verifying compatibility with WordPress 7.1, PHP 8.0+, EU GDPR, Info Banner, v0.4.0 Optimizer & v0.5.0 Security Audit Log requirements
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
    'render_security_badge_shortcode', 'render_global_info_banner', 'render_gdpr_footer_banner',
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
      title: 'PHP 8.0 match kifejezések és verzió-konstans',
      description:
        'A belépési értesítő, a banner hatókör és a beállítás-szanitizálás típusbiztos match () kifejezést használ; VERSION = 0.5.2.',
      passed: has(
        "match ( $audit['login_email_scope'] )",
        "match ( $config['visibility_scope'] )",
        'match ( $type )',
        "public const VERSION     = '0.5.2';"
      ),
    },
    {
      id: 'wp71-header-meta',
      category: 'WordPress 7.1',
      title: 'WordPress fejléc és metaadat (Requires at least: 6.3)',
      description:
        'Plugin Name, Version: 0.5.2, Requires at least: 6.3 (script strategy API), Requires PHP, Tested up to, Author, License URI és Domain Path.',
      passed: has(
        'Plugin Name:       And ToolKit',
        'Version:           0.5.2',
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
      title: 'Minden regisztrált hook, rövidkód és REST végpont implementálva',
      description: `Mind az ${requiredMethods.length} publikus metódus megtalálható, és a hook-regisztrációk (activation/deactivation/uninstall, cron, 8 rövidkód, 6 REST útvonal) jelen vannak.`,
      passed:
        allMethodsImplemented &&
        has(
          'register_activation_hook(',
          'register_deactivation_hook(',
          'register_uninstall_hook(',
          "add_action( self::CRON_HOOK",
          "add_shortcode( 'wtk_security_badge'"
        ) &&
        ['/search', '/track-download', '/track-visit', '/cookie-consent', '/optimize', '/audit-export'].every(
          (route) => phpCode.includes(`'${route}'`)
        ),
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
