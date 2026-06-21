<?php
/**
 * WPCode Snippet: Enqueue VamosMadrid React bundle on /projecto-2/
 * Scope: projecto-2 page only. Do NOT activate globally.
 *
 * After each GitHub push, update $commit below with the new SHA.
 * Use specific SHA (not 'main') — jsDelivr caches 'main' up to 12h.
 *
 * jsDelivr URLs:
 *   JS:  https://cdn.jsdelivr.net/gh/Marchuar/MadridProject@SHA/vamos-p2-app/dist/assets/index.js
 *   CSS: https://cdn.jsdelivr.net/gh/Marchuar/MadridProject@SHA/vamos-p2-app/dist/assets/index.css
 */

add_action( 'wp_enqueue_scripts', function () {
    if ( ! is_page( 'projecto-2' ) ) {
        return;
    }

    // ── UPDATE THIS SHA AFTER EACH PUSH ──────────────────────────────────────
    $commit = 'main'; // replace with actual git SHA, e.g. 'a1b2c3d'
    // ─────────────────────────────────────────────────────────────────────────

    $cdn_root  = 'https://cdn.jsdelivr.net/gh/Marchuar/MadridProject@' . $commit . '/vamos-p2-app/dist';
    $js_url    = $cdn_root . '/assets/index.js';
    $css_url   = $cdn_root . '/assets/index.css';

    wp_enqueue_style( 'vamos-p2-app', $css_url, [], null );
    wp_enqueue_script( 'vamos-p2-app', $js_url, [], null, [ 'in_footer' => true ] );

    wp_localize_script( 'vamos-p2-app', 'vamosp2Config', [
        'restUrl'    => get_rest_url(),
        'nonce'      => wp_create_nonce( 'wp_rest' ),
        'userId'     => get_current_user_id(),
        'isLoggedIn' => is_user_logged_in(),
        // Base URL for all public assets (images, fonts) served from CDN dist folder
        'assetsUrl'  => $cdn_root,
    ] );
} );

// Required: Vite ES module output needs type="module"
add_filter( 'script_loader_tag', function ( $tag, $handle ) {
    if ( 'vamos-p2-app' === $handle ) {
        return str_replace( ' src=', ' type="module" src=', $tag );
    }
    return $tag;
}, 10, 2 );

// Inject the React root div — replaces page content on /projecto-2/
add_filter( 'the_content', function ( $content ) {
    if ( ! is_page( 'projecto-2' ) ) {
        return $content;
    }
    return '<div id="vamos-p2-root"></div>';
} );
