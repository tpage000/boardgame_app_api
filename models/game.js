var mongoose = require('mongoose');

var gameSchema = mongoose.Schema({

	name: String,
	gameId: { type: Number, required: true },
	isExpansion: { type: Boolean, default: false },
	expands: {},
	minPlayers: { type: Number, default: 1 },
	maxPlayers: { type: Number, default: 1 },
	image: { type: String, default: "https://image.freepik.com/free-icon/white-question-mark-on-a-black-circular-background_318-35996.jpg" },
	thumbnail: { type: String, default: "http://image.flaticon.com/icons/png/128/25/25400.png" },
	mechanics: Array,
	designers: Array,
	artists: Array,
	publishers: Array,
	yearPublished: Number,
	acquired: { type: Date, required: true },
	inCollection: { type: Boolean, default: true },
	plays: { type: Number, default: 0 },
	expansions: Array,
	userName: { type: String, required: true }
});

module.exports = mongoose.model('Game', gameSchema);
