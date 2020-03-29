const express = require('express');
const bodyParser = require('body-parser');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')
    .all((request, response, next) => {
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/plain');
        //this calls the execution of the next /dishes method.
        //in this case, it will pass the reques to the get, post, put or delete method.
        //Sending the modified object.

        //The methods are executed sequentially 
        next()
    })
    .get((request, response, next) => {
        response.end('Will send all the dishes to you!');
    })
    .post((request, response, next) => {
        response.end(`Will add the dish: ${request.body.name} with details: ${request.body.description}`);
    })
    .put((request, response, next) => {
        response.statusCode = 403;
        response.end("Put operation not supported");
    })
    .delete((request, response, next) => {
        response.end("Deleting all dishes");
    })

dishRouter.route('/:dishId')
    .all((request, response, next) => {
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/plain');
        next()
    })
    .get((request, response, next) => {
        response.end(`Will send detials of the dish: ${request.params.dishId}`);
    })
    .post((request, response, next) => {
        response.statusCode = 403;
        response.end(`Pust operation not supported on: /dishes/${request.params.dishId}`);
    })
    .put((request, response, next) => {
        //write adds a line to the response
        response.write(`Will update the dish: ${request.params.dishId}\n`)
        response.end(`Will add the dish: ${request.body.name} with details: ${request.body.description}`);
    })
    .delete((request, response, next) => {
        response.end(`Will delete the dish: ${request.params.dishId}`);
    })

module.exports = dishRouter;
