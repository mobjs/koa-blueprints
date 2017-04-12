const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, lowercase: true, trim: true, required: true, unique: true },
  password: { type: String },
  created_at: { type: Date, default: Date.now }
});

UserSchema.pre('save', function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = User.encryptPassword(this.password);
  next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
