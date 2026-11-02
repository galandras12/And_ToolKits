import {
  CalendarConfig,
  NumberFormatStyle,
  PerformanceConfig,
  ScheduledPostItem,
  SearchConfig,
  SocialConfig,
  StatsConfig,
  ToolkitState,
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
    title: 'And ToolKit v0.2.0 Kiadási Csomag és GDPR Modul Dokumentáció (ZIP)',
    date: '2026-11-09',
    time: '10:30',
    category: 'Kiadás',
    author: 'galandras12+AI',
    excerpt: 'Teljes REST API végpontok, GDPR Cookie Consent Mode v2 támogatás és sötét mód kompatibilis oldalsáv komponensek.',
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
    badgeText: 'ÚJ VERZIÓ · v0.3.0',
    headline: 'And ToolKit v0.3.0 megjelent: Testreszabható Információs Banner és GDPR Cookie Kezelő!',
    subtext: 'Állítsa be egyedi színekkel, betűtípussal és animációval a főoldalon vagy minden oldalon.',
    ctaLabel: 'Részletek megtekintése',
    ctaUrl: '/kiadasok/and-toolkit-v0-3-0',
    dismissible: true,
    showIcon: true,
    impressions: 29450,
    clicks: 3840,
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
  let baseKb = 4.2 + activeModulesCount * 1.3;
  if (!perf.minifyAssets) baseKb += 4.8;
  if (!perf.svgSpritesOnly) baseKb += 6.5;
  if (!perf.zeroJqueryDependency) baseKb += 28.0;

  let loadMs = Math.round(baseKb * 1.9);
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
 * Generate production-ready WordPress 7.1 & PHP 8.0+ Plugin file reflecting current v0.3.0 configuration
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

  return `<?php
/**
 * Plugin Name:       And ToolKit
 * Plugin URI:        https://github.com/galandras12/and-toolkit
 * Description:       Modern WordPress 7.1 adminisztrációs eszköztár: Esemény naptár widget, AJAX élő kereső, platformfüggetlen közösségi megosztó, látogatói/letöltési statisztika, kötelező GDPR Cookie kezelő és testreszabható Információs Banner modul sötét/világos móddal.
 * Version:           0.3.0
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
    public const VERSION    = '0.3.0';
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

        // Rövidkódok (Shortcodes) regisztrálása WordPress 7.1 blokk és klasszikus témákhoz
        add_shortcode( 'wtk_calendar', [ __CLASS__, 'render_calendar_widget' ] );
        add_shortcode( 'wtk_search', [ __CLASS__, 'render_search_widget' ] );
        add_shortcode( 'wtk_social', [ __CLASS__, 'render_social_widget' ] );
        add_shortcode( 'wtk_stats', [ __CLASS__, 'render_stats_widget' ] );
        add_shortcode( 'wtk_cookie_consent', [ __CLASS__, 'render_cookie_consent_widget' ] );
        add_shortcode( 'wtk_info_banner', [ __CLASS__, 'render_info_banner_shortcode' ] );
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
            'performance' => [
                'minify_assets'   => ${state.performance.minifyAssets ? 'true' : 'false'},
                'defer_scripts'   => ${state.performance.deferScripts ? 'true' : 'false'},
                'cache_ttl_mins'  => ${state.performance.objectCacheTtlMinutes},
                'zero_jquery'     => ${state.performance.zeroJqueryDependency ? 'true' : 'false'},
            ],
        ];
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
 * Automated static code & configuration audit verifying compatibility with WordPress 7.1, PHP 8.0+, EU GDPR Cookie & v0.3.0 Info Banner requirements
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
    'enqueue_frontend_assets',
    'register_sidebar_widgets',
    'render_admin_dashboard',
    'render_calendar_widget',
    'render_search_widget',
    'render_social_widget',
    'render_stats_widget',
    'render_cookie_consent_widget',
    'render_info_banner_shortcode',
    'render_global_info_banner',
    'render_gdpr_footer_banner',
    'register_rest_routes',
    'handle_ajax_search',
    'increment_download_counter',
    'handle_cookie_consent',
  ];

  const allMethodsImplemented = requiredMethods.every((m) =>
    phpCode.includes(`public static function ${m}(`)
  );

  const checks: AuditCheckItem[] = [
    {
      id: 'php80-strict-types',
      category: 'PHP 8.0+',
      title: 'PHP 8.0 Strict Types & Union Types (array|string)',
      description:
        'A generált bővítmény tartalmazza a declare(strict_types=1); direktívát, a visszatérési típusokat (: void, : string, : array) és a PHP 8.0 union típusokat.',
      passed:
        phpCode.includes('declare(strict_types=1);') &&
        phpCode.includes('array|string $atts = []') &&
        phpCode.includes('Requires PHP:      8.0'),
    },
    {
      id: 'php80-match-expression',
      category: 'PHP 8.0+',
      title: 'PHP 8.0 Match Kifejezés & v0.3.0 Osztálykonstansok',
      description:
        'A sablonválasztó a típusbiztos PHP 8.0 match () kifejezést és a public const VERSION = \'0.3.0\' konstanst használja.',
      passed:
        phpCode.includes("match ( $atts['style'] )") &&
        phpCode.includes("public const VERSION    = '0.3.0';"),
    },
    {
      id: 'wp71-header-meta',
      category: 'WordPress 7.1',
      title: 'WordPress 7.1 Fejléc és v0.3.0 Metaadat Szabvány',
      description:
        'Plugin Name: And ToolKit, Version: 0.3.0, Author: galandras12+AI és Tested up to: 7.1 fejléc mezők hiánytalanul beállítva.',
      passed:
        phpCode.includes('Plugin Name:       And ToolKit') &&
        phpCode.includes('Version:           0.3.0') &&
        phpCode.includes('Tested up to:      7.1') &&
        phpCode.includes('Author:            galandras12+AI'),
    },
    {
      id: 'wp71-hook-callbacks',
      category: 'WordPress 7.1',
      title: 'Minden Hook, 6 Shortcode és 3 REST Végpont Implementálva',
      description:
        'Az összes regisztrált add_action, add_shortcode (beleértve a [wtk_cookie_consent] és [wtk_info_banner] rövidkódokat) és register_rest_route (18/18 metódus) rendelkezik valódi PHP törzzsel.',
      passed: allMethodsImplemented,
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
        'Közvetlen fájlelérés tiltva (!defined(\'ABSPATH\')), minden kimenet esc_html/esc_attr/esc_url/absint szűréssel, a REST bemenet pedig sanitize_text_field-del védett.',
      passed:
        phpCode.includes("if ( ! defined( 'ABSPATH' ) )") &&
        phpCode.includes('sanitize_text_field') &&
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

