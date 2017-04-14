const passport = require('koa-passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose').model('User');

const config = require('../config')();



