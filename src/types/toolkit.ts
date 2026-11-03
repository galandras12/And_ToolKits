export type ThemeMode = 'light' | 'dark';

export type ActiveTab =
  | 'overview'
  | 'calendar'
  | 'search'
  | 'social'
  | 'stats'
  | 'gdpr'
  | 'banner'
  | 'optimizer'
  | 'audit-log'
  | 'captcha'
  | 'auth'
  | 'wp-hide'
  | 'export';

export type CalendarWidgetStyle = 'compact' | 'cards' | 'grid' | 'timeline';

export interface ScheduledPostItem {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  category: 'Konferencia' | 'Webinárium' | 'Kiadás' | 'Workshop' | 'Hír';
  author: string;
  excerpt: string;
  postType: 'post' | 'event' | 'page' | 'download';
  views: number;
  downloads?: number;
  featured: boolean;
}

export interface CalendarConfig {
  enabled: boolean;
  widgetTitle: string;
  style: CalendarWidgetStyle;
  maxItems: number;
  categoryFilter: string; // 'all' or specific category
  showCategory: boolean;
  showTime: boolean;
  showExcerpt: boolean;
  showCountdown: boolean;
  accentColor: 'blue' | 'emerald' | 'amber' | 'rose' | 'slate';
}

export type SearchWidgetLayout = 'minimal' | 'detailed' | 'compact-cards';

export interface SearchConfig {
  enabled: boolean;
  widgetTitle: string;
  placeholder: string;
  layout: SearchWidgetLayout;
  liveAjax: boolean;
  debounceMs: number;
  maxResults: number;
  includedTypes: Array<'post' | 'event' | 'page' | 'download'>;
  showThumbnail: boolean;
  showCategory: boolean;
  showDate: boolean;
  showExcerpt: boolean;
  highlightMatches: boolean;
  showPopularTags: boolean;
  popularTags: string[];
}

export type SocialPlatformId =
  | 'facebook'
  | 'x'
  | 'linkedin'
  | 'whatsapp'
  | 'telegram'
  | 'reddit'
  | 'pinterest'
  | 'email';

export type SocialButtonStyle = 'pill' | 'rounded' | 'square' | 'icon-only' | 'minimal-outline';

export interface SocialPlatformItem {
  id: SocialPlatformId;
  name: string;
  enabled: boolean;
  shareCount: number;
  brandHex: string;
}

export interface SocialConfig {
  enabled: boolean;
  widgetTitle: string;
  subtitle: string;
  buttonStyle: SocialButtonStyle;
  columns: 1 | 2 | 4;
  showShareCounts: boolean;
  showTotalShares: boolean;
  includeCopyLink: boolean;
  utmTracking: boolean;
  useBrandColors: boolean;
  platforms: SocialPlatformItem[];
}

export type StatsWidgetStyle = 'grid-cards' | 'clean-list' | 'horizontal-strip' | 'featured-hero';
export type NumberFormatStyle = 'compact' | 'exact' | 'comma';

export interface DailyMetricPoint {
  date: string;
  label: string;
  uniqueVisitors: number;
  pageViews: number;
  downloads: number;
  shares: number;
  searches: number;
}

export interface StatsConfig {
  enabled: boolean;
  widgetTitle: string;
  style: StatsWidgetStyle;
  numberFormat: NumberFormatStyle;
  showUniqueVisitors: boolean;
  showTotalDownloads: boolean;
  showActiveReaders: boolean;
  showShareConversions: boolean;
  showSearchEfficiency: boolean;
  showTrendDelta: boolean;
  showSparkline: boolean;
  customBadgeText: string;
  accentTheme: 'blue' | 'emerald' | 'amber' | 'slate';
  totals: {
    uniqueVisitors: number;
    totalDownloads: number;
    activeReaders: number;
    shareConversions: number;
    searchSuccessRate: number;
  };
  history: DailyMetricPoint[];
}

export type GdprDisplayStyle = 'sidebar-widget' | 'bottom-bar' | 'floating-card' | 'modal-center';
export type GdprCategoryId = 'necessary' | 'preferences' | 'analytics' | 'marketing';

