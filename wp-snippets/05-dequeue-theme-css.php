<?php
/**
 * WPCode: CSS management + header/footer + button fix on /projecto-2/
 *
 * Page uses template "elementor_header_footer" which shows the Elementor
 * global header (ID 13092) and footer (ID 13079) around our React SPA content.
 *
 * Four problems solved here:
 *  1. CSS dequeue — keep only what's needed for header/footer + our bundle
 *  2. Elementor single-template bypass — Elementor overrides page content with
 *     its own 51,000px of built content; we disable that so the_content() runs
 *     our React div instead
 *  3. Button red background — Edubin's customizer <style> hardcodes
 *     button { background: #d90723 } as a plain hex value (not a CSS variable),
 *     so CSS-variable overrides don't help. PHP output buffer strips those rules.
 *  4. JoinChat widget — kept so "Need help?" button remains styled
 */

// ── 1. CSS keep list ──────────────────────────────────────────────────────────
$p2_keep = [
    // WP admin
    'admin-bar',
    'dashicons',
    'wpcode-admin-bar-css',

    // Our React bundle
    'vamos-p2-app',

    // WhatsApp chat widget
    'joinchat',

    // Elementor core + global kit (needed for header/footer size/typography/colors)
    'elementor-frontend',
    'elementor-global-css',   // kit/global typography, colors, spacing
    'elementor-common',       // common base styles

    // Elementor global header (ID 13092) and footer (ID 13079) CSS
    'elementor-post-13092',
    'elementor-post-13079',

    // Elementor icon sets used in the header/footer
    'elementor-icons',
    'elementor-icons-shared-0',
    'elementor-icons-fa-solid',
    'elementor-icons-fa-regular',
    'elementor-icons-fa-brands',
    'elementor-icons-ekiticons',
    'elementor-icons-edubin-custom-icons',

    // ElementsKit (used for mega menu / header widgets)
    'ekit-widget-styles',
    'ekit-responsive',

    // Edubin theme base CSS (needed for header/footer typography + layout)
    'edubin-core',
    'edubin-global-theme',
    'edubin-theme',
    'edubin-fonts',
    'edubin-flaticon',

    // Font awesome (header/footer social icons)
    'font-awesome',
    'fontawesome',

    // Swiper (used by header slider if any)
    'swiper',
    'e-swiper',
];

// Layer 1: dequeue from WP queue (catches most stylesheets)
add_action( 'wp_enqueue_scripts', function () use ( $p2_keep ) {
    if ( ! is_page( 'projecto-2' ) ) return;

    global $wp_styles;
    if ( empty( $wp_styles->queue ) ) return;

    foreach ( $wp_styles->queue as $handle ) {
        if ( ! in_array( $handle, $p2_keep, true ) ) {
            wp_dequeue_style( $handle );
            wp_deregister_style( $handle );
        }
    }
}, 9999 );

// Layer 2: suppress <link> tags that slipped past Layer 1
add_filter( 'style_loader_tag', function ( $tag, $handle ) use ( $p2_keep ) {
    if ( ! is_page( 'projecto-2' ) ) return $tag;
    return in_array( $handle, $p2_keep, true ) ? $tag : '';
}, 9999, 2 );


// ── 2. Disable Elementor "single" location on /projecto-2/ ───────────────────
// The elementor_header_footer template calls elementor_theme_do_location('single')
// which renders all the Elementor-built page content (~51,000px tall).
// By returning false for this page, Elementor falls back to the_content()
// which our filter replaces with <div id="vamos-p2-root"></div>.
add_filter( 'elementor/theme/need_override_location', function ( $need_override, $location ) {
    if ( is_page( 'projecto-2' ) && 'single' === $location ) {
        return false;
    }
    return $need_override;
}, 10, 2 );


// ── 3. Strip button background rules from Edubin inline <style> ───────────────
// Edubin's Customizer outputs a large <style> block via wp_head (not enqueue
// system — can't be dequeued) containing:
//   button, input[type="button"], input[type="submit"] { background: #d90723; }
//   button:hover, button:focus { background-color: #d8223a; }
// These are plain hex values (NOT CSS variables), so our --edubin-btn-bg-color
// override in CSS has no effect. We strip them via output buffering.
add_action( 'template_redirect', function () {
    if ( ! is_page( 'projecto-2' ) ) return;

    ob_start( function ( $html ) {
        return preg_replace_callback(
            '/<style\b[^>]*>([\s\S]*?)<\/style>/i',
            function ( $m ) {
                $css = $m[1];

                // Only process Edubin's Customizer style (identified by its variables)
                if ( strpos( $css, '--edubin-primary-color' ) === false &&
                     strpos( $css, '--edubin-btn-bg-color' ) === false ) {
                    return $m[0];
                }

                // Process each CSS rule block individually
                $css = preg_replace_callback(
                    '/([^{}@]+)\{([^}]*)\}/s',
                    function ( $rule ) {
                        $selector = $rule[1];
                        $props    = $rule[2];

                        // Does the selector contain button or input[type=button/submit]?
                        $is_btn = preg_match(
                            '/\b(button|input\s*\[\s*type\s*=\s*["\']?\s*(button|submit)\s*["\']?\s*\])/i',
                            $selector
                        );

                        if ( $is_btn ) {
                            // Remove background and border-color declarations
                            $props = preg_replace( '/\s*background(-color)?:[^;]+;/i', '', $props );
                            $props = preg_replace( '/\s*border-color:[^;]+;/i', '', $props );
                        }

                        return $rule[1] . '{' . $props . '}';
                    },
                    $css
                );

                return '<style>' . $css . '</style>';
            },
            $html
        );
    } );
} );
