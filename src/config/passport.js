const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../models').User;

const options = {
  secretOrKey: process.env.JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const startegy = new JwtStrategy(options, (payload, done) => {
  User.findOne({
    where: {
      id: payload.id,
    },
  })
    .then((user) => {
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    })
    .catch((err) => done(err, false));
});

module.exports = (passport) => {
  passport.use(startegy);
};
