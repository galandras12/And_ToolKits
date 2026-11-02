export type ThemeMode = 'light' | 'dark';

export type ActiveTab =
  | 'overview'
  | 'calendar'
  | 'search'
  | 'social'
  | 'stats'
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
  performance: PerformanceConfig;
  posts: ScheduledPostItem[];
}
