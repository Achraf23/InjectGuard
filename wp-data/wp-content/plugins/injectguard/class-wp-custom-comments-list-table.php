<?php

if ( ! class_exists( "WP_Comments_List_Table" ) ) {
    require_once ABSPATH . 'wp-admin/includes/admin.php'; 
    require_once ABSPATH . 'wp-admin/includes/class-wp-list-table.php';
    require_once ABSPATH . 'wp-admin/includes/class-wp-comments-list-table.php';
}




class My_Custom_Comments_List_Table extends WP_Comments_List_Table {

    function column_author( $comment ) {
        // Example: customize author column
        return '<strong style="color:red;">' . esc_html( $comment->comment_author ) . '</strong>';
    }

    // Override any other methods you need...
}