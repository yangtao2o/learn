# Connect

Connect 是一个基于HTTP服务器的工具集，成为中间件（middleware）。

中间件，其实就是一个简单的JavaScript函数。除了处理req和res对象之外，还接受一个next函数来做流控制。

## 一个简单的网站

初始化：

```js
var http = require('http');
var connect = require('connect');
var serveStatic = require('serve-static');
var path = require('path');

var app = connect();

app.use(serveStatic(path.join(__dirname, 'public-optimized')))
app.use(serveStatic(path.join(__dirname, 'public')))

// respond to all requests
app.use(function(req, res){
  res.end('Hello from Connect!\n');
});

//create node.js http server and listen on port
http.createServer(app).listen(3000);
```

中间件的使用，模拟登录登出：

```js
var http = require('http');
var connect = require('connect');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var users = require('./config/users.json');

var app = connect();

// logger
app.use(morgan('dev'));

// parse an HTML body into a string
app.use(bodyParser());

app.use(cookieParser());

app.use(session({
  secret: 'my site secret'
}));

app.use(function(req, res, next) {
  if('/' == req.url && req.session.logged_in) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(`Welcome back, <b>${req.session.name}</b><a href="/logout">Logout</a>`);
  } else {
    next();
  }
});

app.use(function(req, res, next) {
  if('/' == req.url && 'GET' == req.method) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end([
      '<form method="POST" action="/login">',
        '<h1>Login</h1>',
        '<fieldset>',
          '<label>Please log in</label>',
          'Username: <input type="text" name="user" /><br>',
          'Password: <input type="password" name="password" />',
          '<p><button>Submit</button></p>',
        '</fieldset>',
      '</form>'
    ].join(''));
  } else {
    next();
  }
});

app.use(function(req, res, next) {
  if('/login' == req.url && 'POST' == req.method) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    if(!users[req.body.user] || req.body.password != users[req.body.user].password) {
      res.end('Bad username/password<br><a href="/">Back</a>');
    } else {
      req.session.logged_in = true;
      req.session.name = users[req.body.user].name;
      res.end('Success!');
    }
  } else {
    next();
  }
});

app.use(function(req, res, next) {
  if('/logout' == req.url) {
    req.session.logged_in = false;
    res.writeHead(200);
    res.end('Logged out!');
  } else {
    next();
  }
})

//create node.js http server and listen on port
http.createServer(app).listen(3000);
```
