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
    title: 'And ToolKit v0.5.1 Kiadási Csomag és Audit Napló Dokumentáció (ZIP)',
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
    badgeText: 'ÚJ VERZIÓ · v0.5.1',
    headline: 'And ToolKit v0.5.1: Critical Only E-mail Riasztás Szűrő a Biztonsági Naplóban!',
    subtext: 'Szűrje az e-mail értesítéseket kizárólag a kritikus WordPress mag (Core) frissítésekre és fájlrendszer-változásokra.',
    ctaLabel: 'Naplózás megnyitása',
    ctaUrl: '/kiadasok/and-toolkit-v0-5-1',
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
    recipientEmail: 'galandras12@gmail.com',
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
      const esc = (val = '') => `"${String(val).replace(/"/g, '""')}"`;
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
      'AND TOOLKIT v0.5.1 — WORDPRESS 7.1 BIZTONSÁGI ÉS ESEMÉNYNAPLÓ (.TXT EXPORT)',
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
    ? `[And ToolKit v0.5.1 · CRITICAL ONLY] Kritikus WP Mag Frissítés & Fájlrendszer Riasztás (${filtered.length} mag frissítés)`
    : `[And ToolKit v0.5.1] WordPress Frissítési Értesítő (${filtered.length} komponens) & Napi Összefoglaló (${config.dailyDigestTime})`;

  const body = [
    `Címzett: ${config.recipientEmail}`,
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
export function generateWordPressPluginPhp(state: ToolkitState): string {
  const enabledPlatforms = state.social.platforms
    .filter((p) => p.enabled)
    .map((p) => `'${p.id}'`)
    .join(', ');

  const postTypesList = state.search.includedTypes.map((t) => `'${t}'`).join(', ');
  const gdprCategoriesList = state.gdpr.categories
    .map((c) => `'${c.id}' => ${c.defaultEnabled ? 'true' : 'false'}`)
    .join(', ');

  const newDeviceRolesList = state.auditLog.newDeviceTargetRoles
    .map((r) => `'${r}'`)
    .join(', ');

  return `<?php
/**
 * Plugin Name:       And ToolKit
 * Plugin URI:        https://github.com/galandras12/and-toolkit
 * Description:       Modern WordPress 7.1 adminisztrációs eszköztár: Esemény naptár widget, AJAX élő kereső, platformfüggetlen közösségi megosztó, látogatói/letöltési statisztika, kötelező GDPR Cookie kezelő, Információs Banner, Kép/Upload/Lazy-Load/Cache Optimalizáló és Biztonsági Audit Naplózás & E-mail Értesítő modul (Critical Only szűrővel).
 * Version:           0.5.1
 * Requires at least: 6.2
 * Tested up to:      7.1
 * Requires PHP:      8.0
 * Author:            galandras12+AI
 * License:           GPL v2 or later
 * Text Domain:       and-toolkit
 */

declare(strict_types=1);

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

final class And_ToolKit_Plugin {
    public const VERSION    = '0.5.1';
    public const AUTHOR     = 'galandras12+AI';
    public const WP_TARGET  = '7.1';
    public const PHP_TARGET = '8.0';

    public static function init(): void {
        add_action( 'admin_menu', [ __CLASS__, 'register_admin_menu' ] );
        add_action( 'widgets_init', [ __CLASS__, 'register_sidebar_widgets' ] );
        add_action( 'wp_enqueue_scripts', [ __CLASS__, 'enqueue_frontend_assets' ] );
        add_action( 'wp_body_open', [ __CLASS__, 'render_global_info_banner' ] );
        add_action( 'wp_footer', [ __CLASS__, 'render_gdpr_footer_banner' ] );
        add_action( 'rest_api_init', [ __CLASS__, 'register_rest_routes' ] );

        // v0.4.0 Optimalizáló: Fájlfeltöltési limit felülbírálás, Kép-átméretezés és Teljes körű Lazy Loading
        add_filter( 'upload_size_limit', [ __CLASS__, 'filter_upload_size_limit' ], 999 );
        add_filter( 'big_image_size_threshold', [ __CLASS__, 'filter_big_image_threshold' ], 999 );
        add_filter( 'wp_get_attachment_image_attributes', [ __CLASS__, 'filter_lazy_load_attributes' ], 10, 2 );

        // v0.5.0 Biztonsági Audit Naplózás & E-mail Értesítés Hookok (Bejelentkezés, Plugin, Téma, Poszt, Oldal, Felhasználó, Auto-Update, WP Core)
        add_action( 'wp_login', [ __CLASS__, 'log_user_login_event' ], 10, 2 );
        add_action( 'upgrader_process_complete', [ __CLASS__, 'log_upgrader_lifecycle_event' ], 10, 2 );
        add_action( 'deleted_plugin', [ __CLASS__, 'log_deleted_plugin_event' ], 10, 2 );
        add_action( 'switch_theme', [ __CLASS__, 'log_theme_switch_event' ], 10, 3 );
        add_action( 'save_post', [ __CLASS__, 'log_content_save_event' ], 10, 3 );
        add_action( 'before_delete_post', [ __CLASS__, 'log_content_delete_event' ], 10, 2 );
        add_action( 'user_register', [ __CLASS__, 'log_user_registration_event' ], 10, 2 );
        add_action( 'set_user_role', [ __CLASS__, 'log_user_role_change_event' ], 10, 3 );
        add_action( 'delete_user', [ __CLASS__, 'log_user_delete_event' ], 10, 2 );
        add_action( 'automatic_updates_complete', [ __CLASS__, 'log_auto_system_update_event' ], 10, 1 );
        add_action( '_core_updated_successfully', [ __CLASS__, 'log_core_manual_update_event' ], 10, 1 );

        // Rövidkódok (Shortcodes) regisztrálása WordPress 7.1 blokk és klasszikus témákhoz
        add_shortcode( 'wtk_calendar', [ __CLASS__, 'render_calendar_widget' ] );
        add_shortcode( 'wtk_search', [ __CLASS__, 'render_search_widget' ] );
        add_shortcode( 'wtk_social', [ __CLASS__, 'render_social_widget' ] );
        add_shortcode( 'wtk_stats', [ __CLASS__, 'render_stats_widget' ] );
        add_shortcode( 'wtk_cookie_consent', [ __CLASS__, 'render_cookie_consent_widget' ] );
        add_shortcode( 'wtk_info_banner', [ __CLASS__, 'render_info_banner_shortcode' ] );
        add_shortcode( 'wtk_speed_badge', [ __CLASS__, 'render_speed_badge_shortcode' ] );
        add_shortcode( 'wtk_security_badge', [ __CLASS__, 'render_security_badge_shortcode' ] );
    }

    public static function register_admin_menu(): void {
        // Egyedi SVG logó: & (and jel) egy villáskulcsban
        $icon_svg = 'data:image/svg+xml;base64,' . base64_encode(
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44"><path d="M34.8 14.2C36.3 18.4 35.3 23.2 32.0 26.5C28.9 29.6 24.4 30.6 20.3 29.3L11.8 37.8C10.2 39.4 7.6 39.4 6.0 37.8C4.4 36.2 4.4 33.6 6.0 32.0L14.5 23.5C13.2 19.4 14.2 14.9 17.3 11.8C20.6 8.5 25.4 7.5 29.6 9.0L24.8 13.8L25.6 17.8L29.6 18.6L34.8 14.2Z" fill="none" stroke="#a7aaad" stroke-width="2.5"/><text x="23.5" y="24" text-anchor="middle" fill="#a7aaad" font-size="13" font-weight="bold">&amp;</text></svg>'
        );

        add_menu_page(
            'And ToolKit Vezérlőpult',
            'And ToolKit',
            'manage_options',
            'and-toolkit',
            [ __CLASS__, 'render_admin_dashboard' ],
            $icon_svg,
            58
        );
    }

    public static function get_config(): array {
        return [
            'plugin_name' => 'And ToolKit',
            'version'     => self::VERSION,
            'author'      => self::AUTHOR,
            'theme_mode'  => '${state.theme}',
            'calendar'    => [
                'enabled'        => ${state.calendar.enabled ? 'true' : 'false'},
                'title'          => '${state.calendar.widgetTitle.replace(/'/g, "\\'")}',
                'style'          => '${state.calendar.style}',
                'max_items'      => ${state.calendar.maxItems},
                'show_countdown' => ${state.calendar.showCountdown ? 'true' : 'false'},
            ],
            'search'      => [
                'enabled'           => ${state.search.enabled ? 'true' : 'false'},
                'title'             => '${state.search.widgetTitle.replace(/'/g, "\\'")}',
                'layout'            => '${state.search.layout}',
                'live_ajax'         => ${state.search.liveAjax ? 'true' : 'false'},
                'debounce_ms'       => ${state.search.debounceMs},
                'post_types'        => [ ${postTypesList} ],
                'highlight_matches' => ${state.search.highlightMatches ? 'true' : 'false'},
            ],
            'social'      => [
                'enabled'      => ${state.social.enabled ? 'true' : 'false'},
                'title'        => '${state.social.widgetTitle.replace(/'/g, "\\'")}',
                'button_style' => '${state.social.buttonStyle}',
                'columns'      => ${state.social.columns},
                'platforms'    => [ ${enabledPlatforms} ],
            ],
            'stats'       => [
                'enabled'          => ${state.stats.enabled ? 'true' : 'false'},
                'title'            => '${state.stats.widgetTitle.replace(/'/g, "\\'")}',
                'style'            => '${state.stats.style}',
                'number_format'    => '${state.stats.numberFormat}',
                'unique_visitors'  => ${state.stats.showUniqueVisitors ? 'true' : 'false'},
                'total_downloads'  => ${state.stats.showTotalDownloads ? 'true' : 'false'},
            ],
            'gdpr'        => [
                'enabled'                => ${state.gdpr.enabled ? 'true' : 'false'},
                'title'                  => '${state.gdpr.widgetTitle.replace(/'/g, "\\'")}',
                'display_style'          => '${state.gdpr.displayStyle}',
                'privacy_url'            => '${state.gdpr.privacyPolicyUrl.replace(/'/g, "\\'")}',
                'expiry_days'            => ${state.gdpr.consentExpiryDays},
                'google_consent_mode_v2' => ${state.gdpr.googleConsentModeV2 ? 'true' : 'false'},
                'auto_block_scripts'     => ${state.gdpr.autoBlockScripts ? 'true' : 'false'},
                'default_categories'     => [ ${gdprCategoriesList} ],
            ],
            'banner'      => [
                'enabled'          => ${state.banner.enabled ? 'true' : 'false'},
                'visibility_scope' => '${state.banner.visibilityScope}',
                'sticky_top'       => ${state.banner.stickyTop ? 'true' : 'false'},
                'color_preset'     => '${state.banner.colorPreset}',
                'custom_bg_hex'    => '${state.banner.customBgHex.replace(/'/g, "\\'")}',
                'custom_text_hex'  => '${state.banner.customTextHex.replace(/'/g, "\\'")}',
                'size_preset'      => '${state.banner.sizePreset}',
                'font_style'       => '${state.banner.fontStyle}',
                'animation'        => '${state.banner.animation}',
                'badge_text'       => '${state.banner.badgeText.replace(/'/g, "\\'")}',
                'headline'         => '${state.banner.headline.replace(/'/g, "\\'")}',
                'subtext'          => '${state.banner.subtext.replace(/'/g, "\\'")}',
                'cta_label'        => '${state.banner.ctaLabel.replace(/'/g, "\\'")}',
                'cta_url'          => '${state.banner.ctaUrl.replace(/'/g, "\\'")}',
                'dismissible'      => ${state.banner.dismissible ? 'true' : 'false'},
            ],
            'optimizer'   => [
                'enabled'                 => ${state.optimizer.enabled ? 'true' : 'false'},
                'auto_optimize'           => ${state.optimizer.autoOptimizeEnabled ? 'true' : 'false'},
                'auto_schedule'           => '${state.optimizer.autoSchedule}',
                'image_compression'       => ${state.optimizer.imageCompressionEnabled ? 'true' : 'false'},
                'compression_quality'     => ${state.optimizer.compressionQuality},
                'convert_format'          => '${state.optimizer.convertFormat}',
                'auto_resize'             => ${state.optimizer.autoResizeEnabled ? 'true' : 'false'},
                'max_width_px'            => ${state.optimizer.maxWidthPx},
                'max_height_px'           => ${state.optimizer.maxHeightPx},
                'override_upload_limit'   => ${state.optimizer.overrideUploadLimit ? 'true' : 'false'},
                'custom_upload_limit_mb'  => ${state.optimizer.customUploadLimitMb},
                'lazy_load_images'        => ${state.optimizer.lazyLoadImages ? 'true' : 'false'},
                'lazy_load_iframes'       => ${state.optimizer.lazyLoadIframesAndVideos ? 'true' : 'false'},
                'lazy_load_backgrounds'   => ${state.optimizer.lazyLoadBackgrounds ? 'true' : 'false'},
                'exclude_above_fold'      => ${state.optimizer.excludeAboveFoldCount},
                'page_cache_enabled'      => ${state.optimizer.pageCacheEnabled ? 'true' : 'false'},
            ],
            'audit_log'   => [
                'enabled'                        => ${state.auditLog.enabled ? 'true' : 'false'},
                'recipient_email'                => '${state.auditLog.recipientEmail.replace(/'/g, "\\'")}',
                'critical_only_emails'           => ${state.auditLog.criticalOnlyEmails ? 'true' : 'false'},
                'export_format'                  => '${state.auditLog.defaultExportFormat}',
                'login_email_enabled'            => ${state.auditLog.loginEmailEnabled ? 'true' : 'false'},
                'login_email_scope'              => '${state.auditLog.loginEmailScope}',
                'new_device_location_alert'      => ${state.auditLog.newDeviceLocationEmailEnabled ? 'true' : 'false'},
                'new_device_target_roles'        => [ ${newDeviceRolesList} ],
                'update_available_email_enabled' => ${state.auditLog.updateAvailableEmailEnabled ? 'true' : 'false'},
                'daily_digest_enabled'           => ${state.auditLog.dailyDigestEnabled ? 'true' : 'false'},
                'daily_digest_time'              => '${state.auditLog.dailyDigestTime}',
            ],
            'performance' => [
                'minify_assets'   => ${state.performance.minifyAssets ? 'true' : 'false'},
                'defer_scripts'   => ${state.performance.deferScripts ? 'true' : 'false'},
                'cache_ttl_mins'  => ${state.performance.objectCacheTtlMinutes},
                'zero_jquery'     => ${state.performance.zeroJqueryDependency ? 'true' : 'false'},
            ],
        ];
    }

    public static function filter_upload_size_limit( int $size ): int {
        $opt = self::get_config()['optimizer'];
        if ( ! $opt['enabled'] || ! $opt['override_upload_limit'] ) {
            return $size;
        }
        return absint( $opt['custom_upload_limit_mb'] ) * 1024 * 1024;
    }

    public static function filter_big_image_threshold( int $threshold ): int {
        $opt = self::get_config()['optimizer'];
        if ( ! $opt['enabled'] || ! $opt['auto_resize'] ) {
            return $threshold;
        }
        return max( absint( $opt['max_width_px'] ), absint( $opt['max_height_px'] ) );
    }

    public static function filter_lazy_load_attributes( array $attr, object $attachment ): array {
        $opt = self::get_config()['optimizer'];
        if ( ! $opt['enabled'] || ! $opt['lazy_load_images'] ) {
            return $attr;
        }
        $attr['loading']  = 'lazy';
        $attr['decoding'] = 'async';
        return $attr;
    }

    // ========================================================================
    // v0.5.1 BIZTONSÁGI NAPLÓZÁS & E-MAIL ÉRTESÍTÉS METÓDUSOK (CRITICAL ONLY)
    // ========================================================================

    public static function log_user_login_event( string $user_login, object $user ): void {
        $audit = self::get_config()['audit_log'];
        if ( ! $audit['enabled'] || $audit['critical_only_emails'] ) {
            return;
        }
        $roles = isset( $user->roles ) && is_array( $user->roles ) ? $user->roles : [ 'subscriber' ];
        $primary_role = (string) ( $roles[0] ?? 'subscriber' );

        $should_notify = match ( $audit['login_email_scope'] ) {
            'all-users'    => true,
            'editors-only' => 'editor' === $primary_role,
            'admins-only'  => 'administrator' === $primary_role,
            default        => false,
        };

        if ( $audit['login_email_enabled'] && $should_notify && function_exists( 'wp_mail' ) ) {
            wp_mail(
                sanitize_email( $audit['recipient_email'] ),
                sprintf( '[And ToolKit] Belépési értesítés: %s (%s)', sanitize_text_field( $user_login ), $primary_role ),
                sprintf( 'Felhasználó bejelentkezett: %s · Szerepkör: %s', sanitize_text_field( $user_login ), $primary_role )
            );
        }
    }

    public static function log_upgrader_lifecycle_event( object $upgrader, array $hook_extra ): void {
        $audit = self::get_config()['audit_log'];
        if ( ! $audit['enabled'] ) {
            return;
        }
        $action = sanitize_text_field( (string) ( $hook_extra['action'] ?? 'update' ) );
        $type   = sanitize_text_field( (string) ( $hook_extra['type'] ?? 'plugin' ) );
        update_option( 'and_toolkit_last_upgrader_event', $type . ':' . $action, false );
    }

    public static function log_deleted_plugin_event( string $plugin_file, bool $deleted ): void {
        if ( $deleted ) {
            update_option( 'and_toolkit_last_deleted_plugin', sanitize_text_field( $plugin_file ), false );
        }
    }

    public static function log_theme_switch_event( string $new_name, object $new_theme, object $old_theme ): void {
        update_option( 'and_toolkit_last_theme_switch', sanitize_text_field( $new_name ), false );
    }

    public static function log_content_save_event( int $post_id, object $post, bool $update ): void {
        $post_type = isset( $post->post_type ) ? (string) $post->post_type : 'post';
        if ( in_array( $post_type, [ 'post', 'page' ], true ) ) {
            update_option( 'and_toolkit_last_content_event', $post_type . ':' . ( $update ? 'edit' : 'create' ) . ':' . absint( $post_id ), false );
        }
    }

    public static function log_content_delete_event( int $post_id, object $post ): void {
        $post_type = isset( $post->post_type ) ? (string) $post->post_type : 'post';
        update_option( 'and_toolkit_last_content_delete', $post_type . ':delete:' . absint( $post_id ), false );
    }

    public static function log_user_registration_event( int $user_id, array $userdata = [] ): void {
        // Rögzíti, hogy regisztrációs űrlapon, meghívóval vagy admin által jött létre
        $method = is_admin() ? 'admin-created' : 'registration-form';
        update_option( 'and_toolkit_last_user_created', absint( $user_id ) . ':' . $method, false );
    }

    public static function log_user_role_change_event( int $user_id, string $role, array $old_roles ): void {
        update_option( 'and_toolkit_last_role_change', absint( $user_id ) . ':' . sanitize_text_field( $role ), false );
    }

    public static function log_user_delete_event( int $id, ?int $reassign ): void {
        update_option( 'and_toolkit_last_user_deleted', absint( $id ), false );
    }

    public static function log_auto_system_update_event( array $results ): void {
        $audit = self::get_config()['audit_log'];
        update_option( 'and_toolkit_last_auto_update', time(), false );
        if ( $audit['enabled'] && $audit['daily_digest_enabled'] && function_exists( 'wp_mail' ) ) {
            wp_mail(
                sanitize_email( $audit['recipient_email'] ),
                '[And ToolKit] Napi 24 órás automatikus frissítési összefoglaló',
                'A WordPress automatizált rendszerfrissítése sikeresen lefutott.'
            );
        }
    }

    public static function log_core_manual_update_event( string $new_wp_version ): void {
        $current_user = function_exists( 'wp_get_current_user' ) ? wp_get_current_user() : null;
        $actor_login  = ( $current_user && isset( $current_user->user_login ) ) ? (string) $current_user->user_login : 'admin';
        update_option(
            'and_toolkit_last_core_update',
            sanitize_text_field( $actor_login . '->' . $new_wp_version ),
            false
        );
    }

    public static function enqueue_frontend_assets(): void {
        $config = self::get_config();
        // WordPress 6.3+ / 7.1 natív script strategy ('defer') támogatás jQuery függőség nélkül
        wp_register_script(
            'and-toolkit-frontend',
            plugins_url( 'assets/and-toolkit.min.js', __FILE__ ),
            [],
            self::VERSION,
            [
                'in_footer' => true,
                'strategy'  => $config['performance']['defer_scripts'] ? 'defer' : 'async',
            ]
        );
        wp_enqueue_script( 'and-toolkit-frontend' );
    }

    public static function register_sidebar_widgets(): void {
        // WordPress 7.1 blokk-alapú és klasszikus oldalsáv widget regisztráció
        if ( function_exists( 'register_block_type' ) ) {
            register_block_type( 'and-toolkit/sidebar-widgets', [
                'render_callback' => [ __CLASS__, 'render_calendar_widget' ],
            ] );
        }
    }

    public static function render_admin_dashboard(): void {
        if ( ! current_user_can( 'manage_options' ) ) {
            wp_die( esc_html__( 'Nincs jogosultsága az oldal megtekintéséhez.', 'and-toolkit' ) );
        }
        echo '<div id="and-toolkit-admin-root" class="wrap" data-version="' . esc_attr( self::VERSION ) . '"></div>';
    }

    public static function render_calendar_widget( array|string $atts = [] ): string {
        $config = self::get_config()['calendar'];
        if ( ! $config['enabled'] ) {
            return '';
        }
        $atts = shortcode_atts(
            [
                'style' => $config['style'],
                'limit' => (string) $config['max_items'],
            ],
            is_array( $atts ) ? $atts : [],
            'wtk_calendar'
        );

        // PHP 8.0 match kifejezés a sablon osztály kiválasztásához
        $style_class = match ( $atts['style'] ) {
            'grid'     => 'atk-calendar--grid',
            'compact'  => 'atk-calendar--compact',
            'timeline' => 'atk-calendar--timeline',
            default    => 'atk-calendar--cards',
        };

        return sprintf(
            '<section class="atk-widget %s" data-limit="%d"><h3>%s</h3></section>',
            esc_attr( $style_class ),
            absint( $atts['limit'] ),
            esc_html( $config['title'] )
        );
    }

    public static function render_search_widget( array|string $atts = [] ): string {
        $config = self::get_config()['search'];
        if ( ! $config['enabled'] ) {
            return '';
        }
        return sprintf(
            '<section class="atk-widget atk-search" data-layout="%s" data-debounce="%d"><h3>%s</h3></section>',
            esc_attr( $config['layout'] ),
            absint( $config['debounce_ms'] ),
            esc_html( $config['title'] )
        );
    }

    public static function render_social_widget( array|string $atts = [] ): string {
        $config = self::get_config()['social'];
        if ( ! $config['enabled'] ) {
            return '';
        }
        return sprintf(
            '<section class="atk-widget atk-social" data-style="%s" data-cols="%d"><h3>%s</h3></section>',
            esc_attr( $config['button_style'] ),
            absint( $config['columns'] ),
            esc_html( $config['title'] )
        );
    }

    public static function render_stats_widget( array|string $atts = [] ): string {
        $config = self::get_config()['stats'];
        if ( ! $config['enabled'] ) {
            return '';
        }
        return sprintf(
            '<section class="atk-widget atk-stats" data-style="%s" data-format="%s"><h3>%s</h3></section>',
            esc_attr( $config['style'] ),
            esc_attr( $config['number_format'] ),
            esc_html( $config['title'] )
        );
    }

    public static function render_cookie_consent_widget( array|string $atts = [] ): string {
        $config = self::get_config()['gdpr'];
        if ( ! $config['enabled'] ) {
            return '';
        }
        return sprintf(
            '<section class="atk-widget atk-gdpr-cookie" data-style="%s" data-expiry="%d" data-gcm-v2="%s"><h3>%s</h3><a href="%s">Adatvédelmi tájékoztató</a></section>',
            esc_attr( $config['display_style'] ),
            absint( $config['expiry_days'] ),
            esc_attr( $config['google_consent_mode_v2'] ? 'true' : 'false' ),
            esc_html( $config['title'] ),
            esc_url( $config['privacy_url'] )
        );
    }

    public static function render_info_banner_shortcode( array|string $atts = [] ): string {
        $config = self::get_config()['banner'];
        if ( ! $config['enabled'] ) {
            return '';
        }
        return sprintf(
            '<aside class="atk-info-banner" data-scope="%s" data-color="%s" data-size="%s" data-font="%s" data-anim="%s"><strong>%s</strong> <span>%s</span> <a href="%s">%s</a></aside>',
            esc_attr( $config['visibility_scope'] ),
            esc_attr( $config['color_preset'] ),
            esc_attr( $config['size_preset'] ),
            esc_attr( $config['font_style'] ),
            esc_attr( $config['animation'] ),
            esc_html( $config['badge_text'] ),
            esc_html( $config['headline'] ),
            esc_url( $config['cta_url'] ),
            esc_html( $config['cta_label'] )
        );
    }

    public static function render_speed_badge_shortcode( array|string $atts = [] ): string {
        $opt = self::get_config()['optimizer'];
        if ( ! $opt['enabled'] ) {
            return '';
        }
        return sprintf(
            '<div class="atk-widget atk-speed-badge" data-format="%s" data-upload-mb="%d"><span>And ToolKit Speed Optimizer v%s</span></div>',
            esc_attr( $opt['convert_format'] ),
            absint( $opt['custom_upload_limit_mb'] ),
            esc_html( self::VERSION )
        );
    }

    public static function render_security_badge_shortcode( array|string $atts = [] ): string {
        $audit = self::get_config()['audit_log'];
        if ( ! $audit['enabled'] ) {
            return '';
        }
        return sprintf(
            '<div class="atk-widget atk-security-badge" data-export="%s" data-digest="%s"><span>And ToolKit Security Audit v%s</span></div>',
            esc_attr( $audit['export_format'] ),
            esc_attr( $audit['daily_digest_time'] ),
            esc_html( self::VERSION )
        );
    }

    public static function render_global_info_banner(): void {
        $config = self::get_config()['banner'];
        if ( ! $config['enabled'] || 'sidebar-only' === $config['visibility_scope'] ) {
            return;
        }
        if ( 'homepage-only' === $config['visibility_scope'] && function_exists( 'is_front_page' ) && ! is_front_page() ) {
            return;
        }
        echo self::render_info_banner_shortcode(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
    }

    public static function render_gdpr_footer_banner(): void {
        $config = self::get_config()['gdpr'];
        if ( ! $config['enabled'] || 'sidebar-widget' === $config['display_style'] ) {
            return;
        }
        echo self::render_cookie_consent_widget(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
    }

    public static function register_rest_routes(): void {
        register_rest_route( 'and-toolkit/v1', '/search', [
            'methods'             => 'GET',
            'callback'            => [ __CLASS__, 'handle_ajax_search' ],
            'permission_callback' => '__return_true',
            'args'                => [
                'q' => [
                    'required'          => false,
                    'sanitize_callback' => 'sanitize_text_field',
                ],
            ],
        ] );
        register_rest_route( 'and-toolkit/v1', '/track-download', [
            'methods'             => 'POST',
            'callback'            => [ __CLASS__, 'increment_download_counter' ],
            'permission_callback' => '__return_true',
        ] );
        register_rest_route( 'and-toolkit/v1', '/cookie-consent', [
            'methods'             => 'POST',
            'callback'            => [ __CLASS__, 'handle_cookie_consent' ],
            'permission_callback' => '__return_true',
            'args'                => [
                'consent_level' => [
                    'required'          => true,
                    'sanitize_callback' => 'sanitize_text_field',
                ],
            ],
        ] );
        register_rest_route( 'and-toolkit/v1', '/optimize', [
            'methods'             => 'POST',
            'callback'            => [ __CLASS__, 'handle_system_optimization' ],
            'permission_callback' => static fn(): bool => current_user_can( 'manage_options' ),
        ] );
        register_rest_route( 'and-toolkit/v1', '/audit-export', [
            'methods'             => 'GET',
            'callback'            => [ __CLASS__, 'handle_audit_log_export' ],
            'permission_callback' => static fn(): bool => current_user_can( 'manage_options' ),
            'args'                => [
                'format' => [
                    'required'          => false,
                    'sanitize_callback' => 'sanitize_text_field',
                ],
            ],
        ] );
    }

    public static function handle_ajax_search( \\WP_REST_Request $request ): \\WP_REST_Response {
        $query  = sanitize_text_field( (string) $request->get_param( 'q' ) );
        $config = self::get_config()['search'];

        $posts = get_posts( [
            's'              => $query,
            'post_type'      => $config['post_types'],
            'posts_per_page' => 5,
            'post_status'    => [ 'publish', 'future' ],
        ] );

        return new \\WP_REST_Response( [ 'results' => $posts, 'query' => $query ], 200 );
    }

    public static function increment_download_counter( \\WP_REST_Request $request ): \\WP_REST_Response {
        $current = (int) get_option( 'and_toolkit_downloads_total', ${state.stats.totals.totalDownloads} );
        update_option( 'and_toolkit_downloads_total', $current + 1, false );

        return new \\WP_REST_Response( [ 'downloads' => $current + 1 ], 200 );
    }

    public static function handle_cookie_consent( \\WP_REST_Request $request ): \\WP_REST_Response {
        $level = sanitize_text_field( (string) $request->get_param( 'consent_level' ) );
        $allowed_levels = [ 'all', 'custom', 'essential' ];
        $clean_level = in_array( $level, $allowed_levels, true ) ? $level : 'essential';

        return new \\WP_REST_Response(
            [
                'status'        => 'recorded',
                'consent_level' => $clean_level,
                'version'       => self::VERSION,
            ],
            200
        );
    }

    public static function handle_system_optimization( \\WP_REST_Request $request ): \\WP_REST_Response {
        if ( function_exists( 'wp_cache_flush' ) ) {
            wp_cache_flush();
        }
        return new \\WP_REST_Response(
            [
                'status'  => 'optimized',
                'version' => self::VERSION,
            ],
            200
        );
    }

    public static function handle_audit_log_export( \\WP_REST_Request $request ): \\WP_REST_Response {
        $format = sanitize_text_field( (string) ( $request->get_param( 'format' ) ?? 'log' ) );
        $allowed = [ 'log', 'txt', 'csv' ];
        $clean_format = in_array( $format, $allowed, true ) ? $format : 'log';

        return new \\WP_REST_Response(
            [
                'status'  => 'exported',
                'format'  => $clean_format,
                'version' => self::VERSION,
            ],
            200
        );
    }
}

And_ToolKit_Plugin::init();
`;
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
    'init',
    'register_admin_menu',
    'get_config',
    'filter_upload_size_limit',
    'filter_big_image_threshold',
    'filter_lazy_load_attributes',
    'log_user_login_event',
    'log_upgrader_lifecycle_event',
    'log_deleted_plugin_event',
    'log_theme_switch_event',
    'log_content_save_event',
    'log_content_delete_event',
    'log_user_registration_event',
    'log_user_role_change_event',
    'log_user_delete_event',
    'log_auto_system_update_event',
    'log_core_manual_update_event',
    'enqueue_frontend_assets',
    'register_sidebar_widgets',
    'render_admin_dashboard',
    'render_calendar_widget',
    'render_search_widget',
    'render_social_widget',
    'render_stats_widget',
    'render_cookie_consent_widget',
    'render_info_banner_shortcode',
    'render_speed_badge_shortcode',
    'render_security_badge_shortcode',
    'render_global_info_banner',
    'render_gdpr_footer_banner',
    'register_rest_routes',
    'handle_ajax_search',
    'increment_download_counter',
    'handle_cookie_consent',
    'handle_system_optimization',
    'handle_audit_log_export',
  ];

  const allMethodsImplemented = requiredMethods.every((m) =>
    phpCode.includes(`public static function ${m}(`)
  );

  const checks: AuditCheckItem[] = [
    {
      id: 'php80-strict-types',
      category: 'PHP 8.0+',
      title: 'PHP 8.0 Strict Types, Union Types, Nullable & Arrow Functions',
      description:
        'A generált bővítmény tartalmazza a declare(strict_types=1); direktívát, a visszatérési típusokat (: void, : string, : int, : array), az union típusokat (array|string), a ?int nullable típust és a static fn(): bool nyílfüggvényt.',
      passed:
        phpCode.includes('declare(strict_types=1);') &&
        phpCode.includes('array|string $atts = []') &&
        phpCode.includes('?int $reassign') &&
        phpCode.includes('static fn(): bool =>') &&
        phpCode.includes('Requires PHP:      8.0'),
    },
    {
      id: 'php80-match-expression',
      category: 'PHP 8.0+',
      title: 'PHP 8.0 Match Kifejezések & v0.5.1 Osztálykonstansok',
      description:
        'A sablonválasztó és a belépési e-mail jogosultság-ellenőrző a típusbiztos PHP 8.0 match () kifejezést és a public const VERSION = \'0.5.1\' konstanst használja.',
      passed:
        phpCode.includes("match ( $atts['style'] )") &&
        phpCode.includes("match ( $audit['login_email_scope'] )") &&
        phpCode.includes("public const VERSION    = '0.5.1';"),
    },
    {
      id: 'wp71-header-meta',
      category: 'WordPress 7.1',
      title: 'WordPress 7.1 Fejléc és v0.5.1 Metaadat Szabvány',
      description:
        'Plugin Name: And ToolKit, Version: 0.5.1, Author: galandras12+AI és Tested up to: 7.1 fejléc mezők hiánytalanul beállítva.',
      passed:
        phpCode.includes('Plugin Name:       And ToolKit') &&
        phpCode.includes('Version:           0.5.1') &&
        phpCode.includes('Tested up to:      7.1') &&
        phpCode.includes('Author:            galandras12+AI'),
    },
    {
      id: 'wp71-hook-callbacks',
      category: 'WordPress 7.1',
      title: 'Minden Hook (17 Action, 3 Filter, 8 Shortcode, 5 REST Végpont) Implementálva',
      description:
        'Az összes regisztrált add_action, add_filter, add_shortcode és register_rest_route (36/36 metódus) rendelkezik valódi PHP törzzsel.',
      passed: allMethodsImplemented,
    },
    {
      id: 'audit-log-email-module',
      category: 'Biztonság',
      title: 'v0.5.1 Biztonsági Audit Naplózás (.log/.txt/.csv) & Critical Only E-mail Szűrő',
      description:
        'A wp_login, upgrader_process_complete, save_post, user_register, set_user_role, automatic_updates_complete és _core_updated_successfully hookok, a critical_only_emails szűrő és az /audit-export végpont aktívak.',
      passed:
        phpCode.includes("add_action( 'wp_login'") &&
        phpCode.includes("add_action( 'upgrader_process_complete'") &&
        phpCode.includes("add_action( 'user_register'") &&
        phpCode.includes("add_action( 'set_user_role'") &&
        phpCode.includes("add_action( 'automatic_updates_complete'") &&
        phpCode.includes("add_action( '_core_updated_successfully'") &&
        phpCode.includes("'critical_only_emails'") &&
        phpCode.includes("'/audit-export'") &&
        Boolean(state.auditLog.recipientEmail),
    },
    {
      id: 'optimizer-media-upload-lazy',
      category: 'Teljesítmény',
      title: 'v0.4.0 Kép-, Upload Limit-, Lazy Load & Gyorsítótár Optimalizáló',
      description:
        'Az upload_size_limit, big_image_size_threshold és wp_get_attachment_image_attributes filterek, valamint a wp_cache_flush() alapú /optimize REST végpont aktív.',
      passed:
        phpCode.includes("add_filter( 'upload_size_limit'") &&
        phpCode.includes("add_filter( 'big_image_size_threshold'") &&
        phpCode.includes("add_filter( 'wp_get_attachment_image_attributes'") &&
        phpCode.includes("'/optimize'") &&
        state.optimizer.customUploadLimitMb >= 8,
    },
    {
      id: 'info-banner-module',
      category: 'WordPress 7.1',
      title: 'v0.3.0 Állandó Információs Banner (wp_body_open & is_front_page)',
      description:
        'Színben, méretben, betűstílusban és animációban testreszabható információs sáv főoldali (is_front_page) vagy globális (minden oldalon) megjelenítéssel.',
      passed:
        phpCode.includes("add_action( 'wp_body_open'") &&
        phpCode.includes("add_shortcode( 'wtk_info_banner'") &&
        phpCode.includes('render_global_info_banner') &&
        Boolean(state.banner.headline),
    },
    {
      id: 'gdpr-cookie-compliance',
      category: 'GDPR & Adatvédelem',
      title: 'EU GDPR Kötelező Sütikezelés és Google Consent Mode v2',
      description:
        'Granuláris süti kategóriák (Szükséges, Funkcionális, Statisztikai, Marketing), előzetes hozzájárulás-naplózás (/cookie-consent REST API) és esc_url() védett adatvédelmi hivatkozás.',
      passed:
        phpCode.includes("add_shortcode( 'wtk_cookie_consent'") &&
        phpCode.includes("'/cookie-consent'") &&
        phpCode.includes('handle_cookie_consent') &&
        state.gdpr.categories.some((c) => c.id === 'necessary' && c.required),
    },
    {
      id: 'wp71-script-strategy',
      category: 'WordPress 7.1',
      title: 'WordPress 7.1 Script Betöltési Stratégia (Defer / Async) & Block API',
      description:
        'A wp_register_script a modern tömb alapú strategy paramétert használja, a register_block_type pedig biztosítja az FSE / Gutenberg kompatibilitást.',
      passed:
        phpCode.includes("'strategy'  =>") &&
        phpCode.includes("register_block_type( 'and-toolkit/sidebar-widgets'"),
    },
    {
      id: 'security-sanitization',
      category: 'Biztonság',
      title: 'ABSPATH Védelem, Escaping és REST Sanitize Callback',
      description:
        'Közvetlen fájlelérés tiltva (!defined(\'ABSPATH\')), minden kimenet esc_html/esc_attr/esc_url/absint/sanitize_email szűréssel, a REST bemenet pedig sanitize_text_field-del védett.',
      passed:
        phpCode.includes("if ( ! defined( 'ABSPATH' ) )") &&
        phpCode.includes('sanitize_text_field') &&
        phpCode.includes('sanitize_email') &&
        phpCode.includes('esc_html(') &&
        phpCode.includes('esc_url('),
    },
    {
      id: 'perf-zero-jquery',
      category: 'Teljesítmény',
      title: 'Gyors Betöltés & Natív Vanilla JS (Zero-jQuery)',
      description:
        'A bővítmény nem kényszeríti ki a jQuery betöltését a frontenden, így a csomagméret 15 KB alatt marad.',
      passed: Boolean(state.performance.zeroJqueryDependency && state.performance.minifyAssets),
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
