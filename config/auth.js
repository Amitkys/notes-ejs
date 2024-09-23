// config/auth.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User'); // Import the User model

// Passport configuration
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id); // findById returns a Promise
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
  

passport.use(new GoogleStrategy({
  clientID: '48121057593-bbbmeb7nrm2a0si114decbnetit58e80.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: '/auth/google/callback',
  passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    // Check if the user already exists
    let user = await User.findOne({ googleId: profile.id });

    // If user doesn't exist, create a new user
    if (!user) {
      user = await new User({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        avatar: profile.photos[0].value
      }).save();
    }

    done(null, user);
  } catch (err) {
    done(err, false);
  }
}));

module.exports = passport;
