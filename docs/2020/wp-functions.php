<?php
add_action('wp_enqueue_scripts', 'wordpress_theme_resources');
function wordpress_theme_resources() {
	wp_enqueue_style('style', get_stylesheet_uri());
}

//this adds the function above to the 'pre_get_posts' action
add_action('pre_get_posts', 'custom_posts_per_page');
function custom_posts_per_page($query) {
	if (is_home()) {
		$query->set('posts_per_page', 8);
	}
	if (is_archive()) {
		$query->set('posts_per_page', -1);
	}
	if (is_tag()) {
		$query->set('posts_per_page', 6);
	}
	if (is_category()) {
		$query->set('posts_per_page', 20);
	}
}

// 导航菜单注册函数
register_nav_menus(array(
	'header_menu' => 'Header Menu',
	'footer_product' => 'Footer Product',
	'footer_fast_track' => 'Footer Fast Track',
	'friend_link' => 'Friend Link',
));

// 删除多余标签，只保留 a 标签
function get_strip_menu($location) {
	$menuParameters = array(
		'container' => false,
		'echo' => false,
		'theme_location' => $location,
		'items_wrap' => '%3$s',
	);
	return strip_tags(wp_nav_menu($menuParameters), '<a>');
}

//  tool functions
function get_mobile_image($name) {
	return get_template_directory_uri() . '/assets/images/mobile/' . $name;
}

function get_image($name) {
	return get_template_directory_uri() . '/assets/images/' . $name;
}

function get_js($name) {
	return get_template_directory_uri() . '/assets/js/' . $name . '.js';
}

function get_css($name) {
	return get_template_directory_uri() . '/assets/stylesheets/' . $name . '.css';
}

// 获取分页
function mpar_pagenavi($range = 25) {
	$max_page = "";
	global $paged, $wp_query;
	if (!$max_page) {
		$max_page = $wp_query->max_num_pages;
	}
	if ($max_page > 1) {
		echo "<a class=\"page-next\" href='" . get_pagenum_link(1) . "' class=\"go_first\">首页</a>";
		if (!$paged) {
			$paged = 1;
			echo "";
		} else {
			previous_posts_link('<');
		}
		if ($max_page > $range) {
			if ($paged < $range) {
				for ($i = 1; $i <= ($range + 1); $i++) {
					echo "<a rel='aaa' href='" . get_pagenum_link($i) . "'";
					if ($i == $paged) {
						echo " class='page_active'";
					}
					
					echo ">$i</a>";
				}
			} elseif ($paged >= ($max_page - ceil(($range / 2)))) {
				for ($i = $max_page - $range; $i <= $max_page; $i++) {
					echo "<a href='" . get_pagenum_link($i) . "'";
					if ($i == $paged) {
						echo " class='page_active'";
					}
					
					echo ">$i</a>";
				}
			} elseif ($paged >= $range && $paged < ($max_page - ceil(($range / 2)))) {
				for ($i = ($paged - ceil($range / 2)); $i <= ($paged + ceil(($range / 2))); $i++) {
					echo "<a href='" . get_pagenum_link($i) . "'";
					if ($i == $paged) {
						echo " class='page_active'";
					}
					
					echo ">$i</a>";
				}
			}
		} else {
			for ($i = 1; $i <= $max_page; $i++) {
				echo "<a href='" . get_pagenum_link($i) . "'";
				if ($i == $paged) {
					echo " class='page_active'";
				}
				
				echo ">$i</a>";
			}
		}
		next_posts_link('>');
		if ($paged == $max_page) {
			echo "";
		}
		echo "<a class=\"page-next\" href='" . get_pagenum_link($max_page) . "' class=\"go_last\">尾页</a>";
	}
	
}

function num2tring($num) {
	if ($num >= 10000) {
		$num = round($num / 10000 * 100) / 100 . '万'; // 以万为单位
	} elseif ($num >= 1000) {
		$num = round($num / 1000 * 100) / 100 . '千'; // 以千为单位
	} else {
		$num = $num;
	}
	return $num;
}

/**
 * getPostViews()函数
 * 功能：获取阅读数量
 * 在需要显示浏览次数的位置，调用此函数
 * @Param object|int $postID   文章的id
 * @Return string $count          文章阅读数量
 */
function getPostViews($postID) {
	$count_key = 'views';
	$count = get_post_meta($postID, $count_key, true);
	if ('' == $count) {
		delete_post_meta($postID, $count_key);
		add_post_meta($postID, $count_key, '0');
		return "0";
	}
	//  return $count >= 1000 ? number_format($count / 10000, 1) . '万' : $count;
	return num2tring($count);
}

function getPostLikes($postID) {
	$count_key = 'likes';
	$count = get_post_meta($postID, $count_key, true);
	if ('' == $count) {
		delete_post_meta($postID, $count_key);
		add_post_meta($postID, $count_key, '0');
		return "0";
	}
	//  return $count >= 1000 ? number_format($count / 10000, 1) . '万' : $count;
	return num2tring($count);
}

