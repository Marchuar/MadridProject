<?php
/**
 * WPCode Snippet: Enqueue VamosMadrid React bundle on /projecto-2/
 * Scope: projecto-2 page only. Do NOT activate globally.
 * CDN: update JS_URL and CSS_URL after each GitHub push.
 *
 * jsDelivr URLs — update @COMMIT_SHA after each push for cache busting.
 * Latest main (may be cached up to 12h):
 *   https://cdn.jsdelivr.net/gh/Marchuar/MadridProject@main/vamos-p2-app/dist/assets/index.js
 * Specific commit (instant, recommended for testing):
 *   https://cdn.jsdelivr.net/gh/Marchuar/MadridProject@COMMIT_SHA/vamos-p2-app/dist/assets/index.js
 */

add_action( 'wp_enqueue_scripts', function () {
    if ( ! is_page( 'projecto-2' ) ) {
        return;
    }

    // Sansation font (brand typeface — not available via @fontsource npm)
    wp_enqueue_style(
        'vamos-p2-sansation',
        'https://fonts.googleapis.com/css2?family=Sansation:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap',
        [],
        null
    );

    // Update the commit SHA below after each push to GitHub
    $commit  = 'main'; // replace with actual SHA for cache-busting
    $base    = 'https://cdn.jsdelivr.net/gh/Marchuar/MadridProject@' . $commit . '/vamos-p2-app/dist/assets/';
    $js_url  = $base . 'index.js';
    $css_url = $base . 'index.css';

    wp_enqueue_style( 'vamos-p2-app', $css_url, [ 'vamos-p2-sansation' ], null );
    wp_enqueue_script( 'vamos-p2-app', $js_url, [], null, [ 'in_footer' => true ] );

    wp_localize_script( 'vamos-p2-app', 'vamosp2Config', [
        'restUrl'    => get_rest_url(),
        'nonce'      => wp_create_nonce( 'wp_rest' ),
        'userId'     => get_current_user_id(),
        'isLoggedIn' => is_user_logged_in(),
    ] );
} );

// Required: Vite output uses ES module syntax (import.meta), so script must be type="module"
add_filter( 'script_loader_tag', function ( $tag, $handle ) {
    if ( 'vamos-p2-app' === $handle ) {
        return str_replace( ' src=', ' type="module" src=', $tag );
    }
    return $tag;
}, 10, 2 );

// Inject the React root div into the page content (before existing content)
add_filter( 'the_content', function ( $content ) {
    if ( ! is_page( 'projecto-2' ) ) {
        return $content;
    }
    return '<div id="vamos-p2-root"></div>';
} );
