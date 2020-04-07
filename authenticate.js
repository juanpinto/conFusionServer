const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Users = require('./models/user');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const JsonWebToken = require('jsonwebtoken');
const config = require('./config')

exports.local = passport.use('local', new LocalStrategy(Users.authenticate()));
passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());

exports.getToken = function (user) {
    return JsonWebToken.sign(user, config.secretKey, {expiresIn: 86400 * 100});
};

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.secretKey
};

exports.jwtPassport = passport.use(new JwtStrategy(options, (jwt_payload, done) => {
    console.log('JWT Payload', jwt_payload)
    Users.findOne({_id: jwt_payload._id}, (error, user) => {
        if (error) {
            return done(error, false);
        } else if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    })
}));

exports.verifyUser = passport.authenticate('jwt', {session: false});

exports.verifyAdmin = function (request, response, next) {
    if (request.user.admin) {
        return next();
    } else if (!request.user.admin) {
        const error = new Error("You are not authorized to perform this operation!");
        error.status = 403;
        return next(error);
    }
};