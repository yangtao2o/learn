# 前端硬核面试专题

## 1. 前言

本文面试的内容包含：HTML + CSS + JS + ES6 + Webpack + Vue + React + Node + HTTPS + 数据结构与算法 + Git 。

Fork Github 地址：[戳我](https://github.com/biaochenxuying/blog/edit/master/interview/fe-interview.md)

> 复习前端面试的知识，是为了巩固前端的基础知识，最重要的还是平时的积累！

`注意`：文章的题与题之间用下划线分隔开，**答案仅供参考**。

笔者技术博客首发地址 [GitHub](https://github.com/biaochenxuying/blog)，欢迎关注。

## 2. HTML

**为什么利用多个域名来存储网站资源会更有效 ？**

[利用多个域名来存储网站资源](https://www.jianshu.com/p/4cf3b6d6b50a)

- 确保用户在不同地区能用最快的速度打开网站，其中某个域名崩溃用户也能通过其他域名访问网站。
- CDN 缓存更方便。简单来说，CDN 主要用来使用户就近获取资源。
- 突破浏览器并发限制。同一时间针对同一域名下的请求有一定数量限制，超过限制数目的请求会被阻塞。大多数浏览器的并发数量都控制在 6 以内。有些资源的请求时间很长，因而会阻塞其他资源的请求。因此，对于一些静态资源，如果放到不同的域名下面就能实现与其他资源的并发请求。
- Cookieless, 节省带宽，尤其是上行带宽 一般比下行要慢。
- 对于 UGC 的内容和主站隔离，防止不必要的安全问题。
- 数据做了划分，甚至切到了不同的物理集群，通过子域名来分流比较省事. 这个可能被用的不多。

---

**window 常用属性与方法有哪些 ？**

window 对象的常用属性

- window.self 返回当前窗口的引用
- window.parent   返回当前窗体的父窗体对象
- window.top 返回当前窗体最顶层的父窗体的引用
- window.outerwidth       返回当前窗口的外部宽
- window.outerheight  返回当前窗口的外部高
- window.innerwidth       返回当前窗口的可显示区域宽
- window.innerheight  返回当前窗口的可显示区域高

提示：通过直接在 Chrome 控制台中输入 console.log(window) 可以查看到其所有的被当前浏览器支持的属性及值。

window 对象的常用方法

- window.prompt()   弹出一个输入提示框，若用户点击了“取消”则返回 null
- window.alert()    弹出一个警告框
- window.confirm()  弹出一个确认框
- window.close()  关闭当前浏览器窗口。 有些浏览器对此方法有限制。
- window.open(uri, [name], [features])  打开一个浏览器窗口，显示指定的网页。name 属性值可以是“\_blank”、“\_self”、“\_parent”、“\_top”、任意指定的一个窗口名。
- window.blur( )     指定当前窗口失去焦点
- window.focus( ) 指定当前窗口获得焦点
- window.showModalDialog(uri, [dataFromParent])  打开一个“模态窗口”（打开的子窗口只要不关闭，其父窗口即无法获得焦点；且父子窗口间可以传递数据）

---

**document 常用属性与方法有哪些 ？**

document 常见的属性

- body 提供对 <body> 元素的直接访问。对于定义了框架集的文档，该属性引用最外层的 <frameset>。
- cookie 设置或返回与当前文档有关的所有 cookie。
- domain 返回当前文档的域名。
- lastModified 返回文档被最后修改的日期和时间。
- referrer 返回载入当前文档的文档的 URL。
- title 返回当前文档的标题。
- URL 返回当前文档的 URL。

document 常见的方法

- write()：动态向页面写入内容
- createElement(Tag)：创建一个 HTML 标签对象
- getElementById(ID)：获得指定 id 的对象
- getElementsByName(Name)：获得之前 Name 的对象
- body.appendChild(oTag)：向 HTML 中插入元素对象

---

**简述一下 src 与 href 的区别**

- href 是指向网络资源所在位置，建立和当前元素（锚点）或当前文档（链接）之间的链接，用于超链接。
- src 是指向外部资源的位置，指向的内容将会嵌入到文档中当前标签所在位置；
- 在请求 src 资源时会将其指向的资源下载并应用到文档内，例如 js 脚本，img 图片和 frame 等元素。
  当浏览器解析到该元素时，会暂停其他资源的下载和处理，直到将该资源加载、编译、执行完毕，图片和框架等元素也如此，类似于将所指向资源嵌入当前标签内。这也是为什么将 js 脚本放在底部而不是头部。

---

**写一个 div + css 布局，左边图片，右边文字，文字环绕图片，外面容器固定宽度，文字不固定。**

直接就一个 img，它 float：left，加文字加 p 标签就好了。

---

**html 中 title 属性和 alt 属性的区别 ？**

1. alt

```html
<img src="#" alt="alt 信息" />
```

当图片不输出信息的时候，会显示 alt 信息， 鼠标放上去没有信息。
当图片正常读取，不会出现 alt 信息。

1. title

```html
<img src="#" alt="alt 信息" title="title 信息" />
```

当图片不输出信息的时候，会显示 alt 信息，鼠标放上去会出现 title 信息。
当图片正常输出的时候，不会出现 alt 信息，鼠标放上去会出现 title 信息。

---

**讲述你对 reflow 和 repaint 的理解。**

repaint 就是重绘，reflow 就是回流。

严重性：  在性能优先的前提下，性能消耗 reflow 大于 repaint。

体现：repaint 是某个 DOM 元素进行重绘；reflow 是整个页面进行重排，也就是页面所有 DOM 元素渲染。

如何触发： style 变动造成 repaint 和 reflow。

1. 不涉及任何 DOM 元素的排版问题的变动为 repaint，例如元素的 color/text-align/text-decoration 等等属性的变动。
2. 除上面所提到的 DOM 元素 style 的修改基本为 reflow。例如元素的任何涉及 长、宽、行高、边框、display 等 style 的修改。

常见触发场景

触发 repaint：

- color 的修改，如 color=#ddd；
- text-align 的修改，如 text-align=center；
- a:hover 也会造成重绘。
- :hover 引起的颜色等不导致页面回流的 style 变动。

触发 reflow：

- width/height/border/margin/padding 的修改，如 width=778px；
- 动画，:hover 等伪类引起的元素表现改动，display=none 等造成页面回流；
- appendChild 等 DOM 元素操作；
- font 类 style 的修改；
- background 的修改，注意着字面上可能以为是重绘，但是浏览器确实回流了，经过浏览器厂家的优化，部分 background 的修改只触发 repaint，当然 IE 不用考虑；
- scroll 页面，这个不可避免；
- resize 页面，桌面版本的进行浏览器大小的缩放，移动端的话，还没玩过能拖动程序，resize 程序窗口大小的多窗口操作系统。
- 读取元素的属性（这个无法理解，但是技术达人是这么说的，那就把它当做定理吧）：读取元素的某些属性（offsetLeft、offsetTop、offsetHeight、offsetWidth、scrollTop/Left/Width/Height、clientTop/Left/Width/Height、getComputedStyle()、currentStyle(in IE))；

如何避免：

- 尽可能在 DOM 末梢通过改变 class 来修改元素的 style 属性：尽可能的减少受影响的 DOM 元素。
- 避免设置多项内联样式：使用常用的 class 的方式进行设置样式，以避免设置样式时访问 DOM 的低效率。
- 设置动画元素 position 属性为 fixed 或者 absolute：由于当前元素从 DOM 流中独立出来，因此受影响的只有当前元素，元素 repaint。
- 牺牲平滑度满足性能：动画精度太强，会造成更多次的 repaint/reflow，牺牲精度，能满足性能的损耗，获取性能和平滑度的平衡。
- 避免使用 table 进行布局：table 的每个元素的大小以及内容的改动，都会导致整个 table 进行重新计算，造成大幅度的 repaint 或者 reflow。改用 div 则可以进行针对性的 repaint 和避免不必要的 reflow。
- 避免在 CSS 中使用运算式：学习 CSS 的时候就知道，这个应该避免，不应该加深到这一层再去了解，因为这个的后果确实非常严重，一旦存在动画性的 repaint/reflow，那么每一帧动画都会进行计算，性能消耗不容小觑。

参考文章：[你真的了解回流和重绘吗](https://segmentfault.com/a/1190000017329980)

---

- [我终于理解了伪类和伪元素](https://www.jianshu.com/p/996d021bced3)

---

**Doctype 作用 ？标准模式与兼容模式各有什么区别 ?**

- <!DOCTYPE> 声明位于位于 HTML 文档中的第一行，处于 <html> 标签之前。告知浏览器的解析器用什么文档标准解析这个文档。DOCTYPE 不存在或格式不正确会导致文档以兼容模式呈现。
- 标准模式的排版和 JS 运作模式都是以该浏览器支持的最高标准运行。在兼容模式中，页面以宽松的向后兼容的方式显示，模拟老式浏览器的行为以防止站点无法工作。

---

**HTML5 为什么只需要写 < !DOCTYPE HTML> ？**

HTML5 不基于 SGML(标准通用标记语言（以下简称“通用标言”)，因此不需要对 DTD 进行引用，但是需要 doctype 来规范浏览器的行为（让浏览器按照它们应该的方式来运行）；
而 HTML4.01 基于 SGML，所以需要对 DTD 进行引用，才能告知浏览器文档所使用的文档类型。

---

**行内元素有哪些 ？块级元素有哪些 ？ 空(void)元素有那些 ？**

CSS 规范规定，每个元素都有 display 属性，确定该元素的类型，每个元素都有默认的 display 值。
如 div 的 display 默认值为 “block”，则为“块级”元素；
span 默认 display 属性值为 “inline”，是“行内”元素。

- 行内元素有：a b span img input select strong（强调的语气）
- 块级元素有：div ul ol li dl dt dd h1 h2 h3 h4 p
- 常见的空元素： img input link meta br hr ，鲜为人知的是：area base col command embed keygen param source track wbr

---

**HTML5 有哪些新特性、移除了那些元素 ？如何处理 HTML5 新标签的浏览器兼容问题 ？如何区分 HTML 和 HTML5 ？**

HTML5 现在已经不是 SGML（标准通用标记语言）的子集，主要是关于图像，位置，存储，多任务等功能的增加。

新特性

- 绘画 canvas;
- 用于媒介回放的 video 和 audio 元素;
- 本地离线存储 localStorage 长期存储数据，浏览器关闭后数据不丢失;
- sessionStorage 的数据在浏览器关闭后自动删除;
- 语意化更好的内容元素，比如 article、footer、header、nav、section;
- 表单控件：calendar、date、time、email、url、search;
- 新的技术：webworker, websocket, Geolocation;

移除的元素

- 纯表现的元素：basefont，big，center，font, s，strike，tt，u;
- 对可用性产生负面影响的元素：frame，frameset，noframes；

支持 HTML5 新标签

- IE8/IE7/IE6 支持通过 document.createElement 方法产生的标签，可以利用这一特性让这些浏览器支持 HTML5 新标签，浏览器支持新标签后，还需要添加标签默认的样式。
- 当然也可以直接使用成熟的框架、比如 html5shim;

```html
<!--[if lt IE 9]>
  <script>
    src = "http://html5shim.googlecode.com/svn/trunk/html5.js";
  </script>
<![endif]-->
```

---

**简述一下你对 HTML 语义化的理解 ？**

- 1、用正确的标签做正确的事情。
- 2、html 语义化让页面的内容结构化，结构更清晰，
- 3、便于对浏览器、搜索引擎解析;
- 4、即使在没有样式 CSS 情况下也以一种文档格式显示，并且是容易阅读的;
- 5、搜索引擎的爬虫也依赖于 HTML 标记来确定上下文和各个关键字的权重，利于 SEO;
- 6、使阅读源代码的人对网站更容易将网站分块，便于阅读维护理解。

---

**HTML5 的离线储存怎么使用，工作原理能不能解释一下 ？**

在用户没有与因特网连接时，可以正常访问站点或应用，在用户与因特网连接时，更新用户机器上的缓存文件。

原理

HTML5 的离线存储是基于一个新建的 .appcache 文件的缓存机制(不是存储技术)，通过这个文件上的解析清单离线存储资源，这些资源就会像 cookie 一样被存储了下来。之后当网络在处于离线状态下时，浏览器会通过被离线存储的数据进行页面展示。

如何使用

- 1、页面头部像下面一样加入一个 manifest 的属性；
- 2、在 cache.manifest 文件的编写离线存储的资源；

```json
CACHE MANIFEST
#v0.11
CACHE:
js/app.js
css/style.css
NETWORK:
resourse/logo.png
FALLBACK:
//offline.html
```

- 3、在离线状态时，操作 window.applicationCache 进行需求实现。

---

**浏览器是怎么对 HTML5 的离线储存资源进行管理和加载的呢 ？**

在线的情况下，浏览器发现 html 头部有 manifest 属性，它会请求 manifest 文件，如果是第一次访问 app，那么浏览器就会根据 manifest 文件的内容下载相应的资源并且进行离线存储。

如果已经访问过 app 并且资源已经离线存储了，那么浏览器就会使用离线的资源加载页面，然后浏览器会对比新的 manifest 文件与旧的 manifest 文件，如果文件没有发生改变，就不做任何操作，如果文件改变了，那么就会重新下载文件中的资源并进行离线存储。

离线的情况下，浏览器就直接使用离线存储的资源。

---

**请描述一下 cookies，sessionStorage 和 localStorage 的区别 ？**

- cookie 是网站为了标示用户身份而储存在用户本地终端（Client Side）上的数据（通常经过加密）。
- cookie 数据始终在同源的 http 请求中携带（即使不需要），也会在浏览器和服务器间来回传递。
- sessionStorage 和 localStorage 不会自动把数据发给服务器，仅在本地保存。

存储大小

- cookie 数据大小不能超过 4k。
- sessionStorage 和 localStorage 虽然也有存储大小的限制，但比 cookie 大得多，可以达到 5M 或更大。

有期时间

- localStorage 存储持久数据，浏览器关闭后数据不丢失除非主动删除数据；
- sessionStorage 数据在当前浏览器窗口关闭后自动删除。
- cookie   设置的 cookie 过期时间之前一直有效，即使窗口或浏览器关闭。

---

**iframe 内嵌框架有那些缺点 ？**

内联框架 iframe 一般用来包含别的页面，例如 我们可以在我们自己的网站页面加载别人网站的内容，为了更好的效果，可能需要使 iframe 透明效果；

- iframe 会阻塞主页面的 onload 事件；
- 搜索引擎的检索程序无法解读这种页面，不利于 SEO 搜索引擎优化（Search Engine Optimization）
- iframe 和主页面共享连接池，而浏览器对相同域的连接有限制，所以会影响页面的并行加载。

如果需要使用 iframe，最好是通过 javascript 动态给 iframe 添加 src 属性值，这样可以绕开以上两个问题。

---

**Label 的作用是什么？是怎么用的 ？**

label 标签来定义表单控制间的关系，当用户选择该标签时，浏览器会自动将焦点转到和标签相关的表单控件上。

```html
<label for="Name">Number:</label>
<input type="“text“" name="Name" id="Name" />

<label>Date:<input type="text" name="B"/></label>
```

---

**HTML5 的 form 如何关闭自动完成功能 ？**

给不想要提示的 form 或某个 input 设置为 autocomplete=off。

---

**如何实现浏览器内多个标签页之间的通信 ? (阿里)**

- WebSocket、SharedWorker；
- 也可以调用 localstorge、cookies 等本地存储方式；
- localstorge 在另一个浏览上下文里被添加、修改或删除时，它都会触发一个事件，我们通过监听事件，控制它的值来进行页面信息通信；
  注意 quirks：Safari 在无痕模式下设置 localstorge 值时会抛出 QuotaExceededError 的异常；

---

**webSocket 如何兼容低浏览器 ？(阿里)**

- Adobe Flash Socket 、
- ActiveX HTMLFile (IE) 、
- 基于 multipart 编码发送 XHR 、
- 基于长轮询的 XHR。

---

**页面可见性（Page Visibility API） 可以有哪些用途 ？**

- 通过 visibilityState 的值检测页面当前是否可见，以及打开网页的时间等;
- 在页面被切换到其他后台进程的时候，自动暂停音乐或视频的播放；

---

**网页验证码是干嘛的，是为了解决什么安全问题。**

- 区分用户是计算机还是人的公共全自动程序；
- 可以防止恶意破解密码、刷票、论坛灌水；
- 有效防止黑客对某一个特定注册用户用特定程序暴力破解方式进行不断的登陆尝试。

---

**title 与 h1 的区别、b 与 strong 的区别、i 与 em 的区别 ？**

- title 属性没有明确意义只表示是个标题，H1 则表示层次明确的标题，对页面信息的抓取也有很大的影响；
- strong 是标明重点内容，有语气加强的含义，使用阅读设备阅读网络时：`strong 会重读，而 b 是展示强调内容`。
- i 内容展示为斜体，em 表示强调的文本；

- Physical Style Elements -- 自然样式标签：b, i, u, s, pre
- Semantic Style Elements -- 语义样式标签：strong, em, ins, del, code
- 应该准确使用语义样式标签, 但不能滥用, 如果不能确定时，首选使用自然样式标签。

---

**谈谈以前端的角度出发，做好 SEO ，需要考虑什么 ？**

- 了解搜索引擎如何抓取网页和如何索引网页。
  你需要知道一些搜索引擎的基本工作原理，各个搜索引擎之间的区别，搜索机器人（SE robot 或叫 web cra 何进行工作，搜索引擎如何对搜索结果进行排序等等。
- Meta 标签优化
  主要包括主题（Title)，网站描述(Description)，和关键词（Keywords）。还有一些其它的隐藏文字比如 Au 者），Category（目录），Language（编码语种）等。
- 如何选取关键词并在网页中放置关键词。
  搜索就得用关键词。关键词分析和选择是 SEO 最重要的工作之一。首先要给网站确定主关键词（一般在 5 个上后针对这些关键词进行优化，包括关键词密度（Density），相关度（Relavancy），突出性（Prominency）等等。
- 了解主要的搜索引擎。
  虽然搜索引擎有很多，但是对网站流量起决定作用的就那么几个。比如英文的主要有 Google，Yahoo，Bing 等有百度，搜狗，有道等。
  不同的搜索引擎对页面的抓取和索引、排序的规则都不一样。
  还要了解各搜索门户和搜索的关系，比如 AOL 网页搜索用的是 Google 的搜索技术，MSN 用的是 Bing 的技术。
- 主要的互联网目录。
  Open Directory 自身不是搜索引擎，而是一个大型的网站目录，他和搜索引擎的主要区别是网站内容的收集方目录是人工编辑的，主要收录网站主页；搜索引擎是自动收集的，除了主页外还抓取大量的内容页面。
- 按点击付费的搜索引擎。
  搜索引擎也需要生存，随着互联网商务的越来越成熟，收费的搜索引擎也开始大行其道。最典型的有 Overture 当然也包括 Google 的广告项目 Google Adwords。越来越多的人通过搜索引擎的点击广告来定位商业网站，这里面化和排名的学问，你得学会用最少的广告投入获得最多的点击。
- 搜索引擎登录。
  网站做完了以后，别躺在那里等着客人从天而降。要让别人找到你，最简单的办法就是将网站提交（submit）擎。如果你的是商业网站，主要的搜索引擎和目录都会要求你付费来获得收录（比如 Yahoo 要 299 美元），但是好消少到目前为止）最大的搜索引擎 Google 目前还是免费，而且它主宰着 60％ 以上的搜索市场。
- 链接交换和链接广泛度（Link Popularity）。
  网页内容都是以超文本（Hypertext）的方式来互相链接的，网站之间也是如此。除了搜索引擎以外，人们也不同网站之间的链接来 Surfing（“冲浪”）。其它网站到你的网站的链接越多，你也就会获得更多的访问量。更重你的网站的外部链接数越多，会被搜索引擎认为它的重要性越大，从而给你更高的排名。
- 标签的合理使用。

---

**前端页面有哪三层构成，分别是什么？作用是什么？**

网页分成三个层次，即：结构层、表示层、行为层。

- 网页的结构层（structurallayer）由 HTML 或 XHTML 之类的标记语言负责创建。
  标签，也就是那些出现在尖括号里的单词，对网页内容的语义含义做出这些标签不包含任何关于如何显示有关内容的信息。例如，P 标签表达了这样一种语义：“这是一个文本段。”
- 网页的表示层（presentationlayer）由 CSS 负责创建。CSS 对“如何显示有关内容”的问题做出了回答。
- 网页的行为层（behaviorlayer）负责回答 “内容应该如何对事件做出反应” 这一问题。
  这是 Javascript 语言和 DOM 主宰的领域。

---

**有这么一段 HTML，请挑毛病**

<P> 哥写的不是HTML，是寂寞。< br>< br> 我说：< br>不要迷恋哥，哥只是一个传说

答案：缺少 p 标记的结束标记。

---

## 3. CSS

**盒子模型的理解 ?**

- 标准模式和混杂模式（IE）。
- 在标准模式下浏览器按照规范呈现页面；
- 在混杂模式下，页面以一种比较宽松的向后兼容的方式显示。
- 混杂模式通常模拟老式浏览器的行为以防止老站点无法工作。

![](https://upload-images.jianshu.io/upload_images/12890819-b9c3230377a2a0d2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![](https://upload-images.jianshu.io/upload_images/12890819-f0e6a3f07947a2e0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

CSS 盒子模型具有内容 (content)、填充 (padding)、边框 (border)、边界 (margin)这些属性。

我们所说的 width，height 指的是内容 (content) 的宽高。

一个盒子模型的中：

- 宽度 = width+ pdding(宽) + border(宽)。
- 高度 = height + padding(高) + border(高)。

---

**如何在页面上实现一个圆形的可点击区域 ？**

- 1、map+area 或者 svg
- 2、border-radius
- 3、纯 js 实现，需要求一个点在不在圆上简单算法、获取鼠标坐标等等

---

**实现不使用 border 画出 1px 高的线，在不同浏览器的标准模式与怪异模式下都能保持一致的效果。**

```html
<div style="height:1px;overflow:hidden;background:red"></div>
```

---

**CSS 中哪些属性可以同父元素继承 ?**

继承：(X)HTML 元素可以从其父元素那里继承部分 CSS 属性，即使当前元素并没有定义该属性，比如： color，font-size。

---

**box-sizing 常用的属性有哪些 ？分别有什么作用 ？**

常用的属性：box-sizing: content-box border-box inherit;

作用

content-box(默认)：宽度和高度分别应用到元素的内容框。在宽度和高度之外绘制元素的内边距和边框(元素默认效果)。
border-box：元素指定的任何内边距和边框都将在已设定的宽度和高度内进行绘制。通过从已设定的宽度和高度分别减去边框和内边距才能得到内容的宽度和高度。

---

**页面导入样式时，使用 link 和 @import 有什么区别 ？**

- link 属于 XHTML 标签，除了加载 CSS 外，还能用于定义 RSS(是一种描述和同步网站内容的格式，是使用最广泛的 XML 应用), 定义 rel 连接属性等作用；
- 而 @import 是 CSS 提供的，只能用于加载 CSS;
- 页面被加载的时，link 会同时被加载，而 @import 引用的 CSS 会等到页面被加载完再加载;
- import 是 CSS2.1 提出的，只在 IE5 以上才能被识别，而 link 是 XHTML 标签，无兼容问题。
- 总之，link 要优于 @import。

---

**常见兼容性问题？**

- 浏览器默认的 margin 和 padding 不同。解决方案是加一个全局的 \*{margin: 0; padding: 0;} 来统一。
- IE 下 event 对象有 event.x，event.y 属性，而 Firefox 下没有。Firefox 下有 event.pageX，event.PageY 属性，而 IE 下没有。
  解决办法：var mx = event.x?event.x:event.pageX;

- Chrome 中文界面下默认会将小于 12px 的文本强制按照 12px 显示, 可通过加入 CSS 属性 -webkit-text-size-adjust: none; 解决.

- 超链接访问过后 hover 样式就不出现了，被点击访问过的超链接样式不在具有 hover 和 active 了，解决方法是改变 CSS 属性的排列顺序:
  L-V-H-A : a:link {} a:visited {} a:hover {} a:active {}

---

**清除浮动，什么时候需要清除浮动，清除浮动都有哪些方法 ？**

一个块级元素如果没有设置 height，那么其高度就是由里面的子元素撑开，如果子元素使用浮动，脱离了标准的文档流，那么父元素的高度会将其忽略，如果不清除浮动，父元素会出现高度不够，那样如果设置 border 或者 background 都得不到正确的解析。

正是因为浮动的这种特性，导致本属于普通流中的元素浮动之后，包含框内部由于不存在其他普通流元素了，也就表现出高度为 0（`高度塌陷`）。在实际布局中，往往这并不是我们所希望的，所以需要闭合浮动元素，使其包含框表现出正常的高度。

清除浮动的方式

- 父级 div 定义 height，原理：父级 div 手动定义 height，就解决了父级 div 无法自动获取到高度的问题。
- 结尾处加空 div 标签 clear: both，原理：添加一个空 div，利用 css 提高的 clear: both 清除浮动，让父级 div 能自动获取到高度。
- 父级 div 定义 overflow: hidden，   原理：必须定义 width 或 zoom: 1，同时不能定义 height，使用 overflow: hidden 时，浏览器会自动检查浮动区域的高度。
- 父级 div 也一起浮动  。
- 父级 div 定义 display: table 。
- 父级 div 定义 伪类 :after 和 zoom 。
- 结尾处加 br 标签 clear: both，  原理：父级 div 定义 zoom: 1 来解决 IE 浮动问题，结尾处加 br 标签 clear: both。

总结：比较好的是倒数第 2 种方式，简洁方便。

---

**如何保持浮层水平垂直居中 ？**

一、水平居中

（1）行内元素解决方案

只需要把行内元素包裹在一个属性 display 为 block 的父层元素中，并且把父层元素添加如下属性即可。

```css
.parent {
  text-align: center;
}
```

（2）块状元素解决方案

```css
.item {
  /* 这里可以设置顶端外边距 */
  margin: 10px auto;
}
```

（3）多个块状元素解决方案将元素的 display 属性设置为 inline-block，并且把父元素的 text-align 属性设置为 center 即可:

```css
.parent {
  text-align: center;
}
```

（4）多个块状元素解决方案

使用 flexbox 布局，只需要把待处理的块状元素的父元素添加属性 display: flex 及 justify-content: center 即可。

```css
.parent {
  display: flex;
  justify-content: center;
}
```

二、垂直居中

（1）单行的行内元素解决方案

```css
.parent {
  background: #222;
  height: 200px;
}

/* 以下代码中，将 a 元素的 height 和 line-height 设置的和父元素一样高度即可实现垂直居中 */
a {
  height: 200px;
  line-height: 200px;
  color: #fff;
}
```

（2）多行的行内元素解决方案组合

使用 display: table-cell 和 vertical-align: middle 属性来定义需要居中的元素的父容器元素生成效果，如下：

```
.parent {
    background: #222;
    width: 300px;
    height: 300px;
    /* 以下属性垂直居中 */
    display: table-cell;
    vertical-align: middle;
}
```

（3）已知高度的块状元素解决方案

```css 
.item {
  position: absolute;
  top: 50%;
  margin-top: -50px; /* margin-top值为自身高度的一半 */
  padding: 0;
}
```

三、水平垂直居中

（1）已知高度和宽度的元素解决方案 1

这是一种不常见的居中方法，可自适应，比方案 2 更智能，如下：

```css
.item {
  position: absolute;
  margin: auto;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
```

（2）已知高度和宽度的元素解决方案 2

```css
.item {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -75px; /* 设置margin-left / margin-top 为自身高度的一半 */
  margin-left: -75px;
}
```

（3）未知高度和宽度元素解决方案

```css
.item {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* 使用 css3 的 transform 来实现 */
}
```

（4）使用 flex 布局实现

```css
.parent {
  display: flex;
  justify-content: center;
  align-items: center;
  /* 注意这里需要设置高度来查看垂直居中效果 */
  background: #aaa;
  height: 300px;
}
```

---

**position 、float 和 display 的取值和各自的意思和用法**

position

- position 属性取值：static(默认)、relative、absolute、fixed、inherit、sticky。
- postision：static；始终处于文档流给予的位置。看起来好像没有用，但它可以快速取消定位，让 top，right，bottom，left 的值失效。在切换的时候可以尝试这个方法。
- 除了 static 值，在其他三个值的设置下，z-index 才会起作用。确切地说 z-index 只在定位元素上有效。
- position：relative 和 absolute 都可以用于定位，区别在于前者的 div 还属于正常的文档流，后者已经是脱离了正常文档流，不占据空间位置，不会将父类撑开。
  定位原点 relative 是相对于它在正常流中的默认位置偏移，它原本占据的空间任然保留；absolute 相对于第一个 position 属性值不为 static 的父类。所以设置了 position：absolute，其父类的该属性值要注意，而且 overflow：hidden 也不能乱设置，因为不属于正常文档流，不会占据父类的高度，也就不会有滚动条。
- fixed 旧版本 IE 不支持，却是很有用，定位原点相对于浏览器窗口，而且不能变。
  常用于 header，footer 或者一些固定的悬浮 div，随滚动条滚动又稳定又流畅，比 JS 好多了。fixed 可以有很多创造性的布局和作用，兼容性是问题。
- position：inherit。
  规定从父类继承 position 属性的值，所以这个属性也是有继承性的，但需要注意的是 IE8 以及往前的版本都不支持 inherit 属性。
- sticky ：设置了 sticky 的元素，在屏幕范围（viewport）时该元素的位置并不受到定位影响（设置是 top、left 等属性无效），当该元素的位置将要移出偏移范围时，定位又会变成 fixed，根据设置的 left、top 等属性成固定位置的效果。

float

- float：left (或 right)，向左（或右）浮动，直到它的边缘碰到包含框或另一个浮动框为止。
  且脱离普通的文档流，会被正常文档流内的块框忽略。不占据空间，无法将父类元素撑开。
- 任何元素都可以浮动，浮动元素会生成一个块级框，不论它本身是何种元素。因此，没有必要为浮动元素设置 display：block。
- 如果浮动非替换元素，则要指定一个明确的 width，否则它们会尽可能的窄。
  什么叫替换元素 ？根据元素本身的特点定义的， (X)HTML 中的 img、input、textarea、select、object 都是替换元素，这些元素都没有实际的内容。 (X)HTML 的大多数元素是不可替换元素，他们将内容直接告诉浏览器，将其显示出来。

display

- display 属性取值：none、inline、inline-block、block、table 相关属性值、inherit。
- display 属性规定元素应该生成的框的类型。文档内任何元素都是框，块框或行内框。
- display：none 和 visiability：hidden 都可以隐藏 div，区别有点像 absolute 和 relative，前者不占据文档的空间，后者还是占据文档的位置。
- display：inline 和 block，又叫行内元素和块级元素。
  表现出来的区别就是 block 独占一行，在浏览器中通常垂直布局，可以用 margin 来控制块级元素之间的间距（存在 margin 合并的问题，只有普通文档流中块框的垂直外边距才会发生外边距合并。行内框、浮动框或绝对定位之间的外边距不会合并。）；
  而 inline 以水平方式布局，垂直方向的 margin 和 padding 都是无效的，大小跟内容一样，且无法设置宽高。
  inline 就像塑料袋，内容怎么样，就长得怎么样；block 就像盒子，有固定的宽和高。
- inline-block 就介于两者之间。
- table 相关的属性值可以用来垂直居中，效果一般。
- flex

定位机制

上面三个属性都属于 CSS 定位属性。CSS 三种基本的定位机制：普通流、浮动、绝对定位。

---

**css3 动画效果属性有哪些 ?**

- animation-name：规定需要绑定到选择器的 keyframe 名称。。
- animation-duration：规定完成动画所花费的时间，以秒或毫秒计。
- animation-timing-function：规定动画的速度曲线。
- animation-delay：规定在动画开始之前的延迟。
- animation-iteration-count：规定动画应该播放的次数。
- animation-direction：规定是否应该轮流反向播放动画。

---

**会不会用 ps 扣图，png、jpg、gif 这些图片格式解释一下，分别什么时候用。如何优化图像、图像格式的区别 ?**

JPG 的特性

- 支持摄影图像或写实图像的高级压缩，并且可利用压缩比例控制图像文件大小。
- 有损压缩会使图像数据质量下降，并且在编辑和重新保存 JPG 格式图像时，这种下降损失会累积。
- JPG 不适用于所含颜色很少、具有大块颜色相近的区域或亮度差异十分明显的较简单的图片。

PNG 的特性

- 能在保证最不失真的情况下尽可能压缩图像文件的大小。
- PNG 用来存储灰度图像时，灰度图像的深度可多到 16 位，存储彩色图像时，彩色图像的深度可多到 48 位，并且还可存储多到 16 位的 α 通道数据。
- 对于需要高保真的较复杂的图像，PNG 虽然能无损压缩，但图片文件较大，不适合应用在 Web 页面上。
- 另外还有一个原则就是用于页面结构的基本视觉元素，**如容器的背景、按钮、导航的背景等应该尽量用 PNG 格式进行存储，这样才能更好的保证设计品质**。而其他一些内容元素，**如广告 Banner、商品图片 等对质量要求不是特别苛刻的，则可以用 JPG 去进行存储从而降低文件大小**。

GIF 格式特点

- 透明性: Gif 是一种布尔透明类型，既它可以是全透明，也可以是全不透明，但是它并没有半透明（alpha 透明）。
- 动画：Gif 这种格式支持动画。
- 无损耗性：Gif 是一种无损耗的图像格式，这也意味着你可以对 gif 图片做任何操作也不会使得图像质量产生损耗。
- 水平扫描：Gif 是使用了一种叫作 LZW 的算法进行压缩的，当压缩 gif 的过程中，像素是由上到下水平压缩的，这也意味着同等条件下，横向的 gif 图片比竖向的 gif 图片更加小。
  例如 500*10 的图片比 10*500 的图片更加小。
  间隔渐进显示：Gif 支持可选择性的间隔渐进显示。

由以上特点看出只有 256 种颜色的 gif 图片不适合作为照片，它适合做对颜色要求不高的图形。

---

**我们知道可以以外链的方式引入 CSS 文件，请谈谈外链引入 CSS 有哪些方式，这些方式的性能有区别吗 ？**

CSS 的引入方式最常用的有三种

第一：外链式

这种方法可以说是现在占统治地位的引入方法。

如同 IE 与浏览器。这也是最能体现 CSS 特点的方法；

最能体现 DIV+CSS 中的内容离的思想，也最易改版维护，代码看起来也是最美观的一种。

第二：内部样式表

这种方法的使用情况要少的多，最长见得就是访问量大的门户网站。或者访问量较大的企业网站的首页。

与第一种方法比起来，优弊端也明显。

优点：速度快，所有的 CSS 控制都是针对本页面标签的，没有多余的 CSS 命令；再者不用外链 CSS 文件。直接在文档中读取样式。

缺点：就是改版麻烦些，单个页面显得臃肿，CSS 不能被其他 HTML 引用造成代码量相对较多，维护也麻烦些采用这种方法的公司大多有钱，对他们来说用户量是关键，他们不缺人进行复杂的维护工作。

第三：行内样式

认为 HTML 里不能出现 CSS 命令。其实有时候没有什么大不了。比如通用性差，效果特殊，使用 CSS 命令较少，并且不常改动的地方，使用这种方法反而是很好的选择。

第四、@import 引入方式

```css
<style type="text/css">
@import url(my.css);
</style>
```

---

**CSS Sprite 是什么，谈谈这个技术的优缺点。**

加速的关键，不是降低重量，而是减少个数。传统切图讲究精细，图片规格越小越好，重量越小越好，其实规格大小无计算机统一都按 byte 计算。客户端每显示一张图片都会向服务器发送请求。所以，图片越多请求次数越多，造成延迟的可越大。

- 利用 CSS Sprites 能很好地减少了网页的 http 请求，从而大大的提高了页面的性能，这也是 CSS Sprites 的优点，也是其被广泛传播和应用的主要原因；
- CSS Sprites 能减少图片的字节，曾经比较过多次 3 张图片合并成 1 张图片的字节总是小于这 3 张图片的和。
- 解决了网页设计师在图片命名上的困扰，只需对一张集合的图片上命名就可以了，不需要对每一个小元素名，从而提高了网页的制作效率。
- 更换风格方便，只需要在一张或少张图片上修改图片的颜色或样式，整个网页的风格就可以改变。维护起方便。

诚然 CSS Sprites 是如此的强大，但是也存在一些不可忽视的缺点，如下：

- 在图片合并的时候，你要把多张图片有序的合理的合并成一张图片，还要留好足够的空间，防止板块内不不必要的背景；这些还好，最痛苦的是在宽屏，高分辨率的屏幕下的自适应页面，你的图片如果不够宽，很容背景断裂；
- CSS Sprites 在开发的时候比较麻烦，你要通过 photoshop 或其他工具测量计算每一个背景单元的精确位是针线活，没什么难度，但是很繁琐；
- CSS Sprites 在维护的时候比较麻烦，如果页面背景有少许改动，一般就要改这张合并的图片，无需改的好不要动，这样避免改动更多的 css，如果在原来的地方放不下，又只能（最好）往下加图片，这样图片的字加了，还要改动 css。

CSS Sprites 非常值得学习和应用，特别是页面有一堆 ico（图标）。总之很多时候大家要权衡一下再决定是不是应用 CSS Sprites。

---

**以 CSS3 标准定义一个 webkit 内核浏览器识别的圆角（尺寸随意）**

```css
-moz-border-radius: 10px;
-webkit-border-radius: 10px;
 border-radius: 10px;。
```

---

**优先级算法如何计算？内联和 important 哪个优先级高 ？**

- 优先级就近原则，样式定义最近者为准
- 载入样式以最后载入的定位为准
- 优先级为 !important > [ id > class > tag ]
- !mportant 比内联优先级高

---

**css 的基本语句构成是 ？**

回答：选择器、属性和属性值。

---

**如果让你来制作一个访问量很高的大型网站，你会如何来管理所有 CSS 文件、JS 与图片？**

回答：涉及到人手、分工、同步；

- 先期团队必须确定好全局样式（globe.css），编码模式 (utf-8) 等
- 编写习惯必须一致（例如都是采用继承式的写法，单样式都写成一行）；
- 标注样式编写人，各模块都及时标注（标注关键样式调用的地方）；
- 页面进行标注（例如页面模块开始和结束）；
- CSS 跟 HTML 分文件夹并行存放，命名都得统一（例如 style.css）
- JS 分文件夹存放，命名以该 JS 功能为准
- 图片采用整合的 png8 格式文件使用，尽量整合在一起使用，方便将来的管理。

---

**CSS 选择符有哪些 ？哪些属性可以继承 ？优先级算法如何计算 ？新增伪类有那些 ？**

CSS 选择符

1. id 选择器（ # myid）
2. 类选择器（.myclassname）
3. 标签选择器（div, h1, p）
4. 相邻选择器（h1 + p）
5. 子选择器（ul > li）
6. 后代选择器（li a）
7. 通配符选择器（ \* ）
8. 属性选择器（a[rel = "external"]）
9. 伪类选择器（a: hover, li: nth - child）

可继承的样式

font-size，font-family，color，ul，li，dl，dd，dt；

不可继承的样式

border padding margin width height
事实上，宽度也不是继承的，而是如果你不指定宽度，那么它就是 100%。由于你子 DIV 并没有指定宽度，那它就是 100%，也就是与父 DIV 同宽，但这与继承无关，高度自然也没有继承一说。

优先级算法

优先级就近原则，同权重情况下样式定义最近者为准;
载入样式以最后载入的定位为准;
优先级为: !important > id > class > tag , important 比 内联优先级高

---

**CSS3 新增伪类举例**

- :root 选择文档的根元素，等同于 html 元素
- :empty 选择没有子元素的元素
- :target 选取当前活动的目标元素
- :not(selector) 选择除 selector 元素以外的元素
- :enabled 选择可用的表单元素
- :disabled 选择禁用的表单元素
- :checked 选择被选中的表单元素
- :after 选择器在被选元素的内容后面插入内容
- :before 选择器在被选元素的内容前面插入内容
- :nth-child(n) 匹配父元素下指定子元素，在所有子元素中排序第 n
- :nth-last-child(n) 匹配父元素下指定子元素，在所有子元素中排序第 n，从后向前数
- :nth-child(odd) 奇数
- :nth-child(even) 偶数
- :nth-child(3n+1)
- :first-child
- :last-child
- :only-child
- :nth-of-type(n) 匹配父元素下指定子元素，在同类子元素中排序第 n
- :nth-last-of-type(n) 匹配父元素下指定子元素，在同类子元素中排序第 n，从后向前数
- :nth-of-type(odd)
- :nth-of-type(even)
- :nth-of-type(3n+1)
- :first-of-type
- :last-of-type
- :only-of-type
- ::selection 选择被用户选取的元素部分
- :first-line 选择元素中的第一行
- :first-letter 选择元素中的第一个字符

---

**CSS3 有哪些新特性 ?**

- CSS3 实现圆角（border-radius:8px）
- 阴影（box-shadow:10px）
- 对文字加特效（text-shadow）
- 线性渐变（gradient）
- 旋转、缩放、定位、倾斜

```css
transform: rotate(9deg) scale(0.85, 0.9) translate(0px, -30px) skew(-9deg, 0deg);
```

- 增加了更多的 CSS 选择器
- 多背景 rgba

---

**一个满屏 品字布局 如何设计 ？**

第一种方式

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>满屏品字布局</title>
    <style type="text/css">
      * {
        margin: 0;
        padding: 0;
      }
      html,
      body {
        height: 100%; /*此设置非常关键，因为默认的 body，HTML 高度为 0，所以后面设置的 div 的高度无法用百分比显示*/
      }
      .header {
        height: 50%; /*此步结合 html,body 高度为 100%，解决元素相对窗口的定位问题*/
        width: 50%;
        background: #ccc;
        margin: 0 auto;
      }
      .main {
        width: 100%;
        height: 50%;
        background: #ddd;
      }
      .main .left,
      .main .right {
        float: left; /*采用 float 方式，对元素进行左右定位*/
        width: 50%; /*此步解决元素相对窗口的定位问题*/
        height: 100%; /*此步解决元素相对窗口的定位问题*/
        background: yellow;
      }
      .main .right {
        background: green;
      }
    </style>
  </head>
  <body>
    <div class="header"></div>
    <div class="main">
      <div class="left"></div>
      <div class="right"></div>
    </div>
  </body>
</html>
```

效果如下：

![](https://upload-images.jianshu.io/upload_images/12890819-14fd939f04b7ce27.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

---

**为什么要初始化 CSS 样式 ?**

因为浏览器的兼容问题，不同浏览器对有些标签的默认值是不同的，如果没对 CSS 初始化往往会出现浏览器之间的页面显示差异。
初始化样式会对 SEO 有一定的影响，但鱼和熊掌不可兼得，但力求影响最小的情况下初始化。

初始化 CSS 样式例子

```css
html,
body {
  padding: 0;
  margin: 0;
}
...
```

---

**请解释一下 CSS3 的 Flexbox（弹性盒布局模型），以及适用场景 ？**

http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html

任何一个容器都可以指定为 Flex 布局，行内元素也可以使用 Flex 布局。

注意：设为 Flex 布局以后，子元素的 float、clear 和 vertical-align 属性将失效。

---

**flex 布局最常用的是什么场景 ？**

一般实现垂直居中是一件很麻烦的事，但 flex 布局轻松解决。

```css
.demo {
  display: flex;
   justify-content: center;
   align-items: center;
}
```

---

**用纯 CSS 创建一个三角形的原理是什么？**

把上、左、右三条边隐藏掉（颜色设为 transparent）

```css
#demo {
   width: 0;
   height: 0;
   border-width: 20px;
   border-style: solid;
   border-color: transparent transparent red transparent;
}
```

---

**absolute 的 containing block(容器块) 计算方式跟正常流有什么不同 ？**

无论属于哪种，都要先找到其祖先元素中最近的 position 值不为 static 的元素，然后再判断：

- 若此元素为 inline 元素，则 containing block 为能够包含这个元素生成的第一个和最后一个 inline box 的 padding box (除 margin, border 外的区域) 的最小矩形；
- 否则，则由这个祖先元素的 padding box 构成。
- 如果都找不到，则为 initial containing block。

补充：

1. static / relative：简单说就是它的父元素的内容框（即去掉 padding 的部分）
2. absolute: 向上找最近的定位为 absolute / relative 的元素
3. fixed: 它的 containing block 一律为根元素(html / body)，根元素也是 initialcontaining block

---

**对 BFC 规范(块级格式化上下文：blockformatting context)的理解 ？**

W3C CSS 2.1 规范中的一个概念，它是一个独立容器，决定了元素如何对其内容进行定位，以及与其他元素的关系和相互作用。

- 一个页面是由很多个 Box 组成的，元素的类型和 display 属性，决定了这个 Box 的类型。
- 不同类型的 Box，会参与不同的 Formatting Context（决定如何渲染文档的容器），因此 Box 内的元素会以不同的方式渲染，也就是说 BFC 内部的元素和外部的元素不会互相影响。

---

**用 position: absolute 跟用 float 有什么区别吗 ？**

- 都是脱离标准流，只是 position: absolute 定位用的时候，位置可以给的更精确(想放哪就放哪)，而 float 用的更简洁，向右，左，两个方向浮动，用起来就一句代码。
- 还有就是 position: absolute 不管在哪个标签里，都可以定位到任意位置，毕竟 top，left，bottom，right 都可以给正值或负值；
- float 只是向左或向右浮动，不如 position: absolute 灵活，浮动后再想改变位置就要加各种 margin，padding 之类的通过间距的改变来改变位置，我自身觉得这样的话用起来不方便，也不太好。
- 但在菜单栏，或者一些图标的横向排列时，用起来特别方便，一个 float 就解决了，而且每个元素之间不会有任何间距(所以可以用 float 消除元素间的距离)；

---

**canvas 与 svg 的区别 ？**

- Canvas 是基于像素的即时模式图形系统，最适合较小的表面或较大数量的对象，Canvas 不支持鼠标键盘等事件。
- SVG 是基于形状的保留模式图形系统，更加适合较大的表面或较小数量的对象。
- Canvas 和 SVG 在修改方式上还存在着不同。绘制 Canvas 对象后，不能使用脚本和 CSS 对它进行修改。因为 SVG 对象是文档对象模型的一部分，所以可以随时使用脚本和 CSS 修改它们。

现在对两种技术做对比归纳如下：

Canvas

1. 依赖分辨率
2. 不支持事件处理器
3. 弱的文本渲染能力
4. 能够以 .png 或 .jpg 格式保存结果图像
5. 最适合图像密集型的游戏，其中的许多对象会被频繁重绘

SVG

1. 不依赖分辨率
2. 支持事件处理器
3. 最适合带有大型渲染区域的应用程序（比如谷歌地图）
4. 复杂度高会减慢渲染速度（任何过度使用 DOM 的应用都不快）
5. 不适合游戏应用

---

**svg 与 canvas 的区别 ？**

- svg 绘制出来的每一个图形的元素都是独立的 DOM 节点，能够方便的绑定事件或用来修改，而 canvas 输出的是一整幅画布；
- svg 输出的图形是矢量图形，后期可以修改参数来自由放大缩小，不会是真和锯齿。而 canvas 输出标量画布，就像一张图片一样，放大会失真或者锯齿。

---

**何时应当时用 padding 和 margin ？**

何时应当使用 margin

- 需要在 border 外侧添加空白时。
- 空白处不需要背景（色）时。
- 上下相连的两个盒子之间的空白，需要相互抵消时。
  如 15px + 20px 的 margin，将得到 20px 的空白。

何时应当使用 padding

- 需要在 border 内测添加空白时。
- 空白处需要背景（色）时。
- 上下相连的两个盒子之间的空白，希望等于两者之和时。
  如 15px + 20px 的 padding，将得到 35px 的空白。

个人认为：`margin 是用来隔开元素与元素的间距；padding 是用来隔开元素与内容的间隔，让内容（文字）与（包裹）元素之间有一段 呼吸距离`。

---

**文字在超出长度时，如何实现用省略号代替 ? 超长长度的文字在省略显示后，如何在鼠标悬停时，以悬浮框的形式显示出全部信息 ?**

注意：设置 width，overflow: hidden, white-space: nowrap (规定段落中的文本不进行换行), text-overflow: ellipsis，四个属性缺一不可。这种写法在所有的浏览器中都能正常显示。

---

**CSS 里的 visibility 属性有个 collapse 属性值 ？在不同浏览器下有什么区别 ？**

collapse

- 当在表格元素中使用时，此值可删除一行或一列，但是它不会影响表格的布局，被行或列占据的空间会留给其他内容使用。
- 如果此值被用在其他的元素上，会呈现为 hidden。
- 当一个元素的 visibility 属性被设置成 collapse 值后，对于一般的元素，它的表现跟 hidden 是一样的。

- chrome 中，使用 collapse 值和使用 hidden 没有区别。
- firefox，opera 和 IE，使用 collapse 值和使用 display：none 没有什么区别。

---

**position 跟 display、overflow、float 这些特性相互叠加后会怎么样 ？**

- display 属性规定元素应该生成的框的类型；
- position 属性规定元素的定位类型；
- float 属性是一种布局方式，定义元素在哪个方向浮动。
- 类似于优先级机制：position：absolute / fixed 优先级最高，有他们在时，float 不起作用，display 值需要调整。float 或者 absolute 定位的元素，只能是块元素或表格。

---

**对 BFC 规范(块级格式化上下文：block formatting context) 的理解 ？**

BFC 规定了内部的 Block Box 如何布局。

定位方案：

- 内部的 Box 会在垂直方向上一个接一个放置。
- Box 垂直方向的距离由 margin 决定，属于同一个 BFC 的两个相邻 Box 的 margin 会发生重叠。
- 每个元素的 margin box 的左边，与包含块 border box 的左边相接触。
- BFC 的区域不会与 float box 重叠。
- BFC 是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。

计算 BFC 的高度时，浮动元素也会参与计算。

满足下列条件之一就可触发 BFC：

- 1、根元素，即 html
- 2、float 的值不为 none（默认）
- 3、overflow 的值不为 visible（默认）
- 4、display 的值为 inline-block、table-cell、table-caption
- 5、position 的值为 absolute 或 fixed

---

**浏览器是怎样解析 CSS 选择器的 ？**

- CSS 选择器的解析是从右向左解析的。
- 若从左向右的匹配，发现不符合规则，需要进行回溯，会损失很多性能。
- 若从右向左匹配，先找到所有的最右节点，对于每一个节点，向上寻找其父节点直到找到根元素或满足条件的匹配规则，则结束这个分支的遍历。
- 两种匹配规则的性能差别很大，是因为从右向左的匹配在第一步就筛选掉了大量的不符合条件的最右节点（叶子节点），而从左向右的匹配规则的性能都浪费在了失败的查找上面。
- 而在 CSS 解析完毕后，需要将解析的结果与 DOM Tree 的内容一起进行分析建立一棵 Render Tree，最终用来进行绘图。
- 在建立 Render Tree 时（WebKit 中的「Attachment」过程），浏览器就要为每个 DOM Tree 中的元素根据 CSS 的解析结果（Style Rules）来确定生成怎样的 Render Tree。

---

**元素竖向的百分比设定是相对于容器的高度吗 ？**

当按百分比设定一个元素的宽度时，它是相对于父容器的宽度计算的。

---

**全屏滚动的原理是什么 ？用到了 CSS 的哪些属性 ？**

原理

- 有点类似于轮播，整体的元素一直排列下去，假设有 5 个需要展示的全屏页面，那么高度是 500%，只是展示 100%，剩下的可以通过 transform 进行 y 轴定位，也可以通过 margin-top 实现。
- overflow：hidden；transition：all 1000ms ease；

---

**什么是响应式设计 ？响应式设计的基本原理是什么 ？如何兼容低版本的 IE ？**

- 响应式网站设计( Responsive Web design ) 是一个网站能够兼容多个终端，而不是为每一个终端做一个特定的版本。
- 基本原理是通过媒体查询检测不同的设备屏幕尺寸做处理。
- 页面头部必须有 meta 声明的 viewport。

```html
<meta name="viewport" content="”
width="device-width" initial-scale="1" maximum-scale="1" user-scalable="no"/>
```

---

**视差滚动效果 ？**

视差滚动（Parallax Scrolling）通过在网页向下滚动的时候，`控制背景的移动速度比前景的移动速度慢`来创建出令人惊叹的 3D 效果。

- CSS3 实现。
  优点：开发时间短、性能和开发效率比较好，缺点是不能兼容到低版本的浏览器
- jQuery 实现。
  通过控制不同层滚动速度，计算每一层的时间，控制滚动效果。优点：能兼容到各个版本的，效果可控性好。缺点：开发起来对制作者要求高。
- 插件实现方式。
  例如：parallax-scrolling，兼容性十分好。

---

**::before 和 :after 中双冒号和单冒号有什么区别 ？解释一下这 2 个伪元素的作用**

- 单冒号 (:) 用于 CSS3 伪类，双冒号 (::) 用于 CSS3 伪元素。
- ::before 就是以一个子元素的存在，定义在元素主体内容之前的一个伪元素。并不存在于 dom 之中，只存在在页面之中。

:before 和 :after 这两个伪元素，是在 CSS2.1 里新出现的。
起初，伪元素的前缀使用的是单冒号语法，但随着 Web 的进化，在 CSS3 的规范里，伪元素的语法被修改成使用双冒号，成为 ::before、 ::after 。

---

**怎么让 Chrome 支持小于 12px 的文字 ？**

```css
p {
  font-size: 10px;
  -webkit-transform: scale(0.8);  // 0.8 是缩放比例
} 
```

---

**让页面里的字体变清晰，变细用 CSS 怎么做 ？**

-webkit-font-smoothing 在 window 系统下没有起作用，但是在 IOS 设备上起作用 -webkit-font-smoothing：antialiased 是最佳的，灰度平滑。

---

**如果需要手动写动画，你认为最小时间间隔是多久，为什么 ？**

多数显示器默认频率是 60Hz，即 1 秒刷新 60 次，所以理论上最小间隔为：1/60＊1000ms ＝ 16.7ms。

---

**有一个高度自适应的 div，里面有两个 div，一个高度 100px，如何让另一个填满剩下的高度 ？**

- 外层 div 使用 position：relative；
- 高度要求自适应的 div 使用 position: absolute; top: 100px; bottom: 0; left: 0

---

**style 标签写在 body 后与 body 前有什么区别？**

页面加载自上而下，当然是先加载样式。

写在 body 标签后，由于浏览器以逐行方式对 HTML 文档进行解析，当解析到写在尾部的样式表（外联或写在 style 标签）会导致浏览器停止之前的渲染，等待加载且解析样式表完成之后重新渲染，在 windows 的 IE 下可能会出现 FOUC 现象（即样式失效导致的页面闪烁问题）

---

**阐述一下 CSS Sprites**

将一个页面涉及到的所有图片都包含到一张大图中去，然后利用 CSS 的 background-image，background-repeat，background-position 的组合进行背景定位。

利用 CSS Sprites 能很好地减少网页的 http 请求，从而大大的提高页面的性能；
CSS Sprites 能减少图片的字节。

---

**用 css 实现左侧宽度自适应，右侧固定宽度 ？**

1、标准浏览器的方法

当然，以不折腾人为标准的 w3c 标准早就为我们提供了制作这种自适应宽度的标准方法。

- 把 container 设为 display: table 并指定宽度 100%；
- 然后把 main + sidebar 设为 display: table-cell;
- 然后只给 sidebar 指定一个宽度，那么 main 的宽度就变成自适应了。

代码很少，而且不会有额外标签。不过这是 IE7 及以下都无效的方法。

```css
.container {
  display: table;
  width: 100%;
}
.main {
  display: table-cell;
}
.sidebar {
  display: table-cell;
  width: 300px;
}
```

![](https://upload-images.jianshu.io/upload_images/12890819-ce4324bfc2c4f839.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

2、固定区域浮动，自适应区域不设置宽度但设置 margin

```css
.container {
  overflow: hidden;
  *zoom: 1;
}
.sidebar {
  float: right;
  width: 300px;
  background: #333;
}
.main {
  margin-right: 320px;
  background: #666;
}
.footer {
  margin-top: 20px;
  background: #ccc;
}
```

其中，sidebar 让它浮动，并设置了一个宽度；而 main 没有设置宽度。

大家要注意 html 中必须使用 div 标签，不要妄图使用什么 p 标签来达到目的。因为 div 有个默认属性，即如果不设置宽度，那它会自动填满它的父标签的宽度。这里的 main 就是例子。

当然我们不能让它填满了，填满了它就不能和 sidebar 保持同一行了。我们给它设置一个 margin。由于 sidebar 在右边，所以我们设置 main 的 margin-right 值，值比 sidebar 的宽度大一点点——以便区分它们的范围，例子中是 320。

假设 main 的默认宽度是 100%，那么它设置了 margin 后，它的宽度就变成了 100% - 320，此时 main 发现自己的宽度可以与 sidebar 挤在同一行了，于是它就上来了。
而宽度 100% 是相对于它的父标签来的，如果我们改变了它父标签的宽度，那 main 的宽度也就会变——比如我们把浏览器窗口缩小，那 container 的宽度就会变小，而 main 的宽度也就变小，但它的实际宽度 100% - 320 始终是不会变的。

这个方法看起来很完美，只要我们记得清除浮动(这里我用了最简单的方法)，那 footer 也不会错位。而且无论 main 和 sidebar 谁更长，都不会对布局造成影响。

但实际上这个方法有个很老火的限制——html 中 sidebar 必须在 main 之前！
但我需要 sidebar 在 main 之后！因为我的 main 里面才是网页的主要内容，我不想主要内容反而排在次要内容后面。
但如果 sidebar 在 main 之后，那上面的一切都会化为泡影。

![](https://upload-images.jianshu.io/upload_images/12890819-47c872107fcc93aa.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

3、固定区域使用定位，自适应区域不设置宽度，但设置 margin

```css
.container {
  position: relative;
}
.sidebar {
  position: absolute;
  top: 0;
  right: 0;
  width: 300px;
  background: #333;
}
.main {
  margin-right: 320px;
  background: #666;
}
```

![](https://upload-images.jianshu.io/upload_images/12890819-767262ae18002121.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

咦，好像不对，footer 怎么还是在那儿呢？怎么没有自动往下走呢？footer 说——我不给绝对主义者让位！
其实这与 footer 无关，而是因为 container 对 sidebar 的无视造成的——你再长，我还是没感觉。
看来这种定位方式只能满足 sidebar 自己，但对它的兄弟们却毫无益处。

4、左边浮动，右边 overflow: hidden;

```css
* {
  margin: 0;
  padding: 0;
}
html,
body {
  height: 100%; /*高度百分百显示*/
}
#left {
  width: 300px;
  height: 100%;
  background-color: #ccc;
  float: left;
}
#right {
  height: 100%;
  overflow: hidden;
  background-color: #eee;
}
```

这个方法，我利用的是创建一个新的 BFC（块级格式化上下文）来防止文字环绕的原理来实现的。

BFC 就是一个相对独立的布局环境，它内部元素的布局不受外面布局的影响。
它可以通过以下任何一种方式来创建：

- float 的值不为 none
- position 的值不为 static 或者 relative
- display 的值为 table-cell , table-caption , inline-block , flex , 或者 inline-flex 中的其中一个
- overflow 的值不为  visible

关于 BFC，在 w3c 里是这样描述的：在 BFC 中，每个盒子的左外边框紧挨着 包含块 的 左边框 （从右到左的格式化时，则为右边框紧挨）。
即使在浮动里也是这样的（尽管一个包含块的边框会因为浮动而萎缩），除非这个包含块的内部创建了一个新的 BFC。
这样，当我们给右侧的元素单独创建一个 BFC 时，它将不会紧贴在包含块的左边框，而是紧贴在左元素的右边框。

---

**问：浮动的原理和工作方式，会产生什么影响呢，要怎么处理 ？**

工作方式：浮动元素脱离文档流，不占据空间。浮动元素碰到包含它的边框或者浮动元素的边框停留。

影响

- 浮动会导致父元素无法被撑开，影响与父元素同级的元素。
- 与该浮动元素同级的非浮动元素，如果是块级元素，会移动到该元素下方，而块级元素内部的行内元素会环绕浮动元素；而如果是内联元素则会环绕该浮动元素。
- 与该元素同级的浮动元素，对于同一方向的浮动元素(同级)，两个元素将会跟在碰到的浮动元素后；而对于不同方向的浮动元素，在宽度足够时，将分别浮动向不同方向，在宽度不同是将导致一方换行(换行与 HTML 书写顺序有关，后边的将会浮动到下一行)。
- 浮动元素将被视作为块元素。
- 而浮动元素对于其父元素之外的元素，如果是非浮动元素，则相当于忽视该浮动元素，如果是浮动元素，则相当于同级的浮动元素。
- 而常用的清除浮动的方法，则如使用空标签，overflow，伪元素等。

在使用基于浮动设计的 CSS 框架时，自会提供清除的方法，个人并不习惯使用浮动进行布局。

---

**对 CSS Grid 布局的使用**

[5 分钟学会 CSS Grid 布局](http://www.css88.com/archives/8506)

---

**rem、em、px、vh 与 vw 的区别 ？**

一、 rem 的特点

1. rem 的大小是根据 `html` 根目录下的字体大小进行计算的。
2. 当我们改变根目录下的字体大小的时候，下面字体都改变。
3. rem 不仅可以设置字体的大小，也可以设置元素宽、高等属性。
4. rem 是 CSS3 新增的一个相对单位（root em，根 em），这个单位与 em 区别在于使用 rem 为元素设定字体大小时，仍然是相对大小，但相对的只是 HTML 根元素。

这个单位可谓集相对大小和绝对大小的优点于一身，通过它既可以做到只修改根元素就成比例地调整所有字体大小，又可以避免字体大小逐层复合的连锁反应。
目前，除了 IE8 及更早版本外，所有浏览器均已支持 rem。
对于不支持它的浏览器，应对方法也很简单，就是多写一个绝对单位的声明。这些浏览器会忽略用 rem 设定的字体大小。

二、px 特点

1. px 像素（Pixel）。相对长度单位。像素 px 是相对于显示器屏幕分辨率而言的。

三、em 特点

1. em 的值并不是固定的；
2. em 会继承父级元素的字体大小。
3. em 是相对长度单位。当前对行内文本的字体尺寸未被人为设置，相对于当前对象内文本的字体尺寸。如则相对于浏览器的默认字体尺寸。
4. 任意浏览器的默认字体高都是 16px。

所有未经调整的浏览器一般都符合: 1em = 16px。那么 12px = 0.75em，10px = 0.625em。
为了简化 font-size 的换算，需要在 css 中的 body 选择器中声明 Fontsize = 62.5%，这就使 em 值变为 16px\*62.5%=10px, 这样 12px = 1.2em, 10px = 1em, 也就是说只需要将你的原来的 px 数值除以 10，然后换上 em 作为单位就行了。

四、vh 与 vw

视口

- 在桌面端，指的是浏览器的可视区域；
- 在移动端，它涉及 3 个 视口：Layout Viewport（布局视口），Visual Viewport（视觉视口），Ideal Viewport（理想视口）。
- 视口单位中的 “视口”，桌面端指的是浏览器的可视区域；移动端指的就是 Viewport 中的 Layout Viewport。

vh / vw 与 %

| 单位 | 解释                       |
| :--- | :------------------------- |
| vw   | 1vw = 视口宽度的 1%        |
| vh   | 1vh = 视口高度的 1%        |
| vmin | 选取 vw 和 vh 中最小的那个 |
| vmax | 选取 vw 和 vh 中最大的那个 |

比如：浏览器视口尺寸为 370px，那么 1vw = 370px \* 1% = 6.5px (浏览器会四舍五入向下取 7)

vh / vw 与 % 区别

| 单位    | 解释           |
| :------ | :------------- |
| %       | 元素的祖先元素 |
| vh / vw | 视口的尺寸     |

不过由于 vw 和 vh 是 css3 才支持的长度单位，所以在不支持 css3 的浏览器中是无效的。

---

**什么叫优雅降级和渐进增强 ？**

- 渐进增强 progressive enhancement：针对低版本浏览器进行构建页面，保证最基本的功能，然后再针对高级浏览器进行效果、交互等改进和追加功能达到更好的用户体验。
- 优雅降级 graceful degradation：一开始就构建完整的功能，然后再针对低版本浏览器进行兼容。

区别

- 优雅降级是从复杂的现状开始，并试图减少用户体验的供给；
- 渐进增强则是从一个非常基础的，能够起作用的版本开始，并不断扩充，以适应未来环境的需要；
- 降级（功能衰减）意味着往回看；而渐进增强则意味着朝前看，同时保证其根基处于安全地带。

---

**width 和 height 的百分比是相对谁讲的 ？margin 和 padding 呢？**

- width 是相对于直接父元素的 width
- height 是相对于直接父元素的 height
- padding 是相对于直接父元素的 width
- margin 是相对于直接父元素的 margin

```
<style>
    #wrapper {
        width: 500px;
        height: 800px;
        background-color: #ccc;
    }
    .parent {
        width: 300px;
        height: 400px;
        background-color: yellow;
    }
    .son {
        /* 90*40 */
        width: 30%;
        height: 10%;
        /* 30 30 */
        padding-left: 10%;
        margin-left: 10%;
        background-color: green;
    }
