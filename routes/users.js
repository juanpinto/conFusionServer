const express = require('express');
const bodyParser = require('body-parser');
const Users = require('../models/user');
const passport = require('passport');
const authenticator = require('../authenticate');

const router = express.Router();
router.use(bodyParser.json())

/* GET users listing. */
router.get('/', function (request, response, next) {
    response.send('respond with a resource');
});

router.post('/signup', (request, response, next) => {
    Users.register(new Users({username: request.body.username}), request.body.password, (error, user, info) => {
        if (error) {
            response.statusCode = 500;
            response.setHeader('Content-Type', 'application/json');
            response.json({error: error});
        } else {
            passport.authenticate('local', (error, user, info) => {
                response.statusCode = 200;
                response.setHeader('Content-Type', 'application/json');
                response.json({success: true, user: user});
            })(request, response, next);
        }
    })
});

router.post('/login', passport.authenticate('local'), (request, response) => {
    const token = authenticator.getToken({_id: request.user.id});
    response.status = 200;
    response.setHeader('Content-Type', 'application/json');
    response.json({success: true, token: token});
});

router.get('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy();
        res.clearCookie('session-id');
        res.redirect('/');
    } else {
        var err = new Error('You are not logged in!');
        err.status = 403;
        next(err);
    }
});


module.exports = router;
