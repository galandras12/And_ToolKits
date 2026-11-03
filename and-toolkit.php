<?php
/**
 * Plugin Name:       And ToolKit
 * Plugin URI:        https://github.com/galandras12/And_ToolKits
 * Description:       WordPress adminisztrációs eszköztár: Esemény naptár, AJAX élő kereső, közösségi megosztó, látogatói/letöltési statisztika, GDPR süti-kezelő (Consent Mode v2), információs banner, kép/upload/lazy-load/cache optimalizáló, biztonsági audit napló e-mail értesítővel (Critical Only szűrővel), Google reCAPTCHA v3 & Cloudflare Turnstile botvédelem, kétfaktoros hitelesítés (TOTP + visszaállító kódok), valamint WP Rejtés (verzió-elrejtés, felderítés-tiltás, maszkolás, csak tagoknak mód, mesterjelszó kapu, AJAX belépő buborék).
 * Version:           0.7.1
 * Requires at least: 6.3
 * Tested up to:      7.1
 * Requires PHP:      8.0
 * Author:            galandras12+AI
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       and-toolkit
 * Domain Path:       /languages
 */

declare(strict_types=1);

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

final class And_ToolKit_Plugin {
    public const VERSION     = '0.7.1';
    public const AUTHOR      = 'galandras12+AI';
    public const WP_TARGET   = '7.1';
    public const PHP_TARGET  = '8.0';
    public const OPTION_KEY  = 'and_toolkit_settings';
    public const DB_VERSION  = '2';
    public const CRON_HOOK   = 'and_toolkit_hourly';
    public const REST_NS     = 'and-toolkit/v1';

    private static ?array $config_cache = null;

    // ========================================================================
    // BOOTSTRAP
    // ========================================================================

    public static function init(): void {
        register_activation_hook( __FILE__, [ __CLASS__, 'activate' ] );
        register_deactivation_hook( __FILE__, [ __CLASS__, 'deactivate' ] );
        register_uninstall_hook( __FILE__, [ __CLASS__, 'uninstall' ] );

        add_action( 'init', [ __CLASS__, 'on_init' ] );
        add_action( 'admin_menu', [ __CLASS__, 'register_admin_menu' ] );
        add_action( 'admin_init', [ __CLASS__, 'register_settings' ] );
        add_action( 'admin_post_and_toolkit_export', [ __CLASS__, 'handle_admin_export' ] );
        add_action( 'admin_post_and_toolkit_optimize', [ __CLASS__, 'handle_admin_optimize' ] );
        add_action( 'add_meta_boxes', [ __CLASS__, 'register_event_meta_box' ] );
        add_action( 'save_post', [ __CLASS__, 'save_event_meta' ] );
        add_action( 'update_option_' . self::OPTION_KEY, [ __CLASS__, 'flush_config_cache' ] );
        add_action( 'wp_enqueue_scripts', [ __CLASS__, 'enqueue_frontend_assets' ] );
        add_action( 'wp_head', [ __CLASS__, 'print_consent_mode_defaults' ], 1 );
        add_action( 'wp_body_open', [ __CLASS__, 'render_global_info_banner' ] );
        add_action( 'wp_footer', [ __CLASS__, 'render_gdpr_footer_banner' ] );
        add_action( 'rest_api_init', [ __CLASS__, 'register_rest_routes' ] );
        add_action( self::CRON_HOOK, [ __CLASS__, 'run_hourly_tasks' ] );
        add_action( 'template_redirect', [ __CLASS__, 'start_page_cache' ], 0 );
        foreach ( [ 'wp_update_nav_menu', 'customize_save_after', 'comment_post', 'wp_set_comment_status', 'update_option_sidebars_widgets', 'created_term', 'edited_term', 'delete_term' ] as $invalidating_hook ) {
            add_action( $invalidating_hook, [ __CLASS__, 'flush_page_cache' ] );
        }

        // Kép-, Upload Limit-, Lazy Load és Gyorsítótár Optimalizáló
        add_filter( 'upload_size_limit', [ __CLASS__, 'filter_upload_size_limit' ], 999 );
        add_filter( 'big_image_size_threshold', [ __CLASS__, 'filter_big_image_threshold' ], 999 );
        add_filter( 'wp_editor_set_quality', [ __CLASS__, 'filter_editor_quality' ], 20, 2 );
        add_filter( 'image_editor_output_format', [ __CLASS__, 'filter_output_format' ], 20, 3 );
        add_filter( 'wp_lazy_loading_enabled', [ __CLASS__, 'filter_lazy_loading_enabled' ], 20, 2 );
        add_filter( 'wp_omit_loading_attr_threshold', [ __CLASS__, 'filter_omit_loading_threshold' ], 20 );
        add_filter( 'script_loader_tag', [ __CLASS__, 'filter_script_loader_tag' ], 20, 3 );

        // Biztonsági Audit Naplózás & E-mail Értesítés
        add_action( 'wp_login', [ __CLASS__, 'log_user_login_event' ], 10, 2 );
        add_action( 'upgrader_process_complete', [ __CLASS__, 'log_upgrader_lifecycle_event' ], 10, 2 );
        add_action( 'deleted_plugin', [ __CLASS__, 'log_deleted_plugin_event' ], 10, 2 );
        add_action( 'switch_theme', [ __CLASS__, 'log_theme_switch_event' ], 10, 3 );
        add_action( 'wp_after_insert_post', [ __CLASS__, 'log_content_save_event' ], 10, 4 );
        add_action( 'before_delete_post', [ __CLASS__, 'log_content_delete_event' ], 10, 2 );
        add_action( 'user_register', [ __CLASS__, 'log_user_registration_event' ], 10, 2 );
        add_action( 'set_user_role', [ __CLASS__, 'log_user_role_change_event' ], 10, 3 );
        add_action( 'delete_user', [ __CLASS__, 'log_user_delete_event' ], 10, 3 );
        add_action( 'automatic_updates_complete', [ __CLASS__, 'log_auto_system_update_event' ], 10, 1 );
        add_action( '_core_updated_successfully', [ __CLASS__, 'log_core_manual_update_event' ], 10, 1 );
        add_action( 'activated_plugin', [ __CLASS__, 'refresh_integrity_baseline' ] );
        add_action( 'deactivated_plugin', [ __CLASS__, 'refresh_integrity_baseline' ] );

        // Botvédelem: Google reCAPTCHA v3 & Cloudflare Turnstile
        add_action( 'login_enqueue_scripts', [ __CLASS__, 'enqueue_captcha_login_assets' ] );
        add_action( 'login_form', [ __CLASS__, 'render_captcha_field' ] );
        add_action( 'register_form', [ __CLASS__, 'render_captcha_field' ] );
        add_action( 'lostpassword_form', [ __CLASS__, 'render_captcha_field' ] );
        add_action( 'comment_form_after_fields', [ __CLASS__, 'render_captcha_field' ] );
        add_filter( 'authenticate', [ __CLASS__, 'verify_login_captcha' ], 30, 3 );
        add_filter( 'registration_errors', [ __CLASS__, 'verify_registration_captcha' ], 10, 3 );
        add_action( 'lostpassword_post', [ __CLASS__, 'verify_lostpassword_captcha' ], 10, 1 );
        add_filter( 'preprocess_comment', [ __CLASS__, 'verify_comment_captcha' ], 10, 1 );

        // Hitelesítés: 2FA (TOTP + visszaállító kódok)
        add_action( 'login_form', [ __CLASS__, 'render_totp_login_field' ] );
        add_filter( 'authenticate', [ __CLASS__, 'enforce_totp_login' ], 50, 3 );
        add_action( 'application_password_did_authenticate', [ __CLASS__, 'mark_app_password_used' ] );
        add_action( 'show_user_profile', [ __CLASS__, 'render_profile_2fa' ] );
        add_action( 'edit_user_profile', [ __CLASS__, 'render_profile_2fa' ] );
        add_action( 'personal_options_update', [ __CLASS__, 'save_profile_2fa' ] );
        add_action( 'edit_user_profile_update', [ __CLASS__, 'save_profile_2fa' ] );
        add_action( 'admin_notices', [ __CLASS__, 'render_2fa_required_notice' ] );

        // WP Rejtés & hozzáférési kapuk
        add_action( 'template_redirect', [ __CLASS__, 'enforce_wp_hide_access_gate' ], -1 );
        add_filter( 'rest_authentication_errors', [ __CLASS__, 'filter_rest_access' ], 90 );
        add_action( 'wp_footer', [ __CLASS__, 'render_ajax_bubble_login_widget' ], 25 );
        add_action( 'wp_ajax_nopriv_wtk_bubble_login', [ __CLASS__, 'handle_ajax_bubble_login' ] );
        add_action( 'wp_ajax_wtk_bubble_login', [ __CLASS__, 'handle_ajax_bubble_login' ] );
        add_filter( 'the_author', [ __CLASS__, 'filter_masked_author_name' ], 20 );
        add_filter( 'get_the_author_display_name', [ __CLASS__, 'filter_masked_author_name' ], 20, 2 );
        add_filter( 'get_comment_author', [ __CLASS__, 'filter_masked_comment_author' ], 20, 3 );

        // Rövidkódok: Szövegvezérlő widgetek (Szöveg widget, Rövidkód blokk, klasszikus témák)
        add_shortcode( 'wtk_calendar', [ __CLASS__, 'render_calendar_widget' ] );
        add_shortcode( 'wtk_search', [ __CLASS__, 'render_search_widget' ] );
        add_shortcode( 'wtk_social', [ __CLASS__, 'render_social_widget' ] );
        add_shortcode( 'wtk_stats', [ __CLASS__, 'render_stats_widget' ] );
        add_shortcode( 'wtk_cookie_consent', [ __CLASS__, 'render_cookie_consent_widget' ] );
        add_shortcode( 'wtk_info_banner', [ __CLASS__, 'render_info_banner_shortcode' ] );
        add_shortcode( 'wtk_speed_badge', [ __CLASS__, 'render_speed_badge_shortcode' ] );
        add_shortcode( 'wtk_security_badge', [ __CLASS__, 'render_security_badge_shortcode' ] );
        add_shortcode( 'wtk_captcha_badge', [ __CLASS__, 'render_captcha_badge_shortcode' ] );
        add_shortcode( 'wtk_auth_manager', [ __CLASS__, 'render_auth_manager_shortcode' ] );
        add_shortcode( 'wtk_custom_login', [ __CLASS__, 'render_custom_login_shortcode' ] );
    }

    public static function on_init(): void {
        load_plugin_textdomain( 'and-toolkit', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );
        if ( get_option( 'and_toolkit_db_version' ) !== self::DB_VERSION ) {
            self::create_tables();
            update_option( 'and_toolkit_db_version', self::DB_VERSION, false );
        }
        if ( ! wp_next_scheduled( self::CRON_HOOK ) ) {
            wp_schedule_event( time() + 300, 'hourly', self::CRON_HOOK );
        }
        self::apply_wp_hide();
    }

    public static function activate(): void {
        self::create_tables();
        update_option( 'and_toolkit_db_version', self::DB_VERSION, false );
        if ( ! wp_next_scheduled( self::CRON_HOOK ) ) {
            wp_schedule_event( time() + 300, 'hourly', self::CRON_HOOK );
        }
        update_option( 'and_toolkit_integrity', self::integrity_snapshot(), false );
    }

    public static function deactivate(): void {
        wp_clear_scheduled_hook( self::CRON_HOOK );
    }

