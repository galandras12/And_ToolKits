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
  performance: PerformanceConfig;
  posts: ScheduledPostItem[];
}


