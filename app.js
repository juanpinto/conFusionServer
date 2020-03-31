const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const authenticate = require('./authenticate');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const dishRouter = require('./routes/dishRouter');
const leaderRouter = require('./routes/leaderRouter');
const promotionRouter = require('./routes/promotionRouter');

//This lines avoid using deprecated methods
mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);

const databaseLocation = 'mongodb://localhost:27017/conFusion';
const dbConnection = mongoose.connect(databaseLocation);

dbConnection.then(() => {
  console.log("Conected to MongoDB")
}, (error) => { console.log(error) })

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//When we use app.use we are basically defining our MIDDLEWARE.
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Adding cookie parser with secret.
//app.use(cookieParser('12345-67890-09876-54321'));

//Setting up express session
app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
}));

app.use(passport.initialize());
app.use(passport.session());
/**
 * We allow the user to access this API. Even if they are not authenticated.
 * We achive this by placing this route before the authenticateUser.
 * 
 * The code place in here is going to happen in order. so the following
 * routes will happen without even knowing that there is a MIDDLEWARE AUTH METHOD.
 */
app.use('/', indexRouter);
app.use('/users', usersRouter);

/** 
 * Before leting the client use the API or
 *  Any of the public data we want to make sure
 *  the user has access. We have to do this in our
 *  MIDDLEWARE.
 */

function authenticateUser(request, response, next) {
  console.log(request.session);

  //request.user is added by passport.
  if (!request.user) {
    var err = new Error('unauthorized');
    err.status = 403;
    return next(err);
  }
  else {
    next();
  }
}

app.use(authenticateUser);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/dishes', dishRouter);
app.use('/leaders', leaderRouter);
app.use('/promotions', promotionRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
