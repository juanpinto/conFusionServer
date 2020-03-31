const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const FileStore = require('session-file-store')(session);

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

/** 
 * Before leting the client use the API or
 *  Any of the public data we want to make sure
 *  the user has access. We have to do this in our
 *  MIDDLEWARE.
 */

function authenticateUser(request, response, next) {
  console.log(request.session);

  if (!request.session.user) {

    var authHeader = request.headers.authorization;
    if (!authHeader) {
      var error = new Error('Unauthorized');
      response.setHeader('WWW-Authenticate', 'Basic');
      error.status = 401;
      next(error);
      return;
    }

    var authCredentials = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    var username = authCredentials[0];
    var password = authCredentials[1];

    if (username == 'admin' && password == 'password') {
      request.session.user = 'admin';
      next();
    } else {
      var error = new Error('Unauthorized');
      response.setHeader('WWWW-Authenticate', 'Basic');
      error.status = 401;
      next(error);
    }
  } else {
    if (request.session.user == 'admin') {
      next();
    } else {
      var error = new Error('Unauthorized');
      error.status = 401;
      next(error);
    }
  }
}

app.use(authenticateUser);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
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
