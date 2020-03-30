const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Dish = require('../models/dish');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')
    .get((request, response, next) => {
        Dish.find({}).then((dishes) => {

            response.statusCode = 200;
            response.setHeader('Content-Type', 'application/json');
            response.json(dishes);

        }, (error) => next(error))
            .catch((error) => next(error));
    })
    .post((request, response, next) => {
        Dish.create(request.body).then((dish) => {
            console.log('Dish created:', dish);

            response.statusCode = 200;
            response.setHeader('Content-Type', 'application/json');
            response.json(dish);

        }, (error) => next(error))
            .catch((error) => next(error));
    })
    .put((request, response, next) => {

        response.statusCode = 403;
        response.end("Put operation not supported");
    })
    .delete((request, response, next) => {
        Dish.deleteMany({}).then((result) => {

            response.statusCode = 200;
            response.setHeader('Content-Type', 'application/json');
            response.json(result);

        }, (error) => next(error))
            .catch((error) => next(error));
    })

dishRouter.route('/:dishId')
    .get((request, response, next) => {
        Dish.findById(request.params.dishId).then((dish) => {

            response.statusCode = 200;
            response.setHeader('Content-Type', 'application/json');
            response.json(dish);

        }, (error) => next(error))
            .catch((error) => next(error));
    })
    .post((request, response, next) => {
        response.statusCode = 403;
        response.end(`Pust operation not supported on: /dishes/${request.params.dishId}`);
    })
    .put((request, response, next) => {
        Dish.findByIdAndUpdate(request.params.dishId, { $set: request.body }, { new: true }).then((dish) => {

            response.statusCode = 200;
            response.setHeader('Content-Type', 'application/json');
            response.json(dish);

        }, (error) => next(error))
        .catch((error) => next(error));
    })
    .delete((request, response, next) => {
        Dish.findByIdAndRemove(request.params.dishId).then((result) => {

            response.statusCode = 200;
            response.setHeader('Content-Type', 'application/json');
            response.json(result);
            
        }, (error) => next(error))
            .catch((error) => next(error));
    })

module.exports = dishRouter;
