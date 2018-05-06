const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Promotions = require('../models/promotions');
const authenticate = require('../authenticate');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter
  .route('/')
  .get((req, res, next) => {
    Promotions.find({})
      .then(
        promos => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(promos);
        },
        err => next(err)
      )
      .catch(err => next(err));
  })
  .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promotions.create(req.body)
      .then(
        promo => {
          console.log(promo);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(promo);
        },
        err => next(err)
      )
      .catch(err => next(err));
  })
  .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    console.log('PUT operation not supported on /promotions');
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
  })
  .delete(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Promotions.remove({})
        .then(
          resp => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
          },
          err => next(err)
        )
        .catch(err => next(err));
    }
  );

promoRouter
  .route('/:promoId')
  .get((req, res, next) => {
    Promotions.findById(req.params.promoId)
      .then(
        promos => {
          console.log(promos);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(promos);
        },
        err => next(err)
      )
      .catch(err => next(err));
  })
  .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    console.log('POST operation not supported on /promotions');
    res.statusCode = 403;
    res.end('POST operation not supported on /promotions');
  })
  .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promotions.findByIdAndUpdate(
      req.params.promoId,
      { $set: req.body },
      { new: true }
    )
      .then(
        promo => {
          console.log(promo);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(promo);
        },
        err => next(err)
      )
      .catch(err => next(err));
  })
  .delete(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Promotions.findByIdAndRemove(req.params.promoId).then(resp => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
      });
    }
  );

module.exports = promoRouter;
