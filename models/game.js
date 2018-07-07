const mongoose = require('mongoose');

const gameSchema = mongoose.Schema({
  // https://bgg-json.azurewebsites.net/thing/id 
  gameId: { type: Number, required: true },
  name: { type: String, required: true },
  description: String,
  image: { type: String, default: "https://image.freepik.com/free-icon/white-question-mark-on-a-black-circular-background_318-35996.jpg" },
  thumbnail: { type: String, default: "http://image.flaticon.com/icons/png/128/25/25400.png" },
  minPlayers: { type: Number, default: 1 },
  maxPlayers: { type: Number, default: 1 },
  playingTime: Number,
  mechanics: Array,
  isExpansion: { type: Boolean, default: false },
  yearPublished: Number,
  bggRating: Number,
  averageRating: Number,
  rank: Number,
  designers: Array,
  publishers: Array,
  artists: Array,
  playerPollResults: Array,
  // custom fields
  expands: {},
  acquired: { type: Date, default: Date.now },
  inCollection: { type: Boolean, default: true },
  expansions: Array,
  plays: { type: Number, default: 0 },
  user_id: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Game', gameSchema);
