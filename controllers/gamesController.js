var express = require('express');
var router = express.Router();
var request = require('request');
var Game = require('../models/game');
var Session = require('../models/session');


// index
router.get('/', function(req, res) {
	var searchName;
	if (!req.session.loggedInUser) {
		searchName = "example"
	} else {
		searchName = req.session.loggedInUser.username;
	}
	console.log("Finding all games for: ", searchName);
	Game.find({ userName: searchName }).sort({date: 'descending'}).exec(function(err, games) {
		if (err) throw err;
		res.json(games);
	});
});


// import (seed data)
// router.get('/import', function(req, res) {
// 	var games = require('../data/games');
// 	var counter = 0;
// 	var gamesToImport = [];
//
// 	var makeRequest = function() {
// 		request('https://bgg-json.azurewebsites.net/thing/' + games[counter].gameId, function (error, response, body) {
// 		  if (!error && response.statusCode == 200) {
// 				var gameFromBGG = JSON.parse(body);
// 				gameFromBGG.acquired = games[counter].acquired;
// 				gameFromBGG.userName = "admin";
// 				// console.log(JSON.parse(body));
// 				console.log('game data: ', gameFromBGG)
// 				gamesToImport.push(gameFromBGG);
// 				counter++;
// 				if (counter >= games.length) {
// 					return done();
// 				} else {
// 					return makeRequest();
// 				}
// 		  } else {
// 				console.log('ERROR: ', error);
// 				return runError(error);
// 			}
// 		});
// 	} // end makeRquest
//
// 	var done = function() {
// 		console.log('DONE');
// 		console.log('IMPORTING: ', gamesToImport);
// 		Game.create(gamesToImport, function(err, importedGames) {
// 			if (err) {
// 				res.send(err);
// 			} else {
// 				res.send(importedGames);
// 			}
// 		});
// 	}
//
// 	var runError = function(err) {
// 		res.send(err);
// 	}
//
// 	makeRequest();
// }); // end import


// show
router.get('/:id', function(req, res) {
	console.log('id param: ', req.params.id);
	Game.findById(req.params.id, function(err, foundGame) {
		if (err) throw err;

		if (foundGame.isExpansion) {
			Game.find({ 'gameId' : foundGame.expands[0].gameId }, 'name id plays', function(experr, parentGames) {
				foundGame.expansions = parentGames;
				res.json(foundGame);
			});
		} else {
			Game.find({ 'expands.gameId': foundGame.gameId}, 'name id plays', function(err, expansions) {
				console.log('expansions: ', expansions);
					foundGame.expansions = expansions;
					res.json(foundGame);
			});
		}
	});
});

// create
router.post('/', function(req, res) {
	if (!req.session.loggedInUser.username) {
		res.send({status: 401, message: "Unauthorized"});
	} else {
		req.body.userName = req.session.loggedInUser.username;
		Game.create(req.body, function(err, newGame) {
			if (err) {
				console.log('Create game Error: ', err);
				res.json(err);
			} else {
				console.log('game successfully added to database for user: ', req.session.loggedInUser.userName );
				res.json(newGame);
			}
		});
	}
});


module.exports = router;
