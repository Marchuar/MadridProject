<?php
/**
 * WPCode Snippet: VamosMadrid Profile REST Endpoints (Project 2)
 * Routes:
 *   GET   /wp-json/vamos-p2/v1/profile — get current user's p2_ meta
 *   PATCH /wp-json/vamos-p2/v1/profile — update current user's p2_ meta
 *
 * Fields (stored as usermeta):
 *   p2_age           — integer
 *   p2_nationality   — string (country name)
 *   p2_budget        — string: 'low' | 'medium' | 'high'
 *   p2_stay_duration — string: '1_week' | '2_weeks' | '1_month' | '3_plus_months'
 *   p2_interests     — JSON array of interest slugs
 */

add_action( 'rest_api_init', function () {

    register_rest_route( 'vamos-p2/v1', '/profile', [
        [
            'methods'             => 'GET',
            'callback'            => 'vamos_p2_get_profile',
            'permission_callback' => 'is_user_logged_in',
        ],
        [
            'methods'             => 'PATCH',
            'callback'            => 'vamos_p2_update_profile',
            'permission_callback' => 'is_user_logged_in',
        ],
    ] );
} );

function vamos_p2_get_profile() {
    $user_id  = get_current_user_id();
    $interests_raw = get_user_meta( $user_id, 'p2_interests', true );

    return rest_ensure_response( [
        'p2_age'           => get_user_meta( $user_id, 'p2_age', true ),
        'p2_nationality'   => get_user_meta( $user_id, 'p2_nationality', true ),
        'p2_budget'        => get_user_meta( $user_id, 'p2_budget', true ),
        'p2_stay_duration' => get_user_meta( $user_id, 'p2_stay_duration', true ),
        'p2_interests'     => $interests_raw ? json_decode( $interests_raw, true ) : [],
    ] );
}

function vamos_p2_update_profile( WP_REST_Request $req ) {
    $user_id = get_current_user_id();

    $allowed_string_keys = [ 'p2_nationality', 'p2_budget', 'p2_stay_duration' ];
    foreach ( $allowed_string_keys as $key ) {
        if ( $req->has_param( $key ) ) {
            update_user_meta( $user_id, $key, sanitize_text_field( $req[ $key ] ) );
        }
    }

    if ( $req->has_param( 'p2_age' ) ) {
        $age = absint( $req['p2_age'] );
        if ( $age >= 1 && $age <= 120 ) {
            update_user_meta( $user_id, 'p2_age', $age );
        }
    }

    if ( $req->has_param( 'p2_interests' ) ) {
        $valid_interests = [ 'flamenco', 'city_tour', 'museum', 'day_trip', 'tardeo', 'cooking_class', 'language_exchange', 'football' ];
        $interests       = array_filter( (array) $req['p2_interests'], fn( $i ) => in_array( $i, $valid_interests, true ) );
        update_user_meta( $user_id, 'p2_interests', wp_json_encode( array_values( $interests ) ) );
    }

    return rest_ensure_response( [ 'success' => true ] );
}