    public static function uninstall(): void {
        global $wpdb;
        wp_clear_scheduled_hook( self::CRON_HOOK );
        $wpdb->query( 'DROP TABLE IF EXISTS ' . $wpdb->prefix . 'and_toolkit_audit' ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery
        $wpdb->query( 'DROP TABLE IF EXISTS ' . $wpdb->prefix . 'and_toolkit_consent' ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery
        foreach ( [ self::OPTION_KEY, 'and_toolkit_db_version', 'and_toolkit_integrity', 'and_toolkit_notified_updates', 'and_toolkit_digest_last', 'and_toolkit_downloads_total', 'and_toolkit_visits_total', 'and_toolkit_visits_daily', 'and_toolkit_cache_gen', 'and_toolkit_optimize_last', 'and_toolkit_captcha_verified', 'and_toolkit_captcha_blocked', 'and_toolkit_auth_vault_backup' ] as $option ) {
            delete_option( $option );
        }
        foreach ( [ 'and_toolkit_devices', 'and_toolkit_totp', 'and_toolkit_totp_pending', 'and_toolkit_recovery_flash' ] as $meta_key ) {
            delete_metadata( 'user', 0, $meta_key, '', true );
        }
        delete_post_meta_by_key( '_wtk_event_date' );
    }

    // ========================================================================
    // KONFIGURÁCIÓ (alapértelmezés + mentett beállítások)
    // ========================================================================

    public static function get_defaults(): array {
        return [
            'plugin_name' => 'And ToolKit',
            'version'     => self::VERSION,
            'author'      => self::AUTHOR,
            'theme_mode' => 'light',
            'calendar' => [
                'enabled'                => true,
                'title'                  => 'Közelgő Események & Bejegyzések',
                'style'                  => 'cards',
                'max_items'              => 4,
                'show_countdown'         => true,
            ],
            'search' => [
                'enabled'                => true,
                'title'                  => 'Gyors Keresés az Oldalon',
                'layout'                 => 'detailed',
                'live_ajax'              => true,
                'debounce_ms'            => 180,
                'post_types'             => [ 'post', 'event', 'page', 'download' ],
                'highlight_matches'      => true,
            ],
            'social' => [
                'enabled'                => true,
                'title'                  => 'Tartalom Megosztása',
                'button_style'           => 'rounded',
                'columns'                => 2,
                'platforms'              => [ 'facebook', 'x', 'linkedin', 'whatsapp', 'telegram', 'reddit', 'email' ],
            ],
            'stats' => [
                'enabled'                => true,
                'title'                  => 'Oldal Hatékonyság & Forgalom',
                'style'                  => 'grid-cards',
                'number_format'          => 'compact',
                'unique_visitors'        => true,
                'total_downloads'        => true,
            ],
            'gdpr' => [
                'enabled'                => true,
                'title'                  => 'GDPR Süti (Cookie) és Adatvédelmi Beállítások',
                'display_style'          => 'sidebar-widget',
                'privacy_url'            => '/adatvedelmi-tajekoztato',
                'expiry_days'            => 180,
                'google_consent_mode_v2' => true,
                'auto_block_scripts'     => true,
                'default_categories'     => [ 'necessary' => true, 'preferences' => false, 'analytics' => false, 'marketing' => false ],
            ],
            'banner' => [
                'enabled'                => false,
                'visibility_scope'       => 'all-pages',
                'sticky_top'             => true,
                'color_preset'           => 'cobalt-gradient',
                'custom_bg_hex'          => '#1E3A8A',
                'custom_text_hex'        => '#FFFFFF',
                'size_preset'            => 'standard',
                'font_style'             => 'display-bold',
                'animation'              => 'pulse-glow',
                'badge_text'             => 'ÚJ VERZIÓ · v0.7.1',
                'headline'               => 'And ToolKit v0.7.0: 2FA/Passkey Hitelesítés Időszinkronnal & Teljes WP Rejtés Modul!',
                'subtext'                => '2FA TOTP + Készülék Időszinkron, Passkey, E-mail OTP, Offline Kódok, Frissítés-védelem, [wtk_auth_manager] Shortcode, WP URL Álcázás, AJAX Buborék Belépés és Titkosított Mesterjelszó.',
                'cta_label'              => 'Hitelesítés & WP Rejtés',
                'cta_url'                => '',
                'dismissible'            => true,
            ],
            'optimizer' => [
                'enabled'                => true,
                'auto_optimize'          => true,
                'auto_schedule'          => 'realtime-upload',
                'image_compression'      => true,
                'compression_quality'    => 82,
                'convert_format'         => 'webp',
                'auto_resize'            => true,
                'max_width_px'           => 1920,
                'max_height_px'          => 1080,
                'override_upload_limit'  => true,
                'custom_upload_limit_mb' => 256,
                'lazy_load_images'       => true,
                'lazy_load_iframes'      => true,
                'lazy_load_backgrounds'  => true,
                'exclude_above_fold'     => 2,
                'page_cache_enabled'     => false,
            ],
            'audit_log' => [
                'enabled'                => true,
                'recipient_email'        => '',
                'critical_only_emails'   => false,
                'export_format'          => 'log',
                'login_email_enabled'    => false,
                'login_email_scope'      => 'admins-only',
                'new_device_location_alert' => true,
                'new_device_target_roles' => [ 'administrator', 'editor' ],
                'update_available_email_enabled' => true,
                'daily_digest_enabled'   => true,
                'daily_digest_time'      => '08:00',
                'retention_days'         => 90,
            ],
            'captcha' => [
                'enabled'                 => true,
                'provider'                => 'recaptcha-v3',
                'recaptcha_site_key'      => '',
                'recaptcha_secret_key'    => '',
                'turnstile_site_key'      => '',
                'turnstile_secret_key'    => '',
                'score_threshold'         => 0.5,
                'turnstile_mode'          => 'managed',
                'turnstile_theme'         => 'auto',
                'protect_login'           => true,
                'protect_register'        => true,
                'protect_lost_password'   => true,
                'protect_comments'        => true,
                'bypass_logged_in_admins' => true,
                'log_blocked_attempts'    => true,
            ],
            'auth' => [
                'enabled'                      => true,
                'totp_enabled'                 => true,
                'totp_issuer'                  => 'And ToolKit WP 7.1',
                'time_drift_tolerance_windows' => 2,
                'whitelisted_ips'              => [  ],
                'role_policies'                => [ 'administrator' => [ 'totp' => 'required' ], 'editor' => [ 'totp' => 'required' ], 'author' => [ 'totp' => 'optional' ], 'contributor' => [ 'totp' => 'optional' ], 'subscriber' => [ 'totp' => 'disabled' ] ],
            ],
            'wp_hide' => [
                'enabled'                         => false,
                'strip_wp_version'                => true,
                'block_author_scanning'           => true,
                'hide_usernames_emails'           => true,
                'author_alias'                    => 'Szerző #ID (Védett profil)',
                'members_only_mode'               => false,
                'master_password_enabled'         => false,
                'master_password_hash'            => '',
                'master_password_whitelisted_ips' => [  ],
                'enable_login_shortcode'          => true,
                'enable_ajax_bubble_login'        => true,
                'bubble_position'                 => 'bottom-right',
                'bubble_button_label'             => 'Gyors Belépés',
            ],
            'performance' => [
                'defer_scripts'          => true,
                'cache_ttl_mins'         => 60,
            ],
        ];
    }

    public static function get_config(): array {
        if ( null === self::$config_cache ) {
            $stored             = get_option( self::OPTION_KEY, [] );
            self::$config_cache = self::merge_config( self::get_defaults(), is_array( $stored ) ? $stored : [] );
        }
        return self::$config_cache;
    }

    public static function flush_config_cache(): void {
        self::$config_cache = null;
    }

    private static function is_list_array( array $a ): bool {
        return [] === $a || array_keys( $a ) === range( 0, count( $a ) - 1 );
    }

    private static function merge_config( array $defaults, array $stored ): array {
        foreach ( $stored as $key => $value ) {
            if ( ! array_key_exists( $key, $defaults ) ) {
                continue;
            }
            $default = $defaults[ $key ];
            if ( is_array( $default ) && ! self::is_list_array( $default ) && is_array( $value ) ) {
                $defaults[ $key ] = self::merge_config( $default, $value );
            } elseif ( gettype( $default ) === gettype( $value ) ) {
                $defaults[ $key ] = $value;
            }
        }
        return $defaults;
    }

    private static function option_sets(): array {
        return [
            'calendar_style' => [ 'cards' => 'Kártyás', 'compact' => 'Kompakt lista', 'grid' => 'Havi rács', 'timeline' => 'Idővonal' ],
            'search_layout'  => [ 'minimal' => 'Minimális', 'detailed' => 'Részletes', 'compact-cards' => 'Kompakt kártyák' ],
            'social_style'   => [ 'rounded' => 'Kerekített', 'pill' => 'Kapszula', 'square' => 'Szögletes', 'icon-only' => 'Csak ikon', 'minimal-outline' => 'Keretes' ],
            'platforms'      => [ 'facebook' => 'Facebook', 'x' => 'X (Twitter)', 'linkedin' => 'LinkedIn', 'whatsapp' => 'WhatsApp', 'telegram' => 'Telegram', 'reddit' => 'Reddit', 'pinterest' => 'Pinterest', 'email' => 'E-mail' ],
            'stats_style'    => [ 'grid-cards' => '2x2 kártya rács', 'clean-list' => 'Letisztult lista', 'horizontal-strip' => 'Vízszintes sáv', 'featured-hero' => 'Kiemelt számláló' ],
            'number_format'  => [ 'compact' => 'Kompakt (48.9K)', 'exact' => 'Szóközös (48 920)', 'comma' => 'Vesszős (48,920)' ],
            'gdpr_style'     => [ 'sidebar-widget' => 'Oldalsáv widget', 'bottom-bar' => 'Alsó sáv', 'floating-card' => 'Lebegő kártya', 'modal-center' => 'Középső ablak' ],
            'banner_scope'   => [ 'all-pages' => 'Minden oldal', 'homepage-only' => 'Csak főoldal', 'blog-posts' => 'Csak bejegyzések', 'sidebar-only' => 'Csak rövidkóddal' ],
            'banner_color'   => [ 'cobalt-gradient' => 'Kobalt', 'emerald-aurora' => 'Smaragd', 'amber-highlight' => 'Borostyán', 'rose-alert' => 'Rózsa', 'slate-obsidian' => 'Obszidián', 'custom' => 'Egyedi HEX' ],
            'banner_size'    => [ 'compact' => 'Kicsi', 'standard' => 'Közepes', 'large-hero' => 'Nagy' ],
            'banner_font'    => [ 'sans-clean' => 'Sans', 'display-bold' => 'Display', 'serif-editorial' => 'Serif', 'mono-tech' => 'Mono' ],
            'banner_anim'    => [ 'none' => 'Nincs', 'pulse-glow' => 'Pulzáló', 'slide-down' => 'Beúszó', 'shimmer' => 'Csillogó', 'marquee' => 'Futó' ],
            'convert_format' => [ 'original' => 'Eredeti', 'webp' => 'WebP', 'avif' => 'AVIF' ],
            'auto_schedule'  => [ 'realtime-upload' => 'Feltöltéskor', 'hourly-cron' => 'Óránként', 'daily-cron' => 'Naponta', 'manual-only' => 'Csak kézzel' ],
            'export_format'    => [ 'log' => '.log', 'txt' => '.txt', 'csv' => '.csv' ],
            'login_scope'      => [ 'all-users' => 'Minden felhasználó', 'editors-only' => 'Csak szerkesztők', 'admins-only' => 'Csak adminisztrátorok' ],
            'roles'            => [ 'administrator' => 'Adminisztrátor', 'editor' => 'Szerkesztő', 'author' => 'Szerző', 'contributor' => 'Közreműködő', 'subscriber' => 'Feliratkozó' ],
            'captcha_provider' => [ 'recaptcha-v3' => 'Google reCAPTCHA v3 (Score alapú)', 'turnstile' => 'Cloudflare Turnstile (Adatvédelem-barát)' ],
            'turnstile_mode'   => [ 'managed' => 'Managed (Adaptív)', 'non-interactive' => 'Non-Interactive', 'invisible' => 'Invisible (Láthatatlan)' ],
            'turnstile_theme'  => [ 'auto' => 'Automatikus', 'light' => 'Világos', 'dark' => 'Sötét' ],
            'bubble_pos'       => [ 'bottom-right' => 'Jobb alsó sarok', 'bottom-left' => 'Bal alsó sarok' ],
        ];
    }

    /**
     * Beállítás-séma: csoport => [ kulcs => [ típus, címke, extra ] ]
     */
    private static function settings_schema(): array {
        $o      = self::option_sets();
        $public = [];
        foreach ( get_post_types( [ 'public' => true ], 'objects' ) as $slug => $type ) {
            $public[ $slug ] = (string) $type->labels->singular_name;
        }
        return [
            'calendar'    => [
                'enabled'        => [ 'bool', 'Naptár engedélyezése' ],
                'title'          => [ 'text', 'Cím' ],
                'style'          => [ 'select', 'Stílus', $o['calendar_style'] ],
                'max_items'      => [ 'int', 'Max. elemszám', [ 1, 20 ] ],
                'show_countdown' => [ 'bool', 'Visszaszámláló' ],
            ],
            'search'      => [
                'enabled'           => [ 'bool', 'Kereső engedélyezése' ],
                'title'             => [ 'text', 'Cím' ],
                'layout'            => [ 'select', 'Elrendezés', $o['search_layout'] ],
                'live_ajax'         => [ 'bool', 'Élő AJAX keresés' ],
                'debounce_ms'       => [ 'int', 'Késleltetés (ms)', [ 80, 500 ] ],
                'post_types'        => [ 'multi', 'Keresett tartalomtípusok', $public ],
                'highlight_matches' => [ 'bool', 'Találatok kiemelése' ],
            ],
            'social'      => [
                'enabled'      => [ 'bool', 'Megosztó engedélyezése' ],
                'title'        => [ 'text', 'Cím' ],
                'button_style' => [ 'select', 'Gombstílus', $o['social_style'] ],
                'columns'      => [ 'int', 'Oszlopok (1-4)', [ 1, 4 ] ],
                'platforms'    => [ 'multi', 'Platformok', $o['platforms'] ],
            ],
            'stats'       => [
                'enabled'         => [ 'bool', 'Statisztika engedélyezése' ],
                'title'           => [ 'text', 'Cím' ],
                'style'           => [ 'select', 'Stílus', $o['stats_style'] ],
                'number_format'   => [ 'select', 'Számformátum', $o['number_format'] ],
                'unique_visitors' => [ 'bool', 'Látogatások megjelenítése' ],
                'total_downloads' => [ 'bool', 'Letöltések megjelenítése' ],
            ],
            'gdpr'        => [
                'enabled'                => [ 'bool', 'GDPR süti-kezelő engedélyezése' ],
                'title'                  => [ 'text', 'Cím' ],
                'display_style'          => [ 'select', 'Megjelenés', $o['gdpr_style'] ],
                'privacy_url'            => [ 'url', 'Adatvédelmi tájékoztató URL' ],
                'expiry_days'            => [ 'int', 'Hozzájárulás érvényessége (nap)', [ 1, 730 ] ],
                'google_consent_mode_v2' => [ 'bool', 'Google Consent Mode v2' ],
                'auto_block_scripts'     => [ 'bool', 'Ismert követő szkriptek előzetes blokkolása' ],
            ],
            'banner'      => [
                'enabled'          => [ 'bool', 'Banner engedélyezése' ],
                'visibility_scope' => [ 'select', 'Hatókör', $o['banner_scope'] ],
                'sticky_top'       => [ 'bool', 'Tapadó (sticky) felső sáv' ],
                'color_preset'     => [ 'select', 'Színséma', $o['banner_color'] ],
                'custom_bg_hex'    => [ 'hex', 'Egyedi háttérszín' ],
                'custom_text_hex'  => [ 'hex', 'Egyedi betűszín' ],
                'size_preset'      => [ 'select', 'Méret', $o['banner_size'] ],
                'font_style'       => [ 'select', 'Betűstílus', $o['banner_font'] ],
                'animation'        => [ 'select', 'Animáció', $o['banner_anim'] ],
                'badge_text'       => [ 'text', 'Jelvény szöveg' ],
                'headline'         => [ 'text', 'Főcím' ],
                'subtext'          => [ 'text', 'Alszöveg' ],
                'cta_label'        => [ 'text', 'Gomb felirata' ],
                'cta_url'          => [ 'url', 'Gomb URL' ],
                'dismissible'      => [ 'bool', 'Bezárható' ],
            ],
            'optimizer'   => [
                'enabled'                => [ 'bool', 'Optimalizáló engedélyezése' ],
                'auto_optimize'          => [ 'bool', 'Automatikus gyorsítótár-ürítés' ],
                'auto_schedule'          => [ 'select', 'Ütemezés', $o['auto_schedule'] ],
                'image_compression'      => [ 'bool', 'Képtömörítés (új méretekre)' ],
                'compression_quality'    => [ 'int', 'Tömörítési minőség', [ 40, 100 ] ],
                'convert_format'         => [ 'select', 'Konvertálás formátumra', $o['convert_format'] ],
                'auto_resize'            => [ 'bool', 'Nagy képek átméretezése' ],
                'max_width_px'           => [ 'int', 'Max. szélesség (px)', [ 320, 8192 ] ],
                'max_height_px'          => [ 'int', 'Max. magasság (px)', [ 320, 8192 ] ],
                'override_upload_limit'  => [ 'bool', 'Feltöltési limit módosítása' ],
                'custom_upload_limit_mb' => [ 'int', 'Kért feltöltési limit (MB)', [ 1, 1024 ] ],
                'lazy_load_images'       => [ 'bool', 'Képek lazy load' ],
                'lazy_load_iframes'      => [ 'bool', 'iframe/videó lazy load' ],
                'lazy_load_backgrounds'  => [ 'bool', 'Háttérképek lazy load (data-atk-bg)' ],
                'exclude_above_fold'     => [ 'int', 'Oldal tetején kihagyott képek', [ 0, 10 ] ],
                'page_cache_enabled'     => [ 'bool', 'Oldal-gyorsítótár (csak kijelentkezett látogatóknak)' ],
            ],
            'audit_log'   => [
                'enabled'                        => [ 'bool', 'Audit napló engedélyezése' ],
                'recipient_email'                => [ 'email', 'Értesítési e-mail (üresen: webhely admin e-mail)' ],
                'critical_only_emails'           => [ 'bool', 'Critical Only: e-mail csak WP mag frissítésről és fájlrendszer-változásról' ],
                'export_format'                  => [ 'select', 'Alapértelmezett export formátum', $o['export_format'] ],
                'login_email_enabled'            => [ 'bool', 'Belépési e-mail értesítő' ],
                'login_email_scope'              => [ 'select', 'Belépési értesítő hatóköre', $o['login_scope'] ],
                'new_device_location_alert'      => [ 'bool', 'Új eszköz / új IP-cím belépési riasztás' ],
                'new_device_target_roles'        => [ 'multi', 'Riasztandó szerepkörök', $o['roles'] ],
                'update_available_email_enabled' => [ 'bool', 'Elérhető frissítés e-mail (régi → új verzió)' ],
                'daily_digest_enabled'           => [ 'bool', 'Napi automatikus frissítési összefoglaló' ],
                'daily_digest_time'              => [ 'time', 'Összefoglaló időpontja (ÓÓ:PP)' ],
                'retention_days'                 => [ 'int', 'Naplómegőrzés (nap)', [ 7, 730 ] ],
            ],
            'captcha'     => [
                'enabled'                 => [ 'bool', 'Botvédelem (CAPTCHA) engedélyezése (kulcsok nélkül nem aktív)' ],
                'provider'                => [ 'select', 'Szolgáltató (Google reCAPTCHA v3 / Cloudflare Turnstile)', $o['captcha_provider'] ],
                'recaptcha_site_key'      => [ 'text', 'Google reCAPTCHA v3 Site Key (Nyilvános kulcs)' ],
                'recaptcha_secret_key'    => [ 'secret', 'Google reCAPTCHA v3 Secret Key (Titkos kulcs; üresen hagyva a mentett marad)' ],
                'turnstile_site_key'      => [ 'text', 'Cloudflare Turnstile Site Key (Nyilvános kulcs)' ],
                'turnstile_secret_key'    => [ 'secret', 'Cloudflare Turnstile Secret Key (Titkos kulcs; üresen hagyva a mentett marad)' ],
                'score_threshold'         => [ 'float', 'Észlelési érzékenység / küszöbérték (0.1 – 0.9)', [ 0.1, 0.9 ] ],
                'turnstile_mode'          => [ 'select', 'Turnstile widget mód', $o['turnstile_mode'] ],
                'turnstile_theme'         => [ 'select', 'Turnstile színséma', $o['turnstile_theme'] ],
                'protect_login'           => [ 'bool', 'Bejelentkezési űrlap védelme (wp-login.php; az XML-RPC / REST / alkalmazásjelszavas belépést nem érinti)' ],
                'protect_register'        => [ 'bool', 'Regisztrációs űrlap védelme' ],
                'protect_lost_password'   => [ 'bool', 'Elfelejtett jelszó űrlap védelme' ],
                'protect_comments'        => [ 'bool', 'Hozzászólási (komment) űrlap védelme (kijelentkezett látogatóknak)' ],
                'bypass_logged_in_admins' => [ 'bool', 'Bejelentkezett adminisztrátorok kihagyása' ],
                'log_blocked_attempts'    => [ 'bool', 'Blokkolt bot-kísérletek rögzítése az Audit Naplóban' ],
            ],
            'auth'        => [
                'enabled'                      => [ 'bool', 'Kétfaktoros hitelesítés (2FA) engedélyezése' ],
                'totp_enabled'                 => [ 'bool', '2FA hitelesítő alkalmazással (TOTP, RFC 6238) és visszaállító kódokkal; a felhasználók a saját profiljukon kapcsolják be' ],
                'totp_issuer'                  => [ 'text', 'TOTP kibocsátó neve (a hitelesítő alkalmazásban látszik)' ],
                'time_drift_tolerance_windows' => [ 'int', 'Időeltolódás tűréshatár (±30 mp ablak)', [ 0, 5 ] ],
                'whitelisted_ips'              => [ 'iplist', '2FA alól mentesített IP-címek / CIDR-ek (soronként egy; csak megbízható, fix címek – proxy mögött pontatlan)' ],
            ],
            'wp_hide'     => [
                'enabled'                         => [ 'bool', 'WP Rejtés és hozzáférés-védelem engedélyezése' ],
                'strip_wp_version'                => [ 'bool', 'WP verziószám és generator meta elrejtése' ],
                'block_author_scanning'           => [ 'bool', 'Felhasználó-felderítés tiltása vendégeknek (?author=N, szerzői archívum, /wp/v2/users)' ],
                'hide_usernames_emails'           => [ 'bool', 'Felhasználónevek és e-mail címek maszkolása a szerzői és komment nevekben' ],
                'author_alias'                    => [ 'text', 'Maszkolt szerzőnév (az "ID" szó a felhasználó azonosítójára cserélődik)' ],
                'members_only_mode'               => [ 'bool', 'Csak bejelentkezett látogatók (a REST API is zárolt vendégeknek)' ],
                'master_password_enabled'         => [ 'bool', 'Mesterjelszó kapu az egész weboldalra (adminisztrátorok és mentesített IP-k kivételével)' ],
                'master_password_new'             => [ 'newpass', 'Új mesterjelszó (üresen hagyva a jelenlegi marad; legalább 8 karakter)' ],
                'master_password_whitelisted_ips' => [ 'iplist', 'Mesterjelszó alól mentesített IP-címek / CIDR-ek (soronként egy)' ],
                'enable_login_shortcode'          => [ 'bool', '[wtk_custom_login] rövidkódos bejelentkező űrlap' ],
                'enable_ajax_bubble_login'        => [ 'bool', 'Lebegő AJAX belépő buborék' ],
                'bubble_position'                 => [ 'select', 'Buborék pozíciója', $o['bubble_pos'] ],
                'bubble_button_label'             => [ 'text', 'Buborék gomb felirata' ],
            ],
            'performance' => [
                'defer_scripts'  => [ 'bool', 'Szkriptek defer betöltése' ],
                'cache_ttl_mins' => [ 'int', 'Oldal-gyorsítótár élettartama (perc)', [ 1, 1440 ] ],
            ],
        ];
    }

    public static function sanitize_settings( $input ): array {
        $current = self::get_config();
        $input   = is_array( $input ) ? $input : [];
        $out     = [];
        foreach ( self::settings_schema() as $group => $fields ) {
            $out[ $group ] = $current[ $group ];
            foreach ( $fields as $key => $def ) {
                $type = $def[0];
                $raw  = $input[ $group ][ $key ] ?? null;
                if ( 'newpass' === $type ) {
                    continue; // külön kezeljük, a konfigban nincs ilyen kulcs
                }
                $out[ $group ][ $key ] = match ( $type ) {
                    'bool'   => ! empty( $raw ),
                    'text'   => is_scalar( $raw ) ? sanitize_text_field( (string) $raw ) : $current[ $group ][ $key ],
                    'secret' => is_scalar( $raw ) && '' !== trim( (string) $raw ) ? (string) preg_replace( '/[^A-Za-z0-9_\-.:]/', '', trim( (string) $raw ) ) : $current[ $group ][ $key ],
                    'iplist' => is_scalar( $raw ) ? self::sanitize_ip_list( (string) $raw ) : $current[ $group ][ $key ],
                    'email'  => is_scalar( $raw ) && is_email( sanitize_email( (string) $raw ) ) ? sanitize_email( (string) $raw ) : '',
                    'url'    => is_scalar( $raw ) ? esc_url_raw( trim( (string) $raw ) ) : $current[ $group ][ $key ],
                    'int'    => is_scalar( $raw ) ? max( (int) $def[2][0], min( (int) $def[2][1], (int) $raw ) ) : $current[ $group ][ $key ],
                    'float'  => is_scalar( $raw ) ? round( max( (float) $def[2][0], min( (float) $def[2][1], (float) $raw ) ), 2 ) : $current[ $group ][ $key ],
                    'select' => is_scalar( $raw ) && array_key_exists( (string) $raw, $def[2] ) ? (string) $raw : $current[ $group ][ $key ],
                    'time'   => is_scalar( $raw ) && 1 === preg_match( '/^([01]\d|2[0-3]):[0-5]\d$/', (string) $raw ) ? (string) $raw : $current[ $group ][ $key ],
                    'hex'    => is_scalar( $raw ) && sanitize_hex_color( (string) $raw ) ? (string) sanitize_hex_color( (string) $raw ) : $current[ $group ][ $key ],
                    'multi'  => array_values( array_intersect( array_map( 'sanitize_key', is_array( $raw ) ? $raw : [] ), array_keys( $def[2] ) ) ),
                    default  => $current[ $group ][ $key ],
                };
            }
        }
        $out['gdpr']['default_categories'] = $current['gdpr']['default_categories'];
        // Mesterjelszó: csak sózott hash kerül tárolásra (wp_hash_password), a nyers jelszó és semmilyen visszafejthető másolat nem.
        $new_password = $input['wp_hide']['master_password_new'] ?? '';
        if ( is_scalar( $new_password ) && '' !== trim( (string) $new_password ) ) {
            if ( mb_strlen( trim( (string) $new_password ) ) < 8 ) {
                add_settings_error( self::OPTION_KEY, 'atk_master_short', 'A mesterjelszó legalább 8 karakter legyen, a jelszó nem változott.', 'error' );
            } else {
                $out['wp_hide']['master_password_hash'] = wp_hash_password( trim( (string) $new_password ) );
            }
        }
        if ( ! empty( $out['wp_hide']['master_password_enabled'] ) && '' === (string) $out['wp_hide']['master_password_hash'] ) {
            $out['wp_hide']['master_password_enabled'] = false; // jelszó nélkül nem kapcsolható be (nehogy mindenki kizáródjon)
            add_settings_error( self::OPTION_KEY, 'atk_master_missing', 'Mesterjelszó megadása nélkül a kapu nem kapcsolható be.', 'error' );
        }
        self::flush_page_cache();
        self::$config_cache                = null;
        return $out;
    }

    public static function register_settings(): void {
        register_setting(
            'and_toolkit_group',
            self::OPTION_KEY,
            [
                'type'              => 'array',
                'sanitize_callback' => [ __CLASS__, 'sanitize_settings' ],
                'default'           => [],
                'show_in_rest'      => false,
            ]
        );
        if ( function_exists( 'wp_add_privacy_policy_content' ) ) {
            wp_add_privacy_policy_content(
                'And ToolKit',
                wp_kses_post(
                    '<p>Az And ToolKit a biztonsági audit naplóban rögzíti az események idejét, a felhasználó azonosítóját, a kliens IP-címét és böngésző-azonosítóját (legfeljebb a beállított megőrzési ideig). A süti-hozzájárulás igazolásához pszeudonimizált (sózott hash) IP-azonosítót, a hozzájárulás szintjét és idejét tárolja. A statisztika modul csak összesített számlálókat tárol, személyes adatot nem.</p>'
                )
            );
        }
    }

    // ========================================================================
    // ADATBÁZIS
    // ========================================================================

    private static function table_audit(): string {
        global $wpdb;
        return $wpdb->prefix . 'and_toolkit_audit';
    }

    private static function table_consent(): string {
        global $wpdb;
        return $wpdb->prefix . 'and_toolkit_consent';
    }

    public static function create_tables(): void {
        global $wpdb;
        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        $charset = $wpdb->get_charset_collate();
        $audit   = self::table_audit();
        $consent = self::table_consent();

        dbDelta(
            "CREATE TABLE {$audit} (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            created_at datetime NOT NULL,
            category varchar(40) NOT NULL DEFAULT '',
            severity varchar(12) NOT NULL DEFAULT 'info',
            actor_id bigint(20) unsigned NOT NULL DEFAULT 0,
            actor_login varchar(60) NOT NULL DEFAULT '',
            actor_role varchar(40) NOT NULL DEFAULT '',
            ip varchar(45) NOT NULL DEFAULT '',
            user_agent varchar(255) NOT NULL DEFAULT '',
            target varchar(255) NOT NULL DEFAULT '',
            message text NOT NULL,
            PRIMARY KEY  (id),
            KEY created_at (created_at),
            KEY category (category)
            ) {$charset};"
        );
        dbDelta(
            "CREATE TABLE {$consent} (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            created_at datetime NOT NULL,
            consent_id varchar(64) NOT NULL DEFAULT '',
            level varchar(12) NOT NULL DEFAULT '',
            categories varchar(255) NOT NULL DEFAULT '',
            ip_hash varchar(32) NOT NULL DEFAULT '',
            policy_version varchar(12) NOT NULL DEFAULT '',
            PRIMARY KEY  (id),
            KEY consent_id (consent_id),
            KEY created_at (created_at)
            ) {$charset};"
        );
    }

    // ========================================================================
    // SEGÉDFÜGGVÉNYEK
    // ========================================================================

