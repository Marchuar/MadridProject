<?php
/**
 * WPCode Snippet: Dequeue non-essential CSS on /projecto-2/
 *
 * The Edubin theme + WooCommerce/Formidable/WPML stylesheets interfere with
 * the React SPA (wrong fonts, borders, paddings, button colors, etc.).
 * This snippet removes them ONLY on /projecto-2/ so the rest of the site is unaffected.
 *
 * How to use: paste into WPCode → PHP Snippet → Run Everywhere.
 * Priority 100 ensures we run AFTER all theme/plugin enqueues (default priority 10).
 *
 * Note: WP appends "-css" to the handle for the DOM id attribute.
 * DOM id "edubin-core-css-css" → handle "edubin-core-css".
 */

add_action( 'wp_enqueue_scripts', function () {
    if ( ! is_page( 'projecto-2' ) ) {
        return;
    }

    $handles = [
        // ── Edubin theme ──────────────────────────────────────────────────
        'edubin-core-css',          // main theme base CSS (fonts, resets, layout)
        'edubin-style',             // theme style.css if registered separately

        // ── Elementor ─────────────────────────────────────────────────────
        'elementor-common',         // common Elementor CSS
        'elementor-frontend',       // front-end Elementor CSS
        'elementor-global-css',     // kit/global styles
        'elementor-post-15913',     // page-specific CSS — update ID if page changes
        'e-theme-ui-light',         // Elementor UI tokens
        'elementor-icons',          // Elementor icon font

        // ── WooCommerce ───────────────────────────────────────────────────
        'woocommerce-layout',
        'woocommerce-smallscreen',
        'woocommerce-general',

        // ── WooLentor / ShopLentor ────────────────────────────────────────
        'woolentor-block-common',
        'woolentor-block-default',

        // ── Formidable Forms ──────────────────────────────────────────────
        'formidable-css',
        'frm_fonts-css',            // Formidable fonts

        // ── WPML ──────────────────────────────────────────────────────────
        'wpml-legacy-dropdown-0',
        'wpml-sticky-links',

        // ── Wordfence ─────────────────────────────────────────────────────
        'wordfenceAJAXcss',

        // ── WP Core blocks (not needed for SPA) ───────────────────────────
        'wp-block-library',
        'wp-block-library-theme',
        'classic-theme-styles',
        'global-styles',            // WP 6.x global styles
    ];

    foreach ( $handles as $handle ) {
        wp_dequeue_style( $handle );
        wp_deregister_style( $handle );   // prevents re-enqueue by other hooks
    }

}, 100 );
