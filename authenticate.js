var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');

var jwt = require('jsonwebtoken');
var ExtractJwt = require('passport-jwt').ExtractJwt;
var JwtStrategy = require('passport-jwt').Strategy;

var config = require('./config');
var FacebookTokenStrategy = require('passport-facebook-token');

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Creates JSON Token and returns to User
exports.getToken = user => {
  return jwt.sign(user, config.secretKey, { expiresIn: 3600 });
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

// Checks the JSON token is authentic
exports.jwtPassport = passport.use(
  new JwtStrategy(opts, (jwt_payload, done) => {
    User.findOne({ _id: jwt_payload._id }, (err, user) => {
      if (err) {
        return done(err, false);
      } else if (user) {
        return done(null, user);
      }
      return done(null, false);
    });
  })
);

// Calls the previous step (exports.jwtPassport) | to be used in Routes
exports.verifyUser = passport.authenticate('jwt', { session: false });

// #############################################################################
// Above function can also be implemented this way
// exports.verifyUser = function(req, res, next) {
//   var token =
//     req.body.token || req.query.token || req.headers['x-access-token'];
//   if (token) {
//     jwt.verify(token, config.secretKey, function(err, decoded) {
//       if (err) {
//         var err = new Error('You are not authenticated!');
//         err.status = 401;
//         return next(err);
//       } else {
//         req.decoded = decoded;
//         next();
//       }
//     });
//   } else {
//     var err = new Error('No token provided!');
//     err.status = 403;
//     return next(err);
//   }
// };
// #############################################################################

// Checks whether user is admin or not
exports.verifyAdmin = (req, res, next) => {
  if (req.user.admin) {
    return next();
  }
  var err = new Error('unauthorized');
  err.status = 403;
  next(err);
};

exports.facebookPassport = passport.use(
  new FacebookTokenStrategy(
    {
      clientID: config.facebook.clientId,
      clientSecret: config.facebook.clientSecret
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ facebookId: profile.id }, (err, user) => {
        console.log(profile);
        if (err) {
          return done(err, false);
        }
        if (!err && user != null) {
          return done(null, user);
        } else {
          user = new User({ username: profile.displayName });
          user.facebookId = profile.id;
          user.firstName = profile.name.givenName;
          user.lastName = profile.name.familyName;
          user.save((err, user) => {
            if (err) {
              return done(err, false);
            } else {
              return done(null, user);
            }
          });
        }
      });
    }
  )
);
