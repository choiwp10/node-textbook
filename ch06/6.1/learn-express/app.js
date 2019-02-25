const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('secret code'));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: 'secret code',
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));
app.use(flash());

app.use((req, res, next) => {
  console.log('첫 번째 미들웨어');
  next();
});

app.use((req, res, next) => {
  console.log('두 번째 미들웨어');
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use((req, res, next) => {
  res.status(404).send('NOT FOUND');
});

app.use(function(err, req, res, next) {
  console.log(err);
  res.status(500).send('SERVER ERROR');
});

module.exports = app;