const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Leaders = require('../models/leaders')

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.get((req,res,next) => {
    Leaders.find({})
    .then((ldrs) => {
        console.log(ldrs);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(ldrs);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    Leaders.create(req.body)
    .then((ldr) => {
        console.log(ldr);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(ldr);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    console.log('PUT operation not supported on /leaders');
    res.statusCode = 403;
    res.end('PUT operation not supported on /leaders');
})
.delete((req, res, next) => {
    Leaders.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

leaderRouter.route('/:leaderId')
.get((req,res,next) => {
    Leaders.findById(req.params.leaderId)
    .then((ldr) => {
        console.log(ldr);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(ldr);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    console.log('POST operation not supported on /leaders');
    res.statusCode = 403;
    res.end('POST operation not supported on /leaders');
})
.put((req, res, next) => {
    Leaders.findByIdAndUpdate(req.params.leaderId, {$set: req.body}, {new: true})
    .then((ldr) => {
        console.log(ldr);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(ldr);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) => {
    Leaders.findByIdAndRemove(req.params.leaderId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = leaderRouter;
