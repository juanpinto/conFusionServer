const express = require('express');
const bodyParser = require('body-parser');

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
    .post((request, response, next) => {
        Leaders.create(request.body).then((leader) => {
            response.statusCode = 200;
            response.setHeader('Content-Type', 'application/json');
            response.json(leader);

        }, (error) => next(error))
            .catch((error) => next(error));
    })
    .put((request, response, next) => {
        response.statusCode = 403;
        response.end("Put operation not supported");
    })
    .delete((request, response, next) => {
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
    .post((request, response, next) => {
        response.statusCode = 403;
        response.end(`Pust operation not supported on: /leaders/${request.params.leaderId}`);
    })
    .put((request, response, next) => {
        Leaders.findByIdAndUpdate(request.params.leaderId, { $set: request.body }, { new: true }).then((leader) => {

            response.statusCode = 200;
            response.setHeader('Content-Type', 'application/json');
            response.json(leader);

        }, (error) => next(error))
            .catch((error) => next(error));
    })
    .delete((request, response, next) => {
        Leaders.findByIdAndRemove(request.params.leaderId).then((result) => {

            response.statusCode = 200;
            response.setHeader('Content-Type', 'application/json');
            response.json(result);

        }, (error) => next(error))
            .catch((error) => next(error));
    })

module.exports = leaderRouter;
