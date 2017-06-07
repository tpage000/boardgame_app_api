const mongoose = require('mongoose');

const playerSchema = mongoose.Schema({
  name: { type: String, required: true },
  avatar: { type: String, default: 'http://www.tea-after-twelve.com/uploads/pics/default-avatar.jpg' },
  date: { type: Date, required: true },
  username: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Player', playerSchema);
