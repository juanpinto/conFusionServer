const express = require('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
    .all((request, response, next) => {
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/plain');
        next()
    })
    .get((request, response, next) => {
        response.end('Will send all the leaders to you!');
    })
    .post((request, response, next) => {
        response.end(`Will add the leader: ${request.body.name} with details: ${request.body.description}`);
    })
    .put((request, response, next) => {
        response.statusCode = 403;
        response.end("Put operation not supported");
    })
    .delete((request, response, next) => {
        response.end("Deleting all leaders");
    })

leaderRouter.route('/:leaderId')
    .all((request, response, next) => {
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/plain');
        next()
    })
    .get((request, response, next) => {
        response.end(`Will send detials of the leader: ${request.params.leaderId}`);
    })
    .post((request, response, next) => {
        response.statusCode = 403;
        response.end(`Pust operation not supported on: /leaders/${request.params.leaderId}`);
    })
    .put((request, response, next) => {
        //write adds a line to the response
        response.write(`Will update the leader: ${request.params.leaderId}\n`)
        response.end(`Will add the leader: ${request.body.name} with details: ${request.body.description}`);
    })
    .delete((request, response, next) => {
        response.end(`Will delete the leader: ${request.params.leaderId}`);
    })

module.exports = leaderRouter;