</style>
<div id="wrapper">
    <div class="parent">
        <div class="son">
        </div>
    </div>
</div>
```

相关文章：

- [transform，transition，animation，keyframes 区别](https://segmentfault.com/a/1190000012698032)
- [width 和 height 的百分比是相对谁讲的 ？margin 和 padding 呢？](https://www.jianshu.com/p/075839c8e2f2)
- [彻底搞懂 CSS 层叠上下文、层叠等级、层叠顺序、z-index](https://juejin.im/post/5b876f86518825431079ddd6)

---

## 4. JavaScript

**常见的浏览器内核有哪些 ？**

- Trident 内核：IE, 360，搜狗浏览器 MaxThon、TT、The World,等。[又称 MSHTML]
- Gecko 内核：火狐，FF，MozillaSuite / SeaMonkey 等
- Presto 内核：Opera7 及以上。[Opera 内核原为：Presto，现为：Blink]
- Webkit 内核：Safari，Chrome 等。 [ Chrome 的：Blink（WebKit 的分支）]

---

**try/catch 无法捕获 promise.reject 的问题**

try..catch 结构，它只能是同步的，无法用于异步代码模式。

https://segmentfault.com/q/1010000014905440

---

**error 事件的事件处理程序**

https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onerror

---

**一个简易版的 Function.prototype.bind 实现**

```js
Function.prototype.bind = function(context) {
  var self = this;
  return function() {
    return self.apply(context, arguments);
  };
};