export interface GdprCategoryItem {
  id: GdprCategoryId;
  name: string;
  description: string;
  cookiesUsed: string;
  required: boolean;
  defaultEnabled: boolean;
}

export interface GdprConfig {
  enabled: boolean;
  widgetTitle: string;
  description: string;
  displayStyle: GdprDisplayStyle;
  privacyPolicyUrl: string;
  consentExpiryDays: number;
  acceptAllLabel: string;
  rejectLabel: string;
  savePreferencesLabel: string;
  googleConsentModeV2: boolean;
  autoBlockScripts: boolean;
  showCategoryDetails: boolean;
  showReopenBadge: boolean;
  categories: GdprCategoryItem[];
  consentStats: {
    acceptedAll: number;
    customSelection: number;
    essentialOnly: number;
  };
}

export type BannerVisibilityScope = 'all-pages' | 'homepage-only' | 'blog-posts' | 'sidebar-only';
export type BannerColorPreset =
  | 'cobalt-gradient'
  | 'emerald-aurora'
  | 'amber-highlight'
  | 'rose-alert'
  | 'slate-obsidian'
  | 'custom';
export type BannerSizePreset = 'compact' | 'standard' | 'large-hero';
export type BannerFontStyle = 'sans-clean' | 'display-bold' | 'serif-editorial' | 'mono-tech';
export type BannerAnimationType = 'none' | 'pulse-glow' | 'slide-down' | 'shimmer' | 'marquee';

export interface BannerConfig {
  enabled: boolean;
  visibilityScope: BannerVisibilityScope;
  stickyTop: boolean;
  colorPreset: BannerColorPreset;
  customBgHex: string;
  customTextHex: string;
  sizePreset: BannerSizePreset;
  fontStyle: BannerFontStyle;
  animation: BannerAnimationType;
  badgeText: string;
  headline: string;
  subtext: string;
  ctaLabel: string;
  ctaUrl: string;
  dismissible: boolean;
  showIcon: boolean;
  impressions: number;
  clicks: number;
}

export type ImageTargetFormat = 'webp' | 'avif' | 'original';
export type LazyPlaceholderStyle = 'blurhash' | 'dominant-color' | 'shimmer-skeleton' | 'none';
export type AutoOptimizeSchedule = 'realtime-upload' | 'hourly-cron' | 'daily-cron' | 'manual-only';

export interface MediaOptimizationItem {
  id: string;
  fileName: string;
  originalFormat: 'JPG' | 'PNG';
  targetFormat: 'WebP' | 'AVIF' | 'JPG';
  originalDimensions: string;
  resizedDimensions: string;
  originalSizeKb: number;
  optimizedSizeKb: number;
  status: 'optimized' | 'pending';
}

export interface OptimizerConfig {
  enabled: boolean;
  showSidebarSpeedBadge: boolean;
  // 1. Automatic vs Manual Mode
  autoOptimizeEnabled: boolean;
  autoSchedule: AutoOptimizeSchedule;
  lastOptimizedAt: string;
  totalOptimizationRuns: number;
  // 2. Image Compression, Format Conversion & Resizing
  imageCompressionEnabled: boolean;
  compressionQuality: number; // 40 - 98
  convertFormat: ImageTargetFormat;
  autoResizeEnabled: boolean;
  maxWidthPx: number;
  maxHeightPx: number;
  stripExifMetadata: boolean;
  keepOriginalBackup: boolean;
  mediaQueue: MediaOptimizationItem[];
  // 3. WordPress File Upload Limit Override
  overrideUploadLimit: boolean;
  defaultWpUploadLimitMb: number;
  customUploadLimitMb: number;
  maxExecutionTimeSec: number;
  allowSvgAndAvifUpload: boolean;
  // 4. Comprehensive Lazy Loading
  lazyLoadImages: boolean;
  lazyLoadIframesAndVideos: boolean;
  lazyLoadBackgrounds: boolean;
  excludeAboveFoldCount: number;
  fetchPriorityHighOnLcp: boolean;
  lazyPlaceholder: LazyPlaceholderStyle;
  // 5. Cache Management & Speed Measurement
  pageCacheEnabled: boolean;
  browserCacheTtlHours: number;
  gzipBrotliEnabled: boolean;
  currentCacheSizeMb: number;
  lastCachePurgedAt: string;
  speedMetrics: {
    ttfbMs: number;
    lcpMs: number;
    clsScore: string;
    pageSpeedScore: number;
    totalSavedMb: number;
  };
}

