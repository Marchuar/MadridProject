<?php
/**
 * WPCode Snippet: VamosMadrid Activities REST Endpoint (Project 2)
 *
 * Route: GET /wp-json/vamos-p2/v1/activities
 * Query param: ?category=flamenco (optional — filters by category slug)
 *
 * Data source priority:
 *   1. CPT "activity_p2" with ACF fields:
 *      category, date_and_time, location, price, available_slots,
 *      max_participants, image, woocommerce_product_id
 *      (if WooCommerce is active, pulls live stock from linked product)
 *   2. Hardcoded mock data (10 activities, all 8 categories) as final fallback
 *
 * Response shape per item:
 *   { id, title, category, date, location, price, slotsLeft, slotsTotal, imageUrl, description }
 *
 * Categories: flamenco | museum | city_tour | football | cooking_class |
 *             tardeo | language_exchange | day_trip
 */

add_action( 'rest_api_init', function () {
    register_rest_route( 'vamos-p2/v1', '/activities', [
        'methods'             => 'GET',
        'callback'            => 'vamos_p2_get_activities',
        'permission_callback' => '__return_true',
        'args'                => [
            'category' => [
                'type'              => 'string',
                'default'           => '',
                'sanitize_callback' => 'sanitize_text_field',
                'validate_callback' => function ( $value ) {
                    $allowed = [
                        '', 'flamenco', 'museum', 'city_tour', 'football',
                        'cooking_class', 'tardeo', 'language_exchange', 'day_trip',
                    ];
                    return in_array( $value, $allowed, true );
                },
            ],
        ],
    ] );
} );

function vamos_p2_get_activities( WP_REST_Request $req ) {
    $category = $req->get_param( 'category' );

    // ── Try CPT activity_p2 ──
    $query_args = [
        'post_type'      => 'activity_p2',
        'post_status'    => 'publish',
        'posts_per_page' => 50,
        'orderby'        => 'meta_value',
        'meta_key'       => 'date_and_time',
        'order'          => 'ASC',
    ];

    if ( $category ) {
        $query_args['meta_query'] = [
            [
                'key'     => 'category',
                'value'   => $category,
                'compare' => '=',
            ],
        ];
    }

    $posts = get_posts( $query_args );

    if ( ! empty( $posts ) ) {
        $items = [];
        foreach ( $posts as $post ) {
            $fields      = function_exists( 'get_fields' ) ? get_fields( $post->ID ) : [];
            $slots_left  = intval( $fields['available_slots'] ?? 10 );
            $slots_total = intval( $fields['max_participants'] ?? 20 );

            // Pull live stock from linked WooCommerce product if available
            $wc_id = intval( $fields['woocommerce_product_id'] ?? 0 );
            if ( $wc_id && function_exists( 'wc_get_product' ) ) {
                $product = wc_get_product( $wc_id );
                if ( $product && $product->managing_stock() ) {
                    $slots_left  = max( 0, intval( $product->get_stock_quantity() ) );
                    $slots_total = max( $slots_total, $slots_left );
                }
            }

            // Resolve image URL
            $image_url = '';
            if ( ! empty( $fields['image'] ) ) {
                $image_url = is_array( $fields['image'] )
                    ? ( $fields['image']['url'] ?? '' )
                    : (string) wp_get_attachment_url( $fields['image'] );
            }
            if ( ! $image_url && has_post_thumbnail( $post->ID ) ) {
                $image_url = (string) get_the_post_thumbnail_url( $post->ID, 'medium_large' );
            }

            $items[] = [
                'id'          => $post->ID,
                'title'       => $post->post_title,
                'category'    => (string) ( $fields['category'] ?? '' ),
                'date'        => (string) ( $fields['date_and_time'] ?? '' ),
                'location'    => (string) ( $fields['location'] ?? '' ),
                'price'       => floatval( $fields['price'] ?? 0 ),
                'slotsLeft'   => $slots_left,
                'slotsTotal'  => $slots_total ?: 20,
                'imageUrl'    => $image_url,
                'description' => wp_strip_all_tags( $post->post_content ),
            ];
        }
        return rest_ensure_response( $items );
    }

    // ── Fallback: mock data ──
    return rest_ensure_response( vamos_p2_mock_activities( $category ) );
}