var obj = {
  name: "前端架构师"
};
var func = function() {
  console.log(this.name);
}.bind(obj);
func();
```

- [【JavaScript】Function.prototype.bind 实现原理](https://blog.csdn.net/w390058785/article/details/83185847)

---

**call、apply、bind**

1. 怎么利用 call、apply 来求一个数组中最大或者最小值 ?
2. 如何利用 call、apply 来做继承 ?
3. apply、call、bind 的区别和主要应用场景 ?

- call 跟 apply 的用法几乎一样，唯一的不同就是传递的参数不同，call 只能一个参数一个参数的传入。
- apply 则只支持传入一个数组，哪怕是一个参数也要是数组形式。最终调用函数时候这个数组会拆成一个个参数分别传入。
- 至于 bind 方法，他是直接改变这个函数的 this 指向并且返回一个新的函数，之后再次调用这个函数的时候 this 都是指向 bind 绑定的第一个参数。
- bind 传参方式跟 call 方法一致。

适用场景：

求一个数组中最大或者最小值

```js
// 如果一个数组我们已知里面全都是数字，想要知道最大的那个数，由于 Array 没有 max 方法，Math 对象上有
// 我们可以根据 apply 传递参数的特性将这个数组当成参数传入
// 最终 Math.max 函数调用的时候会将 apply 的数组里面的参数一个一个传入，恰好符合 Math.max 的参数传递方式
// 这样变相的实现了数组的 max 方法。min 方法也同理
const arr = [1, 2, 3, 4, 5, 6];
const max = Math.max.apply(null, arr);
console.log(max); // 6
```

参数都会排在之后

```js
// 如果你想将某个函数绑定新的`this`指向并且固定先传入几个变量可以在绑定的时候就传入，之后调用新函数传入的参数都会排在之后
const obj = {};
function test(...args) {
  console.log(args);
}
const newFn = test.bind(obj, "静态参数1", "静态参数2");
newFn("动态参数3", "动态参数4");
```

利用 call 和 apply 做继承

```js
function Animal(name) {
  this.name = name;
  this.showName = function() {
    console.log(this.name);
  };
}

