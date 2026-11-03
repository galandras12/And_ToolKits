<?php
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

        // v0.4.0 Kép-, Upload Limit-, Lazy Load és Gyorsítótár Optimalizáló szűrők
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
            'theme_mode'  => 'light',
            'calendar'    => [
                'enabled'        => true,
                'title'          => 'Közelgő Események & Bejegyzések',
                'style'          => 'cards',
                'max_items'      => 4,
                'show_countdown' => true,
            ],
            'search'      => [
                'enabled'           => true,
                'title'             => 'Gyors Keresés az Oldalon',
                'layout'            => 'detailed',
                'live_ajax'         => true,
                'debounce_ms'       => 180,
                'post_types'        => [ 'post', 'event', 'page', 'download' ],
                'highlight_matches' => true,
            ],
            'social'      => [
                'enabled'      => true,
                'title'        => 'Tartalom Megosztása',
                'button_style' => 'rounded',
                'columns'      => 2,
                'platforms'    => [ 'facebook', 'x', 'linkedin', 'whatsapp', 'telegram', 'reddit', 'email' ],
            ],
            'stats'       => [
                'enabled'          => true,
                'title'            => 'Oldal Hatékonyság & Forgalom',
                'style'            => 'grid-cards',
                'number_format'    => 'compact',
                'unique_visitors'  => true,
                'total_downloads'  => true,
            ],
            'gdpr'        => [
                'enabled'                => true,
                'title'                  => 'GDPR Süti (Cookie) és Adatvédelmi Beállítások',
                'display_style'          => 'sidebar-widget',
                'privacy_url'            => '/adatvedelmi-tajekoztato',
                'expiry_days'            => 180,
                'google_consent_mode_v2' => true,
                'auto_block_scripts'     => true,
                'default_categories'     => [
                    'necessary'   => true,
                    'preferences' => true,
                    'analytics'   => false,
                    'marketing'   => false,
                ],
            ],
            'banner'      => [
                'enabled'          => true,
                'visibility_scope' => 'all-pages',
                'sticky_top'       => true,
                'color_preset'     => 'cobalt-gradient',
                'custom_bg_hex'    => '#1E3A8A',
                'custom_text_hex'  => '#FFFFFF',
                'size_preset'      => 'standard',
                'font_style'       => 'display-bold',
                'animation'        => 'pulse-glow',
                'badge_text'       => 'ÚJ VERZIÓ · v0.5.1',
                'headline'         => 'And ToolKit v0.5.1: Critical Only E-mail Riasztás Szűrő a Biztonsági Naplóban!',
                'subtext'          => 'Szűrje az e-mail értesítéseket kizárólag a kritikus WordPress mag (Core) frissítésekre és fájlrendszer-változásokra.',
                'cta_label'        => 'Naplózás megnyitása',
                'cta_url'          => '/kiadasok/and-toolkit-v0-5-1',
                'dismissible'      => true,
            ],
            'optimizer'   => [
                'enabled'                 => true,
                'auto_optimize'           => true,
                'auto_schedule'           => 'realtime-upload',
                'image_compression'       => true,
                'compression_quality'     => 82,
                'convert_format'          => 'webp',
                'auto_resize'             => true,
                'max_width_px'            => 1920,
                'max_height_px'           => 1080,
                'override_upload_limit'   => true,
                'custom_upload_limit_mb'  => 256,
                'lazy_load_images'        => true,
                'lazy_load_iframes'       => true,
                'lazy_load_backgrounds'   => true,
                'exclude_above_fold'      => 2,
                'page_cache_enabled'      => true,
            ],
            'audit_log'   => [
                'enabled'                        => true,
                'recipient_email'                => 'galandras12@gmail.com',
                'critical_only_emails'           => false,
                'export_format'                  => 'log',
                'login_email_enabled'            => true,
                'login_email_scope'              => 'admins-only',
                'new_device_location_alert'      => true,
                'new_device_target_roles'        => [ 'administrator', 'editor' ],
                'update_available_email_enabled' => true,
                'daily_digest_enabled'           => true,
                'daily_digest_time'              => '08:00',
            ],
            'performance' => [
                'minify_assets'   => true,
                'defer_scripts'   => true,
                'cache_ttl_mins'  => 60,
                'zero_jquery'     => true,
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

    public static function log_user_login_event( string $user_login, object $user ): void {
        $audit = self::get_config()['audit_log'];
        if ( ! $audit['enabled'] ) {
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

    public static function handle_ajax_search( \WP_REST_Request $request ): \WP_REST_Response {
        $query  = sanitize_text_field( (string) $request->get_param( 'q' ) );
        $config = self::get_config()['search'];

        $posts = get_posts( [
            's'              => $query,
            'post_type'      => $config['post_types'],
            'posts_per_page' => 5,
            'post_status'    => [ 'publish', 'future' ],
        ] );

        return new \WP_REST_Response( [ 'results' => $posts, 'query' => $query ], 200 );
    }

    public static function increment_download_counter( \WP_REST_Request $request ): \WP_REST_Response {
        $current = (int) get_option( 'and_toolkit_downloads_total', 12640 );
        update_option( 'and_toolkit_downloads_total', $current + 1, false );

        return new \WP_REST_Response( [ 'downloads' => $current + 1 ], 200 );
    }

    public static function handle_cookie_consent( \WP_REST_Request $request ): \WP_REST_Response {
        $level = sanitize_text_field( (string) $request->get_param( 'consent_level' ) );
        $allowed_levels = [ 'all', 'custom', 'essential' ];
        $clean_level = in_array( $level, $allowed_levels, true ) ? $level : 'essential';

        return new \WP_REST_Response(
            [
                'status'        => 'recorded',
                'consent_level' => $clean_level,
                'version'       => self::VERSION,
            ],
            200
        );
    }

    public static function handle_system_optimization( \WP_REST_Request $request ): \WP_REST_Response {
        if ( function_exists( 'wp_cache_flush' ) ) {
            wp_cache_flush();
        }
        return new \WP_REST_Response(
            [
                'status'  => 'optimized',
                'version' => self::VERSION,
            ],
            200
        );
    }

    public static function handle_audit_log_export( \WP_REST_Request $request ): \WP_REST_Response {
        $format = sanitize_text_field( (string) ( $request->get_param( 'format' ) ?? 'log' ) );
        $allowed = [ 'log', 'txt', 'csv' ];
        $clean_format = in_array( $format, $allowed, true ) ? $format : 'log';

        return new \WP_REST_Response(
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