// ============================================================================
// v0.5.0: 08. Biztonsági Naplózás & E-mail Értesítés Modul (Audit Log & Email)
// ============================================================================

export type AuditEventCategory =
  | 'user_login'
  | 'plugin_lifecycle'
  | 'theme_lifecycle'
  | 'post_lifecycle'
  | 'page_lifecycle'
  | 'user_lifecycle'
  | 'auto_system_update'
  | 'core_manual_update'
  | 'filesystem_change'
  | 'bot_protection'
  | 'auth_security'
  | 'wp_hide_shield';

export type WpUserRole =
  | 'administrator'
  | 'editor'
  | 'author'
  | 'contributor'
  | 'subscriber';

export type UserCreationMethod =
  | 'registration-form'
  | 'user-invitation'
  | 'admin-created'
  | 'role-changed'
  | 'user-deleted';

export type LoginNotificationScope = 'all-users' | 'editors-only' | 'admins-only';

export type AuditLogExportFormat = 'log' | 'txt' | 'csv';

export interface AuditLogEntry {
  id: string;
  timestamp: string; // YYYY-MM-DD HH:mm:ss
  category: AuditEventCategory;
  actionLabel: string; // e.g. 'Bejelentkezés', 'Plugin frissítés', 'Felhasználó létrehozás (Meghívóval)'
  actorUser: string; // e.g. 'galandras12', 'szabo.dora', 'WP-Cron Automatikus Rendszer'
  actorRole: WpUserRole | 'system';
  targetObject: string; // e.g. 'WooCommerce', 'Astra Pro Téma', 'Kapcsolat oldal', 'WP Core 7.1.0'
  details: string; // Detailed description including versions, role changes, or creation method
  previousVersion?: string;
  newVersion?: string;
  userCreationMethod?: UserCreationMethod;
  ipLocation?: string;
  deviceBrowser?: string;
  isNewDeviceOrLocation?: boolean;
  severity: 'info' | 'warning' | 'critical';
}

export interface PendingUpdateItem {
  id: string;
  componentType: 'plugin' | 'theme' | 'core';
  name: string;
  currentVersion: string;
  newVersion: string;
  detectedAt: string;
  autoUpdatedInLast24h: boolean;
}

export interface AuditLogConfig {
  enabled: boolean;
  showSidebarAuditWidget: boolean;
  recipientEmail: string;
  // v0.5.1: 'Critical Only' email filter toggle (high-impact events: core WP updates or file system changes)
  criticalOnlyEmails: boolean;
  // Granular logging switches for all 8 required audit categories
  logUserLogins: boolean;
  logPluginChanges: boolean;
  logThemeChanges: boolean;
  logPostChanges: boolean;
  logPageChanges: boolean;
  logUserLifecycle: boolean;
  logAutoSystemUpdates: boolean;
  logCoreManualUpdates: boolean;
  // Export preferences
  defaultExportFormat: AuditLogExportFormat;
  retentionDays: number;
  // 1. Login Email Notifications
  loginEmailEnabled: boolean;
  loginEmailScope: LoginNotificationScope;
  // 2. New Location / New Device Login Alert for optional user groups
  newDeviceLocationEmailEnabled: boolean;
  newDeviceTargetRoles: WpUserRole[];
  // 3. Available Update Email Alert (Plugin / Theme / Core with current -> new version)
  updateAvailableEmailEnabled: boolean;
  notifyPluginUpdates: boolean;
  notifyThemeUpdates: boolean;
  notifyCoreUpdates: boolean;
  // 4. Daily Digest Email at custom time for 24h automatic updates
  dailyDigestEnabled: boolean;
  dailyDigestTime: string; // HH:mm e.g. '08:00'
  lastDigestSentAt: string;
  emailsSentTotal: number;
  entries: AuditLogEntry[];
  pendingUpdates: PendingUpdateItem[];
}

