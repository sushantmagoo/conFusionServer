var express = require('express');
var bodyParser = require('body-parser');
var User = require('../models/user');
var passport = require('passport');
var authenticate = require('../authenticate');

var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get(
  '/',
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  (req, res, next) => {
    User.find({}).then(users => {
      if (!users) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.json('not found');
        return;
      } else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(users);
        return;
      }
    });
  }
);

router.post('/signup', (req, res, next) => {
  if (req.body.firstName && req.body.lastName) {
    User.register(
      new User({ username: req.body.username }),
      req.body.password,
      (err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({ err: err });
        } else {
          user.firstName = req.body.firstName;
          user.lastName = req.body.lastName;
          user.save((err, user) => {
            if (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.json({ err: err });
              return;
            }
            passport.authenticate('local')(req, res, () => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json({ success: true, status: 'Registration Successful!' });
              return;
            });
          });
        }
      }
    );
  } else {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.json({
      success: false,
      status: 'username & password fields are mandatory'
    });
    return;
  }
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  var token = authenticate.getToken({ _id: req.user._id });
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({
    success: true,
    token,
    status: 'You are successfully logged in!'
  });
});

router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  } else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});

module.exports = router;
