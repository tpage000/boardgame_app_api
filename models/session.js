const mongoose = require('mongoose');

// a game Session is dependent on having a game and at least one player
// a game Session will be populated with the game and the player(s)
const sessionSchema = mongoose.Schema({
  date: { type: Date, default: Date.now },
  game: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Game',
          required: true
        },
  gameresults: [
            {
              player: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
              score: { type: Number, required: true },
              winner: { type: Boolean, default: false }
            }
          ],
  username: { type: String, required: true },
  comments: String
}, { timestamps: true });

// validation for the presence of a gameresults array
sessionSchema.path('gameresults').validate(gameresults => {
  if (!gameresults) {
    return false;
  } else if (gameresults.length === 0) {
    return false;
  } else {
    return true;
  }
}, 'Session needs to have at least one gameresult');

module.exports = mongoose.model('Session', sessionSchema);
