const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, required: true },
  avatar: { type: String, default: "https://ikhazy.com/wp-content/uploads/2015/12/Natural-Black-Ocean-Wave-Texture-100x100.jpg" },
  password: { type: String, required: true }
}, { timestamps: true });

// =================================================================
// PASSWORD HASHING AND AUTHENTICATION

// Before each save of the user, check if the password has been added or modified,
// and if it has, hash the provided password and store it.
// Used at signup / creating a user.
userSchema.pre('save', function(next) {
  if (!this.isModified('password')) { return next(); }
  const hashedPassword = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10));
  this.password = hashedPassword;
  next();
});

// Method for comparing the provided password with the stored hashed password.
// Used at login / authenticating a user.
userSchema.methods.authenticate = function(password) {
  return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', userSchema);