// ============================================================================
// v0.6.0: 09. Botvédelem: Google reCAPTCHA v3 & Cloudflare Turnstile Modul
// ============================================================================

export type CaptchaProvider = 'recaptcha-v3' | 'turnstile';
export type TurnstileWidgetMode = 'managed' | 'non-interactive' | 'invisible';
export type TurnstileTheme = 'auto' | 'light' | 'dark';

export interface CaptchaConfig {
  enabled: boolean;
  provider: CaptchaProvider;
  recaptchaSiteKey: string;
  recaptchaSecretKey: string;
  turnstileSiteKey: string;
  turnstileSecretKey: string;
  // Észlelési érzékenység / küszöbérték (0.1 = megengedő ... 0.9 = maximális szigorúság)
  scoreThreshold: number;
  turnstileMode: TurnstileWidgetMode;
  turnstileTheme: TurnstileTheme;
  // Védett WordPress űrlapok és végpontok
  protectLogin: boolean;
  protectRegister: boolean;
  protectLostPassword: boolean;
  protectComments: boolean;
  protectRestEndpoints: boolean;
  bypassLoggedInAdmins: boolean;
  logBlockedAttempts: boolean;
  showSidebarBadge: boolean;
  stats: {
    verifiedHumans: number;
    blockedBots: number;
    lastBlockedIp: string;
    lastBlockedScore: number;
  };
}

// ============================================================================
// v0.7.0: 10. Hitelesítés Modul (2FA TOTP, Időszinkron, Passkey, E-mail OTP,
// Offline Mentett Kódok, Frissítés-védelem, Rang Mátrix, Shortcode, IP Whitelist)
// ============================================================================

export type AuthMethodId = 'totp' | 'passkey' | 'email' | 'offline';
export type RoleAuthPolicy = 'required' | 'optional' | 'disabled';

export type RoleAuthMatrix = Record<WpUserRole, Record<AuthMethodId, RoleAuthPolicy>>;

export interface PasskeyCredentialItem {
  id: string;
  label: string;
  deviceType: string;
  createdAt: string;
  lastUsedAt: string;
  credentialIdPreview: string;
}

export interface OfflineSavedPasswordItem {
  id: string;
  codePreview: string;
  passwordHash: string;
  label: string;
  createdAt: string;
  used: boolean;
}

export interface AuthConfig {
  enabled: boolean;
  // 1. Hitelesítő szolgáltatások (2FA TOTP, Passkey, E-mail, Offline mentett jelszó/kód)
  totpEnabled: boolean;
  totpIssuer: string;
  totpSecretKey: string;
  totpDigits: 6;
  totpPeriodSeconds: 30;
  passkeyEnabled: boolean;
  passkeyRpId: string;
  passkeyUserVerification: 'required' | 'preferred';
  passkeyCredentials: PasskeyCredentialItem[];
  emailAuthEnabled: boolean;
  emailOtpExpiryMinutes: number;
  offlinePasswordsEnabled: boolean;
  offlineSavedItems: OfflineSavedPasswordItem[];
  // 2. Szerver és kliens idő elcsúszás korrekció & készülék szinkronizálás
  timeDriftCorrectionEnabled: boolean;
  timeOffsetSeconds: number; // +/- másodperc eltolás a szerver és kliens között
  manualServerTimeIso: string; // Manuálisan beállított pontos dátum és idő (YYYY-MM-DD HH:mm:ss)
  lastSyncedWithDeviceAt: string;
  toleranceWindows: number; // +/- hány 30mp-es ablakot fogadjon el (1..4)
  // 3. Frissítés-biztos adattárolás (Plugin update során nem vesznek el a kódok)
  preserveCredentialsOnUpdate: boolean;
  storageSchemaVersion: string;
  lastBackupSnapshotAt: string;
  // 4. Rangonként (szerepkörönként) külön meghatározható szabályok (Kötelező / Opcionális / Tiltott)
  roleMatrix: RoleAuthMatrix;
  // 5. Shortcode alapú frontend önkiszolgáló felület (wp-admin belépés nélkül)
  enableFrontendShortcode: boolean;
  shortcodeTag: string; // '[wtk_auth_manager]'
  shortcodePageSlug: string;
  allowUserMethodSwitch: boolean;
  // 6. Fehér listás IP címek (nem kéri a hitelesítő használatát)
  whitelistedIps: string[];
  showSidebarAuthWidget: boolean;
}

