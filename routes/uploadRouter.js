const express = require('express');
const bodyParser = require('body-parser');
const authenticator = require('../authenticate');
const multer = require('multer');

const fileStorage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, 'public/images');
    },
    filename: (request, file, callback) => {
        callback(null, file.originalname)
    }
});

const fileFilter = (request, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return callback(new Error('Invalid file format'), false)
    }
    callback(null, true)
};
const upload = multer({storage: fileStorage, fileFilter: fileFilter});

const uploadRouter = express.Router();

uploadRouter.use(bodyParser.json());

uploadRouter.route('/')
    .get(authenticator.verifyUser, authenticator.verifyAdmin, (request, response, next) => {
        response.statusCode = 403;
        response.end("Get operation not supported");
    })
    .post(authenticator.verifyUser, authenticator.verifyAdmin, upload.single('imageFile'), (request, response, next) => {
        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');
        response.json(request.file)
    })
    .put(authenticator.verifyUser, authenticator.verifyAdmin, (request, response, next) => {
        response.statusCode = 403;
        response.end("Put operation not supported");
    })
    .delete(authenticator.verifyUser, authenticator.verifyAdmin, (request, response, next) => {
        response.statusCode = 403;
        response.end("Delete operation not supported");
    });

module.exports = uploadRouter;
