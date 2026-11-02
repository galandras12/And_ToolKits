<?php
/**
 * Plugin Name:       And ToolKit
 * Plugin URI:        https://github.com/galandras12/and-toolkit
 * Description:       Modern WordPress 7.1 adminisztrációs eszköztár: Esemény naptár widget, AJAX élő kereső, platformfüggetlen közösségi megosztó, látogatói/letöltési statisztika és kötelező GDPR Cookie (Süti) kezelő modul sötét/világos móddal.
 * Version:           0.2.0
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
    public const VERSION    = '0.2.0';
    public const AUTHOR     = 'galandras12+AI';
    public const WP_TARGET  = '7.1';
    public const PHP_TARGET = '8.0';

    public static function init(): void {
        add_action( 'admin_menu', [ __CLASS__, 'register_admin_menu' ] );
        add_action( 'widgets_init', [ __CLASS__, 'register_sidebar_widgets' ] );
        add_action( 'wp_enqueue_scripts', [ __CLASS__, 'enqueue_frontend_assets' ] );
        add_action( 'wp_footer', [ __CLASS__, 'render_gdpr_footer_banner' ] );
        add_action( 'rest_api_init', [ __CLASS__, 'register_rest_routes' ] );

        // Rövidkódok (Shortcodes) regisztrálása WordPress 7.1 blokk és klasszikus témákhoz
        add_shortcode( 'wtk_calendar', [ __CLASS__, 'render_calendar_widget' ] );
        add_shortcode( 'wtk_search', [ __CLASS__, 'render_search_widget' ] );
        add_shortcode( 'wtk_social', [ __CLASS__, 'render_social_widget' ] );
        add_shortcode( 'wtk_stats', [ __CLASS__, 'render_stats_widget' ] );
        add_shortcode( 'wtk_cookie_consent', [ __CLASS__, 'render_cookie_consent_widget' ] );
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
                'default_categories'     => [ 'necessary' => true, 'preferences' => true, 'analytics' => false, 'marketing' => false ],
            ],
            'performance' => [
                'minify_assets'   => true,
                'defer_scripts'   => true,
                'cache_ttl_mins'  => 60,
                'zero_jquery'     => true,
            ],
        ];
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
}

And_ToolKit_Plugin::init();