    public static function client_ip(): string {
        $ip = isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( (string) $_SERVER['REMOTE_ADDR'] ) ) : '';
        $ip = (string) apply_filters( 'and_toolkit_client_ip', $ip );
        return false !== filter_var( $ip, FILTER_VALIDATE_IP ) ? $ip : '';
    }

    private static function client_user_agent(): string {
        $ua = isset( $_SERVER['HTTP_USER_AGENT'] ) ? sanitize_text_field( wp_unslash( (string) $_SERVER['HTTP_USER_AGENT'] ) ) : '';
        return mb_substr( $ua, 0, 255 );
    }

    private static function one_line( string $text ): string {
        return trim( (string) preg_replace( '/[\r\n\t]+/', ' ', $text ) );
    }

    private static function rate_limit( string $bucket, int $seconds, string $extra = '' ): bool {
        $key = 'atk_rl_' . $bucket . '_' . substr( hash_hmac( 'sha256', self::client_ip() . '|' . self::client_user_agent() . '|' . $extra, wp_salt() ), 0, 24 );
        if ( false !== get_transient( $key ) ) {
            return false;
        }
        set_transient( $key, 1, $seconds );
        return true;
    }

    private static function increment_counter( string $name ): int {
        global $wpdb;
        add_option( $name, 0, '', false );
        $wpdb->query( $wpdb->prepare( "UPDATE {$wpdb->options} SET option_value = CAST(option_value AS UNSIGNED) + 1 WHERE option_name = %s", $name ) ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery
        wp_cache_delete( $name, 'options' );
        return (int) get_option( $name, 0 );
    }

    private static function actor_for_user( \WP_User $user ): array {
        $roles = is_array( $user->roles ) ? $user->roles : [];
        return [
            'id'    => (int) $user->ID,
            'login' => (string) $user->user_login,
            'role'  => (string) ( $roles[0] ?? 'subscriber' ),
        ];
    }

    private static function current_actor(): array {
        $user = wp_get_current_user();
        if ( $user instanceof \WP_User && $user->exists() ) {
            return self::actor_for_user( $user );
        }
        return [ 'id' => 0, 'login' => 'system', 'role' => 'system' ];
    }

    // ========================================================================
    // AUDIT NAPLÓ (adatbázis) + E-MAIL
    // ========================================================================

    public static function log_event( string $category, string $severity, string $message, string $target = '', ?array $actor = null ): int {
        if ( ! self::get_config()['audit_log']['enabled'] ) {
            return 0;
        }
        global $wpdb;
        $actor ??= self::current_actor();
        $wpdb->insert( // phpcs:ignore WordPress.DB.DirectDatabaseQuery
            self::table_audit(),
            [
                'created_at'  => gmdate( 'Y-m-d H:i:s' ),
                'category'    => sanitize_key( $category ),
                'severity'    => sanitize_key( $severity ),
                'actor_id'    => (int) $actor['id'],
                'actor_login' => mb_substr( self::one_line( (string) $actor['login'] ), 0, 60 ),
                'actor_role'  => sanitize_key( (string) $actor['role'] ),
                'ip'          => self::client_ip(),
                'user_agent'  => self::client_user_agent(),
                'target'      => mb_substr( self::one_line( $target ), 0, 255 ),
                'message'     => self::one_line( $message ),
            ],
            [ '%s', '%s', '%s', '%d', '%s', '%s', '%s', '%s', '%s', '%s' ]
        );
        return (int) $wpdb->insert_id;
    }

    private static function recipient(): string {
        $configured = sanitize_email( (string) self::get_config()['audit_log']['recipient_email'] );
        return is_email( $configured ) ? $configured : (string) get_option( 'admin_email' );
    }

    /**
     * E-mail küldése az audit beállítások szerint. $critical = magas hatású esemény (WP mag frissítés, fájlrendszer-változás).
     */
    private static function notify( string $subject, string $body, bool $critical ): bool {
        $audit = self::get_config()['audit_log'];
        if ( ! $audit['enabled'] || ( $audit['critical_only_emails'] && ! $critical ) ) {
            return false;
        }
        $to = self::recipient();
        if ( '' === $to ) {
            return false;
        }
        return (bool) wp_mail( $to, self::one_line( $subject ), $body );
    }

    public static function log_user_login_event( $user_login, $user ): void {
        if ( ! $user instanceof \WP_User || ! self::get_config()['audit_log']['enabled'] ) {
            return;
        }
        $audit = self::get_config()['audit_log'];
        $actor = self::actor_for_user( $user );
        self::log_event( 'user_login', 'info', sprintf( 'Bejelentkezés: %s (%s)', $actor['login'], $actor['role'] ), $actor['login'], $actor );

        $should_notify = match ( $audit['login_email_scope'] ) {
            'all-users'    => true,
            'editors-only' => 'editor' === $actor['role'],
            'admins-only'  => 'administrator' === $actor['role'],
            default        => false,
        };
        if ( $audit['login_email_enabled'] && $should_notify ) {
            self::notify(
                sprintf( '[And ToolKit] Belépési értesítő: %s (%s)', $actor['login'], $actor['role'] ),
                sprintf( "Felhasználó: %s\nSzerepkör: %s\nIP-cím: %s\nIdő: %s", $actor['login'], $actor['role'], self::client_ip(), wp_date( 'Y-m-d H:i:s' ) ),
                false
            );
        }
        self::check_new_device( $user, $actor );
    }

    private static function check_new_device( \WP_User $user, array $actor ): void {
        $audit = self::get_config()['audit_log'];
        $hash  = hash_hmac( 'sha256', self::client_ip() . '|' . self::client_user_agent(), wp_salt() );
        $known = get_user_meta( $user->ID, 'and_toolkit_devices', true );
        $known = is_array( $known ) ? $known : [];
        if ( in_array( $hash, $known, true ) ) {
            return;
        }
        $known[] = $hash;
        update_user_meta( $user->ID, 'and_toolkit_devices', array_slice( $known, -20 ) );
        // Az első megfigyelt eszköz alapállapot, nem riasztás.
        if ( count( $known ) < 2 || ! $audit['new_device_location_alert'] || ! in_array( $actor['role'], $audit['new_device_target_roles'], true ) ) {
            return;
        }
        self::log_event( 'user_login', 'warning', sprintf( 'Új eszközről/IP-címről történt belépés: %s', $actor['login'] ), $actor['login'], $actor );
        self::notify(
            sprintf( '[And ToolKit] Új eszközről történt belépés: %s', $actor['login'] ),
            sprintf( "Felhasználó: %s (%s)\nIP-cím: %s\nBöngésző: %s\nIdő: %s", $actor['login'], $actor['role'], self::client_ip(), self::client_user_agent(), wp_date( 'Y-m-d H:i:s' ) ),
            false
        );
    }

    public static function log_upgrader_lifecycle_event( $upgrader, $hook_extra ): void {
        if ( ! is_array( $hook_extra ) || wp_doing_cron() ) {
            return; // az automatikus frissítést az automatic_updates_complete naplózza
        }
        $action = (string) ( $hook_extra['action'] ?? '' );
        $type   = (string) ( $hook_extra['type'] ?? '' );
        if ( ! in_array( $action, [ 'install', 'update' ], true ) || ! in_array( $type, [ 'plugin', 'theme' ], true ) ) {
            return; // a core frissítést a _core_updated_successfully naplózza
        }
        $verb = 'install' === $action ? 'telepítve' : 'frissítve';
        if ( 'plugin' === $type ) {
            $files = isset( $hook_extra['plugins'] ) ? (array) $hook_extra['plugins'] : ( isset( $hook_extra['plugin'] ) ? [ (string) $hook_extra['plugin'] ] : [] );
            if ( ! $files && is_object( $upgrader ) && method_exists( $upgrader, 'plugin_info' ) ) {
                $info  = $upgrader->plugin_info();
                $files = $info ? [ (string) $info ] : [];
            }
            foreach ( $files as $file ) {
                $file = (string) $file;
                if ( ! function_exists( 'get_plugin_data' ) ) {
                    require_once ABSPATH . 'wp-admin/includes/plugin.php';
                }
                $data = file_exists( WP_PLUGIN_DIR . '/' . $file ) ? get_plugin_data( WP_PLUGIN_DIR . '/' . $file, false, false ) : [];
                $name = (string) ( $data['Name'] ?? $file );
                $ver  = (string) ( $data['Version'] ?? '' );
                self::log_event( 'plugin_lifecycle', 'info', sprintf( 'Bővítmény %s: %s %s', $verb, $name, $ver ), $file );
            }
        } else {
            $themes = isset( $hook_extra['themes'] ) ? (array) $hook_extra['themes'] : ( isset( $hook_extra['theme'] ) ? [ (string) $hook_extra['theme'] ] : [] );
            foreach ( $themes as $slug ) {
                $theme = wp_get_theme( (string) $slug );
                self::log_event( 'theme_lifecycle', 'info', sprintf( 'Sablon %s: %s %s', $verb, $theme->exists() ? $theme->get( 'Name' ) : $slug, $theme->exists() ? $theme->get( 'Version' ) : '' ), (string) $slug );
            }
        }
        self::refresh_integrity_baseline();
        self::flush_page_cache();
    }

    public static function log_deleted_plugin_event( $plugin_file, $deleted ): void {
        if ( $deleted ) {
            self::log_event( 'plugin_lifecycle', 'warning', sprintf( 'Bővítmény törölve: %s', (string) $plugin_file ), (string) $plugin_file );
        }
    }

    public static function log_theme_switch_event( $new_name, $new_theme = null, $old_theme = null ): void {
        $old = $old_theme instanceof \WP_Theme ? (string) $old_theme->get( 'Name' ) : '';
        self::log_event( 'theme_lifecycle', 'info', sprintf( 'Sablon váltás: %s → %s', $old, (string) $new_name ), (string) $new_name );
        self::refresh_integrity_baseline();
        self::flush_page_cache();
    }

    public static function log_content_save_event( $post_id, $post, $update = false, $post_before = null ): void {
        if ( ! $post instanceof \WP_Post || wp_is_post_revision( $post ) || wp_is_post_autosave( $post ) || in_array( $post->post_status, [ 'auto-draft', 'inherit' ], true ) ) {
            return;
        }
        if ( is_post_type_viewable( $post->post_type ) ) {
            self::flush_page_cache(); // minden megtekinthető típus (CPT, termék stb.) módosítása érvényteleníti a gyorsítótárat
        }
        if ( ! in_array( $post->post_type, [ 'post', 'page' ], true ) ) {
            return;
        }
        // A Gutenberg egy mentésnél több kérést küld (pl. meta box mentés): a változatlan tartalmat nem naplózzuk újra.
        if ( $update && $post_before instanceof \WP_Post && 'auto-draft' !== $post_before->post_status
            && $post_before->post_title === $post->post_title && $post_before->post_content === $post->post_content
            && $post_before->post_status === $post->post_status && $post_before->post_excerpt === $post->post_excerpt ) {
            return;
        }
        $created = ! $update || ! $post_before instanceof \WP_Post || 'auto-draft' === $post_before->post_status;
        $label   = 'page' === $post->post_type ? 'Oldal' : 'Bejegyzés';
        $verb    = 'trash' === $post->post_status ? 'kukába helyezve' : ( $created ? 'létrehozva' : 'szerkesztve' );
        self::log_event(
            'page' === $post->post_type ? 'page_lifecycle' : 'post_lifecycle',
            'info',
            sprintf( '%s %s: %s (#%d)', $label, $verb, get_the_title( $post ), (int) $post_id ),
            (string) $post_id
        );
    }

    public static function log_content_delete_event( $post_id, $post = null ): void {
        $post = $post instanceof \WP_Post ? $post : get_post( (int) $post_id );
        if ( ! $post instanceof \WP_Post || wp_is_post_revision( $post ) ) {
            return;
        }
        self::flush_page_cache();
        if ( ! in_array( $post->post_type, [ 'post', 'page' ], true ) ) {
            return;
        }
        $label = 'page' === $post->post_type ? 'Oldal' : 'Bejegyzés';
        self::log_event(
            'page' === $post->post_type ? 'page_lifecycle' : 'post_lifecycle',
            'warning',
            sprintf( '%s véglegesen törölve: %s (#%d)', $label, get_the_title( $post ), (int) $post_id ),
            (string) $post_id
        );
    }

    public static function log_user_registration_event( $user_id, $userdata = [] ): void {
        $user = get_userdata( (int) $user_id );
        if ( ! $user instanceof \WP_User ) {
            return;
        }
        $method = ( is_user_logged_in() && current_user_can( 'create_users' ) ) ? 'admin-created' : 'registration-form';
        $label  = 'admin-created' === $method ? 'admin felületen létrehozva' : 'regisztrációs űrlapon';
        self::log_event( 'user_lifecycle', 'info', sprintf( 'Új felhasználó (%s): %s', $label, $user->user_login ), (string) $user_id );
    }

    public static function log_user_role_change_event( $user_id, $role, $old_roles = [] ): void {
        if ( empty( $old_roles ) ) {
            return; // új felhasználó kezdeti szerepköre
        }
        $user = get_userdata( (int) $user_id );
        self::log_event(
            'user_lifecycle',
            'warning',
            sprintf( 'Szerepkör módosítva: %s: %s → %s', $user ? $user->user_login : '#' . (int) $user_id, implode( ',', (array) $old_roles ), (string) $role ),
            (string) $user_id
        );
    }

    public static function log_user_delete_event( $id, $reassign = null, $user = null ): void {
        $login = $user instanceof \WP_User ? $user->user_login : '#' . (int) $id;
        self::log_event( 'user_lifecycle', 'warning', sprintf( 'Felhasználó törölve: %s', $login ), (string) $id );
    }

    public static function log_auto_system_update_event( $results ): void {
        if ( ! is_array( $results ) ) {
            return;
        }
        foreach ( $results as $type => $items ) {
            if ( ! in_array( (string) $type, [ 'plugin', 'theme' ], true ) || ! is_array( $items ) ) {
                continue;
            }
            foreach ( $items as $item ) {
                if ( ! is_object( $item ) ) {
                    continue;
                }
                $details = isset( $item->item ) && is_object( $item->item ) ? $item->item : new \stdClass();
                $name    = (string) ( $item->name ?? $details->slug ?? '' );
                $version = (string) ( $details->new_version ?? '' );
                $ok      = ! is_wp_error( $item->result ?? null ) && ! empty( $item->result );
                self::log_event(
                    'auto_system_update',
                    $ok ? 'info' : 'warning',
                    sprintf( 'Automatikus %s frissítés %s: %s %s', (string) $type, $ok ? 'sikeres' : 'sikertelen', $name, $version ),
                    $name,
                    [ 'id' => 0, 'login' => 'system', 'role' => 'system' ]
                );
            }
        }
        self::refresh_integrity_baseline();
        self::flush_page_cache();
    }

    public static function log_core_manual_update_event( $new_wp_version ): void {
        global $wp_version;
        $actor = self::current_actor();
        $msg   = sprintf( 'WordPress mag frissítve: %s → %s (%s)', (string) $wp_version, (string) $new_wp_version, $actor['login'] );
        self::log_event( 'core_manual_update', 'critical', $msg, 'wordpress-core', $actor );
        self::notify( '[And ToolKit] KRITIKUS: WordPress mag frissítés', $msg . "\nIdő: " . wp_date( 'Y-m-d H:i:s' ), true );
        self::refresh_integrity_baseline();
        self::flush_page_cache();
    }

    // ========================================================================
    // FÁJLRENDSZER-INTEGRITÁS, FRISSÍTÉS-ÉRTESÍTŐ, NAPI ÖSSZEFOGLALÓ (WP-Cron)
    // ========================================================================

    private static function integrity_snapshot(): array {
        $files = [];
        $cfg   = ABSPATH . 'wp-config.php';
        if ( ! @file_exists( $cfg ) ) { // phpcs:ignore WordPress.PHP.NoSilencedErrors
            $cfg = dirname( ABSPATH ) . '/wp-config.php';
        }
        $files['wp-config.php'] = $cfg;
        foreach ( (array) get_option( 'active_plugins', [] ) as $plugin ) {
            $files[ 'plugin:' . (string) $plugin ] = WP_PLUGIN_DIR . '/' . (string) $plugin;
        }
        $files['theme:' . get_stylesheet() . '/functions.php'] = get_stylesheet_directory() . '/functions.php';
        if ( get_template() !== get_stylesheet() ) {
            $files['theme:' . get_template() . '/functions.php'] = get_template_directory() . '/functions.php';
        }
        $out = [];
        foreach ( $files as $label => $path ) {
            $out[ $label ] = ( @is_file( $path ) && @is_readable( $path ) ) ? (string) hash_file( 'sha256', $path ) : ''; // phpcs:ignore WordPress.PHP.NoSilencedErrors
        }
        return $out;
    }

    public static function refresh_integrity_baseline(): void {
        update_option( 'and_toolkit_integrity', self::integrity_snapshot(), false );
    }

    private static function check_filesystem_integrity(): void {
        $baseline = get_option( 'and_toolkit_integrity', null );
        $current  = self::integrity_snapshot();
        update_option( 'and_toolkit_integrity', $current, false );
        if ( ! is_array( $baseline ) ) {
            return;
        }
        $changed = [];
        foreach ( $current as $label => $hash ) {
            if ( isset( $baseline[ $label ] ) && '' !== $hash && '' !== $baseline[ $label ] && $baseline[ $label ] !== $hash ) {
                $changed[] = $label;
            }
        }
        if ( $changed ) {
            $msg = 'Fájlrendszer-változás észlelve (nem frissítés/aktiválás miatt): ' . implode( ', ', $changed );
            self::log_event( 'filesystem_change', 'critical', $msg, implode( ',', $changed ), [ 'id' => 0, 'login' => 'system', 'role' => 'system' ] );
            self::notify( '[And ToolKit] KRITIKUS: fájlrendszer-változás', $msg . "\nIdő: " . wp_date( 'Y-m-d H:i:s' ), true );
        }
    }

    private static function check_available_updates(): void {
        $audit = self::get_config()['audit_log'];
        if ( ! $audit['enabled'] || ! $audit['update_available_email_enabled'] ) {
            return;
        }
        global $wp_version;
        $notified = get_option( 'and_toolkit_notified_updates', [] );
        $notified = is_array( $notified ) ? $notified : [];
        $lines    = [];

        $plugins = get_site_transient( 'update_plugins' );
        if ( is_object( $plugins ) && ! empty( $plugins->response ) ) {
            foreach ( (array) $plugins->response as $file => $info ) {
                $new = (string) ( $info->new_version ?? '' );
                $key = 'plugin:' . $file;
                if ( '' !== $new && ( $notified[ $key ] ?? '' ) !== $new ) {
                    $lines[]          = [ false, sprintf( 'Bővítmény %s: v%s → v%s', $file, (string) ( $plugins->checked[ $file ] ?? '?' ), $new ) ];
                    $notified[ $key ] = $new;
                }
            }
        }
        $themes = get_site_transient( 'update_themes' );
        if ( is_object( $themes ) && ! empty( $themes->response ) ) {
            foreach ( (array) $themes->response as $slug => $info ) {
                $new = (string) ( is_array( $info ) ? ( $info['new_version'] ?? '' ) : '' );
                $key = 'theme:' . $slug;
                if ( '' !== $new && ( $notified[ $key ] ?? '' ) !== $new ) {
                    $lines[]          = [ false, sprintf( 'Sablon %s: v%s → v%s', $slug, (string) ( $themes->checked[ $slug ] ?? '?' ), $new ) ];
                    $notified[ $key ] = $new;
                }
            }
        }
        $core = get_site_transient( 'update_core' );
        if ( is_object( $core ) && ! empty( $core->updates[0] ) && 'upgrade' === ( $core->updates[0]->response ?? '' ) ) {
            $new = (string) ( $core->updates[0]->current ?? '' );
            if ( '' !== $new && ( $notified['core'] ?? '' ) !== $new ) {
                $lines[]          = [ true, sprintf( 'WordPress mag: v%s → v%s', (string) $wp_version, $new ) ];
                $notified['core'] = $new;
            }
        }
        if ( ! $lines ) {
            return;
        }
        update_option( 'and_toolkit_notified_updates', $notified, false );
        if ( $audit['critical_only_emails'] ) {
            $lines = array_values( array_filter( $lines, static fn( array $l ): bool => $l[0] ) );
        }
        if ( $lines ) {
            $critical = (bool) array_filter( $lines, static fn( array $l ): bool => $l[0] );
            self::notify( '[And ToolKit] Elérhető frissítések (aktuális → új verzió)', implode( "\n", array_map( static fn( array $l ): string => $l[1], $lines ) ), $critical );
        }
    }

    private static function maybe_send_daily_digest(): void {
        $audit = self::get_config()['audit_log'];
        if ( ! $audit['enabled'] || ! $audit['daily_digest_enabled'] ) {
            return;
        }
        $today  = wp_date( 'Y-m-d' );
        $target = (int) explode( ':', (string) $audit['daily_digest_time'] )[0];
        if ( (int) wp_date( 'G' ) < $target || get_option( 'and_toolkit_digest_last' ) === $today ) {
            return;
        }
        update_option( 'and_toolkit_digest_last', $today, false );
        global $wpdb;
        $rows = $wpdb->get_results( // phpcs:ignore WordPress.DB.DirectDatabaseQuery
            $wpdb->prepare( 'SELECT created_at, severity, message FROM ' . self::table_audit() . " WHERE category = 'auto_system_update' AND created_at >= %s ORDER BY id ASC LIMIT 200", gmdate( 'Y-m-d H:i:s', time() - DAY_IN_SECONDS ) ),
            ARRAY_A
        );
        if ( ! $rows ) {
            return;
        }
        $lines = array_map( static fn( array $r ): string => sprintf( '%s [%s] %s', get_date_from_gmt( $r['created_at'], 'Y-m-d H:i' ), $r['severity'], $r['message'] ), $rows );
        self::notify( '[And ToolKit] Napi 24 órás automatikus frissítési összefoglaló', implode( "\n", $lines ), false );
    }

    public static function run_hourly_tasks(): void {
        global $wpdb;
        $audit = self::get_config()['audit_log'];
        if ( $audit['enabled'] ) {
            $wpdb->query( $wpdb->prepare( 'DELETE FROM ' . self::table_audit() . ' WHERE created_at < %s', gmdate( 'Y-m-d H:i:s', time() - (int) $audit['retention_days'] * DAY_IN_SECONDS ) ) ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery
            self::check_filesystem_integrity();
            self::check_available_updates();
            self::maybe_send_daily_digest();
        }
        $wpdb->query( $wpdb->prepare( 'DELETE FROM ' . self::table_consent() . ' WHERE created_at < %s', gmdate( 'Y-m-d H:i:s', time() - 1095 * DAY_IN_SECONDS ) ) ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery

        $opt = self::get_config()['optimizer'];
        if ( $opt['enabled'] && $opt['auto_optimize'] ) {
            $last = (int) get_option( 'and_toolkit_optimize_last', 0 );
            $due  = match ( $opt['auto_schedule'] ) {
                'hourly-cron' => time() - $last >= HOUR_IN_SECONDS - 60,
                'daily-cron'  => time() - $last >= DAY_IN_SECONDS - 60,
                default       => false,
            };
            if ( $due ) {
                self::flush_page_cache();
                update_option( 'and_toolkit_optimize_last', time(), false );
            }
        }
    }

    // ========================================================================
    // AUDIT EXPORT (.log / .txt / .csv)
    // ========================================================================

    private static function fetch_audit_rows( int $limit = 5000, string $category = '' ): array {
        global $wpdb;
        $limit = max( 1, min( 20000, $limit ) );
        if ( '' !== $category ) {
            $sql = $wpdb->prepare( 'SELECT * FROM ' . self::table_audit() . ' WHERE category = %s ORDER BY id DESC LIMIT %d', $category, $limit );
        } else {
            $sql = $wpdb->prepare( 'SELECT * FROM ' . self::table_audit() . ' ORDER BY id DESC LIMIT %d', $limit );
        }
        $rows = $wpdb->get_results( $sql, ARRAY_A ); // phpcs:ignore WordPress.DB.PreparedSQL, WordPress.DB.DirectDatabaseQuery
        return is_array( $rows ) ? $rows : [];
    }

    public static function format_audit_export( array $rows, string $format ): string {
        $format = in_array( $format, [ 'log', 'txt', 'csv' ], true ) ? $format : 'log';
        $clean  = static fn( $v ): string => self::one_line( (string) $v );
        if ( 'csv' === $format ) {
            $handle = fopen( 'php://temp', 'r+' );
            fputcsv( $handle, [ 'id', 'ido_utc', 'kategoria', 'sulyossag', 'felhasznalo', 'szerepkor', 'ip', 'bongeszo', 'cel', 'uzenet' ], ',', '"', '\\' );
            foreach ( $rows as $r ) {
                $cells = [ $r['id'], $r['created_at'], $r['category'], $r['severity'], $r['actor_login'], $r['actor_role'], $r['ip'], $r['user_agent'], $r['target'], $r['message'] ];
                // CSV-injekció (képlet) elleni védelem
                $cells = array_map( static fn( $c ): string => ( 1 === preg_match( '/^[=+\-@]/', (string) $c ) ) ? "'" . $c : (string) $c, $cells );
                fputcsv( $handle, $cells, ',', '"', '\\' );
            }
            rewind( $handle );
            $out = (string) stream_get_contents( $handle );
            fclose( $handle );
            return $out;
        }
        $lines = [];
        if ( 'txt' === $format ) {
            $lines[] = 'AND TOOLKIT v' . self::VERSION . ' - BIZTONSÁGI ÉS ESEMÉNYNAPLÓ';
            $lines[] = 'Exportálva: ' . gmdate( 'Y-m-d H:i:s' ) . ' UTC · Tételek: ' . count( $rows );
            $lines[] = str_repeat( '=', 60 );
        }
        foreach ( $rows as $r ) {
            if ( 'txt' === $format ) {
                $lines[] = sprintf( '#%d  %s UTC  [%s/%s]', $r['id'], $r['created_at'], strtoupper( $clean( $r['severity'] ) ), $clean( $r['category'] ) );
                $lines[] = sprintf( '  Felhasználó: %s (%s) · IP: %s', $clean( $r['actor_login'] ), $clean( $r['actor_role'] ), $clean( $r['ip'] ) );
                $lines[] = '  Cél: ' . $clean( $r['target'] );
                $lines[] = '  Üzenet: ' . $clean( $r['message'] );
                $lines[] = str_repeat( '-', 60 );
            } else {
                $lines[] = sprintf(
                    '%s and-toolkit[%d]: severity=%s category=%s actor="%s" role=%s ip=%s target="%s" msg="%s"',
                    gmdate( 'c', (int) strtotime( $r['created_at'] . ' UTC' ) ),
                    $r['id'],
                    $clean( $r['severity'] ),
                    $clean( $r['category'] ),
                    str_replace( '"', "'", $clean( $r['actor_login'] ) ),
                    $clean( $r['actor_role'] ),
                    $clean( $r['ip'] ),
                    str_replace( '"', "'", $clean( $r['target'] ) ),
                    str_replace( '"', "'", $clean( $r['message'] ) )
                );
            }
        }
        return implode( "\n", $lines ) . "\n";
    }

    private static function export_filename( string $format ): string {
        return 'and-toolkit-audit-' . gmdate( 'Ymd-His' ) . '.' . $format;
    }

    public static function handle_admin_export(): void {
        if ( ! current_user_can( 'manage_options' ) ) {
            wp_die( esc_html__( 'Nincs jogosultsága ehhez a művelethez.', 'and-toolkit' ), 403 );
        }
        check_admin_referer( 'and_toolkit_export' );
        $format = isset( $_GET['format'] ) ? sanitize_key( wp_unslash( (string) $_GET['format'] ) ) : 'log'; // phpcs:ignore WordPress.Security.NonceVerification
        $format = in_array( $format, [ 'log', 'txt', 'csv' ], true ) ? $format : 'log';
        $body   = self::format_audit_export( self::fetch_audit_rows(), $format );
        nocache_headers();
        header( 'X-Content-Type-Options: nosniff' );
        header( 'Content-Type: ' . ( 'csv' === $format ? 'text/csv' : 'text/plain' ) . '; charset=utf-8' );
        header( 'Content-Disposition: attachment; filename="' . self::export_filename( $format ) . '"' );
        echo $body; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- egyszerű szöveges fájl letöltés
        exit;
    }

    public static function handle_admin_optimize(): void {
        if ( ! current_user_can( 'manage_options' ) ) {
            wp_die( esc_html__( 'Nincs jogosultsága ehhez a művelethez.', 'and-toolkit' ), 403 );
        }
        check_admin_referer( 'and_toolkit_optimize' );
        self::flush_page_cache();
        if ( function_exists( 'wp_cache_flush' ) ) {
            wp_cache_flush();
        }
        wp_safe_redirect( add_query_arg( 'atk_optimized', '1', admin_url( 'admin.php?page=and-toolkit' ) ) );
        exit;
    }

    // ========================================================================
    // OPTIMALIZÁLÓ: feltöltési limit, képfeldolgozás, lazy load, oldal-gyorsítótár
    // ========================================================================

    private static function php_upload_ceiling(): int {
        $limits = array_filter(
            [
                (int) wp_convert_hr_to_bytes( (string) ini_get( 'upload_max_filesize' ) ),
                (int) wp_convert_hr_to_bytes( (string) ini_get( 'post_max_size' ) ),
            ],
            static fn( int $v ): bool => $v > 0
        );
        return $limits ? min( $limits ) : 0;
    }

    public static function filter_upload_size_limit( $size ): int {
        $opt = self::get_config()['optimizer'];
        if ( ! $opt['enabled'] || ! $opt['override_upload_limit'] ) {
            return (int) $size;
        }
        // A PHP upload_max_filesize / post_max_size futásidőben nem emelhető, ezért a kért érték erre van korlátozva.
        $requested = absint( $opt['custom_upload_limit_mb'] ) * MB_IN_BYTES;
        $ceiling   = self::php_upload_ceiling();
        return $ceiling > 0 ? min( $requested, $ceiling ) : $requested;
    }

    public static function filter_big_image_threshold( $threshold ) {
        $opt = self::get_config()['optimizer'];
        if ( ! $opt['enabled'] || ! $opt['auto_resize'] ) {
            return $threshold;
        }
        return max( absint( $opt['max_width_px'] ), absint( $opt['max_height_px'] ) );
    }

    public static function filter_editor_quality( $quality, $mime_type = '' ): int {
        $opt = self::get_config()['optimizer'];
        if ( $opt['enabled'] && $opt['image_compression'] ) {
            return (int) $opt['compression_quality'];
        }
        return (int) $quality;
    }

    public static function filter_output_format( $formats, $filename = null, $mime_type = null ) {
        $opt = self::get_config()['optimizer'];
        if ( ! is_array( $formats ) || ! $opt['enabled'] || ! $opt['image_compression'] || ! in_array( $opt['convert_format'], [ 'webp', 'avif' ], true ) ) {
            return $formats;
        }
        $target = 'image/' . $opt['convert_format'];
        if ( function_exists( 'wp_image_editor_supports' ) && wp_image_editor_supports( [ 'mime_type' => $target ] ) ) {
            $formats['image/jpeg'] = $target;
            $formats['image/png']  = $target;
        }
        return $formats;
    }

    public static function filter_lazy_loading_enabled( $default, $tag_name = '' ) {
        $opt = self::get_config()['optimizer'];
        if ( ! $opt['enabled'] ) {
            return $default;
        }
        return match ( (string) $tag_name ) {
            'img'    => (bool) $opt['lazy_load_images'],
            'iframe' => (bool) $opt['lazy_load_iframes'],
            default  => $default,
        };
    }

    public static function filter_omit_loading_threshold( $threshold ) {
        $opt = self::get_config()['optimizer'];
        return $opt['enabled'] ? (int) $opt['exclude_above_fold'] : $threshold;
    }

    private static function cache_generation(): int {
        return (int) get_option( 'and_toolkit_cache_gen', 1 );
    }

    public static function flush_page_cache(): void {
        update_option( 'and_toolkit_cache_gen', self::cache_generation() + 1, false );
    }

    private static function page_cache_key(): string {
        $host = isset( $_SERVER['HTTP_HOST'] ) ? sanitize_text_field( wp_unslash( (string) $_SERVER['HTTP_HOST'] ) ) : '';
        $uri  = isset( $_SERVER['REQUEST_URI'] ) ? sanitize_text_field( wp_unslash( (string) $_SERVER['REQUEST_URI'] ) ) : '/';
        return 'atk_pc_' . self::cache_generation() . '_' . md5( $host . '|' . $uri . '|' . ( is_ssl() ? 's' : 'h' ) );
    }

    private static function page_cache_eligible(): bool {
        $opt = self::get_config()['optimizer'];
        if ( ! $opt['enabled'] || ! $opt['page_cache_enabled'] ) {
            return false;
        }
        if ( 'GET' !== ( $_SERVER['REQUEST_METHOD'] ?? '' ) || ! empty( $_GET ) || is_user_logged_in() ) { // phpcs:ignore WordPress.Security.NonceVerification
            return false;
        }
        if ( is_admin() || is_feed() || is_search() || is_404() || is_preview() || is_customize_preview() || is_robots() || is_trackback()
            || wp_doing_ajax() || defined( 'REST_REQUEST' ) || defined( 'DONOTCACHEPAGE' ) ) {
            return false;
        }
        foreach ( array_keys( $_COOKIE ) as $name ) {
            if ( 1 === preg_match( '/^(wordpress_logged_in|comment_author|wp-postpass_|woocommerce_items_in_cart|woocommerce_cart_hash)/', (string) $name ) ) {
                return false;
            }
        }
        return true;
    }

    public static function start_page_cache(): void {
        if ( ! self::page_cache_eligible() ) {
            return;
        }
        $hit = get_transient( self::page_cache_key() );
        if ( is_array( $hit ) && isset( $hit['body'] ) && is_string( $hit['body'] ) ) {
            header( 'X-And-ToolKit-Cache: HIT' );
            echo $hit['body']; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- korábban generált teljes oldal
            exit;
        }
        header( 'X-And-ToolKit-Cache: MISS' );
        ob_start( [ __CLASS__, 'store_page_cache' ] );
    }

    public static function store_page_cache( string $html ): string {
        if ( strlen( $html ) > 200 && 200 === http_response_code() && false !== stripos( $html, '</html>' ) ) {
            $ttl = max( 1, (int) self::get_config()['performance']['cache_ttl_mins'] ) * MINUTE_IN_SECONDS;
            set_transient( self::page_cache_key(), [ 'body' => $html ], $ttl );
        }
        return $html;
    }

    // ========================================================================
    // ADMIN FELÜLET
    // ========================================================================

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

    private static function render_field( string $name, array $def, mixed $value ): void {
        $type  = $def[0];
        $label = $def[1];
        echo '<tr><th scope="row"><label for="' . esc_attr( $name ) . '">' . esc_html( $label ) . '</label></th><td>';
        switch ( $type ) {
            case 'bool':
                echo '<input type="checkbox" id="' . esc_attr( $name ) . '" name="' . esc_attr( $name ) . '" value="1"' . checked( ! empty( $value ), true, false ) . ' />';
                break;
            case 'select':
                echo '<select id="' . esc_attr( $name ) . '" name="' . esc_attr( $name ) . '">';
                foreach ( $def[2] as $opt_value => $opt_label ) {
                    echo '<option value="' . esc_attr( (string) $opt_value ) . '"' . selected( (string) $value, (string) $opt_value, false ) . '>' . esc_html( (string) $opt_label ) . '</option>';
                }
                echo '</select>';
                break;
            case 'multi':
                foreach ( $def[2] as $opt_value => $opt_label ) {
                    echo '<label style="margin-right:12px;display:inline-block"><input type="checkbox" name="' . esc_attr( $name ) . '[]" value="' . esc_attr( (string) $opt_value ) . '"' . checked( in_array( (string) $opt_value, (array) $value, true ), true, false ) . ' /> ' . esc_html( (string) $opt_label ) . '</label>';
                }
                break;
            case 'int':
                echo '<input type="number" class="small-text" id="' . esc_attr( $name ) . '" name="' . esc_attr( $name ) . '" value="' . esc_attr( (string) $value ) . '" min="' . esc_attr( (string) $def[2][0] ) . '" max="' . esc_attr( (string) $def[2][1] ) . '" />';
                break;
            case 'float':
                echo '<input type="number" step="0.05" class="small-text" id="' . esc_attr( $name ) . '" name="' . esc_attr( $name ) . '" value="' . esc_attr( (string) $value ) . '" min="' . esc_attr( (string) $def[2][0] ) . '" max="' . esc_attr( (string) $def[2][1] ) . '" />';
                break;
            case 'secret':
                echo '<input type="password" class="regular-text" autocomplete="new-password" id="' . esc_attr( $name ) . '" name="' . esc_attr( $name ) . '" value="" placeholder="' . esc_attr( '' !== (string) $value ? '•••••••• (mentve)' : 'nincs megadva' ) . '" />';
                break;
            case 'newpass':
                echo '<input type="password" class="regular-text" autocomplete="new-password" id="' . esc_attr( $name ) . '" name="' . esc_attr( $name ) . '" value="" placeholder="' . esc_attr( '' !== (string) self::get_config()['wp_hide']['master_password_hash'] ? '•••••••• (beállítva)' : 'nincs beállítva' ) . '" />';
                break;
            case 'iplist':
                echo '<textarea class="large-text code" rows="3" id="' . esc_attr( $name ) . '" name="' . esc_attr( $name ) . '">' . esc_textarea( implode( "\n", (array) $value ) ) . '</textarea>';
                break;
            case 'url':
                echo '<input type="url" class="regular-text" id="' . esc_attr( $name ) . '" name="' . esc_attr( $name ) . '" value="' . esc_attr( (string) $value ) . '" />';
                break;
            case 'email':
                echo '<input type="email" class="regular-text" id="' . esc_attr( $name ) . '" name="' . esc_attr( $name ) . '" value="' . esc_attr( (string) $value ) . '" />';
                break;
            case 'time':
                echo '<input type="text" class="small-text" id="' . esc_attr( $name ) . '" name="' . esc_attr( $name ) . '" value="' . esc_attr( (string) $value ) . '" pattern="([01][0-9]|2[0-3]):[0-5][0-9]" placeholder="08:00" />';
                break;
            default:
                echo '<input type="text" class="regular-text" id="' . esc_attr( $name ) . '" name="' . esc_attr( $name ) . '" value="' . esc_attr( (string) $value ) . '" />';
        }
        echo '</td></tr>';
    }

    public static function render_admin_dashboard(): void {
        if ( ! current_user_can( 'manage_options' ) ) {
            wp_die( esc_html__( 'Nincs jogosultsága az oldal megtekintéséhez.', 'and-toolkit' ), 403 );
        }
        $config = self::get_config();
        $titles = [
            'calendar'    => '01. Esemény Naptár',
            'search'      => '02. Élő Kereső',
            'social'      => '03. Közösségi Megosztás',
            'stats'       => '04. Statisztika',
            'gdpr'        => '05. GDPR Süti-kezelő',
            'banner'      => '06. Információs Banner',
            'optimizer'   => '07. Optimalizáló',
            'audit_log'   => '08. Biztonsági Audit Napló & E-mail',
            'captcha'     => '09. Botvédelem: Google reCAPTCHA v3 & Cloudflare Turnstile',
            'auth'        => '10. Hitelesítés (2FA, Időszinkron, Passkey, E-mail, Offline kódok)',
            'wp_hide'     => '11. WP Rejtés & Mesterjelszó Védelem',
            'performance' => 'Teljesítmény',
        ];
        echo '<div class="wrap" id="and-toolkit-admin-root" data-version="' . esc_attr( self::VERSION ) . '">';
        echo '<h1>' . esc_html__( 'And ToolKit', 'and-toolkit' ) . ' <small>v' . esc_html( self::VERSION ) . '</small></h1>';

        settings_errors();
        if ( isset( $_GET['atk_optimized'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification
            echo '<div class="notice notice-success is-dismissible"><p>' . esc_html__( 'Az oldal-gyorsítótár és az objektum-gyorsítótár kiürítve.', 'and-toolkit' ) . '</p></div>';
        }

        $ceiling = self::php_upload_ceiling();
        echo '<div class="notice notice-info inline"><p>';
        echo esc_html(
            sprintf(
                'Hatékony feltöltési limit: %s · PHP korlát (upload_max_filesize/post_max_size): %s · Következő időzített feladat: %s',
                size_format( self::filter_upload_size_limit( wp_max_upload_size() ) ),
                $ceiling > 0 ? size_format( $ceiling ) : 'nincs',
                wp_next_scheduled( self::CRON_HOOK ) ? wp_date( 'Y-m-d H:i', (int) wp_next_scheduled( self::CRON_HOOK ) ) : '—'
            )
        );
        echo '</p></div>';
        $ip = self::client_ip();
        if ( '' === $ip || false === filter_var( $ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE ) ) {
            echo '<div class="notice notice-warning inline"><p>' . esc_html__( 'A szerver privát/helyi IP-címet lát (valószínűleg fordított proxy vagy CDN mögött fut). Az audit napló IP-címei és a sebességkorlátozás ilyenkor pontatlan. Állítsa be az and_toolkit_client_ip szűrőt a valódi kliens IP-cím kiolvasásához.', 'and-toolkit' ) . '</p></div>';
        }

        echo '<form method="post" action="options.php">';
        settings_fields( 'and_toolkit_group' );
        foreach ( self::settings_schema() as $group => $fields ) {
            echo '<h2>' . esc_html( $titles[ $group ] ?? $group ) . '</h2><table class="form-table" role="presentation">';
            foreach ( $fields as $key => $def ) {
                self::render_field( self::OPTION_KEY . '[' . $group . '][' . $key . ']', $def, $config[ $group ][ $key ] ?? '' );
            }
            echo '</table>';
        }
        submit_button();
        echo '</form>';

        $optimize_url = wp_nonce_url( admin_url( 'admin-post.php?action=and_toolkit_optimize' ), 'and_toolkit_optimize' );
        echo '<p><a class="button" href="' . esc_url( $optimize_url ) . '">' . esc_html__( 'Gyorsítótár ürítése most', 'and-toolkit' ) . '</a></p>';

        echo '<h2>' . esc_html__( 'Audit napló (legutóbbi 100 esemény)', 'and-toolkit' ) . '</h2><p>';
        foreach ( [ 'log', 'txt', 'csv' ] as $format ) {
            $url = wp_nonce_url( admin_url( 'admin-post.php?action=and_toolkit_export&format=' . $format ), 'and_toolkit_export' );
            echo '<a class="button" style="margin-right:6px" href="' . esc_url( $url ) . '">' . esc_html( '.' . $format . ' letöltése' ) . '</a>';
        }
        echo '</p><table class="widefat striped"><thead><tr><th>Idő</th><th>Súlyosság</th><th>Kategória</th><th>Felhasználó</th><th>IP</th><th>Üzenet</th></tr></thead><tbody>';
        $rows = self::fetch_audit_rows( 100 );
        if ( ! $rows ) {
            echo '<tr><td colspan="6">' . esc_html__( 'Még nincs naplózott esemény.', 'and-toolkit' ) . '</td></tr>';
        }
        foreach ( $rows as $r ) {
            echo '<tr><td>' . esc_html( get_date_from_gmt( (string) $r['created_at'], 'Y-m-d H:i:s' ) ) . '</td><td>' . esc_html( (string) $r['severity'] ) . '</td><td>' . esc_html( (string) $r['category'] ) . '</td><td>' . esc_html( (string) $r['actor_login'] . ' (' . $r['actor_role'] . ')' ) . '</td><td>' . esc_html( (string) $r['ip'] ) . '</td><td>' . esc_html( (string) $r['message'] ) . '</td></tr>';
        }
        echo '</tbody></table></div>';
    }

    // ========================================================================
    // ESEMÉNY DÁTUM META MEZŐ (Naptár modul)
    // ========================================================================

    public static function register_event_meta_box(): void {
        foreach ( [ 'post', 'page', 'event' ] as $post_type ) {
            if ( post_type_exists( $post_type ) ) {
                add_meta_box( 'atk-event-date', 'And ToolKit esemény dátuma', [ __CLASS__, 'render_event_meta_box' ], $post_type, 'side' );
            }
        }
    }

    public static function render_event_meta_box( $post ): void {
        if ( ! $post instanceof \WP_Post ) {
            return;
        }
        wp_nonce_field( 'and_toolkit_event_date', 'and_toolkit_event_nonce' );
        echo '<input type="date" name="and_toolkit_event_date" value="' . esc_attr( (string) get_post_meta( $post->ID, '_wtk_event_date', true ) ) . '" />';
        echo '<p class="description">' . esc_html__( 'Ha meg van adva, a bejegyzés megjelenik a [wtk_calendar] naptárban.', 'and-toolkit' ) . '</p>';
    }

    public static function save_event_meta( $post_id ): void {
        $post_id = (int) $post_id;
        if ( ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) || ! isset( $_POST['and_toolkit_event_nonce'] ) ) {
            return;
        }
        if ( ! wp_verify_nonce( sanitize_text_field( wp_unslash( (string) $_POST['and_toolkit_event_nonce'] ) ), 'and_toolkit_event_date' ) || ! current_user_can( 'edit_post', $post_id ) ) {
            return;
        }
        $date = isset( $_POST['and_toolkit_event_date'] ) ? sanitize_text_field( wp_unslash( (string) $_POST['and_toolkit_event_date'] ) ) : '';
        if ( 1 === preg_match( '/^(\d{4})-(\d{2})-(\d{2})$/', $date, $m ) && checkdate( (int) $m[2], (int) $m[3], (int) $m[1] ) ) {
            update_post_meta( $post_id, '_wtk_event_date', $date );
        } else {
            delete_post_meta( $post_id, '_wtk_event_date' );
        }
    }

    // ========================================================================
    // FRONTEND ASSETS (beágyazott CSS + Vanilla JS, jQuery nélkül)
    // ========================================================================

    public static function enqueue_frontend_assets(): void {
        $config = self::get_config();
        wp_register_style( 'and-toolkit-frontend', false, [], self::VERSION );
        wp_enqueue_style( 'and-toolkit-frontend' );
        wp_add_inline_style( 'and-toolkit-frontend', self::frontend_css() );

        wp_register_script(
            'and-toolkit-frontend',
            false,
            [],
            self::VERSION,
            [
                'in_footer' => true,
                'strategy'  => $config['performance']['defer_scripts'] ? 'defer' : 'async',
            ]
        );
        wp_enqueue_script( 'and-toolkit-frontend' );

        $js_config = [
            'rest'      => esc_url_raw( rest_url( self::REST_NS . '/' ) ),
            'version'   => self::VERSION,
            'debounce'  => (int) $config['search']['debounce_ms'],
            'highlight' => (bool) $config['search']['highlight_matches'],
            'liveAjax'  => (bool) $config['search']['live_ajax'],
            'gdprOn'    => (bool) $config['gdpr']['enabled'],
            'gcm'       => (bool) $config['gdpr']['google_consent_mode_v2'],
            'ajax'      => esc_url_raw( admin_url( 'admin-ajax.php' ) ),
            'expiry'    => (int) $config['gdpr']['expiry_days'],
            'privacy'   => esc_url_raw( (string) $config['gdpr']['privacy_url'] ),
            'i18n'      => [
                'acceptAll'   => 'Összes elfogadása',
                'essential'   => 'Csak a szükségesek',
                'customize'   => 'Testreszabás',
                'save'        => 'Mentés',
                'necessary'   => 'Feltétlenül szükséges',
                'preferences' => 'Funkcionális',
                'analytics'   => 'Statisztikai',
                'marketing'   => 'Marketing',
                'intro'       => 'Az oldal sütiket használ. A nem kötelező kategóriák csak az Ön hozzájárulásával aktiválódnak.',
                'privacy'     => 'Adatvédelmi tájékoztató',
                'reopen'      => 'Süti-beállítások módosítása',
                'search'      => 'Keresés…',
                'noResult'    => 'Nincs találat.',
                'all'         => 'Összes típus',
                'copy'        => 'Link másolva',
                'close'       => 'Bezárás',
            ],
        ];
        wp_add_inline_script( 'and-toolkit-frontend', 'window.ATK = ' . wp_json_encode( $js_config ) . ';', 'before' );
        wp_add_inline_script( 'and-toolkit-frontend', self::frontend_js() );

        if ( is_singular() && comments_open() && ! is_user_logged_in() && $config['captcha']['protect_comments'] && ! self::captcha_should_bypass() ) {
            self::enqueue_captcha_provider_script();
        }
        // A buborék belépő űrlap a láblécben jelenik meg, de a CAPTCHA szkriptet még a wp_footer szkript-kiírása előtt sorba kell állítani.
        if ( ! empty( $config['wp_hide']['enabled'] ) && ! empty( $config['wp_hide']['enable_ajax_bubble_login'] ) && ! is_user_logged_in() ) {
            self::enqueue_login_form_captcha();
        }
    }

    public static function print_consent_mode_defaults(): void {
        $gdpr = self::get_config()['gdpr'];
        if ( ! $gdpr['enabled'] || ! $gdpr['google_consent_mode_v2'] ) {
            return;
        }
        // Statikus, felhasználói adatot nem tartalmazó szkript: minden tárolás alapból tiltott, a mentett hozzájárulást a süti alapján frissítjük.
        echo '<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("consent","default",{ad_storage:"denied",ad_user_data:"denied",ad_personalization:"denied",analytics_storage:"denied",functionality_storage:"denied",personalization_storage:"denied",security_storage:"granted",wait_for_update:500});(function(){try{var m=document.cookie.match(/(?:^|; )atk_consent=([^;]*)/);if(!m)return;var c=JSON.parse(decodeURIComponent(m[1])).cats||{};gtag("consent","update",{analytics_storage:c.analytics?"granted":"denied",ad_storage:c.marketing?"granted":"denied",ad_user_data:c.marketing?"granted":"denied",ad_personalization:c.marketing?"granted":"denied",functionality_storage:c.preferences?"granted":"denied",personalization_storage:c.preferences?"granted":"denied"});}catch(e){}})();</script>' . "\n"; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
    }

    private static function tracker_category( string $src ): string {
        $host = strtolower( (string) wp_parse_url( $src, PHP_URL_HOST ) );
        if ( '' === $host ) {
            return '';
        }
        $map = [
            'googletagmanager.com'  => 'analytics',
            'google-analytics.com'  => 'analytics',
            'hotjar.com'            => 'analytics',
            'clarity.ms'            => 'analytics',
            'connect.facebook.net'  => 'marketing',
            'doubleclick.net'       => 'marketing',
            'googlesyndication.com' => 'marketing',
            'analytics.tiktok.com'  => 'marketing',
            'snap.licdn.com'        => 'marketing',
        ];
        foreach ( $map as $domain => $category ) {
            if ( $host === $domain || str_ends_with( $host, '.' . $domain ) ) {
                return $category;
            }
        }
        return '';
    }

    public static function filter_script_loader_tag( $tag, $handle = '', $src = '' ) {
        $gdpr = self::get_config()['gdpr'];
        if ( ! is_string( $tag ) || ! $gdpr['enabled'] || ! $gdpr['auto_block_scripts'] || is_admin() ) {
            return $tag;
        }
        $category = self::tracker_category( (string) $src );
        if ( '' === $category ) {
            return $tag;
        }
        // Cache-barát: mindig blokkolt állapotban kerül a HTML-be, a böngészészben futó JS aktiválja hozzájárulás után.
        $tag = (string) preg_replace( '/\stype=("|\').*?\1/i', '', $tag );
        return (string) preg_replace( '/<script\b/i', '<script type="text/plain" data-atk-category="' . esc_attr( $category ) . '"', $tag, 1 );
    }

    private static function frontend_css(): string {
        return <<<'CSS'
.atk-widget{box-sizing:border-box;margin:0 0 1.25rem;padding:1rem;border:1px solid #d0d7de;border-radius:10px;background:#fff;color:#1f2328;font:14px/1.5 system-ui,sans-serif}
.atk-widget h3{margin:0 0 .6rem;font-size:1.05rem}
.atk-widget a{color:#2563eb}
.atk-widget ul{list-style:none;margin:0;padding:0}
.atk-widget li{padding:.35rem 0;border-top:1px solid #eaeef2}
.atk-widget li:first-child{border-top:0}
.atk-cal-list time,.atk-cd{display:inline-block;margin-left:.4rem;font-size:.85em;color:#57606a}
.atk-calendar--cards li{border:1px solid #d0d7de;border-radius:8px;margin-bottom:.5rem;padding:.6rem}
.atk-calendar--timeline li{border-left:3px solid #2563eb;padding-left:.75rem;margin-left:.25rem}
.atk-cal-grid{width:100%;border-collapse:collapse;text-align:center}
.atk-cal-grid td,.atk-cal-grid th{padding:.25rem;border:1px solid #eaeef2}
.atk-cal-grid .atk-has-event{background:#dbeafe;font-weight:700}
.atk-search input[type=search],.atk-search select{width:100%;box-sizing:border-box;margin-bottom:.5rem;padding:.5rem;border:1px solid #d0d7de;border-radius:6px}
.atk-search mark{background:#fde68a;color:inherit}
.atk-search .atk-excerpt{display:block;color:#57606a;font-size:.9em}
.atk-share{display:grid;gap:.5rem;grid-template-columns:repeat(var(--atk-cols,2),1fr)}
.atk-btn{display:inline-block;padding:.45rem .7rem;border:1px solid #2563eb;border-radius:8px;background:#2563eb;color:#fff!important;text-align:center;text-decoration:none;cursor:pointer;font:inherit}
.atk-social[data-style=pill] .atk-btn{border-radius:999px}
.atk-social[data-style=square] .atk-btn{border-radius:0}
.atk-social[data-style=minimal-outline] .atk-btn{background:transparent;color:#2563eb!important}
.atk-social[data-style=icon-only] .atk-btn{font-size:0}
.atk-social[data-style=icon-only] .atk-btn::before{content:attr(data-initial);font-size:14px;font-weight:700}
.atk-stats-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:.5rem}
.atk-stats--horizontal-strip .atk-stats-grid{grid-template-columns:repeat(auto-fit,minmax(110px,1fr))}
.atk-stats--clean-list .atk-stats-grid{grid-template-columns:1fr}
.atk-stat b{display:block;font-size:1.6em}
.atk-stats--featured-hero .atk-stat b{font-size:2.4em}
.atk-info-banner{position:relative;display:flex;flex-wrap:wrap;gap:.6rem;align-items:center;justify-content:center;padding:.6rem 2.5rem .6rem 1rem;color:#fff;font:14px/1.4 system-ui,sans-serif;overflow:hidden}
.atk-info-banner[data-sticky=true]{position:sticky;top:0;z-index:9990}
.atk-info-banner[data-size=compact]{font-size:12px;padding-top:.3rem;padding-bottom:.3rem}
.atk-info-banner[data-size=large-hero]{font-size:18px;padding-top:1.4rem;padding-bottom:1.4rem}
.atk-info-banner[data-font=display-bold]{font-weight:800}
.atk-info-banner[data-font=serif-editorial]{font-family:Georgia,serif}
.atk-info-banner[data-font=mono-tech]{font-family:ui-monospace,monospace}
.atk-info-banner[data-color=cobalt-gradient]{background:linear-gradient(90deg,#1e3a8a,#2563eb)}
.atk-info-banner[data-color=emerald-aurora]{background:linear-gradient(90deg,#047857,#10b981)}
.atk-info-banner[data-color=amber-highlight]{background:linear-gradient(90deg,#b45309,#f59e0b);color:#1f2328}
.atk-info-banner[data-color=rose-alert]{background:linear-gradient(90deg,#be123c,#f43f5e)}
.atk-info-banner[data-color=slate-obsidian]{background:linear-gradient(90deg,#0f172a,#334155)}
.atk-info-banner a{color:inherit;text-decoration:underline;font-weight:700}
.atk-info-banner .atk-badge{padding:.1rem .5rem;border-radius:999px;background:rgba(255,255,255,.2);font-size:.8em}
.atk-info-banner .atk-x{position:absolute;right:.6rem;top:50%;transform:translateY(-50%);background:none;border:0;color:inherit;font-size:1.3em;cursor:pointer}
.atk-anim-pulse-glow{animation:atkPulse 2.4s ease-in-out infinite}
.atk-anim-slide-down{animation:atkSlide .6s ease-out}
.atk-anim-shimmer{background-size:200% 100%!important;animation:atkShimmer 3s linear infinite}
.atk-anim-marquee .atk-banner-text{display:inline-block;white-space:nowrap;animation:atkMarquee 14s linear infinite}
@keyframes atkPulse{50%{box-shadow:0 0 18px rgba(37,99,235,.7)}}
@keyframes atkSlide{from{transform:translateY(-100%)}}
@keyframes atkShimmer{to{background-position:-200% 0}}
@keyframes atkMarquee{from{transform:translateX(60%)}to{transform:translateX(-60%)}}
@media (prefers-reduced-motion:reduce){.atk-info-banner,.atk-info-banner *{animation:none!important}}
.atk-gdpr-cookie .atk-row{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:.6rem}
.atk-gdpr-cookie .atk-btn.atk-alt{background:transparent;color:#2563eb!important}
.atk-gdpr-cookie label{display:block;margin:.3rem 0}
.atk-gdpr--bottom-bar{position:fixed;left:0;right:0;bottom:0;z-index:99990;margin:0;border-radius:0}
.atk-gdpr--floating-card{position:fixed;right:1rem;bottom:1rem;z-index:99990;max-width:360px;margin:0;box-shadow:0 8px 30px rgba(0,0,0,.25)}
.atk-gdpr--modal-center{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:99990;max-width:480px;width:calc(100% - 2rem);margin:0;box-shadow:0 0 0 100vmax rgba(0,0,0,.5)}
.atk-reopen{position:fixed;left:.75rem;bottom:.75rem;z-index:99989;padding:.3rem .6rem;border-radius:999px;background:#fff;color:#2563eb;border:1px solid #d0d7de;font:12px system-ui,sans-serif;text-decoration:none}
.atk-bubble-login{position:fixed;bottom:1rem;z-index:99988}
.atk-bubble-login[data-position=bottom-right]{right:1rem}
.atk-bubble-login[data-position=bottom-left]{left:1rem}
.atk-bubble-trigger{padding:.6rem 1rem;border:0;border-radius:999px;background:#2563eb;color:#fff;box-shadow:0 4px 16px rgba(0,0,0,.25);cursor:pointer;font:600 14px system-ui,sans-serif}
.atk-bubble-panel{position:absolute;bottom:3.2rem;width:290px;max-width:calc(100vw - 2rem);padding:1rem;border-radius:12px;background:#fff;color:#1f2328;box-shadow:0 8px 30px rgba(0,0,0,.3);font:14px/1.4 system-ui,sans-serif}
.atk-bubble-login[data-position=bottom-right] .atk-bubble-panel{right:0}
.atk-bubble-panel input[type=text],.atk-bubble-panel input[type=password]{width:100%;box-sizing:border-box}
.atk-bubble-msg{color:#b42318;margin:.4rem 0 0}
.atk-hidden{display:none!important}
@media (prefers-color-scheme:dark){.atk-widget{background:#161b22;color:#e6edf3;border-color:#30363d}.atk-widget li{border-color:#30363d}.atk-widget a{color:#58a6ff}.atk-cal-grid td,.atk-cal-grid th{border-color:#30363d}.atk-cal-grid .atk-has-event{background:#1f3a5f}.atk-search input[type=search],.atk-search select{background:#0d1117;color:inherit;border-color:#30363d}}
CSS;
    }

    private static function frontend_js(): string {
        return <<<'JS'
(function(){
'use strict';
var C=window.ATK||{},d=document,T=C.i18n||{};
function all(s,r){return Array.prototype.slice.call((r||d).querySelectorAll(s));}
function el(t,c,x){var e=d.createElement(t);if(c)e.className=c;if(x!==undefined)e.textContent=x;return e;}
function url(p,q){return C.rest+p+(q?(C.rest.indexOf('?')>-1?'&':'?')+q:'');}
function post(p,body){return fetch(url(p),{method:'POST',credentials:'same-origin',keepalive:true,headers:{'Content-Type':'application/json'},body:JSON.stringify(body||{})}).then(function(r){return r.json();});}
function rid(){var a=new Uint8Array(16);(window.crypto||{getRandomValues:function(x){for(var i=0;i<x.length;i++)x[i]=Math.random()*256;}}).getRandomValues(a);return Array.prototype.map.call(a,function(b){return('0'+b.toString(16)).slice(-2);}).join('');}

/* ---------- Hozzájárulás (GDPR) ---------- */
function getConsent(){var m=d.cookie.match(/(?:^|; )atk_consent=([^;]*)/);if(!m)return null;try{return JSON.parse(decodeURIComponent(m[1]));}catch(e){return null;}}
function allowed(cat){if(!C.gdprOn)return true;if(cat==='necessary')return true;var c=getConsent();return !!(c&&c.cats&&c.cats[cat]);}
function activateScripts(){all('script[type="text/plain"][data-atk-category]').forEach(function(s){if(!allowed(s.getAttribute('data-atk-category')))return;var n=d.createElement('script');for(var i=0;i<s.attributes.length;i++){var a=s.attributes[i];if(a.name!=='type'&&a.name!=='data-atk-category')n.setAttribute(a.name,a.value);}n.text=s.text;if(n.src&&!s.hasAttribute('async'))n.async=false;s.parentNode.replaceChild(n,s);});}
function applyConsent(cats){
 if(C.gcm&&typeof window.gtag==='function'){window.gtag('consent','update',{analytics_storage:cats.analytics?'granted':'denied',ad_storage:cats.marketing?'granted':'denied',ad_user_data:cats.marketing?'granted':'denied',ad_personalization:cats.marketing?'granted':'denied',functionality_storage:cats.preferences?'granted':'denied',personalization_storage:cats.preferences?'granted':'denied'});}
 activateScripts();trackVisit();
}
function saveConsent(level,cats){
 var prev=getConsent(),id=(prev&&prev.id)||rid();
 var v=encodeURIComponent(JSON.stringify({v:1,id:id,level:level,cats:cats}));
 d.cookie='atk_consent='+v+'; path=/; max-age='+(C.expiry*86400)+'; SameSite=Lax'+(location.protocol==='https:'?'; Secure':'');
 post('cookie-consent',{consent_level:level,consent_id:id,categories:cats}).catch(function(){});
 applyConsent(cats);syncBanners();
}
function syncBanners(){var done=!!getConsent();all('.atk-gdpr-cookie').forEach(function(b){if(b.getAttribute('data-style')!=='sidebar-widget')b.classList.toggle('atk-hidden',done);});all('.atk-reopen').forEach(function(a){a.classList.toggle('atk-hidden',!done);});}
function buildBanner(b){
 if(b.getAttribute('data-ready'))return;b.setAttribute('data-ready','1');
 var p=el('p','',T.intro);b.appendChild(p);
 var panel=el('div','atk-hidden'),boxes={};
 [['necessary',true],['preferences',false],['analytics',false],['marketing',false]].forEach(function(c){
  var l=el('label'),i=d.createElement('input');i.type='checkbox';i.checked=c[1];i.disabled=c[1];boxes[c[0]]=i;l.appendChild(i);l.appendChild(d.createTextNode(' '+T[c[0]]));panel.appendChild(l);});
 var row=el('div','atk-row');
 function btn(txt,alt,fn){var x=el('button','atk-btn'+(alt?' atk-alt':''),txt);x.type='button';x.addEventListener('click',fn);return x;}
 row.appendChild(btn(T.acceptAll,false,function(){saveConsent('all',{necessary:true,preferences:true,analytics:true,marketing:true});}));
 row.appendChild(btn(T.essential,false,function(){saveConsent('essential',{necessary:true,preferences:false,analytics:false,marketing:false});}));
 var cust=btn(T.customize,true,function(){panel.classList.toggle('atk-hidden');});row.appendChild(cust);
 panel.appendChild(btn(T.save,false,function(){saveConsent('custom',{necessary:true,preferences:boxes.preferences.checked,analytics:boxes.analytics.checked,marketing:boxes.marketing.checked});}));
 b.appendChild(row);b.appendChild(panel);
 all('a',b).forEach(function(a){b.appendChild(a);b.appendChild(d.createTextNode(' '));});
 var cur=getConsent();if(cur&&cur.cats){['preferences','analytics','marketing'].forEach(function(k){boxes[k].checked=!!cur.cats[k];});}
}

/* ---------- Statisztika ---------- */
var visitSent=false;
function trackVisit(){
 if(visitSent)return;
 if(!allowed('analytics'))return;
 try{if(sessionStorage.getItem('atk_v'))return;sessionStorage.setItem('atk_v','1');}catch(e){}
 visitSent=true;post('track-visit',{}).catch(function(){});
}
var DL=/\.(pdf|zip|rar|7z|docx?|xlsx?|pptx?|csv|txt|mp3|mp4|epub)$/i;
d.addEventListener('click',function(ev){
 var a=ev.target.closest?ev.target.closest('a[href]'):null;if(!a)return;
 try{var u=new URL(a.href,location.href);if(u.host===location.host&&DL.test(u.pathname)){post('track-download',{url:u.href}).catch(function(){});}}catch(e){}
});

/* ---------- Kereső ---------- */
function esc(s){return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}
function mark(node,text,q){
 if(!C.highlight||!q){node.textContent=text;return;}
 var parts=text.split(new RegExp('('+esc(q)+')','ig'));
 parts.forEach(function(p){if(p.toLowerCase()===q.toLowerCase()){node.appendChild(el('mark','',p));}else{node.appendChild(d.createTextNode(p));}});
}
function initSearch(w){
 if(w.getAttribute('data-ready'))return;w.setAttribute('data-ready','1');
 var inp=d.createElement('input');inp.type='search';inp.placeholder=T.search;inp.setAttribute('aria-label',T.search);
 var types=[];try{types=JSON.parse(w.getAttribute('data-types')||'[]');}catch(e){}
 var sel=null;if(types.length>1){sel=d.createElement('select');var o=el('option','',T.all);o.value='';sel.appendChild(o);types.forEach(function(t){var x=el('option','',t.label);x.value=t.slug;sel.appendChild(x);});w.appendChild(sel);}
 var list=el('ul');list.setAttribute('aria-live','polite');w.appendChild(inp);w.appendChild(list);
 var timer=null,seq=0;
 function run(){
  var q=inp.value.trim();list.textContent='';if(q.length<2)return;
  var my=++seq;
  fetch(url('search','q='+encodeURIComponent(q)+(sel&&sel.value?'&type='+encodeURIComponent(sel.value):'')),{credentials:'same-origin'}).then(function(r){return r.json();}).then(function(j){
   if(my!==seq)return;list.textContent='';
   if(!j.results||!j.results.length){list.appendChild(el('li','',T.noResult));return;}
   j.results.forEach(function(it){var li=el('li'),a=el('a');a.href=it.url;mark(a,it.title,q);li.appendChild(a);
    if(w.getAttribute('data-layout')!=='minimal'&&it.excerpt){var s=el('span','atk-excerpt');mark(s,it.excerpt,q);li.appendChild(s);}list.appendChild(li);});
  }).catch(function(){});
 }
 inp.addEventListener('input',function(){if(!C.liveAjax||w.getAttribute('data-ajax')==='false')return;clearTimeout(timer);timer=setTimeout(run,C.debounce);});
 inp.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();clearTimeout(timer);run();}});
 if(sel)sel.addEventListener('change',run);
}

/* ---------- Megosztás, banner, háttér lazy load ---------- */
all('.atk-copy').forEach(function(b){b.addEventListener('click',function(){var u=b.getAttribute('data-url')||location.href;var done=function(){var o=b.textContent;b.textContent=T.copy;setTimeout(function(){b.textContent=o;},1500);};if(navigator.clipboard){navigator.clipboard.writeText(u).then(done);}});});
all('.atk-info-banner[data-dismissible=true]').forEach(function(b){
 var key='atk_b_'+(b.getAttribute('data-key')||'');try{if(sessionStorage.getItem(key)){b.classList.add('atk-hidden');return;}}catch(e){}
 var x=el('button','atk-x','×');x.type='button';x.setAttribute('aria-label',T.close);x.addEventListener('click',function(){b.classList.add('atk-hidden');try{sessionStorage.setItem(key,'1');}catch(e){}});b.appendChild(x);
});
var bgs=all('[data-atk-bg]');
function loadBg(n){var u=n.getAttribute('data-atk-bg');if(u){n.style.backgroundImage='url("'+u.replace(/"/g,'%22')+'")';n.removeAttribute('data-atk-bg');}}
if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){loadBg(e.target);io.unobserve(e.target);}});});bgs.forEach(function(n){io.observe(n);});}else{bgs.forEach(loadBg);}

/* ---------- AJAX belépő buborék ---------- */
all('.atk-bubble-login').forEach(function(w){
 var t=w.querySelector('.atk-bubble-trigger'),p=w.querySelector('.atk-bubble-panel'),f=w.querySelector('form');if(!t||!p||!f)return;
 t.addEventListener('click',function(){var hidden=p.classList.toggle('atk-hidden');t.setAttribute('aria-expanded',String(!hidden));});
 var msg=el('p','atk-bubble-msg');msg.setAttribute('role','alert');f.appendChild(msg);
 f.addEventListener('submit',function(e){
  if(!window.fetch||!C.ajax||!window.FormData)return;
  e.preventDefault();msg.textContent='…';
  var go=function(){var fd=new FormData(f);fd.append('action','wtk_bubble_login');
   fetch(C.ajax,{method:'POST',credentials:'same-origin',body:fd}).then(function(r){return r.json();}).then(function(j){if(j&&j.success){location.reload();}else{msg.textContent=(j&&j.data&&j.data.message)||'Hiba';}}).catch(function(){msg.textContent='Hálózati hiba';});};
  (window.atkCaptchaRefresh?window.atkCaptchaRefresh(f):Promise.resolve()).then(go,go);
 });
});

/* ---------- Indítás ---------- */
all('.atk-search').forEach(initSearch);
all('.atk-recaptcha-token[data-sitekey]').forEach(function(inp){var sk=inp.getAttribute('data-sitekey');if(sk&&window.grecaptcha&&window.grecaptcha.ready){window.grecaptcha.ready(function(){window.grecaptcha.execute(sk,{action:'submit'}).then(function(tok){inp.value=tok;});});}});
if(C.gdprOn){all('.atk-gdpr-cookie').forEach(buildBanner);syncBanners();all('[data-atk-open-consent]').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();all('.atk-gdpr-cookie').forEach(function(b){b.classList.remove('atk-hidden');});});});activateScripts();}
trackVisit();
})();
JS;
    }

    // ========================================================================
    // RÖVIDKÓDOK / WIDGETEK
    // ========================================================================

    private static function pick( string $value, array $allowed, string $fallback ): string {
        return in_array( $value, $allowed, true ) ? $value : $fallback;
    }

    private static function format_number( int $n, string $format ): string {
        return match ( $format ) {
            'compact' => $n >= 999950 ? number_format( $n / 1000000, 1, '.', '' ) . 'M' : ( $n >= 1000 ? number_format( $n / 1000, 1, '.', '' ) . 'K' : (string) $n ),
            'comma'   => number_format( $n, 0, '.', ',' ),
            default   => number_format( $n, 0, ',', ' ' ),
        };
    }

    public static function render_calendar_widget( $atts = [] ): string {
        $config = self::get_config()['calendar'];
        if ( ! $config['enabled'] ) {
            return '';
        }
        $atts  = shortcode_atts( [ 'style' => $config['style'], 'limit' => (string) $config['max_items'] ], is_array( $atts ) ? $atts : [], 'wtk_calendar' );
        $style = self::pick( (string) $atts['style'], [ 'cards', 'compact', 'grid', 'timeline' ], 'cards' );
        $limit = max( 1, min( 20, absint( $atts['limit'] ) ) );

        $types = array_values( array_filter( [ 'post', 'page', 'event' ], 'post_type_exists' ) );
        $query = new \WP_Query(
            [
                'post_type'           => $types,
                'post_status'         => 'publish',
                'has_password'        => false,
                'posts_per_page'      => $limit,
                'no_found_rows'       => true,
                'ignore_sticky_posts' => true,
                'meta_key'            => '_wtk_event_date', // phpcs:ignore WordPress.DB.SlowDBQuery
                'meta_value'          => wp_date( 'Y-m-d' ), // phpcs:ignore WordPress.DB.SlowDBQuery
                'meta_compare'        => '>=',
                'meta_type'           => 'DATE',
                'orderby'             => 'meta_value',
                'order'               => 'ASC',
            ]
        );
        $events = [];
        $today  = new \DateTimeImmutable( 'today', wp_timezone() );
        foreach ( $query->posts as $post ) {
            $date = (string) get_post_meta( $post->ID, '_wtk_event_date', true );
            try {
                $days = (int) $today->diff( new \DateTimeImmutable( $date, wp_timezone() ) )->format( '%r%a' );
            } catch ( \Exception $e ) {
                continue;
            }
            $events[] = [ 'date' => $date, 'days' => $days, 'title' => get_the_title( $post ), 'url' => (string) get_permalink( $post ) ];
        }

        $html = '<section class="atk-widget atk-calendar atk-calendar--' . esc_attr( $style ) . '" data-limit="' . esc_attr( (string) $limit ) . '"><h3>' . esc_html( $config['title'] ) . '</h3>';
        if ( ! $events ) {
            return $html . '<p>Nincs közelgő esemény.</p></section>';
        }
        if ( 'grid' === $style ) {
            return $html . self::render_calendar_grid( $events ) . '</section>';
        }
        $html .= '<ul class="atk-cal-list">';
        foreach ( $events as $e ) {
            $countdown = '';
            if ( $config['show_countdown'] ) {
                $countdown = 0 === $e['days'] ? 'ma' : ( 1 === $e['days'] ? 'holnap' : $e['days'] . ' nap múlva' );
                $countdown = '<span class="atk-cd">' . esc_html( $countdown ) . '</span>';
            }
            $html .= '<li><a href="' . esc_url( $e['url'] ) . '">' . esc_html( $e['title'] ) . '</a><time datetime="' . esc_attr( $e['date'] ) . '">' . esc_html( $e['date'] ) . '</time>' . $countdown . '</li>';
        }
        return $html . '</ul></section>';
    }

    private static function render_calendar_grid( array $events ): string {
        $now    = new \DateTimeImmutable( 'now', wp_timezone() );
        $first  = $now->modify( 'first day of this month' );
        $days   = (int) $now->format( 't' );
        $offset = (int) $first->format( 'N' ) - 1;
        $by     = [];
        foreach ( $events as $e ) {
            $by[ $e['date'] ][] = $e;
        }
        $html = '<table class="atk-cal-grid"><caption>' . esc_html( wp_date( 'Y. F', $first->getTimestamp() ) ) . '</caption><thead><tr>';
        foreach ( [ 'H', 'K', 'Sze', 'Cs', 'P', 'Szo', 'V' ] as $label ) {
            $html .= '<th>' . esc_html( $label ) . '</th>';
        }
        $html .= '</tr></thead><tbody><tr>' . str_repeat( '<td></td>', $offset );
        for ( $day = 1; $day <= $days; $day++ ) {
            $date  = $now->format( 'Y-m' ) . '-' . sprintf( '%02d', $day );
            $cell  = (string) $day;
            $class = '';
            if ( isset( $by[ $date ] ) ) {
                $e     = $by[ $date ][0];
                $cell  = '<a href="' . esc_url( $e['url'] ) . '" title="' . esc_attr( $e['title'] ) . '">' . $day . '</a>';
                $class = ' class="atk-has-event"';
            }
            $html .= '<td' . $class . '>' . $cell . '</td>';
            if ( 0 === ( $offset + $day ) % 7 && $day < $days ) {
                $html .= '</tr><tr>';
            }
        }
        $html .= str_repeat( '<td></td>', ( 7 - ( ( $offset + $days ) % 7 ) ) % 7 );
        return $html . '</tr></tbody></table>';
    }

    public static function render_search_widget( $atts = [] ): string {
        $config = self::get_config()['search'];
        if ( ! $config['enabled'] ) {
            return '';
        }
        $atts   = shortcode_atts( [ 'layout' => $config['layout'], 'ajax' => $config['live_ajax'] ? 'true' : 'false' ], is_array( $atts ) ? $atts : [], 'wtk_search' );
        $layout = self::pick( (string) $atts['layout'], [ 'minimal', 'detailed', 'compact-cards' ], 'detailed' );
        $ajax   = self::pick( strtolower( (string) $atts['ajax'] ), [ 'true', 'false' ], 'true' );
        $types  = [];
        foreach ( $config['post_types'] as $slug ) {
            $object = get_post_type_object( (string) $slug );
            if ( $object && $object->public ) {
                $types[] = [ 'slug' => (string) $slug, 'label' => (string) $object->labels->singular_name ];
            }
        }
        return sprintf(
            '<section class="atk-widget atk-search" data-layout="%s" data-ajax="%s" data-debounce="%d" data-types="%s"><h3>%s</h3></section>',
            esc_attr( $layout ),
            esc_attr( $ajax ),
            absint( $config['debounce_ms'] ),
            esc_attr( (string) wp_json_encode( $types ) ),
            esc_html( $config['title'] )
        );
    }

    public static function render_social_widget( $atts = [] ): string {
        $config = self::get_config()['social'];
        if ( ! $config['enabled'] ) {
            return '';
        }
        $atts  = shortcode_atts( [ 'style' => $config['button_style'], 'cols' => (string) $config['columns'] ], is_array( $atts ) ? $atts : [], 'wtk_social' );
        $style = self::pick( (string) $atts['style'], [ 'rounded', 'pill', 'square', 'icon-only', 'minimal-outline' ], 'rounded' );
        $cols  = max( 1, min( 4, absint( $atts['cols'] ) ) );

        $page_url = is_singular() ? (string) get_permalink() : home_url( '/' );
        $title    = is_singular() ? wp_strip_all_tags( get_the_title() ) : get_bloginfo( 'name' );
        $defs     = [
            'facebook'  => [ 'Facebook', 'https://www.facebook.com/sharer/sharer.php?u=%1$s' ],
            'x'         => [ 'X', 'https://twitter.com/intent/tweet?url=%1$s&text=%2$s' ],
            'linkedin'  => [ 'LinkedIn', 'https://www.linkedin.com/sharing/share-offsite/?url=%1$s' ],
            'whatsapp'  => [ 'WhatsApp', 'https://api.whatsapp.com/send?text=%2$s%%20%1$s' ],
            'telegram'  => [ 'Telegram', 'https://t.me/share/url?url=%1$s&text=%2$s' ],
            'reddit'    => [ 'Reddit', 'https://www.reddit.com/submit?url=%1$s&title=%2$s' ],
            'pinterest' => [ 'Pinterest', 'https://pinterest.com/pin/create/button/?url=%1$s&description=%2$s' ],
            'email'     => [ 'E-mail', 'mailto:?subject=%2$s&body=%1$s' ],
        ];
        $html = '<section class="atk-widget atk-social" data-style="' . esc_attr( $style ) . '"><h3>' . esc_html( $config['title'] ) . '</h3><div class="atk-share" style="--atk-cols:' . esc_attr( (string) $cols ) . '">';
        foreach ( $config['platforms'] as $platform ) {
            if ( ! isset( $defs[ $platform ] ) ) {
                continue;
            }
            $tracked = add_query_arg( [ 'utm_source' => 'and_toolkit', 'utm_medium' => 'sidebar', 'utm_campaign' => $platform ], $page_url );
            $link    = sprintf( $defs[ $platform ][1], rawurlencode( $tracked ), rawurlencode( $title ) );
            $html   .= '<a class="atk-btn" data-initial="' . esc_attr( mb_substr( $defs[ $platform ][0], 0, 1 ) ) . '" href="' . esc_url( $link ) . '" target="_blank" rel="noopener noreferrer">' . esc_html( $defs[ $platform ][0] ) . '</a>';
        }
        $html .= '<button type="button" class="atk-btn atk-copy" data-initial="⧉" data-url="' . esc_url( $page_url ) . '">Link másolása</button>';
        return $html . '</div></section>';
    }

    public static function render_stats_widget( $atts = [] ): string {
        $config = self::get_config()['stats'];
        if ( ! $config['enabled'] ) {
            return '';
        }
        $atts   = shortcode_atts( [ 'style' => $config['style'], 'format' => $config['number_format'] ], is_array( $atts ) ? $atts : [], 'wtk_stats' );
        $style  = self::pick( (string) $atts['style'], [ 'grid-cards', 'clean-list', 'horizontal-strip', 'featured-hero' ], 'grid-cards' );
        $format = self::pick( (string) $atts['format'], [ 'compact', 'exact', 'comma' ], 'compact' );

        $html = '<section class="atk-widget atk-stats atk-stats--' . esc_attr( $style ) . '" data-style="' . esc_attr( $style ) . '" data-format="' . esc_attr( $format ) . '"><h3>' . esc_html( $config['title'] ) . '</h3><div class="atk-stats-grid">';
        if ( $config['unique_visitors'] ) {
            $html .= '<div class="atk-stat"><b>' . esc_html( self::format_number( (int) get_option( 'and_toolkit_visits_total', 0 ), $format ) ) . '</b>Látogatás (munkamenet)</div>';
        }
        if ( $config['total_downloads'] ) {
            $html .= '<div class="atk-stat"><b>' . esc_html( self::format_number( (int) get_option( 'and_toolkit_downloads_total', 0 ), $format ) ) . '</b>Letöltés</div>';
        }
        $daily = get_option( 'and_toolkit_visits_daily', [] );
        $daily = is_array( $daily ) ? $daily : [];
        $week  = 0;
        for ( $i = 0; $i < 7; $i++ ) {
            $week += (int) ( $daily[ wp_date( 'Y-m-d', time() - $i * DAY_IN_SECONDS ) ] ?? 0 );
        }
        $html .= '<div class="atk-stat"><b>' . esc_html( self::format_number( $week, $format ) ) . '</b>Látogatás az elmúlt 7 napban</div>';
        return $html . '</div></section>';
    }

    private static bool $cookie_widget_rendered = false;

    public static function render_cookie_consent_widget( $atts = [] ): string {
        $config = self::get_config()['gdpr'];
        if ( ! $config['enabled'] ) {
            return '';
        }
        self::$cookie_widget_rendered = true;
        return self::cookie_widget_html( (string) $config['display_style'] );
    }

    private static function cookie_widget_html( string $requested_style ): string {
        $config = self::get_config()['gdpr'];
        $style  = self::pick( $requested_style, [ 'sidebar-widget', 'bottom-bar', 'floating-card', 'modal-center' ], 'sidebar-widget' );
        return sprintf(
            '<section class="atk-widget atk-gdpr-cookie atk-gdpr--%1$s" data-style="%1$s" data-expiry="%2$d" data-gcm-v2="%3$s" role="region" aria-label="%4$s"><h3>%4$s</h3><a href="%5$s">Adatvédelmi tájékoztató</a> <a href="#" data-atk-open-consent>Süti-beállítások módosítása</a></section>',
            esc_attr( $style ),
            absint( $config['expiry_days'] ),
            esc_attr( $config['google_consent_mode_v2'] ? 'true' : 'false' ),
            esc_attr( $config['title'] ),
            esc_url( $config['privacy_url'] )
        );
    }

    private static function banner_html( array $config ): string {
        $preset    = self::pick( (string) $config['color_preset'], array_keys( self::option_sets()['banner_color'] ), 'cobalt-gradient' );
        $style_css = '';
        if ( 'custom' === $preset ) {
            $bg        = sanitize_hex_color( (string) $config['custom_bg_hex'] ) ?: '#1E3A8A';
            $fg        = sanitize_hex_color( (string) $config['custom_text_hex'] ) ?: '#FFFFFF';
            $style_css = ' style="background:' . esc_attr( $bg ) . ';color:' . esc_attr( $fg ) . '"';
        }
        $anim = self::pick( (string) $config['animation'], array_keys( self::option_sets()['banner_anim'] ), 'none' );
        $size = self::pick( (string) $config['size_preset'], array_keys( self::option_sets()['banner_size'] ), 'standard' );
        $font = self::pick( (string) $config['font_style'], array_keys( self::option_sets()['banner_font'] ), 'sans-clean' );
        $cta  = '' !== (string) $config['cta_url'] ? ' <a href="' . esc_url( $config['cta_url'] ) . '">' . esc_html( $config['cta_label'] ) . '</a>' : '';
        return sprintf(
            '<aside class="atk-info-banner atk-anim-%1$s" role="region" aria-label="Információ" data-scope="%2$s" data-color="%3$s" data-size="%4$s" data-font="%5$s" data-anim="%1$s" data-sticky="%6$s" data-dismissible="%7$s" data-key="%8$s"%9$s><span class="atk-badge">%10$s</span> <span class="atk-banner-text"><strong>%11$s</strong> <span>%12$s</span></span>%13$s</aside>',
            esc_attr( $anim ),
            esc_attr( (string) $config['visibility_scope'] ),
            esc_attr( $preset ),
            esc_attr( $size ),
            esc_attr( $font ),
            $config['sticky_top'] ? 'true' : 'false',
            $config['dismissible'] ? 'true' : 'false',
            esc_attr( substr( md5( (string) $config['headline'] ), 0, 8 ) ),
            $style_css, // már escape-elt
            esc_html( $config['badge_text'] ),
            esc_html( $config['headline'] ),
            esc_html( $config['subtext'] ),
            $cta // már escape-elt
        );
    }

    public static function render_info_banner_shortcode( $atts = [] ): string {
        $config = self::get_config()['banner'];
        if ( ! $config['enabled'] ) {
            return '';
        }
        return self::banner_html( $config );
    }

    public static function render_speed_badge_shortcode( $atts = [] ): string {
        $opt = self::get_config()['optimizer'];
        if ( ! $opt['enabled'] ) {
            return '';
        }
        return sprintf(
            '<div class="atk-widget atk-speed-badge" data-format="%s" data-cache="%s"><span>And ToolKit Speed Optimizer v%s · Oldal-gyorsítótár: %s · Feltöltési limit: %s</span></div>',
            esc_attr( $opt['convert_format'] ),
            esc_attr( $opt['page_cache_enabled'] ? 'on' : 'off' ),
            esc_html( self::VERSION ),
            esc_html( $opt['page_cache_enabled'] ? 'be' : 'ki' ),
            esc_html( size_format( self::filter_upload_size_limit( wp_max_upload_size() ) ) )
        );
    }

    public static function render_security_badge_shortcode( $atts = [] ): string {
        if ( ! self::get_config()['audit_log']['enabled'] ) {
            return '';
        }
        // Publikus kimenet: nem árul el beállítást vagy konfigurációs részletet.
        return '<div class="atk-widget atk-security-badge"><span>' . esc_html( 'Védve: And ToolKit Security Audit v' . self::VERSION ) . '</span></div>';
    }

    // ========================================================================
    // BOTVÉDELEM: GOOGLE RECAPTCHA V3 & CLOUDFLARE TURNSTILE (v0.6.0)
    // ========================================================================

    private static function captcha_active_keys(): array {
        $cap      = self::get_config()['captcha'];
        $provider = 'turnstile' === $cap['provider'] ? 'turnstile' : 'recaptcha-v3';
        $site_key = 'turnstile' === $provider ? (string) $cap['turnstile_site_key'] : (string) $cap['recaptcha_site_key'];
        $secret   = 'turnstile' === $provider ? (string) $cap['turnstile_secret_key'] : (string) $cap['recaptcha_secret_key'];
        return [
            'provider'   => $provider,
            'site_key'   => trim( $site_key ),
            'secret_key' => trim( $secret ),
            'threshold'  => max( 0.1, min( 0.9, (float) $cap['score_threshold'] ) ),
        ];
    }

    private static function captcha_should_bypass(): bool {
        $cap = self::get_config()['captcha'];
        if ( ! $cap['enabled'] ) {
            return true;
        }
        if ( $cap['bypass_logged_in_admins'] && is_user_logged_in() && current_user_can( 'manage_options' ) ) {
            return true;
        }
        $keys = self::captcha_active_keys();
        return '' === $keys['site_key'] || '' === $keys['secret_key'];
    }

    private static bool $captcha_script_queued = false;

    private static function enqueue_captcha_provider_script(): void {
        if ( self::$captcha_script_queued ) {
            return; // az inline kezelőt oldalanként csak egyszer adjuk hozzá
        }
        self::$captcha_script_queued = true;
        $keys                        = self::captcha_active_keys();
        if ( 'turnstile' === $keys['provider'] ) {
            wp_enqueue_script( 'atk-turnstile', 'https://challenges.cloudflare.com/turnstile/v0/api.js', [], null, true ); // phpcs:ignore WordPress.WP.EnqueuedResourceParameters.MissingVersion
        } else {
            wp_enqueue_script( 'atk-recaptcha-v3', 'https://www.google.com/recaptcha/api.js?render=' . rawurlencode( $keys['site_key'] ), [], null, true ); // phpcs:ignore WordPress.WP.EnqueuedResourceParameters.MissingVersion
            // A reCAPTCHA token ~2 percig érvényes: ezért beküldéskor kérünk frisset (az AJAX buborék űrlap saját kezelővel hívja az atkCaptchaRefresh-t).
            wp_add_inline_script(
                'atk-recaptcha-v3',
                '(function(){var d=document;function run(k){return new Promise(function(res){if(!window.grecaptcha||!window.grecaptcha.ready){res("");return;}window.grecaptcha.ready(function(){window.grecaptcha.execute(k,{action:"atk_submit"}).then(res,function(){res("");});});});}window.atkCaptchaRefresh=function(f){var i=f.querySelector(".atk-recaptcha-token[data-sitekey]");if(!i){return Promise.resolve();}return run(i.getAttribute("data-sitekey")).then(function(t){i.value=t;});};d.addEventListener("submit",function(e){var f=e.target;if(!f||!f.querySelector||f.__atkOk||f.id==="atk-bubble-form"){return;}if(!f.querySelector(".atk-recaptcha-token[data-sitekey]")){return;}e.preventDefault();window.atkCaptchaRefresh(f).then(function(){f.__atkOk=true;if(f.requestSubmit){f.requestSubmit(e.submitter||undefined);}else{f.submit();}});},true);})();'
            );
        }
    }

    public static function enqueue_captcha_login_assets(): void {
        $cap = self::get_config()['captcha'];
        if ( self::captcha_should_bypass() || ( ! $cap['protect_login'] && ! $cap['protect_register'] && ! $cap['protect_lost_password'] ) ) {
            return;
        }
        self::enqueue_captcha_provider_script();
    }

    public static function render_captcha_field(): void {
        if ( self::captcha_should_bypass() ) {
            return;
        }
        $cap  = self::get_config()['captcha'];
        $keys = self::captcha_active_keys();
        if ( 'turnstile' === $keys['provider'] ) {
            $mode  = self::pick( (string) $cap['turnstile_mode'], [ 'managed', 'non-interactive', 'invisible' ], 'managed' );
            $theme = self::pick( (string) $cap['turnstile_theme'], [ 'auto', 'light', 'dark' ], 'auto' );
            printf(
                '<div class="cf-turnstile" data-sitekey="%s" data-appearance="%s" data-theme="%s" style="margin:10px 0"></div>',
                esc_attr( $keys['site_key'] ),
                esc_attr( $mode ),
                esc_attr( $theme )
            );
            return;
        }
        printf(
            '<input type="hidden" name="atk_captcha_token" class="atk-recaptcha-token" data-sitekey="%s" value="" />',
            esc_attr( $keys['site_key'] )
        );
    }

    public static function verify_captcha_token( string $token, string $expected_action = 'submit' ): array {
        if ( self::captcha_should_bypass() ) {
            return [ 'success' => true, 'score' => 1.0, 'provider' => 'bypass' ];
        }
        $cap   = self::get_config()['captcha'];
        $keys  = self::captcha_active_keys();
        $token = trim( $token );
        if ( '' === $token ) {
            self::increment_counter( 'and_toolkit_captcha_blocked' );
            if ( $cap['log_blocked_attempts'] ) {
                self::log_event( 'bot_protection', 'warning', sprintf( 'Botvédelem: hiányzó CAPTCHA token (%s, művelet: %s)', $keys['provider'], $expected_action ), $expected_action );
            }
            return [ 'success' => false, 'score' => 0.0, 'error' => 'missing-input-response' ];
        }

        $endpoint = 'turnstile' === $keys['provider']
            ? 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
            : 'https://www.google.com/recaptcha/api/siteverify';

        $response = wp_remote_post(
            $endpoint,
            [
                'timeout' => 8,
                'body'    => [
                    'secret'   => $keys['secret_key'],
                    'response' => $token,
                    'remoteip' => self::client_ip(),
                ],
            ]
        );

        if ( is_wp_error( $response ) ) {
            // Hálózati hiba a szolgáltató felé: alapból nem zárjuk ki a látogatókat (és az adminokat), a hiba naplózódik. Szigorításhoz: add_filter( 'and_toolkit_captcha_fail_open', '__return_false' ).
            self::log_event( 'bot_protection', 'warning', 'Botvédelem: a szolgáltató nem érhető el (' . $response->get_error_message() . ')', $expected_action );
            $open = (bool) apply_filters( 'and_toolkit_captcha_fail_open', true, $expected_action );
            return [ 'success' => $open, 'score' => 0.0, 'error' => $response->get_error_message(), 'provider' => 'unreachable' ];
        }

        $body    = json_decode( (string) wp_remote_retrieve_body( $response ), true );
        $body    = is_array( $body ) ? $body : [];
        $ok      = ! empty( $body['success'] );
        $score   = isset( $body['score'] ) ? (float) $body['score'] : ( $ok ? 1.0 : 0.0 );
        $passed  = 'turnstile' === $keys['provider'] ? $ok : ( $ok && $score >= $keys['threshold'] && 'atk_submit' === (string) ( $body['action'] ?? '' ) );
        $host    = strtolower( (string) ( $body['hostname'] ?? '' ) );
        $site    = strtolower( (string) wp_parse_url( home_url(), PHP_URL_HOST ) );
        if ( $passed && '' !== $host && $host !== $site && ! str_ends_with( $host, '.' . $site ) && ! str_ends_with( $site, '.' . $host ) ) {
            $passed = false; // más domainre kiadott token
        }

        if ( $passed ) {
            self::increment_counter( 'and_toolkit_captcha_verified' );
            return [ 'success' => true, 'score' => $score, 'provider' => $keys['provider'] ];
        }

        self::increment_counter( 'and_toolkit_captcha_blocked' );
        if ( $cap['log_blocked_attempts'] ) {
            self::log_event(
                'bot_protection',
                'warning',
                sprintf( 'Botvédelem blokkolta a kérést (%s): score=%.2f < küszöb=%.2f (művelet: %s)', $keys['provider'], $score, $keys['threshold'], $expected_action ),
                $expected_action
            );
        }
        return [ 'success' => false, 'score' => $score, 'error' => 'low-score-or-invalid-token' ];
    }

    private static function posted_captcha_token(): string {
        if ( isset( $_POST['cf-turnstile-response'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification
            return sanitize_text_field( wp_unslash( (string) $_POST['cf-turnstile-response'] ) ); // phpcs:ignore WordPress.Security.NonceVerification
        }
        if ( isset( $_POST['atk_captcha_token'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification
            return sanitize_text_field( wp_unslash( (string) $_POST['atk_captcha_token'] ) ); // phpcs:ignore WordPress.Security.NonceVerification
        }
        if ( isset( $_POST['g-recaptcha-response'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification
            return sanitize_text_field( wp_unslash( (string) $_POST['g-recaptcha-response'] ) ); // phpcs:ignore WordPress.Security.NonceVerification
        }
        return '';
    }

    public static function verify_login_captcha( $user, string $username = '', string $password = '' ) {
        $cap = self::get_config()['captcha'];
        // Csak a böngészős bejelentkező űrlapot védjük: az XML-RPC, REST (alkalmazásjelszó), WP-CLI és cron belépést nem
        if ( ! $cap['protect_login'] || '' === $username || ! self::is_form_login() || self::captcha_should_bypass() ) {
            return $user;
        }
        $check = self::verify_captcha_token( self::posted_captcha_token(), 'login' );
        if ( ! $check['success'] ) {
            return new \WP_Error( 'and_toolkit_captcha_failed', __( 'Botvédelmi ellenőrzés sikertelen (reCAPTCHA v3 / Turnstile). Kérjük, próbálja újra.', 'and-toolkit' ) );
        }
        return $user;
    }

    public static function verify_registration_captcha( \WP_Error $errors, string $sanitized_user_login = '', string $user_email = '' ): \WP_Error {
        $cap = self::get_config()['captcha'];
        if ( $cap['protect_register'] && ! self::captcha_should_bypass() ) {
            $check = self::verify_captcha_token( self::posted_captcha_token(), 'register' );
            if ( ! $check['success'] ) {
                $errors->add( 'and_toolkit_captcha_failed', __( 'Botvédelmi ellenőrzés sikertelen.', 'and-toolkit' ) );
            }
        }
        return $errors;
    }

    public static function verify_lostpassword_captcha( $errors = null ): void {
        $cap = self::get_config()['captcha'];
        if ( ! $cap['protect_lost_password'] || self::captcha_should_bypass() ) {
            return;
        }
        $check = self::verify_captcha_token( self::posted_captcha_token(), 'lostpassword' );
        if ( ! $check['success'] ) {
            if ( $errors instanceof \WP_Error ) {
                $errors->add( 'and_toolkit_captcha_failed', __( 'Botvédelmi ellenőrzés sikertelen.', 'and-toolkit' ) );
            } else {
                wp_die( esc_html__( 'Botvédelmi ellenőrzés sikertelen.', 'and-toolkit' ), 403 );
            }
        }
    }

    public static function verify_comment_captcha( array $commentdata ): array {
        $cap = self::get_config()['captcha'];
        // A komment-űrlap CAPTCHA mezője csak kijelentkezett látogatóknak jelenik meg, ezért a bejelentkezettek nem ellenőrizhetők (és nem is kell)
        if ( ! $cap['protect_comments'] || is_user_logged_in() || self::captcha_should_bypass() ) {
            return $commentdata;
        }
        $check = self::verify_captcha_token( self::posted_captcha_token(), 'comment' );
        if ( ! $check['success'] ) {
            wp_die( esc_html__( 'Botvédelmi ellenőrzés sikertelen (alacsony biztonsági pontszám).', 'and-toolkit' ), 403 );
        }
        return $commentdata;
    }

    public static function render_captcha_badge_shortcode( $atts = [] ): string {
        $cap = self::get_config()['captcha'];
        if ( ! $cap['enabled'] ) {
            return '';
        }
        $provider_label = 'turnstile' === $cap['provider'] ? 'Cloudflare Turnstile' : 'Google reCAPTCHA v3';
        // Publikus jelvény: nem tesz közzé titkos kulcsot vagy érzékeny küszöbértéket.
        return sprintf(
            '<div class="atk-widget atk-captcha-badge" data-provider="%s"><span>%s</span></div>',
            esc_attr( (string) $cap['provider'] ),
            esc_html( sprintf( 'Botvédelem aktív: %s · And ToolKit v%s', $provider_label, self::VERSION ) )
        );
    }

    public static function render_global_info_banner(): void {
        $config = self::get_config()['banner'];
        if ( ! $config['enabled'] ) {
            return;
        }
        $show = match ( $config['visibility_scope'] ) {
            'all-pages'     => true,
            'homepage-only' => is_front_page(),
            'blog-posts'    => is_singular( 'post' ),
            default         => false,
        };
        if ( $show ) {
            echo self::banner_html( $config ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- banner_html() minden elemet escape-el
        }
    }

    public static function render_gdpr_footer_banner(): void {
        $config = self::get_config()['gdpr'];
        if ( ! $config['enabled'] || self::$cookie_widget_rendered ) {
            return; // a rövidkóddal elhelyezett widget már kirajzolódott
        }
        // Ha a rövidkód sehol nincs elhelyezve (oldalsáv stílusnál), a látogatót akkor is meg kell kérdezni: lebegő kártya a tartalék.
        $style = 'sidebar-widget' === $config['display_style'] ? 'floating-card' : (string) $config['display_style'];
        echo self::cookie_widget_html( $style ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escape-elt kimenet
        echo '<a href="#" class="atk-reopen atk-hidden" data-atk-open-consent>' . esc_html__( 'Süti-beállítások', 'and-toolkit' ) . '</a>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
    }

    // ========================================================================
    // REST API
    // ========================================================================

    public static function register_rest_routes(): void {
        // Nyilvános, csak olvasható kereső: kizárólag publikus, jelszó nélküli tartalmat ad vissza.
        register_rest_route(
            self::REST_NS,
            '/search',
            [
                'methods'             => 'GET',
                'callback'            => [ __CLASS__, 'handle_ajax_search' ],
                'permission_callback' => '__return_true',
                'args'                => [
                    'q'    => [ 'required' => false, 'sanitize_callback' => 'sanitize_text_field' ],
                    'type' => [ 'required' => false, 'sanitize_callback' => 'sanitize_key' ],
                ],
            ]
        );
        // Nyilvános, korlátozott számláló (rate limit + útvonal-ellenőrzés).
        register_rest_route(
            self::REST_NS,
            '/track-download',
            [
                'methods'             => 'POST',
                'callback'            => [ __CLASS__, 'increment_download_counter' ],
                'permission_callback' => '__return_true',
                'args'                => [ 'url' => [ 'required' => true, 'sanitize_callback' => 'esc_url_raw' ] ],
            ]
        );
        register_rest_route(
            self::REST_NS,
            '/track-visit',
            [
                'methods'             => 'POST',
                'callback'            => [ __CLASS__, 'increment_visit_counter' ],
                'permission_callback' => '__return_true',
            ]
        );
        register_rest_route(
            self::REST_NS,
            '/cookie-consent',
            [
                'methods'             => 'POST',
                'callback'            => [ __CLASS__, 'handle_cookie_consent' ],
                'permission_callback' => '__return_true',
                'args'                => [
                    'consent_level' => [
                        'required'          => true,
                        'sanitize_callback' => 'sanitize_text_field',
                        'validate_callback' => static fn( $v ): bool => in_array( $v, [ 'all', 'custom', 'essential' ], true ),
                    ],
                    'consent_id'    => [ 'required' => false, 'sanitize_callback' => 'sanitize_text_field' ],
                    'categories'    => [ 'required' => false ],
                ],
            ]
        );
        register_rest_route(
            self::REST_NS,
            '/optimize',
            [
                'methods'             => 'POST',
                'callback'            => [ __CLASS__, 'handle_system_optimization' ],
                'permission_callback' => static fn(): bool => current_user_can( 'manage_options' ),
            ]
        );
        register_rest_route(
            self::REST_NS,
            '/audit-export',
            [
                'methods'             => 'GET',
                'callback'            => [ __CLASS__, 'handle_audit_log_export' ],
                'permission_callback' => static fn(): bool => current_user_can( 'manage_options' ),
                'args'                => [
                    'format' => [
                        'required'          => false,
                        'sanitize_callback' => 'sanitize_text_field',
                        'validate_callback' => static fn( $v ): bool => in_array( $v, [ 'log', 'txt', 'csv' ], true ),
                    ],
                ],
            ]
        );
    }

    public static function handle_ajax_search( \WP_REST_Request $request ): \WP_REST_Response {
        $config = self::get_config()['search'];
        $query  = trim( sanitize_text_field( (string) $request->get_param( 'q' ) ) );
        $empty  = new \WP_REST_Response( [ 'results' => [], 'query' => $query ], 200 );
        if ( ! $config['enabled'] || mb_strlen( $query ) < 2 ) {
            return $empty;
        }
        $types     = array_values( array_intersect( (array) $config['post_types'], get_post_types( [ 'public' => true ] ) ) );
        $requested = sanitize_key( (string) $request->get_param( 'type' ) );
        if ( '' !== $requested && in_array( $requested, $types, true ) ) {
            $types = [ $requested ];
        }
        if ( ! $types ) {
            return $empty;
        }
        $wp_query = new \WP_Query(
            [
                's'                   => $query,
                'post_type'           => $types,
                'post_status'         => 'publish',
                'has_password'        => false,
                'posts_per_page'      => 8,
                'no_found_rows'       => true,
                'ignore_sticky_posts' => true,
            ]
        );
        $results = [];
        foreach ( $wp_query->posts as $post ) {
            $results[] = [
                'id'      => (int) $post->ID,
                'title'   => wp_strip_all_tags( get_the_title( $post ) ),
                'url'     => (string) get_permalink( $post ),
                'type'    => (string) $post->post_type,
                'excerpt' => wp_trim_words( wp_strip_all_tags( get_the_excerpt( $post ) ), 24 ),
            ];
        }
        return new \WP_REST_Response( [ 'results' => $results, 'query' => $query ], 200 );
    }

    public static function increment_download_counter( \WP_REST_Request $request ) {
        $url  = (string) $request->get_param( 'url' );
        $host = strtolower( (string) wp_parse_url( $url, PHP_URL_HOST ) );
        $site = strtolower( (string) wp_parse_url( home_url(), PHP_URL_HOST ) );
        $ext  = strtolower( pathinfo( (string) wp_parse_url( $url, PHP_URL_PATH ), PATHINFO_EXTENSION ) );
        if ( '' === $host || $host !== $site || ! in_array( $ext, [ 'pdf', 'zip', 'rar', '7z', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'csv', 'txt', 'mp3', 'mp4', 'epub' ], true ) ) {
            return new \WP_Error( 'and_toolkit_invalid_download', 'Érvénytelen letöltési cím.', [ 'status' => 400 ] );
        }
        if ( ! self::rate_limit( 'dl', 5 ) ) {
            return new \WP_Error( 'and_toolkit_rate_limited', 'Túl sok kérés.', [ 'status' => 429 ] );
        }
        return new \WP_REST_Response( [ 'downloads' => self::increment_counter( 'and_toolkit_downloads_total' ) ], 200 );
    }

    public static function increment_visit_counter( \WP_REST_Request $request ) {
        if ( ! self::rate_limit( 'visit', 30 ) ) {
            return new \WP_Error( 'and_toolkit_rate_limited', 'Túl sok kérés.', [ 'status' => 429 ] );
        }
        $total = self::increment_counter( 'and_toolkit_visits_total' );
        $daily = get_option( 'and_toolkit_visits_daily', [] );
        $daily = is_array( $daily ) ? $daily : [];
        $today = wp_date( 'Y-m-d' );
        $daily[ $today ] = (int) ( $daily[ $today ] ?? 0 ) + 1;
        krsort( $daily );
        update_option( 'and_toolkit_visits_daily', array_slice( $daily, 0, 14, true ), false );
        return new \WP_REST_Response( [ 'visits' => $total ], 200 );
    }

    public static function handle_cookie_consent( \WP_REST_Request $request ) {
        if ( ! self::rate_limit( 'consent', 2, (string) $request->get_param( 'consent_id' ) ) ) {
            return new \WP_Error( 'and_toolkit_rate_limited', 'Túl sok kérés.', [ 'status' => 429 ] );
        }
        global $wpdb;
        $level = (string) $request->get_param( 'consent_level' );
        $level = in_array( $level, [ 'all', 'custom', 'essential' ], true ) ? $level : 'essential';
        $raw   = $request->get_param( 'categories' );
        $raw   = is_array( $raw ) ? $raw : [];
        $cats  = [ 'necessary' => true ];
        foreach ( [ 'preferences', 'analytics', 'marketing' ] as $cat ) {
            $cats[ $cat ] = 'all' === $level ? true : ( 'essential' === $level ? false : ! empty( $raw[ $cat ] ) );
        }
        $id = preg_replace( '/[^A-Za-z0-9\-]/', '', (string) $request->get_param( 'consent_id' ) );
        $id = ( is_string( $id ) && strlen( $id ) >= 8 && strlen( $id ) <= 64 ) ? $id : wp_generate_uuid4();

        $wpdb->insert( // phpcs:ignore WordPress.DB.DirectDatabaseQuery
            self::table_consent(),
            [
                'created_at'     => gmdate( 'Y-m-d H:i:s' ),
                'consent_id'     => $id,
                'level'          => $level,
                'categories'     => (string) wp_json_encode( $cats ),
                'ip_hash'        => substr( hash_hmac( 'sha256', self::client_ip(), wp_salt() ), 0, 32 ),
                'policy_version' => self::VERSION,
            ],
            [ '%s', '%s', '%s', '%s', '%s', '%s' ]
        );
        return new \WP_REST_Response(
            [
                'status'        => $wpdb->insert_id ? 'recorded' : 'failed',
                'consent_id'    => $id,
                'consent_level' => $level,
                'version'       => self::VERSION,
            ],
            200
        );
    }

    public static function handle_system_optimization( \WP_REST_Request $request ): \WP_REST_Response {
        self::flush_page_cache();
        $object_cache = function_exists( 'wp_cache_flush' ) ? (bool) wp_cache_flush() : false;
        update_option( 'and_toolkit_optimize_last', time(), false );
        return new \WP_REST_Response(
            [
                'status'              => 'optimized',
                'page_cache_flushed'  => true,
                'object_cache_flushed' => $object_cache,
                'version'             => self::VERSION,
            ],
            200
        );
    }

    public static function handle_audit_log_export( \WP_REST_Request $request ): \WP_REST_Response {
        $format = sanitize_text_field( (string) ( $request->get_param( 'format' ) ?? self::get_config()['audit_log']['export_format'] ) );
        $format = in_array( $format, [ 'log', 'txt', 'csv' ], true ) ? $format : 'log';
        $rows   = self::fetch_audit_rows();
        return new \WP_REST_Response(
            [
                'status'   => 'exported',
                'format'   => $format,
                'filename' => self::export_filename( $format ),
                'count'    => count( $rows ),
                'content'  => self::format_audit_export( $rows, $format ),
                'version'  => self::VERSION,
            ],
            200
        );
    }

    // ========================================================================
    // IP-LISTÁK (egyedi cím és CIDR, IPv4 + IPv6)
    // ========================================================================

    private static function ip_matches( string $ip, string $entry ): bool {
        $entry = trim( $entry );
        if ( '' === $entry || '' === $ip ) {
            return false;
        }
        $ip_bin = @inet_pton( $ip ); // phpcs:ignore WordPress.PHP.NoSilencedErrors
        if ( false === $ip_bin ) {
            return false;
        }
        if ( ! str_contains( $entry, '/' ) ) {
            $entry_bin = @inet_pton( $entry ); // phpcs:ignore WordPress.PHP.NoSilencedErrors
            return false !== $entry_bin && $entry_bin === $ip_bin;
        }
        [ $net, $bits ] = explode( '/', $entry, 2 );
        $net_bin        = @inet_pton( $net ); // phpcs:ignore WordPress.PHP.NoSilencedErrors
        if ( false === $net_bin || ! ctype_digit( $bits ) || strlen( $net_bin ) !== strlen( $ip_bin ) ) {
            return false;
        }
        $bits = (int) $bits;
        if ( $bits > strlen( $net_bin ) * 8 ) {
            return false;
        }
        $bytes = intdiv( $bits, 8 );
        if ( $bytes > 0 && substr( $net_bin, 0, $bytes ) !== substr( $ip_bin, 0, $bytes ) ) {
            return false;
        }
        $rest = $bits % 8;
        if ( $rest > 0 ) {
            $mask = ( 0xFF << ( 8 - $rest ) ) & 0xFF;
            return ( ord( $net_bin[ $bytes ] ) & $mask ) === ( ord( $ip_bin[ $bytes ] ) & $mask );
        }
        return true;
    }

    private static function ip_in_whitelist( string $client_ip, array $whitelist ): bool {
        foreach ( $whitelist as $entry ) {
            if ( self::ip_matches( trim( $client_ip ), (string) $entry ) ) {
                return true;
            }
        }
        return false;
    }

    private static function sanitize_ip_list( string $raw ): array {
        $out = [];
        foreach ( preg_split( '/[\s,;]+/', $raw ) ?: [] as $entry ) {
            $entry = trim( (string) $entry );
            if ( '' === $entry ) {
                continue;
            }
            $parts = explode( '/', $entry, 2 );
            if ( false === filter_var( $parts[0], FILTER_VALIDATE_IP ) ) {
                continue;
            }
            if ( isset( $parts[1] ) && ( ! ctype_digit( $parts[1] ) || (int) $parts[1] > ( str_contains( $parts[0], ':' ) ? 128 : 32 ) ) ) {
                continue;
            }
            $out[] = $entry;
        }
        return array_values( array_unique( $out ) );
    }

    // ========================================================================
    // 10. HITELESÍTÉS MODUL: 2FA (TOTP RFC 6238) + VISSZAÁLLÍTÓ KÓDOK
    //     Passkey és e-mail OTP: még nincs a PHP-ban (csak a Studio előnézetében).
    // ========================================================================

    private static function base32_encode( string $bin ): string {
        if ( '' === $bin ) {
            return '';
        }
        $alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        $bits     = '';
        foreach ( str_split( $bin ) as $char ) {
            $bits .= str_pad( decbin( ord( $char ) ), 8, '0', STR_PAD_LEFT );
        }
        $out = '';
        foreach ( str_split( $bits, 5 ) as $chunk ) {
            $out .= $alphabet[ (int) bindec( str_pad( $chunk, 5, '0' ) ) ];
        }
        return $out;
    }

    private static function base32_decode( string $b32 ): string {
        $alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        $b32      = strtoupper( (string) preg_replace( '/[^A-Za-z2-7]/', '', $b32 ) );
        if ( '' === $b32 ) {
            return '';
        }
        $bits = '';
        foreach ( str_split( $b32 ) as $char ) {
            $bits .= str_pad( decbin( (int) strpos( $alphabet, $char ) ), 5, '0', STR_PAD_LEFT );
        }
        $out = '';
        foreach ( str_split( $bits, 8 ) as $byte ) {
            if ( 8 === strlen( $byte ) ) {
                $out .= chr( (int) bindec( $byte ) );
            }
        }
        return $out;
    }

    private static function totp_at( string $key, int $counter ): string {
        $digest = hash_hmac( 'sha1', pack( 'J', $counter ), $key, true );
        $offset = ord( $digest[19] ) & 0x0f;
        $binary = ( ( ord( $digest[ $offset ] ) & 0x7f ) << 24 )
            | ( ( ord( $digest[ $offset + 1 ] ) & 0xff ) << 16 )
            | ( ( ord( $digest[ $offset + 2 ] ) & 0xff ) << 8 )
            | ( ord( $digest[ $offset + 3 ] ) & 0xff );
        return str_pad( (string) ( $binary % 1000000 ), 6, '0', STR_PAD_LEFT );
    }

    /**
     * Base32 titkos kulcs + 6 jegyű kód ellenőrzése ±tűrés ablakkal. A találat időablak-számlálóját adja (újrajátszás-védelemhez), vagy null-t.
     */
    public static function verify_totp_with_time_drift( string $secret_b32, string $code, ?int $unix_now = null ): ?int {
        $code = (string) preg_replace( '/\D/', '', $code );
        $key  = self::base32_decode( $secret_b32 );
        if ( 6 !== strlen( $code ) || '' === $key ) {
            return null;
        }
        $tolerance = max( 0, min( 5, (int) self::get_config()['auth']['time_drift_tolerance_windows'] ) );
        $base      = (int) floor( ( $unix_now ?? time() ) / 30 );
        for ( $w = -$tolerance; $w <= $tolerance; $w++ ) {
            if ( hash_equals( self::totp_at( $key, $base + $w ), $code ) ) {
                return $base + $w;
            }
        }
        return null;
    }

    private static function crypto_key(): string {
        return hash( 'sha256', wp_salt( 'auth' ) . '|and-toolkit-2fa', true );
    }

    private static function encrypt_secret( string $plain ): string {
        $nonce = random_bytes( SODIUM_CRYPTO_SECRETBOX_NONCEBYTES );
        return base64_encode( $nonce . sodium_crypto_secretbox( $plain, $nonce, self::crypto_key() ) );
    }

    private static function decrypt_secret( string $blob ): string {
        $raw = base64_decode( $blob, true );
        if ( false === $raw || strlen( $raw ) <= SODIUM_CRYPTO_SECRETBOX_NONCEBYTES ) {
            return '';
        }
        $plain = sodium_crypto_secretbox_open( substr( $raw, SODIUM_CRYPTO_SECRETBOX_NONCEBYTES ), substr( $raw, 0, SODIUM_CRYPTO_SECRETBOX_NONCEBYTES ), self::crypto_key() );
        return false === $plain ? '' : $plain;
    }

    private static function recovery_hash( string $code ): string {
        return hash_hmac( 'sha256', strtolower( (string) preg_replace( '/[^A-Za-z0-9]/', '', $code ) ), wp_salt( 'auth' ) );
    }

    private static function totp_state( int $user_id ): array {
        $state = get_user_meta( $user_id, 'and_toolkit_totp', true );
        $state = is_array( $state ) ? $state : [];
        return [
            'enabled'      => ! empty( $state['enabled'] ),
            'secret'       => (string) ( $state['secret'] ?? '' ),
            'last_counter' => (int) ( $state['last_counter'] ?? 0 ),
            'recovery'     => array_values( array_filter( (array) ( $state['recovery'] ?? [] ), 'is_string' ) ),
        ];
    }

    private static function save_totp_state( int $user_id, array $state ): void {
        update_user_meta( $user_id, 'and_toolkit_totp', $state );
    }

    private static function generate_recovery_codes( int $count = 10 ): array {
        $codes = [];
        for ( $i = 0; $i < $count; $i++ ) {
            $raw     = substr( bin2hex( random_bytes( 5 ) ), 0, 10 );
            $codes[] = substr( $raw, 0, 5 ) . '-' . substr( $raw, 5 );
        }
        return $codes;
    }

    public static function evaluate_user_auth_policy( \WP_User $user, string $client_ip = '' ): array {
        $auth = self::get_config()['auth'];
        $ip   = '' !== $client_ip ? $client_ip : self::client_ip();
        // Vészkapcsoló (pl. WordPress-só csere után, amikor a titkosított 2FA-kulcsok olvashatatlanná válnak): define( 'AND_TOOLKIT_DISABLE_2FA', true ); a wp-config.php-ban.
        if ( ( defined( 'AND_TOOLKIT_DISABLE_2FA' ) && AND_TOOLKIT_DISABLE_2FA ) || ! $auth['enabled'] || ! $auth['totp_enabled'] || self::ip_in_whitelist( $ip, (array) $auth['whitelisted_ips'] ) ) {
            return [ 'bypassed' => true, 'totp' => 'disabled' ];
        }
        $roles = is_array( $user->roles ) ? $user->roles : [];
        $role  = (string) ( $roles[0] ?? 'subscriber' );
        $pol   = (string) ( $auth['role_policies'][ $role ]['totp'] ?? 'optional' );
        return [ 'bypassed' => false, 'role' => $role, 'totp' => in_array( $pol, [ 'required', 'optional', 'disabled' ], true ) ? $pol : 'optional' ];
    }

    private static function is_form_login(): bool {
        return isset( $_POST['log'], $_POST['pwd'] ) // phpcs:ignore WordPress.Security.NonceVerification
            && ! defined( 'XMLRPC_REQUEST' ) && ! defined( 'REST_REQUEST' )
            && ! ( defined( 'WP_CLI' ) && WP_CLI ) && ! wp_doing_cron();
    }

    private static function totp_field_html(): string {
        $auth = self::get_config()['auth'];
        if ( ! $auth['enabled'] || ! $auth['totp_enabled'] ) {
            return '';
        }
        return '<p class="atk-totp-field"><label>' . esc_html__( '2FA kód (ha be van kapcsolva)', 'and-toolkit' ) . '<br /><input type="text" name="atk_totp" class="input" value="" size="20" inputmode="numeric" autocomplete="one-time-code" /></label></p>';
    }

    public static function render_totp_login_field(): void {
        echo self::totp_field_html(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escape-elt kimenet
    }

    /**
     * A jelszó ellenőrzése után kéri a 2FA kódot azoktól, akik bekapcsolták. Beállítás nélkül nem zár ki senkit.
     */
    private static bool $app_password_used = false;

    public static function mark_app_password_used(): void {
        self::$app_password_used = true;
    }

    public static function enforce_totp_login( $user, $username = '', $password = '' ) {
        if ( ! $user instanceof \WP_User ) {
            return $user;
        }
        $is_api = ( defined( 'XMLRPC_REQUEST' ) && XMLRPC_REQUEST ) || ( defined( 'REST_REQUEST' ) && REST_REQUEST );
        if ( ! $is_api && ! self::is_form_login() ) {
            return $user;
        }
        $policy = self::evaluate_user_auth_policy( $user );
        if ( ! empty( $policy['bypassed'] ) || 'disabled' === $policy['totp'] ) {
            return $user;
        }
        $state = self::totp_state( (int) $user->ID );
        if ( ! $state['enabled'] || '' === $state['secret'] ) {
            return $user;
        }
        if ( $is_api ) {
            // XML-RPC / REST: a 2FA-s fiók az igazi jelszavával nem léphet be (megkerülné a 2FA-t); alkalmazásjelszóval igen.
            return self::$app_password_used ? $user : new \WP_Error( 'and_toolkit_totp_api_blocked', __( 'Ez a fiók 2FA-val védett: API-hozzáféréshez használjon alkalmazásjelszót.', 'and-toolkit' ) );
        }
        $actor    = self::actor_for_user( $user );
        $lock_key = 'atk_2fa_fail_' . (int) $user->ID;
        if ( (int) get_transient( $lock_key ) >= 5 ) {
            return new \WP_Error( 'and_toolkit_totp_locked', __( 'Túl sok hibás 2FA kód. Próbálja újra 10 perc múlva.', 'and-toolkit' ) );
        }
        $code = isset( $_POST['atk_totp'] ) ? sanitize_text_field( wp_unslash( (string) $_POST['atk_totp'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification
        if ( '' === trim( $code ) ) {
            return new \WP_Error( 'and_toolkit_totp_required', __( 'Kétfaktoros hitelesítés: adja meg a hitelesítő alkalmazás 6 jegyű kódját (vagy egy visszaállító kódot).', 'and-toolkit' ) );
        }
        $counter = self::verify_totp_with_time_drift( self::decrypt_secret( $state['secret'] ), $code );
        if ( null !== $counter && $counter > $state['last_counter'] ) {
            $state['last_counter'] = $counter; // újrajátszás elleni védelem
            self::save_totp_state( (int) $user->ID, $state );
            delete_transient( $lock_key );
            return $user;
        }
        $hash = self::recovery_hash( $code );
        foreach ( $state['recovery'] as $index => $stored ) {
            if ( hash_equals( $stored, $hash ) ) {
                unset( $state['recovery'][ $index ] );
                $state['recovery'] = array_values( $state['recovery'] );
                self::save_totp_state( (int) $user->ID, $state );
                delete_transient( $lock_key );
                self::log_event( 'auth_security', 'warning', sprintf( 'Visszaállító kóddal történt belépés: %s (maradt: %d)', $user->user_login, count( $state['recovery'] ) ), $user->user_login, $actor );
                return $user;
            }
        }
        set_transient( $lock_key, (int) get_transient( $lock_key ) + 1, 10 * MINUTE_IN_SECONDS );
        self::log_event( 'auth_security', 'warning', sprintf( 'Hibás 2FA kód: %s', $user->user_login ), $user->user_login, $actor );
        return new \WP_Error( 'and_toolkit_totp_invalid', __( 'Érvénytelen kétfaktoros kód.', 'and-toolkit' ) );
    }

    private static function totp_uri( \WP_User $user, string $secret ): string {
        $issuer = (string) self::get_config()['auth']['totp_issuer'];
        $issuer = '' !== $issuer ? $issuer : get_bloginfo( 'name' );
        return 'otpauth://totp/' . rawurlencode( $issuer . ':' . $user->user_login ) . '?secret=' . $secret . '&issuer=' . rawurlencode( $issuer ) . '&algorithm=SHA1&digits=6&period=30';
    }

    public static function render_profile_2fa( $profile_user ): void {
        $auth = self::get_config()['auth'];
        if ( ! $profile_user instanceof \WP_User || ! $auth['enabled'] || ! $auth['totp_enabled'] ) {
            return;
        }
        $uid     = (int) $profile_user->ID;
        $is_self = get_current_user_id() === $uid;
        if ( ! $is_self && ! current_user_can( 'edit_user', $uid ) ) {
            return;
        }
        if ( 'disabled' === (string) ( $auth['role_policies'][ (string) ( $profile_user->roles[0] ?? 'subscriber' ) ]['totp'] ?? 'optional' ) ) {
            return;
        }
        $state = self::totp_state( $uid );
        echo '<h2>' . esc_html__( 'And ToolKit – kétfaktoros hitelesítés (2FA)', 'and-toolkit' ) . '</h2><table class="form-table" role="presentation"><tbody>';
        wp_nonce_field( 'and_toolkit_2fa_' . $uid, 'and_toolkit_2fa_nonce' );

        $message = get_transient( 'atk_2fa_msg_' . $uid );
        if ( is_string( $message ) && '' !== $message ) {
            delete_transient( 'atk_2fa_msg_' . $uid );
            echo '<tr><th></th><td><div class="notice notice-info inline"><p>' . esc_html( $message ) . '</p></div></td></tr>';
        }
        $flash = get_user_meta( $uid, 'and_toolkit_recovery_flash', true );
        if ( is_string( $flash ) && '' !== $flash ) {
            delete_user_meta( $uid, 'and_toolkit_recovery_flash' );
            echo '<tr><th>' . esc_html__( 'Visszaállító kódok', 'and-toolkit' ) . '</th><td><p><strong>' . esc_html__( 'Mentse el ezeket most, később nem jelennek meg újra! Mindegyik egyszer használható.', 'and-toolkit' ) . '</strong></p><pre style="font-size:15px">' . esc_html( self::decrypt_secret( $flash ) ) . '</pre></td></tr>';
        }

        if ( $state['enabled'] ) {
            echo '<tr><th>' . esc_html__( 'Állapot', 'and-toolkit' ) . '</th><td><strong>' . esc_html__( 'Aktív', 'and-toolkit' ) . '</strong> · ' . esc_html( sprintf( 'Felhasználatlan visszaállító kód: %d', count( $state['recovery'] ) ) ) . '</td></tr>';
            if ( $is_self ) {
                echo '<tr><th><label for="atk-2fa-code">' . esc_html__( 'Jelenlegi 2FA kód', 'and-toolkit' ) . '</label></th><td><input type="text" id="atk-2fa-code" name="and_toolkit_2fa_code" inputmode="numeric" autocomplete="one-time-code" class="regular-text" /><p class="description">' . esc_html__( 'Kikapcsoláshoz vagy új visszaállító kódokhoz szükséges.', 'and-toolkit' ) . '</p><label><input type="checkbox" name="and_toolkit_2fa_regen" value="1" /> ' . esc_html__( 'Új visszaállító kódok készítése', 'and-toolkit' ) . '</label><br /><label><input type="checkbox" name="and_toolkit_2fa_disable" value="1" /> ' . esc_html__( '2FA kikapcsolása', 'and-toolkit' ) . '</label></td></tr>';
            } else {
                echo '<tr><th>' . esc_html__( 'Adminisztrátori művelet', 'and-toolkit' ) . '</th><td><label><input type="checkbox" name="and_toolkit_2fa_reset" value="1" /> ' . esc_html__( '2FA visszaállítása (elvesztett eszköz)', 'and-toolkit' ) . '</label></td></tr>';
            }
        } elseif ( $is_self ) {
            $pending = get_user_meta( $uid, 'and_toolkit_totp_pending', true );
            $secret  = is_string( $pending ) && '' !== $pending ? self::decrypt_secret( $pending ) : '';
            if ( '' === $secret ) {
                $secret = self::base32_encode( random_bytes( 20 ) );
                update_user_meta( $uid, 'and_toolkit_totp_pending', self::encrypt_secret( $secret ) );
            }
            echo '<tr><th>' . esc_html__( 'Beállítás', 'and-toolkit' ) . '</th><td><p>' . esc_html__( 'Adja hozzá a kulcsot egy hitelesítő alkalmazáshoz (Google Authenticator, Aegis, 2FAS stb., „kulcs megadása” lehetőség), majd írja be az alkalmazás által mutatott kódot.', 'and-toolkit' ) . '</p><p><code style="font-size:16px">' . esc_html( trim( chunk_split( $secret, 4, ' ' ) ) ) . '</code></p><p class="description">' . esc_html( self::totp_uri( $profile_user, $secret ) ) . '</p></td></tr>';
            echo '<tr><th><label for="atk-2fa-code">' . esc_html__( 'Ellenőrző kód', 'and-toolkit' ) . '</label></th><td><input type="text" id="atk-2fa-code" name="and_toolkit_2fa_code" inputmode="numeric" autocomplete="one-time-code" class="regular-text" /><p class="description">' . esc_html__( 'A profil mentésekor a kód ellenőrzése után aktiválódik, és megjelennek a visszaállító kódok.', 'and-toolkit' ) . '</p></td></tr>';
        } else {
            echo '<tr><th>' . esc_html__( 'Állapot', 'and-toolkit' ) . '</th><td>' . esc_html__( 'A felhasználó nem kapcsolta be a 2FA-t.', 'and-toolkit' ) . '</td></tr>';
        }
        echo '</tbody></table>';
    }

    public static function save_profile_2fa( $user_id ): void {
        $uid = (int) $user_id;
        if ( ! isset( $_POST['and_toolkit_2fa_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( (string) $_POST['and_toolkit_2fa_nonce'] ) ), 'and_toolkit_2fa_' . $uid ) ) {
            return;
        }
        if ( ! current_user_can( 'edit_user', $uid ) ) {
            return;
        }
        $user = get_userdata( $uid );
        if ( ! $user instanceof \WP_User ) {
            return;
        }
        $is_self = get_current_user_id() === $uid;
        $code    = isset( $_POST['and_toolkit_2fa_code'] ) ? sanitize_text_field( wp_unslash( (string) $_POST['and_toolkit_2fa_code'] ) ) : '';
        $state   = self::totp_state( $uid );
        $actor   = self::current_actor();

        if ( ! $state['enabled'] ) {
            if ( ! $is_self || '' === trim( $code ) ) {
                return;
            }
            $pending = get_user_meta( $uid, 'and_toolkit_totp_pending', true );
            $secret  = is_string( $pending ) ? self::decrypt_secret( $pending ) : '';
            $counter = '' !== $secret ? self::verify_totp_with_time_drift( $secret, $code ) : null;
            if ( null === $counter ) {
                set_transient( 'atk_2fa_msg_' . $uid, __( 'A megadott ellenőrző kód érvénytelen, a 2FA nem lett bekapcsolva.', 'and-toolkit' ), 60 );
                return;
            }
            $codes = self::generate_recovery_codes();
            self::save_totp_state( $uid, [
                'enabled'      => true,
                'secret'       => self::encrypt_secret( $secret ),
                'last_counter' => $counter,
                'recovery'     => array_map( [ __CLASS__, 'recovery_hash' ], $codes ),
            ] );
            delete_user_meta( $uid, 'and_toolkit_totp_pending' );
            update_user_meta( $uid, 'and_toolkit_recovery_flash', self::encrypt_secret( implode( "\n", $codes ) ) );
            self::log_event( 'auth_security', 'info', sprintf( '2FA bekapcsolva: %s', $user->user_login ), $user->user_login, $actor );
            return;
        }

        if ( ! $is_self ) {
            if ( ! empty( $_POST['and_toolkit_2fa_reset'] ) ) {
                delete_user_meta( $uid, 'and_toolkit_totp' );
                delete_user_meta( $uid, 'and_toolkit_totp_pending' );
                self::log_event( 'auth_security', 'warning', sprintf( '2FA visszaállítva adminisztrátor által: %s', $user->user_login ), $user->user_login, $actor );
            }
            return;
        }
        $wants_disable = ! empty( $_POST['and_toolkit_2fa_disable'] );
        $wants_regen   = ! empty( $_POST['and_toolkit_2fa_regen'] );
        if ( ! $wants_disable && ! $wants_regen ) {
            return;
        }
        $counter = self::verify_totp_with_time_drift( self::decrypt_secret( $state['secret'] ), $code );
        if ( null === $counter || $counter <= $state['last_counter'] ) {
            set_transient( 'atk_2fa_msg_' . $uid, __( 'Érvényes, még fel nem használt 2FA kód szükséges a módosításhoz.', 'and-toolkit' ), 60 );
            return;
        }
        if ( $wants_disable ) {
            delete_user_meta( $uid, 'and_toolkit_totp' );
            self::log_event( 'auth_security', 'warning', sprintf( '2FA kikapcsolva: %s', $user->user_login ), $user->user_login, $actor );
            return;
        }
        $codes                 = self::generate_recovery_codes();
        $state['recovery']     = array_map( [ __CLASS__, 'recovery_hash' ], $codes );
        $state['last_counter'] = $counter;
        self::save_totp_state( $uid, $state );
        update_user_meta( $uid, 'and_toolkit_recovery_flash', self::encrypt_secret( implode( "\n", $codes ) ) );
        self::log_event( 'auth_security', 'info', sprintf( '2FA visszaállító kódok újragenerálva: %s', $user->user_login ), $user->user_login, $actor );
    }

    public static function render_2fa_required_notice(): void {
        $user = wp_get_current_user();
        if ( ! $user instanceof \WP_User || ! $user->exists() ) {
            return;
        }
        $policy = self::evaluate_user_auth_policy( $user );
        if ( ! empty( $policy['bypassed'] ) || 'required' !== $policy['totp'] || self::totp_state( (int) $user->ID )['enabled'] ) {
            return;
        }
        echo '<div class="notice notice-warning"><p>' . esc_html__( 'A szerepköréhez a 2FA kötelező.', 'and-toolkit' ) . ' <a href="' . esc_url( admin_url( 'profile.php#atk-2fa-code' ) ) . '">' . esc_html__( 'Kapcsolja be a profiljában.', 'and-toolkit' ) . '</a></p></div>';
    }

    public static function render_auth_manager_shortcode( $atts = [] ): string {
        $auth = self::get_config()['auth'];
        if ( ! $auth['enabled'] || ! $auth['totp_enabled'] ) {
            return '';
        }
        $html = '<section class="atk-widget atk-auth-manager"><h3>' . esc_html__( 'Hitelesítés és saját biztonsági központ', 'and-toolkit' ) . '</h3>';
        if ( ! is_user_logged_in() ) {
            return $html . '<p><a href="' . esc_url( wp_login_url() ) . '">' . esc_html__( 'Jelentkezzen be a 2FA kezeléséhez.', 'and-toolkit' ) . '</a></p></section>';
        }
        $enabled = self::totp_state( get_current_user_id() )['enabled'];
        return $html . '<p>' . esc_html( $enabled ? 'A 2FA aktív a fiókján.' : 'A 2FA nincs bekapcsolva a fiókján.' ) . '</p><p><a class="atk-btn" href="' . esc_url( get_edit_profile_url() . '#atk-2fa-code' ) . '">' . esc_html__( '2FA kezelése a profilban', 'and-toolkit' ) . '</a></p></section>';
    }

    // ========================================================================
    // 11. WP REJTÉS & HOZZÁFÉRÉSI KAPUK: verzió-elrejtés, felderítés-tiltás, maszkolás,
    //     csak tagoknak mód, mesterjelszó kapu, belépő űrlap és AJAX buborék
    //     (URL-átírás és a wp-login.php áthelyezése még nincs a PHP-ban – csak a Studio előnézetében.)
    // ========================================================================

    public static function apply_wp_hide(): void {
        $hide = self::get_config()['wp_hide'];
        if ( empty( $hide['enabled'] ) ) {
            return;
        }
        if ( ! empty( $hide['strip_wp_version'] ) ) {
            remove_action( 'wp_head', 'wp_generator' );
            add_filter( 'the_generator', '__return_empty_string' );
            add_filter( 'style_loader_src', [ __CLASS__, 'strip_version_query' ], 20 );
            add_filter( 'script_loader_src', [ __CLASS__, 'strip_version_query' ], 20 );
        }
        if ( ! empty( $hide['block_author_scanning'] ) ) {
            add_filter( 'rest_endpoints', [ __CLASS__, 'filter_rest_endpoints' ] );
        }
    }

    public static function strip_version_query( $src ) {
        global $wp_version;
        if ( is_string( $src ) && str_contains( $src, 'ver=' . $wp_version ) ) {
            return remove_query_arg( 'ver', $src );
        }
        return $src;
    }

    public static function filter_rest_endpoints( $endpoints ) {
        if ( ! is_array( $endpoints ) || is_user_logged_in() ) {
            return $endpoints;
        }
        foreach ( array_keys( $endpoints ) as $route ) {
            if ( 1 === preg_match( '#^/wp/v2/users#', (string) $route ) ) {
                unset( $endpoints[ $route ] );
            }
        }
        return $endpoints;
    }

    private static function gate_token( string $hash, int $expires ): string {
        return $expires . '|' . hash_hmac( 'sha256', $expires . '|' . $hash, wp_salt( 'auth' ) );
    }

    private static function master_gate_active(): bool {
        $hide = self::get_config()['wp_hide'];
        return ! empty( $hide['enabled'] ) && ! empty( $hide['master_password_enabled'] ) && '' !== (string) $hide['master_password_hash'];
    }

    private static function master_gate_passed(): bool {
        $hide = self::get_config()['wp_hide'];
        if ( self::ip_in_whitelist( self::client_ip(), (array) $hide['master_password_whitelisted_ips'] ) ) {
            return true;
        }
        $cookie = isset( $_COOKIE['atk_master_gate'] ) ? sanitize_text_field( wp_unslash( (string) $_COOKIE['atk_master_gate'] ) ) : '';
        $parts  = explode( '|', $cookie, 2 );
        $exp    = (int) $parts[0];
        return $exp > time() && hash_equals( self::gate_token( (string) $hide['master_password_hash'], $exp ), $cookie );
    }

    private static function current_request_url(): string {
        $uri = isset( $_SERVER['REQUEST_URI'] ) ? (string) wp_unslash( $_SERVER['REQUEST_URI'] ) : '/'; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput
        if ( ! str_starts_with( $uri, '/' ) || str_starts_with( $uri, '//' ) ) {
            $uri = '/';
        }
        $origin = (string) preg_replace( '#^(https?://[^/]+).*$#', '$1', home_url( '/' ) );
        return $origin . $uri;
    }

    private static function send_lock_page( int $status, string $title, string $body_html ): void {
        status_header( $status );
        nocache_headers();
        header( 'X-Robots-Tag: noindex, nofollow' );
        header( 'Content-Type: text/html; charset=utf-8' );
        echo '<!DOCTYPE html><html lang="hu"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>' . esc_html( $title ) . '</title><style>body{font:16px/1.5 system-ui,sans-serif;display:grid;place-items:center;min-height:100vh;margin:0;background:#f6f7f9;color:#1f2328}main{background:#fff;padding:2rem;border-radius:12px;box-shadow:0 6px 24px rgba(0,0,0,.12);max-width:420px;width:calc(100% - 2rem)}input,button{font:inherit;padding:.55rem .7rem;margin:.3rem 0;width:100%;box-sizing:border-box}button{background:#2563eb;color:#fff;border:0;border-radius:8px;cursor:pointer}.err{color:#b42318}</style></head><body><main><h1>' . esc_html( $title ) . '</h1>' . $body_html . '</main></body></html>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- a $body_html hívóoldalon escape-elt
        exit;
    }

    private static function handle_master_gate( string $hash ): void {
        $error = '';
        if ( 'POST' === ( $_SERVER['REQUEST_METHOD'] ?? '' ) && isset( $_POST['atk_master_pw'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification
            $fail_key = 'atk_gate_fail_' . substr( hash_hmac( 'sha256', self::client_ip() . '|' . self::client_user_agent(), wp_salt() ), 0, 20 );
            if ( (int) get_transient( $fail_key ) >= 5 ) {
                self::send_lock_page( 429, 'Védett weboldal', '<p class="err">' . esc_html__( 'Túl sok próbálkozás. Várjon 10 percet.', 'and-toolkit' ) . '</p>' );
            }
            if ( wp_check_password( (string) wp_unslash( $_POST['atk_master_pw'] ), $hash ) ) { // phpcs:ignore WordPress.Security.NonceVerification,WordPress.Security.ValidatedSanitizedInput
                $expires = time() + 12 * HOUR_IN_SECONDS;
                setcookie( 'atk_master_gate', self::gate_token( $hash, $expires ), [ 'expires' => $expires, 'path' => '/', 'secure' => is_ssl(), 'httponly' => true, 'samesite' => 'Lax' ] );
                delete_transient( $fail_key );
                wp_safe_redirect( self::current_request_url() );
                exit;
            }
            set_transient( $fail_key, (int) get_transient( $fail_key ) + 1, 10 * MINUTE_IN_SECONDS );
            $error = '<p class="err">' . esc_html__( 'Hibás jelszó.', 'and-toolkit' ) . '</p>';
        }
        self::send_lock_page(
            403,
            'Védett weboldal',
            $error . '<form method="post" action=""><label>' . esc_html__( 'Mesterjelszó', 'and-toolkit' ) . '<input type="password" name="atk_master_pw" required autofocus autocomplete="current-password"></label><button type="submit">' . esc_html__( 'Belépés', 'and-toolkit' ) . '</button></form>'
        );
    }

    public static function enforce_wp_hide_access_gate(): void {
        $hide = self::get_config()['wp_hide'];
        if ( empty( $hide['enabled'] ) || is_admin() ) {
            return;
        }
        if ( is_user_logged_in() && current_user_can( 'manage_options' ) ) {
            return; // az adminisztrátor sosem zárható ki
        }
        if ( self::master_gate_active() && ! self::master_gate_passed() ) {
            self::handle_master_gate( (string) $hide['master_password_hash'] );
        }
        if ( ! empty( $hide['members_only_mode'] ) && ! is_user_logged_in() ) {
            self::send_lock_page(
                401,
                'Tartalom csak tagoknak',
                '<p>' . esc_html__( 'A weboldal tartalma csak bejelentkezett látogatóknak érhető el.', 'and-toolkit' ) . '</p><p><a href="' . esc_url( wp_login_url( self::current_request_url() ) ) . '">' . esc_html__( 'Bejelentkezés', 'and-toolkit' ) . '</a></p>'
            );
        }
        if ( ! empty( $hide['block_author_scanning'] ) && ! is_user_logged_in() && ( isset( $_GET['author'] ) || is_author() ) ) { // phpcs:ignore WordPress.Security.NonceVerification
            global $wp_query;
            remove_action( 'template_redirect', 'redirect_canonical' );
            $wp_query->set_404();
            status_header( 404 );
            nocache_headers();
        }
    }

    private static function current_rest_route(): string {
        $route = isset( $_GET['rest_route'] ) ? sanitize_text_field( wp_unslash( (string) $_GET['rest_route'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification
        if ( '' === $route && isset( $_SERVER['REQUEST_URI'] ) ) {
            $path   = (string) wp_parse_url( (string) wp_unslash( $_SERVER['REQUEST_URI'] ), PHP_URL_PATH ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput
            $prefix = '/' . rest_get_url_prefix() . '/';
            $pos    = strpos( $path, $prefix );
            $route  = false === $pos ? '' : substr( $path, $pos + strlen( $prefix ) - 1 );
        }
        return '/' . trim( $route, '/' );
    }

    /**
     * Csak tagoknak / mesterjelszó módban a REST API (pl. a keresés) sem ad tartalmat vendégeknek.
     */
    public static function filter_rest_access( $result ) {
        if ( ! empty( $result ) || is_user_logged_in() ) {
            return $result;
        }
        $hide = self::get_config()['wp_hide'];
        if ( empty( $hide['enabled'] ) ) {
            return $result;
        }
        $locked = ( self::master_gate_active() && ! self::master_gate_passed() ) || ! empty( $hide['members_only_mode'] );
        if ( ! $locked || in_array( self::current_rest_route(), [ '/' . self::REST_NS . '/cookie-consent', '/' . self::REST_NS . '/track-visit' ], true ) ) {
            return $result;
        }
        return new \WP_Error( 'and_toolkit_site_locked', __( 'A webhely tartalma zárolt.', 'and-toolkit' ), [ 'status' => 401 ] );
    }

    private static function alias_for( int $user_id ): string {
        $pattern = (string) self::get_config()['wp_hide']['author_alias'];
        $pattern = '' !== $pattern ? $pattern : 'Szerkesztőség';
        return str_replace( 'ID', (string) $user_id, $pattern );
    }

    private static function masking_active(): bool {
        $hide = self::get_config()['wp_hide'];
        return ! empty( $hide['enabled'] ) && ! empty( $hide['hide_usernames_emails'] ) && ! is_admin() && ! current_user_can( 'manage_options' );
    }

    public static function filter_masked_author_name( $name, $user_id = 0 ) {
        if ( ! self::masking_active() ) {
            return $name;
        }
        return self::alias_for( (int) ( $user_id ?: get_the_author_meta( 'ID' ) ) );
    }

    public static function filter_masked_comment_author( $author, $comment_id = 0, $comment = null ) {
        if ( ! self::masking_active() ) {
            return $author;
        }
        $member = $comment instanceof \WP_Comment && (int) $comment->user_id > 0;
        if ( $member || str_contains( (string) $author, '@' ) ) {
            return self::alias_for( $member ? (int) $comment->user_id : 0 );
        }
        return $author; // a névtelen látogatók megadott neve nem azonosító adat, érintetlen marad
    }

    private static function login_form_html( string $form_id ): string {
        ob_start();
        self::render_captcha_field();
        $captcha = (string) ob_get_clean();
        $middle  = $captcha . self::totp_field_html();
        $filter  = static fn( $content ) => (string) $content . $middle;
        add_filter( 'login_form_middle', $filter );
        $html = (string) wp_login_form( [ 'echo' => false, 'form_id' => $form_id, 'redirect' => self::current_request_url(), 'remember' => true ] );
        remove_filter( 'login_form_middle', $filter );
        return $html;
    }

    private static function enqueue_login_form_captcha(): void {
        if ( self::get_config()['captcha']['protect_login'] && ! self::captcha_should_bypass() ) {
            self::enqueue_captcha_provider_script();
        }
    }

    public static function render_custom_login_shortcode( $atts = [] ): string {
        $hide = self::get_config()['wp_hide'];
        if ( empty( $hide['enabled'] ) || empty( $hide['enable_login_shortcode'] ) ) {
            return '';
        }
        $html = '<section class="atk-widget atk-custom-login"><h3>' . esc_html__( 'Bejelentkezés', 'and-toolkit' ) . '</h3>';
        if ( is_user_logged_in() ) {
            return $html . '<p>' . esc_html( sprintf( 'Bejelentkezve: %s', wp_get_current_user()->display_name ) ) . ' · <a href="' . esc_url( wp_logout_url( self::current_request_url() ) ) . '">' . esc_html__( 'Kijelentkezés', 'and-toolkit' ) . '</a></p></section>';
        }
        self::enqueue_login_form_captcha();
        return $html . self::login_form_html( 'atk-login-form' ) . '</section>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- wp_login_form() kimenete
    }

    public static function render_ajax_bubble_login_widget(): void {
        $hide = self::get_config()['wp_hide'];
        if ( empty( $hide['enabled'] ) || empty( $hide['enable_ajax_bubble_login'] ) || is_user_logged_in() ) {
            return;
        }
        printf(
            '<aside class="atk-bubble-login" data-position="%s"><button type="button" class="atk-bubble-trigger" aria-expanded="false">%s</button><div class="atk-bubble-panel atk-hidden">%s</div></aside>',
            esc_attr( self::pick( (string) $hide['bubble_position'], [ 'bottom-right', 'bottom-left' ], 'bottom-right' ) ),
            esc_html( (string) $hide['bubble_button_label'] ),
            self::login_form_html( 'atk-bubble-form' ) // wp_login_form() kimenete
        ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
    }

    public static function handle_ajax_bubble_login(): void {
        $hide = self::get_config()['wp_hide'];
        if ( empty( $hide['enabled'] ) || empty( $hide['enable_ajax_bubble_login'] ) ) {
            wp_send_json_error( [ 'message' => 'A gyors belépés le van tiltva.' ], 403 );
        }
        if ( is_user_logged_in() ) {
            wp_send_json_success( [ 'status' => 'already_logged_in' ] );
        }
        $login = isset( $_POST['log'] ) ? sanitize_user( wp_unslash( (string) $_POST['log'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification
        if ( ! self::rate_limit( 'bubble', 2, $login ) ) {
            wp_send_json_error( [ 'message' => 'Túl sok bejelentkezési kísérlet, várjon egy kicsit.' ], 429 );
        }
        $user = wp_signon(
            [
                'user_login'    => $login,
                'user_password' => isset( $_POST['pwd'] ) ? (string) wp_unslash( $_POST['pwd'] ) : '', // phpcs:ignore WordPress.Security.NonceVerification,WordPress.Security.ValidatedSanitizedInput
                'remember'      => ! empty( $_POST['rememberme'] ), // phpcs:ignore WordPress.Security.NonceVerification
            ],
            is_ssl()
        );
        if ( is_wp_error( $user ) ) {
            $passthrough = [ 'and_toolkit_totp_required', 'and_toolkit_totp_invalid', 'and_toolkit_totp_locked', 'and_toolkit_captcha_failed' ];
            $message     = in_array( $user->get_error_code(), $passthrough, true ) ? wp_strip_all_tags( $user->get_error_message() ) : 'Hibás belépési adatok.';
            wp_send_json_error( [ 'message' => $message ], 401 );
        }
        wp_send_json_success( [ 'status' => 'logged_in' ] );
    }
}

And_ToolKit_Plugin::init();
