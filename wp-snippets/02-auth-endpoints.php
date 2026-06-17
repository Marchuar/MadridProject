<?php
/**
 * WPCode Snippet: VamosMadrid Auth REST Endpoints (Project 2)
 * Routes:
 *   POST /wp-json/vamos-p2/v1/login    — login with WP credentials
 *   POST /wp-json/vamos-p2/v1/register — create new user + auto-login
 *   POST /wp-json/vamos-p2/v1/logout   — clear WP session
 *
 * Scope: global (routes must be registered globally), but safe — no collisions
 * with other teams because of the vamos-p2/v1 namespace.
 */

add_action( 'rest_api_init', function () {

    register_rest_route( 'vamos-p2/v1', '/login', [
        'methods'             => 'POST',
        'callback'            => 'vamos_p2_login',
        'permission_callback' => '__return_true',
        'args'                => [
            'username' => [ 'required' => true, 'type' => 'string', 'sanitize_callback' => 'sanitize_text_field' ],
            'password' => [ 'required' => true, 'type' => 'string' ],
        ],
    ] );

    register_rest_route( 'vamos-p2/v1', '/register', [
        'methods'             => 'POST',
        'callback'            => 'vamos_p2_register',
        'permission_callback' => '__return_true',
        'args'                => [
            'username' => [ 'required' => true, 'type' => 'string', 'sanitize_callback' => 'sanitize_text_field' ],
            'email'    => [ 'required' => true, 'type' => 'string', 'sanitize_callback' => 'sanitize_email' ],
            'password' => [ 'required' => true, 'type' => 'string' ],
        ],
    ] );

    register_rest_route( 'vamos-p2/v1', '/logout', [
        'methods'             => 'POST',
        'callback'            => 'vamos_p2_logout',
        'permission_callback' => '__return_true',
    ] );
} );

function vamos_p2_login( WP_REST_Request $req ) {
    $creds = [
        'user_login'    => $req['username'],
        'user_password' => $req['password'],
        'remember'      => true,
    ];
    $user = wp_signon( $creds, false );
    if ( is_wp_error( $user ) ) {
        return new WP_Error(
            'login_failed',
            'Incorrect username or password.',
            [ 'status' => 401 ]
        );
    }
    wp_set_current_user( $user->ID );
    return rest_ensure_response( [
        'userId'      => $user->ID,
        'displayName' => $user->display_name,
        'nonce'       => wp_create_nonce( 'wp_rest' ),
    ] );
}

function vamos_p2_register( WP_REST_Request $req ) {
    $username = $req['username'];
    $email    = $req['email'];
    $password = $req['password'];

    if ( username_exists( $username ) ) {
        return new WP_Error( 'username_exists', 'This username is already taken.', [ 'status' => 400 ] );
    }
    if ( email_exists( $email ) ) {
        return new WP_Error( 'email_exists', 'An account with this email already exists.', [ 'status' => 400 ] );
    }

    $user_id = wp_create_user( $username, $password, $email );
    if ( is_wp_error( $user_id ) ) {
        return new WP_Error( 'register_failed', $user_id->get_error_message(), [ 'status' => 400 ] );
    }

    // Auto-login after registration
    $creds = [ 'user_login' => $username, 'user_password' => $password, 'remember' => true ];
    $user  = wp_signon( $creds, false );
    if ( is_wp_error( $user ) ) {
        return rest_ensure_response( [ 'userId' => $user_id, 'nonce' => wp_create_nonce( 'wp_rest' ) ] );
    }
    wp_set_current_user( $user_id );

    return rest_ensure_response( [
        'userId' => $user_id,
        'nonce'  => wp_create_nonce( 'wp_rest' ),
    ] );
}

function vamos_p2_logout() {
    wp_logout();
    return rest_ensure_response( [ 'success' => true ] );
}
