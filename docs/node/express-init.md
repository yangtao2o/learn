# Express、Koa 初始化

## express 初始化

```js
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

// 加载路由控制
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

// 创建实例
var app = express();

// 创建 ejs 模板引擎即模板文件位置
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
// 定义日志和输出级别
app.use(logger("dev"));
// JSON 解析中间件
app.use(express.json());
// application/x-www-form-urlencode请求解析中间件
app.use(express.urlencoded({ extended: false }));
// 定义cookie解析器
app.use(cookieParser());
// HTTP 伪造中间件
app.use(express.methodOverride());
// 定义静态文件目录
app.use(express.static(path.join(__dirname, "public")));

// 匹配路径和路由
app.use("/", indexRouter);

// 404 错误处理
app.use(function(req, res, next) {
  next(createError(404));
});

// 500 错误处理及错误堆栈跟踪
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
```

## Koa 初始化

```js
const Koa = require("koa");
const app = new Koa();
const views = require("koa-views");
const json = require("koa-json");
const onerror = require("koa-onerror");
const bodyparser = require("koa-bodyparser");
const logger = require("koa-logger");
const fs = require("fs");
const path = require("path");
const session = require("koa-generic-session");
const redisStore = require("koa-redis");
const morgan = require("koa-morgan");

const index = require("./routes/index");
const users = require("./routes/users");
const user = require("./routes/user");
const blog = require("./routes/blog");

const ENV = app.env;

// error handler
onerror(app);

// middlewares
app.use(
  bodyparser({
    enableTypes: ["json", "form", "text"]
  })
);
app.use(json());

// create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "./logs", "access.log"),
  {
    flags: "a"
  }
);

// setup the logger
if (ENV === "dev" || ENV === "test") {
  app.use(morgan("dev"));
} else {
  app.use(
    morgan("combined", {
      stream: accessLogStream
    })
  );
}

app.use(require("koa-static")(__dirname + "/public"));

app.use(
  views(__dirname + "/views", {
    extension: "ejs"
  })
);

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// session
app.keys = ["Xam_is195#*^0"];
app.use(
  session({
    cookie: {
      path: "/",
      httpOnly: true,
      maxAge: "24 * 60 * 60 * 1000"
    },
    store: redisStore()
  })
);

// routes
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());
app.use(user.routes(), index.allowedMethods());
app.use(blog.routes(), index.allowedMethods());

// error-handling
app.on("error", (err, ctx) => {
  console.error("server error", err, ctx);
});

module.exports = app;
```
