const express = require('express');
const bodyParser = require('body-parser');
const authenticator = require('../authenticate');
const Promotions = require('../models/promotion');

const promotionRouter = express.Router();

promotionRouter.use(bodyParser.json());

promotionRouter.route('/')
    .get((request, response, next) => {
        Promotions.find({}).then((promotions) => {

            response.statusCode = 200;
            response.setHeader('Content-Type', 'application/json');
            response.json(promotions);

        }, (error) => next(error))
            .catch((error) => next(error));
    })
    .post(authenticator.verifyUser, (request, response, next) => {
        Promotions.create(request.body).then((promotion) => {
            response.statusCode = 200;
            response.setHeader('Content-Type', 'application/json');
            response.json(promotion);

        }, (error) => next(error))
            .catch((error) => next(error));
    })
    .put(authenticator.verifyUser, (request, response, next) => {
        response.statusCode = 403;
        response.end("Put operation not supported");
    })
    .delete(authenticator.verifyUser, (request, response, next) => {
        Promotions.deleteMany({}).then((result) => {

            response.statusCode = 200;
            response.setHeader('Content-Type', 'application/json');
            response.json(result);

        }, (error) => next(error))
            .catch((error) => next(error));
    })

promotionRouter.route('/:promotionId')
    .get((request, response, next) => {
        Promotions.findById(request.params.promotionId).then((promotion) => {

            response.statusCode = 200;
            response.setHeader('Content-Type', 'application/json');
            response.json(promotion);

        }, (error) => next(error))
            .catch((error) => next(error));
    })
    .post(authenticator.verifyUser, (request, response, next) => {
        response.statusCode = 403;
        response.end(`Pust operation not supported on: /dishes/${request.params.promotionId}`);
    })
    .put(authenticator.verifyUser, (request, response, next) => {
        Promotions.findByIdAndUpdate(request.params.promotionId, {$set: request.body}, {new: true}).then((promotion) => {

            response.statusCode = 200;
            response.setHeader('Content-Type', 'application/json');
            response.json(promotion);

        }, (error) => next(error))
            .catch((error) => next(error));
    })
    .delete(authenticator.verifyUser, (request, response, next) => {
        Promotions.findByIdAndRemove(request.params.promotionId).then((result) => {

            response.statusCode = 200;
            response.setHeader('Content-Type', 'application/json');
            response.json(result);

        }, (error) => next(error))
            .catch((error) => next(error));
    })

module.exports = promotionRouter;
