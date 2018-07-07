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
  gameresults: [
        {
          player: { 
            kind: String, 
            info: { 
              type: mongoose.Schema.Types.ObjectId, 
              refPath: 'gameresults.player.kind', // either User or Guest
              required: true 
            }
          },
          score: { type: Number, required: true },
          winner: { type: Boolean, default: false }
        }
  ],
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  comments: String
}, { timestamps: true });

// validation for the presence of a gameresults array
sessionSchema.path('gameresults').validate(gameresults => {
  if (!gameresults || gameresults.length === 0) return false;
  return true;
}, 'Session needs to have at least one gameresult');

module.exports = mongoose.model('Session', sessionSchema);
