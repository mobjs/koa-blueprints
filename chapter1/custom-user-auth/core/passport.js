const passport = require('koa-passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const mongoose = require('mongoose').model('User');

const config = require('../config')();

function authFail(done) {
  done(null, false, { message: 'Incorrent email/password combination' });
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, done);
});

passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
  User.findOne({
    email: email
  }, function(err, user) {
    if (err) return done(err);
    if (!user) {
      return authFail(done);
    }
    if (!user.validPassword(password)) {
      return authFail(done);
    }
    return done(null, user);
  });
}));

function tryRegisteringWith(authProvider, profile, cb, error) {
  var search = {};
  search[authProvider] = profile.id;
  User.findOne(search, function(err, existingUser) {
    if (existingUser) return cb(existingUser, null);
    User.findOne({ email: profile._json.email }, function(err, existingEmailUser) {
      if (existingEmailUser) return error('There is already an account using this email address'); 
      var user = new User();
      console.log(profile._json.email);
      user.email = profile._json.email;
      user[authProvider] = profile.id;
      cb(null, user);
    });
  });
}

passport.use(new GitHubStrategy(config.github, (accessToken, refreshToken, profile, done) => {
  tryRegisteringWith('github', profile, function(existingUser, user) {
    if (existingUser) return done(null, existingUser);
    user.tokens.push({ kind: 'github', accessToken: accessToken });
    user.profile.name = profile.displayName;
    user.profile.picture = profile._json.avatar_url;
    user.profile.location = profile._json.location;
    user.profile.website = profile._json.blog;
    user.save(function(err) {
      done(err, user);
    });
  }, done);
}));

module.exports = passport;
