const mongoose = require('mongoose');

const playerSchema = mongoose.Schema({
  name: { type: String, required: true },
  avatar: { type: String, required: true },
  player_since: { type: String, required: true },
  username: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Player', playerSchema);