// ============================================================================
// v0.7.0: 11. WP Rejtés Modul (URL álcázás, Egyéni Login/Shortcode, AJAX Buborék
// Login, Csak Bejelentkezettek Mód forráskód-védelemmel, Felhasználónév/E-mail
// elrejtés, Titkosított Mesterjelszó admin betekintéssel és IP Fehérlistával)
// ============================================================================

export type BubblePosition = 'bottom-right' | 'bottom-left';

export interface WpHideConfig {
  enabled: boolean;
  // 1. WordPress URL-ek és ujjlenyomatok elrejtése robotok elől
  hideWpPaths: boolean;
  customContentSlug: string; // pl. 'assets-media' (wp-content helyett)
  customIncludesSlug: string; // pl. 'core-lib' (wp-includes helyett)
  customUploadsSlug: string; // pl. 'files'
  hideWpJsonEndpoint: boolean;
  customRestPrefix: string; // pl. 'api-portal' (wp-json helyett)
  stripWpVersionMeta: boolean;
  blockAuthorScanning: boolean;
  blockReadmeAndLicense: boolean;
  // 2. wp-login.php és wp-admin elrejtése + saját URL vagy Shortcode
  hideDefaultLoginAndAdmin: boolean;
  customLoginSlug: string; // pl. 'kapu-belepes'
  customAdminRedirectSlug: string; // pl. '404-nem-talalhato'
  enableLoginShortcode: boolean;
  loginShortcodeTag: string; // '[wtk_custom_login]'
  // 3. AJAX alapú buborék bejelentkező widget az oldalon
  enableAjaxBubbleLogin: boolean;
  bubblePosition: BubblePosition;
  bubbleButtonLabel: string;
  bubbleTitle: string;
  // 4. Kizárólag bejelentkezett felhasználók számára hozzáférési mód (teljes forráskód-védelemmel)
  membersOnlyMode: boolean;
  membersOnlyOverlayTitle: string;
  membersOnlyOverlayMessage: string;
  protectPagesPostsAndMedia: boolean;
  stripHtmlSourceForGuests: boolean; // Kódból (view-source) sem olvasható ki a tartalom
  // 5. Felhasználónevek és e-mail címek elrejtése kommentek és bejegyzések felületén
  hideUsernamesAndEmails: boolean;
  maskPostAuthorLogin: boolean;
  maskCommentAuthorEmailAndLogin: boolean;
  maskRestUsersEndpoint: boolean;
  authorAliasPattern: string; // pl. 'Szerző #ID' vagy megjelenítési álnév
  // 6. Egységes Mesterjelszó védelem (Titkosítva tárolva + Adminoknak megtekinthető + IP Fehérlista)
  masterPasswordEnabled: boolean;
  masterPasswordCipher: string; // AES-256 / HMAC-XOR titkosított tárolt érték (kódból nem olvasható ki)
  masterPasswordHash: string; // SHA-256 ellenőrző hash
  masterPasswordSessionHours: number;
  masterPasswordWhitelistedIps: string[];
  showSidebarHideBadge: boolean;
}

export interface PerformanceConfig {
  minifyAssets: boolean;
  deferScripts: boolean;
  svgSpritesOnly: boolean;
  objectCacheTtlMinutes: number;
  zeroJqueryDependency: boolean;
}

export interface ToolkitState {
  theme: ThemeMode;
  previewThemeSync: boolean;
  previewDevice: 'desktop' | 'mobile';
  calendar: CalendarConfig;
  search: SearchConfig;
  social: SocialConfig;
  stats: StatsConfig;
  gdpr: GdprConfig;
  banner: BannerConfig;
  optimizer: OptimizerConfig;
  auditLog: AuditLogConfig;
  captcha: CaptchaConfig;
  auth: AuthConfig;
  wpHide: WpHideConfig;
  performance: PerformanceConfig;
  posts: ScheduledPostItem[];
}