/**
 * setPostViews()函数
 * 功能：设置或更新阅读数量
 * 在内容页(single.php，或page.php )调用此函数
 * @Param object|int $postID   文章的id
 * @Return string $count          文章阅读数量
 */
function setPostViews($postID) {
	$count_key = 'views';
	$count = get_post_meta($postID, $count_key, true);
	if ('' == $count) {
		$count = 0;
		delete_post_meta($postID, $count_key);
		add_post_meta($postID, $count_key, '0');
	} else {
		$count++;
		update_post_meta($postID, $count_key, $count);
	}
}

// 自定义点赞：http 请求模块
add_action('wp_ajax_nopriv_bigfa_like', 'bigfa_like');
add_action('wp_ajax_bigfa_like', 'bigfa_like');

function bigfa_like() {
	global $wpdb, $post;
	$count_key = 'likes';
	$id = $_POST["um_id"];
	$action = $_POST["um_action"];
	
	if ('ding' == $action) {
		$bigfa_raters = get_post_meta($id, $count_key, true);
		
		if (!$bigfa_raters || !is_numeric($bigfa_raters)) {
			update_post_meta($id, $count_key, 1);
		} else {
			update_post_meta($id, $count_key, ($bigfa_raters + 1));
		}
		
		echo num2tring(get_post_meta($id, $count_key, true));
	}
	
	die;
}

// 自定义点赞：功能模块
function get_post_likes($class = '', $pid = '', $text = '') {
	$count_key = 'likes';
	$pid = $pid ? $pid : get_the_ID();
	$text = $text ? $text : __('赞', 'haoui');
	$like = num2tring(get_post_meta($pid, $count_key, true));
	
	return '<a href="javascript:;" etap="like" class="favorite ' . $class . '" data-pid="' . $pid . '"><span class="like-icon"></span><span class="nums">' . ($like ? $like : 0) . '+</span></a>';
}

// 获取面包屑
function get_breadcrumbs() {
	global $wp_query;
	
	if (!is_home()) {
		
		// Start the UL
		echo '<div class="bread">';
		// Add the Home link
		echo '<a href="' . get_option('home') . '">首页</a>';
		if (is_category()) {
			$catTitle = single_cat_title("", false);
			$cat = get_cat_ID($catTitle);
			echo get_category_parents($cat, true, "");
		} elseif (is_tag()) {
			$tagTitle = single_tag_title("", false);
			echo "<span>$tagTitle</span>";
		} elseif (is_archive() && !is_category()) {
			echo "<span>Archives</span>";
		} elseif (is_search()) {
			echo "<span>Search Results</span>";
		} elseif (is_404()) {
			echo "<span>404 Not Found</span>";
		} elseif (is_single()) {
			$category = get_the_category();
			$category_id = get_cat_ID($category[0]->cat_name);
			
			echo get_category_parents($category_id, TRUE, "");
			echo the_title('<span>', '</span>', FALSE);
		} elseif (is_page()) {
			$post = $wp_query->get_queried_object();
			
			if (0 == $post->post_parent) {
				
				echo "<span>" . the_title('', '', FALSE) . "</span>";
				
			} else {
				$title = the_title('', '', FALSE);
				$ancestors = array_reverse(get_post_ancestors($post->ID));
				array_push($ancestors, $post->ID);
				
				foreach ($ancestors as $ancestor) {
					if (end($ancestors) != $ancestor) {
						echo '<a href="' . get_permalink($ancestor) . '">' . strip_tags(apply_filters('single_post_title', get_the_title($ancestor))) . '</a>';
					} else {
						echo '<span>' . strip_tags(apply_filters('single_post_title', get_the_title($ancestor))) . '</span>';
					}
				}
			}
		}
		
		// End the UL
		echo "</div>";
	}
}

/**
 * 通过Cookie记录用户搜索记录
 */
function wpkj_set_recently_searches() {
	
	//仅在前端搜索页面执行
	if (!is_admin()) {
		
		$search_term = get_search_query();
		
		if ($search_term) {
			$search_term = trim($search_term);
		}
		
		//如果搜索字段不存在或为空，不继续
		if (!$search_term || '' === $search_term) {
			return;
		}
		
		//检查并设置搜索历史数组
		$recently_searches = array();
		if (isset($_COOKIE['wpkj_recently_searches'])) {
			$recently_searches = explode(',', $_COOKIE['wpkj_recently_searches'], 20);
		}
		
		if (!in_array($search_term, $recently_searches)) {
			$recently_searches[] = $search_term;
		}
		//设置cookie为30天
		setcookie('wpkj_recently_searches', implode(',', $recently_searches), current_time('timestamp') + (86400 * 30), "/");
	}
}

//add_action('wp', 'wpkj_set_recently_searches', 20);

/**
 * 获取用户最近搜索记录
 */
