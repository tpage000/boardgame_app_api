var mongoose = require('mongoose');

var playerSchema = mongoose.Schema({

	name: { type: String, required: true },
	avatar: { type: String, required: true },
	player_since: { type: String, required: true },
	userName: { type: String, required: true }

});


module.exports = mongoose.model('Player', playerSchema);
