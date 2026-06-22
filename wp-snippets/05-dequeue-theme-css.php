<?php
/**
 * WPCode: CSS dequeue + button red fix on /projecto-2/
 *
 * Page uses Elementor Canvas template — full blank canvas, our React SPA
 * handles its own navigation. No WP theme header/footer needed.
 *
 * What this snippet does:
 *  1. Dequeues all non-essential stylesheets (Edubin, WooCommerce, etc.)
 *     keeping only admin-bar, dashicons, our bundle, and JoinChat.
 *  2. Strips Edubin Customizer's hardcoded button background rules via PHP
 *     output buffering. Edubin inline <style> hardcodes:
 *       button { background: #d90723; }   ← plain hex, not a CSS variable
 *       button:hover { background: #d8223a; }
 *     Our CSS variable override (--edubin-btn-bg-color: transparent) can't
 *     fix this — PHP is the only option.
 */

// ── 1. CSS keep list ─────────────────────────────────────────────────────────
$p2_keep = [
    'admin-bar',            // WP admin toolbar
    'dashicons',            // WP admin icons
    'wpcode-admin-bar-css', // WPCode admin bar badge
    'vamos-p2-app',         // our React bundle CSS
    'joinchat',             // WhatsApp "Need help?" widget
];

// Layer 1: dequeue from WP styles queue
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

// Layer 2: suppress <link> tags that slip past Layer 1
add_filter( 'style_loader_tag', function ( $tag, $handle ) use ( $p2_keep ) {
    if ( ! is_page( 'projecto-2' ) ) return $tag;
    return in_array( $handle, $p2_keep, true ) ? $tag : '';
}, 9999, 2 );


// ── 2. Strip button background rules from Edubin inline <style> ──────────────
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

                // Strip background/border-color from button and input selectors
                $css = preg_replace_callback(
                    '/([^{}@]+)\{([^}]*)\}/s',
                    function ( $rule ) {
                        $selector = $rule[1];
                        $props    = $rule[2];
                        $is_btn   = preg_match(
                            '/\b(button|input\s*\[\s*type\s*=\s*["\']?\s*(button|submit)\s*["\']?\s*\])/i',
                            $selector
                        );
                        if ( $is_btn ) {
                            // Strip background/border — prevents red button bg from Edubin
                            $props = preg_replace( '/\s*background(-color)?:[^;]+;/i', '', $props );
                            $props = preg_replace( '/\s*border-color:[^;]+;/i', '', $props );
                            // Also strip color:#fff — Edubin forces white text on button:hover
                            // which turns "View all" link and carousel arrows invisible on hover
                            $props = preg_replace( '/\s*color\s*:\s*(#fff(fff)?|white)\s*(!important)?\s*;/i', '', $props );
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
