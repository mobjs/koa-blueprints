const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
  email: { type: String, lowercase: true, trim: true, required: true, unique: true },
  password: { type: String },
  created_at: { type: Date, default: Date.now },
  github: String,
  tokens: Array,
  profile: {
    name: { type: String, default: '' },
    gender: { type: String, default: '' },
    location: { type: String, default: '' },
    website: { type: String, default: '' },
    picture: { type: String, default: '' }
  }
});

UserSchema.pre('save', function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = User.encryptPassword(this.password);
  next();
});

UserSchema.methods = {
  validPassword: function(password) {
    return bcrypt.compareSync(password, this.password);
  }
};

UserSchema.statics = {
  makeSalt: function() {
    return bcrypt.genSaltSync(10);
  },
  encryptPassword: function(password) {
    if (!password) {
      return '';
    }
    return bcrypt.hashSync(password, User.makeSalt());
  },
  register: function(email, password, cb) {
    var user = new User({
      email: email,
      password: password
    });
    user.save(function(err) {
      cb(err, user);
    });
  }
};

var User = mongoose.model('User', UserSchema);

User.schema.path('email').validate(function(email) {
  return validator.isEmail(email);
});

User.schema.path('password').validate(function(password) {
  return validator.isLength(password, 6);
});

module.exports = User;
