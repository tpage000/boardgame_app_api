const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const userSchema = mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  avatar: { type: String, default: "/assets/avatars/ocean.jpeg" },
  password: { type: String, required: true },
  kind: { type: String, default: 'User' },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true, usePushEach: true });

// =================================================================
// PASSWORD HASHING AND AUTHENTICATION
userSchema.pre('save', function(next) {
  if (!this.isModified('password')) { return next(); }
  const hashedPassword = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10));
  this.password = hashedPassword;
  next();
});

// Used at login / authenticating a user.
userSchema.methods.authenticate = function(password) {
  return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', userSchema);
