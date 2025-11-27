<?php
/**
* Plugin Name: InjectGUARD
* Plugin URI : no URI
* Description: inform the user of potential comments injections in the admin panel section
* Version: 1.0.0
* Author: abens
* Text Domain: my-plugin
* Author URI: //
* License: GPL2
*/

// Attempt to load the custom comments list table only if the file exists to avoid fatal errors.
$custom_list_table_file = plugin_dir_path( __FILE__ ) . 'class-wp-custom-comments-list-table.php';
if ( file_exists( $custom_list_table_file ) ) {
    require_once $custom_list_table_file;
}

add_action( 'load-edit-comments.php', function () {

    global $wp_list_table;

    // Replace the WP_Comments_List_Table instance with your custom class
    // $wp_list_table = new My_Custom_Comments_List_Table();

});

add_action("admin_head-edit-comments.php", function() {
    // Add global $wp_list_table to current scope
	global $wp_list_table;

	// Create an instance of your custom list table class
	$myListTable = new My_Custom_Comments_List_Table();

	// Copy all properties from the global list table to yours
	foreach ($wp_list_table as $key => $value)
		$myListTable->{$key} = $value;

	// Replace the global list table with yours

	$wp_list_table = $myListTable;

});


// add_action( 'admin_notices', 'notify_admin_of_malicious_comments' );
// add_action( 'admin_notices', 'notify_admin_of_malicious_comments' );
// function notify_admin_of_malicious_comments() {
//     if ( ! is_admin() ) {
//         return;
//     }

//     // Ensure we're on the Comments list screen.
//     $screen = function_exists( 'get_current_screen' ) ? get_current_screen() : null;
//     if ( ! $screen || 'edit-comments' !== $screen->base ) {
//         return;
//     }

//     // Fetch comments here (not at plugin load) with safe defaults.
//     $all_comments = get_comments(
//         array(
//             'status' => 'all',   // approved, hold, spam, trash, etc.
//             'number' => 0        // 0 = no limit
//         )
//     );

//     if ( empty( $all_comments ) || ! is_array( $all_comments ) ) {
//         echo '<p>' . esc_html__( 'No comments found.', 'my-plugin' ) . '</p>';
//         return;
//     }

//     // Optionally display comment meta for the first comment (for debugging), guarded by existence checks.
//     $first_comment = reset( $all_comments );
//     if ( $first_comment && isset( $first_comment->comment_ID ) ) {
//         $id  = $first_comment->comment_ID;
//         $arr = get_comment_meta( $id, '', false );

//         if ( ! empty( $arr ) && is_array( $arr ) ) {
//             foreach ( $arr as $meta_key => $meta_values ) {
//                 if ( is_array( $meta_values ) ) {
//                     foreach ( $meta_values as $meta_value ) {
//                         echo '<p>' . esc_html( $meta_key ) . ': ' . esc_html( wp_unslash( $meta_value ) ) . '</p>';
//                     }
//                 } else {
//                     echo '<p>' . esc_html( $meta_key ) . ': ' . esc_html( wp_unslash( $meta_values ) ) . '</p>';
//                 }
//             }
//         } else {
//             echo '<p>' . sprintf( esc_html__( 'No meta data found for comment ID %d.', 'my-plugin' ), intval( $id ) ) . '</p>';
//         }
//     }

//     $count = 0;
//     foreach ( $all_comments as $comment ) {
//         if ( isset( $comment->comment_content ) && wp_strip_all_tags( $comment->comment_content ) !== $comment->comment_content ) {
//             $count++;
//         }
//     }

//     if ( $count > 0 ) {
//         echo '<div class="notice notice-error">';
//         echo esc_html__( 'Warning. Malicious comments found. Please delete them and report the user!', 'my-plugin' );
//         echo '</div>';
//     }
// }