function wpkj_get_recently_searches($limit = 5) {
	$COOKIE_NAME = 'pdf_recently_searches';
	$recently_searches = array();
	if (isset($_COOKIE[$COOKIE_NAME])) {
		$recently_searches = explode(',', $_COOKIE[$COOKIE_NAME], $limit);
		//将搜索记录倒序
		$recently_searches = array_reverse($recently_searches);
		if (!empty($recently_searches)) {
			$html = '<div class="history">';
			$html .= '<div class="header">搜索记录<span class="clear-btn"><i class="icon-delete"></i>清空</span></div>';
			$html .= '<ul class="list">';
			$home_url_slash = get_option('home') . '/';
			$i = 1;
			foreach ($recently_searches as $result) {
				$html .= '<li class="item"><a href="' . $home_url_slash . '?s=' . $result . '">' . htmlspecialchars($result) . '</a><i class="close-btn" data-value="' . htmlspecialchars($result) . '"></i></li>';
				$i++;
			}
			$html .= '</ul>';
			$html .= '</div>';
			
			return $html;
		}
	}
}

//custom_excerpt_length
function custom_excerpt_length($length) {
	return 150;
}

add_filter('excerpt_length', 'custom_excerpt_length');

function remove_more_jump_link($link) {
	return preg_replace('/#more-\d+/i', '', $link);
}

add_filter('the_content_more_link', 'remove_more_jump_link');

// 替换所有链接
define('CDN_HOST', home_url());
add_filter('the_content', 'z_cdn_content');
function z_cdn_content($content) {
	return str_replace(site_url() . '/wp-content/uploads', CDN_HOST . '/wp-content/uploads', $content);
}

add_filter('wp_get_attachment_url', 'z_get_attachment_url', 10, 2);
function z_get_attachment_url($url, $post_id) {
	return str_replace(home_url(), CDN_HOST, $url);
}

add_filter('stylesheet_directory_uri', 'z_cdn_stylesheet_directory_uri', 10, 3);
function z_cdn_stylesheet_directory_uri($stylesheet_dir_uri, $stylesheet, $theme_root_uri) {
	return str_replace(home_url(), CDN_HOST, $stylesheet_dir_uri);
}

add_filter('template_directory_uri', 'z_cdn_template_directory_uri', 10, 3);
function z_cdn_template_directory_uri($template_dir_uri, $template, $theme_root_uri) {
	return str_replace(site_url(), CDN_HOST, $template_dir_uri);
}

// 后台文章列表增加数据
function star_customer_posts_columns($columns) {
	$columns['views'] = '浏览量';
	$columns['likes'] = '点赞数';
	return $columns;
}

add_filter('manage_posts_columns', 'star_customer_posts_columns');

// 输出浏览量和点赞数
add_action('manage_posts_custom_column', 'star_customer_columns_value', 10, 2);
function star_customer_columns_value($column, $post_id) {
	if ('views' == $column || 'likes' == $column) {
		$count = num2tring(get_post_meta($post_id, $column, true));
		if (!$count) {
			$count = 0;
		}
		echo $count;
	}
	return;
}

//后台文章添加缩略图
if (!function_exists('star_AddThumbColumn') && function_exists('add_theme_support')) {
// for post and page
	add_theme_support('post-thumbnails', array('post', 'page'));
	function star_AddThumbColumn($cols) {
		$cols['thumbnail'] = __('Thumbnail');
		return $cols;
	}
	
	function star_AddThumbValue($column_name, $post_id, $width = 40, $height = 40) {
		if ('thumbnail' == $column_name) {
// thumbnail of WP 2.9
			$thumbnail_id = get_post_meta($post_id, '_thumbnail_id', true);
// image from gallery
			$attachments = get_children(array('post_parent' => $post_id, 'post_type' => 'attachment', 'post_mime_type' => 'image'));
			if ($thumbnail_id) {
				$thumb = wp_get_attachment_image($thumbnail_id, array($width, $height), true);
			} elseif ($attachments) {
				foreach ($attachments as $attachment_id => $attachment) {
					$thumb = wp_get_attachment_image($attachment_id, array($width, $height), true);
				}
			}
			if (isset($thumb) && $thumb) {
				echo $thumb;
			} else {
				echo __('None');
			}
		}
	}

// for posts
	add_filter('manage_posts_columns', 'star_AddThumbColumn');
	add_action('manage_posts_custom_column', 'star_AddThumbValue', 10, 2);
// for pages
	add_filter('manage_pages_columns', 'star_AddThumbColumn');
	add_action('manage_pages_custom_column', 'star_AddThumbValue', 10, 2);
}

// 只获取顶层分类用以链接
function remove_child_categories_from_permalinks($category) {
	while ($category->parent) {
		$category = get_term($category->parent, 'category');
	}
	return $category;
}

add_filter('post_link_category', 'remove_child_categories_from_permalinks');

/**
 * Optimizer additions.
 */
require get_template_directory() . '/inc/optimizer.php';

require get_template_directory() . '/inc/remove-category-base.php';
