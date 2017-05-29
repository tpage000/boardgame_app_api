var mongoose = require('mongoose');
var gameSchema = require('./game').schema;

var sessionSchema = mongoose.Schema({

	date: { type: Date, required: true },
	game: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Game',
					required: true
	      },
	scores: [
					 {
					 	player: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
					 	score: { type: Number, required: true },
					 	winner: { type: Boolean, default: false }
					 }
				 ],
	userName: { type: String, required: true }

});

module.exports = mongoose.model('Session', sessionSchema);
