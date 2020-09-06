# Wordpress 开发总结

## get_post 返回的时间格式化处理

```php
<?php
$post = get_post();
$datetime=date_create($post->post_date);
echo date_format($datetime,"Y/m/d");
?>
```

## 导航菜单注册

```php
// 导航菜单注册函数
register_nav_menus(array(
  'header_menu' => 'Header Menu',
  'footer_menu' => 'Footer Menu',
));

$menu_args = array(
  'container' => 'nav',
  'container_class' => 'nav-wrap-box',
  'container_id' => 'navBox',
  'menu_class' => 'nav-wrap',
  'menu_id' => 'header',
  'echo' => true,
  'fallback_cb' => 'the_main_nav',
  //显示在导航a标签之前
  'before' => '',
  //显示在导航a标签之后
  'after' => '',
  //显示在导航链接名之前
  'link_before' => '',
  'link_after' => '',
  'walker' => new Walker_Nav_Menu(),
  'depth' => 1,
  'theme_location' => 'header_menu'
);
wp_nav_menu($menu_args);

// 删除多余标签，只保留 a 标签
function get_strip_menu($location)
{
  $menuParameters = array(
    'container' => false,
    'echo' => false,
    'theme_location' => $location,
    'items_wrap' => '%3$s'
  );
  return strip_tags(wp_nav_menu($menuParameters), '<a>');
}
```

## 获取标签相关文章

```php
<?php
$tags = wp_get_post_tags($post->ID);
print_r($tags);
if ($tags) {

  $first_tag = $tags[0]->term_id;

  $args=array(

    'tag__in' => array($first_tag),

    'post__not_in' => array($post->ID),

    'showposts'=>10,

    'caller_get_posts'=>1

  );

  $my_query = new WP_Query($args);

  if( $my_query->have_posts() ) {

    while ($my_query->have_posts()) : $my_query->the_post(); ?>

      <li><a href="<?php the_permalink() ?>" title="<?php the_title_attribute(); ?>"><?php the_title();?> <?php comments_number('','(1)','(%)'); ?></a></li>

    <?php

    endwhile;

  }

}

wp_reset_query();

?>
```

## 获取阅读量

```php
/**
 * getPostViews()函数
 * 功能：获取阅读数量
 * 在需要显示浏览次数的位置，调用此函数
 * @Param object|int $postID   文章的id
 * @Return string $count          文章阅读数量
 */
function getPostViews($postID) {
  $count_key = 'views';
  $count     = get_post_meta($postID, $count_key, true);
  if ('' == $count) {
    delete_post_meta($postID, $count_key);
    add_post_meta($postID, $count_key, '0');
    return "0";
  }
  return $count >= 10000 ? number_format($count / 10000, 1) . 'w' : $count;
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
  $count     = get_post_meta($postID, $count_key, true);
  if ('' == $count) {
    $count = 0;
    delete_post_meta($postID, $count_key);
    add_post_meta($postID, $count_key, '0');
  } else {
    $count++;
    update_post_meta($postID, $count_key, $count);
  }
}

```

## 分类

```php
$categories = get_categories(array(
  'orderby' => 'name',
  'parent' => 0
));

foreach ($categories as $category) {
  printf('<a href="%1$s">%2$s</a><br />',
    esc_url(get_category_link($category->term_id)),
    esc_html($category->name)
  );
}
```

## wp_list_categories

```php
<?php
wp_list_categories( $args );

$args = array(
 'show_option_all'  => '',//是否列出分类链接
 'orderby'      => 'name',//按名称排列
 'order'       => 'ASC',//升、降序
 'style'       => 'list',//是否用列表（ul>li）
 'show_count'     => 0,//是否显示文章数量
 'hide_empty'     => 1,//是否显示无日志分类
 'use_desc_for_title' => 1,//是否显示分类描述
 'child_of'      => 0,//是否限制子分类
 'feed'        => '',//是否显示rss
 'feed_type'     => '',//rss类型
 'feed_image'     => '',//是否显示rss图片
 'exclude'      => '',//排除分类的ID，多个用',（英文逗号）'分隔
 'exclude_tree'    => '',//排除分类树，即父分类及其下的子分类
 'include'      => '',//包括的分类
 'hierarchical'    => true,//是否将子、父分类分级
 'title_li'      => __( 'Categories' ),//列表标题的名称
 'show_option_none'  => __('No categories'),//无分类时显示的标题
 'number'       => null,//显示分类的数量
 'echo'        => 1,//是否显示，显示或者返回字符串
 'depth'       => 0,//层级限制
 'current_category'  => 0,//添加一个没有的分类
 'pad_counts'     => 0,//这个我也不明白
 'taxonomy'      => 'category',//使用的分类法
 'walker'       => null//用于显示的类
?>
```

- [WordPress 各种标签大全调用集合](https://www.jianshu.com/p/4da672021f52)
- [WordPress 函数 add_post_meta 详解](https://www.daimadog.com/2482.html)
- [WordPress 主题开发：设置和获取浏览次数](https://www.cnblogs.com/tinyphp/p/6366022.html)
- [WordPress 自定义字段简介及使用示例](https://www.wpdaxue.com/wordpress-custom-fields.html)
- [根据标签/作者/分类相关调用 实现调用 WordPress 相关文章](https://www.laobuluo.com/3763.html)
- [WordPress 如何获取文章所属分类 ID、名称或别名？](https://boke112.com/postwd/4269.html)
- [详解 WordPress 分类目录和 Tag 标签](https://www.wbolt.com/wordpress-categories-vs-tags.html)
