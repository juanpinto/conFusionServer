const express = require('express');
const bodyParser = require('body-parser');
const authenticator = require('../authenticate');
const Leaders = require('../models/leader');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
    .get((request, response, next) => {
        Leaders.find({}).then((leaders) => {

            response.statusCode = 200;
            response.setHeader('Content-Type', 'application/json');
            response.json(leaders);

        }, (error) => next(error))
            .catch((error) => next(error));
    })
    .post(authenticator.verifyUser, authenticator.verifyAdmin, (request, response, next) => {
        Leaders.create(request.body).then((leader) => {
            response.statusCode = 200;
            response.setHeader('Content-Type', 'application/json');
            response.json(leader);

        }, (error) => next(error))
            .catch((error) => next(error));
    })
    .put(authenticator.verifyUser, authenticator.verifyAdmin, (request, response, next) => {
        response.statusCode = 403;
        response.end("Put operation not supported");
    })
    .delete(authenticator.verifyUser, authenticator.verifyAdmin, (request, response, next) => {
        Leaders.deleteMany({}).then((result) => {

            response.statusCode = 200;
            response.setHeader('Content-Type', 'application/json');
            response.json(result);

        }, (error) => next(error))
            .catch((error) => next(error));
    })

leaderRouter.route('/:leaderId')
    .get((request, response, next) => {
        Leaders.findById(request.params.leaderId).then((leader) => {

            response.statusCode = 200;
            response.setHeader('Content-Type', 'application/json');
            response.json(leader);

        }, (error) => next(error))
            .catch((error) => next(error));
    })
    .post(authenticator.verifyUser, authenticator.verifyAdmin, (request, response, next) => {
        response.statusCode = 403;
        response.end(`Pust operation not supported on: /leaders/${request.params.leaderId}`);
    })
    .put(authenticator.verifyUser, authenticator.verifyAdmin, (request, response, next) => {
        Leaders.findByIdAndUpdate(request.params.leaderId, {$set: request.body}, {new: true}).then((leader) => {

            response.statusCode = 200;
            response.setHeader('Content-Type', 'application/json');
            response.json(leader);

        }, (error) => next(error))
            .catch((error) => next(error));
    })
    .delete(authenticator.verifyUser, authenticator.verifyAdmin, (request, response, next) => {
        Leaders.findByIdAndRemove(request.params.leaderId).then((result) => {

            response.statusCode = 200;
            response.setHeader('Content-Type', 'application/json');
            response.json(result);

        }, (error) => next(error))
            .catch((error) => next(error));
    });

module.exports = leaderRouter;
