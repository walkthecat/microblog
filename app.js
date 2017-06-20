var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var settings = require('./settings');
var session = require("express-session");
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var fs = require('fs');
var fileStreamRotator = require('file-stream-rotator')

//判断目标文件夹是否存在
var logDirectory = path.join(__dirname, 'log')
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

// create a rotating write stream
var accessLogfile = fileStreamRotator.getStream({
  date_format: 'YYYYMMDD',
  filename: path.join(logDirectory, 'access-%DATE%.log'),
  frequency: 'daily',
  verbose: false
});
var errorLogfile = fileStreamRotator.getStream({
  date_format: 'YYYYMMDD',
  filename: path.join(logDirectory, 'error-%DATE%.log'),
  frequency: 'daily',
  verbose: false
});

var index = require('./routes/index');
var users = require('./routes/users');
var hello = require('./routes/hello');
var list = require('./routes/list');
var post = require('./routes/post');
var login = require('./routes/login');
var doLogin = require('./routes/doLogin');
var reg = require('./routes/reg');
var doReg = require('./routes/doReg');
var logout = require('./routes/logout');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//是否使用生产模式
//app.set('env', 'production');

app.use(partials());
app.use(flash());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

//自定义日志格式
logger.token('zdate', function(req, res){
    return new Date().toLocaleString() || '-';
});
logger.format('J', '[J] :remote-addr - :remote-user [:zdate] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"')
app.use(logger('dev'));
//增加访问日志
app.use(logger('J', {
  stream: accessLogfile
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: settings.cookieSecret,
  key: settings.db,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 30
  }, //30 days
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({
    url: 'mongodb://localhost/microblog'
  })
}));

app.use('/', index);
//app.use('/users', users);
app.use('/u', users);
//app.use('/hello', hello);
//app.use('/list', list); 
app.use('/post', checkLogin);
app.use('/post', post);
app.use('/reg', checkNotLogin);
app.use('/reg', reg);
app.use('/reg', doReg);
app.use('/login', checkNotLogin);
app.use('/login', login);
app.use('/login', doLogin);
app.use('/logout', checkLogin);
app.use('/logout', logout);

app.use(function (req, res, next) {
  console.log(req.session.user);
  res.locals.user = req.session.user;
  res.locals.post = req.session.post;
  var error = req.flash('error');
  res.locals.error = error.length ? error : null;

  var success = req.flash('success');
  res.locals.success = success.length ? success : null;
  next;
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  //增加错误日志
  var meta = '[' + new Date().toLocaleString() + '] ' + req.url + '\n';
  errorLogfile.write(meta + err.stack + '\n');

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

function checkLogin(req, res, next) {
  if (!req.session.user) {
    req.flash('error', '未登入');
    return res.redirect('/login');
  }
  next();
}

function checkNotLogin(req, res, next) {
  if (req.session.user) {
    req.flash('error', '已登入');
    return res.redirect('/');
  }
  next();
}

module.exports = app;