const passport = require('../core/passport');
var User = require('mongoose').model('User');

module.exports.getLogin = async (ctx) => {
  await ctx.render('login.jade');
};

module.exports.postLogin = passport.authenticate('local', {
  successRedirect: '/app',
  failureRedirect: '/login'
});

module.exports.getRegister = async (ctx, next) => {
  await ctx.render('register.jade');
};

module.exports.postRegister = async (ctx, next) => {

  const registerPromise = function() {
    return new Promise((resolve, reject) => {
      User.register(ctx.request.body.email, ctx.request.body.password, (err, user) => {
        if (err) {
          reject({code: 404, err: err});
        } else {
          ctx.login(user, function(err) {
            if (err) {
              reject({code: 500, err: err});
            } else {
              resolve();
            }
          });
        }
      });
    });
  };

  await registerPromise().then(() => {
    return ctx.redirect('/login');
  }, (info) => {
    return ctx.throw(info.code, info.err.message);
  });
};

module.exports.getLogout = (ctx) => {
  ctx.logout();
  ctx.redirect('/login');
};
