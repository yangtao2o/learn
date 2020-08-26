# WordPress 的安装使用

## 下载安装

### WordPress 下载

[WordPress中文版下载](https://themebetter.com/wordpress/)

### MAMP 设置

- 开启 Nginx

- 开启 MySQL，设置 phpMyAdmin，如我的数据库：`mysite_db`

```url
http://localhost/phpMyAdmin/index.php
```

- 配置 host，如：`wp.yangtao.com`

- 选择 Web Serve 为 Nginx

- 设置 Document root（WordPress 目录）

### 安装

打开`http://wp.yangtao.com/`，进入安装引导页，然后配置如下内容，本地数据库使用 root：

```php
define( 'DB_NAME', 'mysite_db' );

/** MySQL数据库用户名 */
define( 'DB_USER', 'root' );

/** MySQL数据库密码 */
define( 'DB_PASSWORD', 'root' );

/** MySQL主机 */
define( 'DB_HOST', 'localhost' );
```

后面的随便填写即可，最后就会进入管理页面：`http://wp.yangtao.com/wp-admin/`。

再次访问域名，就会发现可以正常访问内容了。

## 参考资料

- [如何使用MAMP在Mac上本地安装WordPress](https://www.lanmit.com/1722.html)