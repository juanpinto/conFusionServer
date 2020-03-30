const express = require('express');
const bodyParser = require('body-parser');
const Dishes = require('../models/dish');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')
    .get((request, response, next) => {
        Dishes.find({}).then((dishes) => {

            response.statusCode = 200;
            response.setHeader('Content-Type', 'application/json');
            response.json(dishes);

        }, (error) => next(error))
            .catch((error) => next(error));
    })
    .post((request, response, next) => {
        Dishes.create(request.body).then((dish) => {
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
        Dishes.deleteMany({}).then((result) => {

            response.statusCode = 200;
            response.setHeader('Content-Type', 'application/json');
            response.json(result);

        }, (error) => next(error))
            .catch((error) => next(error));
    })

dishRouter.route('/:dishId')
    .get((request, response, next) => {
        Dishes.findById(request.params.dishId).then((dish) => {

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
        Dishes.findByIdAndUpdate(request.params.dishId, { $set: request.body }, { new: true }).then((dish) => {

            response.statusCode = 200;
            response.setHeader('Content-Type', 'application/json');
            response.json(dish);

        }, (error) => next(error))
            .catch((error) => next(error));
    })
    .delete((request, response, next) => {
        Dishes.findByIdAndRemove(request.params.dishId).then((result) => {

            response.statusCode = 200;
            response.setHeader('Content-Type', 'application/json');
            response.json(result);

        }, (error) => next(error))
            .catch((error) => next(error));
    })


//COMMENTS ROUTES

dishRouter.route('/:dishId/comments')
    .get((request, response, next) => {
        Dishes.findById(request.params.dishId).then((dish) => {

            if (dish != null) {
                response.statusCode = 200;
                response.setHeader('Content-Type', 'application/json');
                response.json(dish.comments);
            } else {
                error = new Error(`dish ${request.params.dishId} not found`);
                error.statusCode = 404;
                return next(error)
            }

        }, (error) => next(error))
            .catch((error) => next(error));
    })
    .post((request, response, next) => {
        Dishes.findById(request.params.dishId).then((dish) => {
            if (dish != null) {
                dish.comments.push(request.body)
                dish.save().then((dish) => {
                    response.statusCode = 200;
                    response.setHeader('Content-Type', 'application/json');
                    response.json(dish.comments);
                })
            } else {
                error = new Error(`dish ${request.params.dishId} not found`);
                error.statusCode = 404;
                return next(error)
            }

        }, (error) => next(error))
            .catch((error) => next(error));
    })
    .put((request, response, next) => {
        response.statusCode = 403;
        response.end("Put operation not supported");
    })
    .delete((request, response, next) => {
        Dishes.findById(request.params.dishId).then((dish) => {
            if (dish != null) {
                for (var i = (dish.comments.length - 1); i >= 0; i--) {
                    dish.comments.id(dish.comments[i]._id).remove();
                }
                dish.save().then((dish) => {
                    response.statusCode = 200;
                    response.setHeader('Content-Type', 'application/json');
                    response.json(dish.comments);
                })
            } else {
                error = new Error(`dish ${request.params.dishId} not found`);
                error.statusCode = 404;
                return next(error)
            }

        }, (error) => next(error))
            .catch((error) => next(error));
    })

dishRouter.route('/:dishId/comments/:commentId')
    .get((request, response, next) => {
        Dishes.findById(request.params.dishId).then((dish) => {

            if (dish != null && dish.comments.id(request.params.commentId)) {
                response.statusCode = 200;
                response.setHeader('Content-Type', 'application/json');
                response.json(dish.comments.id(request.params.commentId));

            } else if (dish == null) {
                error = new Error(`dish ${request.params.dishId} not found`);
                error.statusCode = 404;
                return next(error)
            } else {
                error = new Error(`comment ${request.params.commentId} not found`);
                error.statusCode = 404;
                return next(error)
            }

        }, (error) => next(error))
            .catch((error) => next(error));
    })
    .post((request, response, next) => {
        response.statusCode = 403;
        response.end(`Pust operation not supported on: /dishes/${request.params.dishId}/comments/${request.params.commentId}`);
    })
    .put((request, response, next) => {
        Dishes.findById(request.params.dishId).then((dish) => {

            if (dish != null && dish.comments.id(request.params.commentId)) {
                if (request.body.rating) {
                    dish.comments.id(request.params.commentId).rating = request.body.rating
                }
                if (request.body.comment) {
                    dish.comments.id(request.params.commentId).comment = request.body.comment
                }
                dish.save().then((dish) => {
                    response.statusCode = 200;
                    response.setHeader('Content-Type', 'application/json');
                    response.json(dish.comments.id(request.params.commentId));
                })
            } else if (dish == null) {
                error = new Error(`dish ${request.params.dishId} not found`);
                error.statusCode = 404;
                return next(error)
            } else {
                error = new Error(`comment ${request.params.commentId} not found`);
                error.statusCode = 404;
                return next(error)
            }


        }, (error) => next(error))
            .catch((error) => next(error));
    })
    .delete((request, response, next) => {
        Dishes.findById(request.params.dishId).then((dish) => {
            if (dish != null && dish.comments.id(request.params.commentId)) {
                dish.comments.id(request.params.commentId).remove()

                dish.save().then((dish) => {
                    response.statusCode = 200;
                    response.setHeader('Content-Type', 'application/json');
                    response.json(dish.comments.id(request.params.commentId));
                })
            } else if (dish == null) {
                error = new Error(`dish ${request.params.dishId} not found`);
                error.statusCode = 404;
                return next(error)
            } else {
                error = new Error(`comment ${request.params.commentId} not found`);
                error.statusCode = 404;
                return next(error)
            }

        }, (error) => next(error))
            .catch((error) => next(error));
    })

module.exports = dishRouter;
