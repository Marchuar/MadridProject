<?php
/**
 * WPCode: Strip non-essential CSS on /projecto-2/
 *
 * Two-layer approach:
 *  1. wp_enqueue_scripts (priority 9999) — dequeues from the WP queue
 *  2. style_loader_tag filter — intercepts the final <link> output;
 *     catches styles enqueued after priority 9999 (Gutenberg blocks, Stripe, etc.)
 *
 * Keep list: only essential handles that must load on this page.
 * Joinchat is kept so the WhatsApp chat widget retains its styling.
 *
 * NOTE: Edubin's Customizer inline <style> (--edubin-btn-bg-color etc.) cannot
 * be dequeued — it's added via wp_head directly. Override its variables in CSS
 * instead (see our React bundle's global.css).
 */

$p2_keep = [
    'admin-bar',            // WP admin toolbar
    'dashicons',            // WP admin icons
    'wpcode-admin-bar-css', // WPCode admin bar badge
    'vamos-p2-app',         // our React bundle CSS
    'joinchat',             // WhatsApp chat widget — keep styled
];

// ── Layer 1: dequeue from WP styles queue ───────────────────────────────────
add_action( 'wp_enqueue_scripts', function () use ( $p2_keep ) {
    if ( ! is_page( 'projecto-2' ) ) {
        return;
    }

    global $wp_styles;
    if ( empty( $wp_styles->queue ) ) {
        return;
    }

    foreach ( $wp_styles->queue as $handle ) {
        if ( ! in_array( $handle, $p2_keep, true ) ) {
            wp_dequeue_style( $handle );
            wp_deregister_style( $handle );
        }
    }
}, 9999 );

// ── Layer 2: filter the final <link> HTML output ─────────────────────────────
// Catches anything that slipped past layer 1 (enqueued at priority > 9999,
// or added by Gutenberg block rendering, WooCommerce, Stripe, etc.)
add_filter( 'style_loader_tag', function ( $tag, $handle ) use ( $p2_keep ) {
    if ( ! is_page( 'projecto-2' ) ) {
        return $tag;
    }

    if ( ! in_array( $handle, $p2_keep, true ) ) {
        return ''; // suppress the <link> tag entirely
    }

    return $tag;
}, 9999, 2 );