function Cat(name) {
  Animal.call(this, name);
}

// Animal.call(this) 的意思就是使用 this 对象代替 Animal 对象，那么
// Cat 中不就有 Animal 的所有属性和方法了吗，Cat 对象就能够直接调用 Animal 的方法以及属性了
var cat = new Cat("TONY");
cat.showName(); //TONY
```

将伪数组转化为数组（含有 length 属性的对象，dom 节点, 函数的参数 arguments）

```js
// case1: dom节点：
<div class="div1">1</div>
<div class="div1">2</div>
<div class="div1">3</div>

let div = document.getElementsByTagName('div');
console.log(div); // HTMLCollection(3) [div.div1, div.div1, div.div1] 里面包含length属性
let arr2 = Array.prototype.slice.call(div);
console.log(arr2); // 数组 [div.div1, div.div1, div.div1]


//case2：fn 内的 arguments
function fn10() {
    return Array.prototype.slice.call(arguments);
}
console.log(fn10(1,2,3,4,5)); // [1, 2, 3, 4, 5]


// case3: 含有 length 属性的对象
let obj4 = {
    0: 1,
    1: 'thomas',
    2: 13,
    length: 3 // 一定要有length属性
};
console.log(Array.prototype.slice.call(obj4)); // [1, "thomas", 13]
```

判断变量类型

```js
let arr1 = [1, 2, 3];
let str1 = "string";
let obj1 = { name: "thomas" };
//
function isArray(obj) {
  return Object.prototype.toString.call(obj) === "[object Array]";
}
console.log(fn1(arr1)); // true

