const express = require('express');
const bodyParser = require('body-parser');
const Users = require('../models/user')

const router = express.Router();
router.use(bodyParser.json())

/* GET users listing. */
router.get('/', function (request, response, next) {
  response.send('respond with a resource');
});

router.post('/signup', (request, response, next) => {
  console.log("This is a value");
  
  Users.findOne({ username: request.body.username }).then((user) => {
    if (user != null) {
      const error = new Error('username already taken');
      error.status = 403;
      next(error)
    } else {
      Users.create({
        username: request.body.username,
        password: request.body.password
      })
    }
  })
    .then((user) => {
      response.status = 200;
      response.setHeader('Content-Type', 'application/json');
      response.json({ status: true, user: user })
    }, (error) => next(error))
    .catch((error) => next(error))
});

router.post('/login', (request, response, next) => {

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

    Users.findOne({ username: username }).then((user) => {
      if (user === null) {
        var error = new Error('Invalid credentials');
        error.status = 401;
        next(error);
      } else if (user.password !== password) {
        var error = new Error('Invalid credentials');
        error.status = 401;
        next(error);
      } else if (user.username === username && user.password === password) {
        request.session.user = 'authenticated';
        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');
        response.json({ status: true, user: user })
      }
    })
      .catch((err) => next(err));
  } else {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/plain');
    response.end('You are already authenticated!');
  }
});

router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});


module.exports = router;
