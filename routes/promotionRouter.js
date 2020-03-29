const express = require('express');
const bodyParser = require('body-parser');

const promotionRouter = express.Router();

promotionRouter.use(bodyParser.json());

promotionRouter.route('/')
    .all((request, response, next) => {
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/plain');
        next()
    })
    .get((request, response, next) => {
        response.end('Will send all the promotions to you!');
    })
    .post((request, response, next) => {
        response.end(`Will add the promotion: ${request.body.name} with details: ${request.body.description}`);
    })
    .put((request, response, next) => {
        response.statusCode = 403;
        response.end("Put operation not supported");
    })
    .delete((request, response, next) => {
        response.end("Deleting all promotions");
    })

promotionRouter.route('/:promotionId')
    .all((request, response, next) => {
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/plain');
        next()
    })
    .get((request, response, next) => {
        response.end(`Will send detials of the promotion: ${request.params.promotionId}`);
    })
    .post((request, response, next) => {
        response.statusCode = 403;
        response.end(`Pust operation not supported on: /promotions/${request.params.promotionId}`);
    })
    .put((request, response, next) => {
        //write adds a line to the response
        response.write(`Will update the promotion: ${request.params.promotionId}\n`)
        response.end(`Will add the promotion: ${request.body.name} with details: ${request.body.description}`);
    })
    .delete((request, response, next) => {
        response.end(`Will delete the promotion: ${request.params.promotionId}`);
    })

module.exports = promotionRouter;