// 判断类型的方式，这个最常用语判断 array 和 object ，null( 因为 typeof null 等于 object )
console.log(Object.prototype.toString.call(arr1)); // [object Array]
console.log(Object.prototype.toString.call(str1)); // [object String]
console.log(Object.prototype.toString.call(obj1)); // [object Object]
console.log(Object.prototype.toString.call(null)); // [object Null]
```

总结：

1. 当我们使用一个函数需要改变 this 指向的时候才会用到 `call` `apply` `bind`
2. 如果你要传递的参数不多，则可以使用 fn.call(thisObj, arg1, arg2 ...)
3. 如果你要传递的参数很多，则可以用数组将参数整理好调用 fn.apply(thisObj, [arg1, arg2 ...])
4. 如果你想生成一个新的函数长期绑定某个函数给某个对象使用，则可以使用 const newFn = fn.bind(thisObj); newFn(arg1, arg2...)

参考文章：

- [call、apply、bind 的区别](https://www.jianshu.com/p/bbeadae6127e)
- [聊一聊 call、apply、bind 的区别](https://segmentfault.com/a/1190000012772040)

---

[理解 js 继承的 6 种方式](https://www.cnblogs.com/Grace-zyy/p/8206002.html)

---

**mouseenter 和 mouseover 的区别**

- 不论鼠标指针穿过被选元素或其子元素，都会触发 mouseover 事件，对应 mouseout。
- 只有在鼠标指针穿过被选元素时，才会触发 mouseenter 事件，对应 mouseleave。

---

**用正则表达式匹配字符串，以字母开头，后面是数字、字符串或者下划线，长度为 9 - 20**

```javascript
var re = new RegExp("^[a-zA-Z][a-zA-Z0-9_]{8,19}$");
```

---

**js 字符串两边截取空白的 trim 的原型方法的实现**

```javascript
// 删除左右两端的空格
function trim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, "");
}
// 删除左边的空格 /(^\s*)/g
// 删除右边的空格 /(\s*$)/g
```

---

**介绍一下你对浏览器内核的理解 ?**

内核主要分成两部分：渲染引擎(layout engineer 或 Rendering Engine) 和 JS 引擎。

渲染引擎

负责取得网页的内容（HTML、XML、图像等等）、整理讯息（例如加入 CSS 等），以及计算网页的显示方式，然后会输出至显示器或打印机。
浏览器的内核的不同对于网页的语法解释会有不同，所以渲染的效果也不相同。
所有网页浏览器、电子邮件客户端以及其它需要编辑、显示网络内容的应用程序都需要内核。

JS 引擎

解析和执行 javascript 来实现网页的动态效果。

最开始渲染引擎和 JS 引擎并没有区分的很明确，后来 JS 引擎越来越独立，内核就倾向于只指渲染引擎。

---

**哪些常见操作会造成内存泄漏 ？**

内存泄漏指任何对象在您不再拥有或需要它之后仍然存在。

垃圾回收器定期扫描对象，并计算引用了每个对象的其他对象的数量。如果一个对象的引用数量为 0（没有其他对象引用过该对象），或对该对象的惟一引用是循环的，那么该对象的内存即可回收。

- setTimeout 的第一个参数使用字符串而非函数的话，会引发内存泄漏。
- 闭包、控制台日志、循环（在两个对象彼此引用且彼此保留时，就会产生一个循环）。

---

**线程与进程的区别 ？**

- 一个程序至少有一个进程，一个进程至少有一个线程。
- 线程的划分尺度小于进程，使得多线程程序的并发性高。
- 另外，进程在执行过程中拥有独立的内存单元，而多个线程共享内存，从而极大地提高了程序的运行效率。

线程在执行过程中与进程还是有区别的。

- 每个独立的线程有一个程序运行的入口、顺序执行序列和程序的出口。但是线程不能够独立执行，必须依存在应用程序中，由应用程序提供多个线程执行控制。
- 从逻辑角度来看，多线程的意义在于一个应用程序中，有多个执行部分可以同时执行。
  但操作系统并没有将多个线程看做多个独立的应用，来实现进程的调度和管理以及资源分配。这就是进程和线程的重要区别。

---

**eval() 函数有什么用 ？**

eval() 函数可计算某个字符串，并执行其中的的 JavaScript 代码。

---

**实现一个方法，使得：add(2, 5) 和 add(2)(5) 的结果都为 7**

```javascript
var add = function(x, r) {
  if (arguments.length === 1) {
    return function(y) {
      return x + y;
    };
  } else {
    return x + r;
  }
};
console.log(add(2)(5)); // 7
console.log(add(2, 5)); // 7
```

---

**alert(1 && 2) 和 alert(1 || 0) 的结果是 ？**

alert(1 &&2 ) 的结果是 2

- 只要 “&&” 前面是 false，无论 “&&” 后面是 true 还是 false，结果都将返 “&&” 前面的值;
- 只要 “&&” 前面是 true，无论 “&&” 后面是 true 还是 false，结果都将返 “&&” 后面的值;

alert(0 || 1) 的结果是 1

- 只要 “||” 前面为 false，不管 “||” 后面是 true 还是 false，都返回 “||” 后面的值。
- 只要 “||” 前面为 true，不管 “||” 后面是 true 还是 false，都返回 “||” 前面的值。

> 只要记住 0 与 任何数都是 0，其他反推。

---

**下面的输出结果是 ？**

```javascript
var out = 25,
  inner = {
    out: 20,
    func: function() {
      var out = 30;
      return this.out;
    }
  };
console.log((inner.func, inner.func)());
console.log(inner.func());
console.log(inner.func());
console.log((inner.func = inner.func)());
```

结果：25，20，20，25

代码解析：这道题的考点分两个

1. 作用域
2. 运算符（赋值预算，逗号运算）

先看第一个输出：25，因为 ( inner.func, inner.func ) 是进行逗号运算符，逗号运算符就是运算前面的 ”,“ 返回最后一个，举个栗子

```javascript
var i = 0,
  j = 1,
  k = 2;
console.log((i++, j++, k)); // 返回的是 k 的值 2 ，如果写成 k++ 的话  这里返回的就是 3
console.log(i); // 1
console.log(j); // 2
console.log(k); // 2
```

回到原题 ( inner.func, inner.func ) 就是返回 inner.func ，而 inner.func 只是一个匿名函数

```javascript
function () {
    var out = 30;
    return this.out;
}
```

而且这个匿名函数是属于 window 的，则变成了

```javascript
(function() {
  var out = 30;
  return this.out;
})();
```

此刻的 this => window

所以 out 是 2
