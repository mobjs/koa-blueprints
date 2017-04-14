const Router = require('koa-router');

const passport = require('./core/passport');
const userController = require('./controllers/user');

const router = new Router();

module.exports.initialize = function(app) {
  router.get('/', async (ctx, next) => {
    await ctx.render('index.jade');
  });

  router.get('/login', userController.getLogin);

  router.post('/custom', (ctx, next) => {
    return passport.authenticate('local', (err, user, info, status) => {
      if (user === false) {
        ctx.body = { success: false };
        ctx.throw(401);
      } else {
        ctx.body = { success: true };
        return ctx.login(user);
      }
    })(ctx, next);
  });

  router.get('/register', userController.getRegister);

  router.post('/register', userController.postRegister);

  // POST /login
  router.post('/login', userController.postLogin);

  router.get('/logout', userController.getLogout);

  router.get('/auth/github', passport.authenticate('github'));

  router.get('/auth/github/callback', passport.authenticate('github', {
    successRedirect: '/app',
    failureRedirect: '/'
  }));

  // Require authentication for now
  router.all('*', (ctx, next) => {
    if (ctx.isAuthenticated()) {
      return next();
    } else {
      ctx.redirect('/login');
    }
  });

  router.get('/app', async (ctx, next) => {
    await ctx.render('app.html', {
      pageTitle: '应用控制台'
    });
  });

  app
    .use(router.routes())
    .use(router.allowedMethods());
};
