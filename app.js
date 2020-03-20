const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')
const session = require('express-session')
require('./db/connect');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/usersRouter');
const testRouter = require('./routes/testRouter')
const daysRouter = require('./routes/daysRouter')
const { userRes } = require('./utils/response')

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  maxAge: '1728000',
}
app.use(cors(corsOptions)) // 跨域访问和cookie设置
// 配置session
app.use(session({
  secret: 'jkhahahhahah',
  resave: false,
  saveUninitialized: true,
  cookie: {
    path: '/', httpOnly: true, secure: false, maxAge: null,
  },
}))
// 公共静态资源
app.use(express.static(path.join(__dirname, 'public')));
// 服务器主页
app.use('/', indexRouter);
// 用户路由
app.use('/users', usersRouter);
// 拦截器，确定用户登录状态
app.use((req, res, next) => {
  const { login } = req.session;
  if (login) {
    next()
  } else {
    res.send(userRes(-998, '未登录，请先登录'))
  }
})
// 测试路由
app.use('/test', testRouter);
app.use('/days', daysRouter)
// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