function vamos_p2_mock_activities( string $category ): array {
    $all = [
        [
            'id' => 1001, 'title' => 'Flamenco Night at Casa Patas',
            'category' => 'flamenco', 'date' => '2026-07-10T21:00:00',
            'location' => 'Cañizares 10, Madrid', 'price' => 38,
            'slotsLeft' => 4, 'slotsTotal' => 20,
            'imageUrl' => '', 'description' => 'An electrifying evening of authentic flamenco in one of Madrid\'s most historic tablaos.',
        ],
        [
            'id' => 1002, 'title' => 'Tablao Villa Rosa — Flamenco Show',
            'category' => 'flamenco', 'date' => '2026-07-15T20:30:00',
            'location' => 'Plaza de Santa Ana 15, Madrid', 'price' => 45,
            'slotsLeft' => 12, 'slotsTotal' => 30,
            'imageUrl' => '', 'description' => 'Experience the passion of flamenco in a venue with over a century of history.',
        ],
        [
            'id' => 1003, 'title' => 'Prado Museum Guided Tour',
            'category' => 'museum', 'date' => '2026-07-12T10:00:00',
            'location' => 'Paseo del Prado s/n, Madrid', 'price' => 25,
            'slotsLeft' => 14, 'slotsTotal' => 25,
            'imageUrl' => '', 'description' => 'Discover Velázquez, Goya, and Bosch with an expert English-speaking guide.',
        ],
        [
            'id' => 1004, 'title' => 'Reina Sofía Art Walk',
            'category' => 'museum', 'date' => '2026-07-18T11:00:00',
            'location' => 'Calle de Santa Isabel 52, Madrid', 'price' => 20,
            'slotsLeft' => 8, 'slotsTotal' => 20,
            'imageUrl' => '', 'description' => 'Explore Picasso\'s Guernica and modern Spanish masters with a knowledgeable guide.',
        ],
        [
            'id' => 1005, 'title' => 'Madrid Highlights Walking Tour',
            'category' => 'city_tour', 'date' => '2026-07-11T09:30:00',
            'location' => 'Puerta del Sol, Madrid', 'price' => 18,
            'slotsLeft' => 20, 'slotsTotal' => 30,
            'imageUrl' => '', 'description' => 'Explore Plaza Mayor, the Royal Palace, and hidden barrio gems with a local guide.',
        ],
        [
            'id' => 1006, 'title' => 'Real Madrid Stadium Tour',
            'category' => 'football', 'date' => '2026-07-14T14:00:00',
            'location' => 'Av. de Concha Espina 1, Madrid', 'price' => 35,
            'slotsLeft' => 18, 'slotsTotal' => 40,
            'imageUrl' => '', 'description' => 'Go behind the scenes at the Santiago Bernabéu — dressing rooms, pitch, and trophy room.',
        ],
        [
            'id' => 1007, 'title' => 'Paella & Sangria Cooking Class',
            'category' => 'cooking_class', 'date' => '2026-07-13T12:00:00',
            'location' => 'Calle de la Cava Baja 18, Madrid', 'price' => 55,
            'slotsLeft' => 3, 'slotsTotal' => 12,
            'imageUrl' => '', 'description' => 'Learn to cook authentic paella and make sangria in a hands-on class with a local chef.',
        ],
        [
            'id' => 1008, 'title' => 'Tardeo Bar Crawl — La Latina',
            'category' => 'tardeo', 'date' => '2026-07-12T17:00:00',
            'location' => 'La Latina, Madrid', 'price' => 22,
            'slotsLeft' => 15, 'slotsTotal' => 25,
            'imageUrl' => '', 'description' => 'The classic Madrid afternoon drink — tapas, vermut, and good company across five local bars.',
        ],
        [
            'id' => 1009, 'title' => 'Spanish Language Exchange Night',
            'category' => 'language_exchange', 'date' => '2026-07-16T19:00:00',
            'location' => 'Malasaña, Madrid', 'price' => 15,
            'slotsLeft' => 22, 'slotsTotal' => 30,
            'imageUrl' => '', 'description' => 'Practice Spanish with native speakers and help them practice English in a relaxed bar setting.',
        ],
        [
            'id' => 1010, 'title' => 'Toledo Day Trip from Madrid',
            'category' => 'day_trip', 'date' => '2026-07-19T08:30:00',
            'location' => 'Departure: Atocha Station, Madrid', 'price' => 65,
            'slotsLeft' => 7, 'slotsTotal' => 20,
            'imageUrl' => '', 'description' => 'Visit the Imperial City — cathedral, Alcázar, and El Greco paintings — on a guided full-day excursion.',
        ],
    ];

    if ( $category ) {
        return array_values( array_filter( $all, fn( $a ) => $a['category'] === $category ) );
    }

    return $all;
}
