require('./models/bdd');

var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use((req, res, next) => {
 res.header("Access-Control-Allow-Origin", '*');
 res.header("Access-Control-Allow-Credentials", true);
 res.header('Access-Control-Allow-Methods', '*');
 res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
 next();
});

passport.use(new FacebookStrategy({
    clientID: "2466813596883904",
    clientSecret: "6a7895df1dbc2961d09725b1fbe98c0a",
    callbackURL: 'https://locapic-capsule-bc.herokuapp.com/auth/facebook/callback',

    profileFields: ['id', 'first_name', 'last_name', 'email'],

    passReqToCallback: true

  },
  function(req, accessToken, refreshToken, profile, done) {

    var state = JSON.parse(req.query.state);
    var mergeData = {...profile._json, redirectUrl : state.redirectUrl};
    console.log('log de state', state);

    return done(null, mergeData);

  }));

app.use(passport.initialize());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
