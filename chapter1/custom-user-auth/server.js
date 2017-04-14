const path = require('path');
const mongoose = require('mongoose');
const Koa = require('koa');
const views = require('koa-views');
const koaStatic = require('koa-static');
const convert = require('koa-convert');
const session = require('koa-generic-session');
const MongoStore = require('koa-generic-session-mongo');
// const RedisStore = require('koa-redis');
const bodyParser = require('koa-bodyparser');

const config = require('./config')();
const User = require('./models/user');
const passport = require('./core/passport');
const routes = require('./routes');

// https://github.com/Automattic/mongoose/issues/4291
mongoose.Promise = global.Promise;
mongoose.connect(config.db_url, err => {
  if (err) throw err;
});

const app = new Koa();

// view engine
app.use(views(__dirname + '/views', {
  map: { jade: 'jade', html: 'mustache' }
}));

// static assets
app.use(koaStatic(path.join(__dirname, 'public')));

// sessions

app.keys = ['your-session-secret'];
app.use(convert(session({
  store: new MongoStore({
    url: config.session_db
  })
})));
// app.use(convert(session({
//   store: new RedisStore()
// })));

// body parser
app.use(bodyParser());

// authentication
app.use(passport.initialize());
app.use(passport.session());

// routes
routes.initialize(app);

app.listen(process.env.PORT || 3000, () => {
  console.log('Koa listening on port 3000');
});
