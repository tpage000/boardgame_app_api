const mongoose = require('mongoose');

// a game Session is dependent on having a game and at least one player
// a game Session will be populated with the game and the player(s)
const sessionSchema = mongoose.Schema({
  date: { type: Date, required: true },
  game: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Game',
          required: true
        },
  results: [
            {
              player: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
              score: { type: Number, required: true },
              winner: { type: Boolean, default: false }
            }
          ],
  username: { type: String, required: true },
  comments: String
});

module.exports = mongoose.model('Session', sessionSchema);
