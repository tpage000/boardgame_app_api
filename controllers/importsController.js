var express = require('express');
var router = express.Router();
var request = require('request');

var Session = require('../models/session');
var Game = require('../models/game');
var Player = require('../models/player');

// <p class="import" ng-click="ctrl.importAdminData()">A</p>
// <p class="import" ng-click="ctrl.importExampleData()">E</p>

router.post('/admin', function(req, res) {

  if (req.session.loggedInUser) {
    if (req.session.loggedInUser.username == 'admin') {
      // import all games
      var importGames = function() {
            var games = require('../data/games');
          	var counter = 0;
          	var gamesToImport = [];

          	var makeRequest = function() {
          		request('https://bgg-json.azurewebsites.net/thing/' + games[counter].gameId, function (error, response, body) {
          		  if (!error && response.statusCode == 200) {
          				var gameFromBGG = JSON.parse(body);
          				gameFromBGG.acquired = games[counter].acquired;
                  gameFromBGG.userName = "admin";
          				// console.log(JSON.parse(body));
          				gamesToImport.push(gameFromBGG);
          				counter++;
          				if (counter >= games.length) {
          					return done();
          				} else {
          					return makeRequest();
          				}
          		  } else {
          				console.log('BGG Request ERROR: ', error);
          				return runError(error);
          			}
          		});
          	} // end makeRquest

          	var done = function() {
          		console.log('DONE');
          		Game.create(gamesToImport, function(err, importedGames) {
          			if (err) {
          				res.send(err);
          			} else {
          				importPlayers();
          			}
          		});
          	}

          	var runError = function(err) {
          		res.send(err);
          	}

            makeRequest();

      } // end importGames




      // import all players
      var importPlayers = function() {
            var players = require('../data/players');
            Player.create(players, function(err, createdPlayers) {
              if (err) {
                res.json(err);
              } else {
                importSessions();
              }
            });
      } // end importPlayers




      // import all sessions (requires games and players imported first)
      var importSessions = function() {
            var sessions = require('../data/sessions');
          	var counter = 0;
          	var playerCounter = 0;
          	var formattedSessions = [];

          	console.log('MAX INDEXES: ', sessions.length - 1);

          	var formatGameId = function() {
          		console.log('FINDING GAME INDEX: ', counter);
          		Game.findOne({ name: sessions[counter].name, userName: "admin" }, 'id plays', function(err, foundGame) {
          			if (err) {
          				return error(err);
          			} else {
          				console.log('GAME INDEX ' + counter + ' FOUND: ', foundGame);
          				foundGame.plays++;
          				foundGame.save(function(gamePlayErr, savedGame) {
          					sessions[counter].game = savedGame.id;
                    sessions[counter].userName = "admin";
          					return formatPlayerIds();
          				});
          			}
          		});
          	} // end formatGameIds;


          	var formatPlayerIds = function() {
          		Player.findOne({ name: sessions[counter].scores[playerCounter].name }, 'id', function(err, foundPlayer) {

          			if (err) {
          				return errorFunc(err);
          			} else {
          				// formattedSessions[counter].scores.push({ name: foundPlayer.id, score: sessions[counter].scores[playerCounter].score })
          				sessions[counter].scores[playerCounter].player = foundPlayer.id;
          				playerCounter++;
          				if (playerCounter >= sessions[counter].scores.length) {
          					counter++;
          					playerCounter = 0;
          					if (counter >= sessions.length) {
          						return done();
          					} else {
          						return formatGameId();
          					}
          				} else {
          					return formatPlayerIds();
          				}
          			}
          		})
          	} // end formatPlayerIds

          	var done = function() {
          		console.log(sessions);
          		Session.create(sessions, function(err, createdSessions) {
          			if (err) {
          				res.json(err);
          			} else {
          				res.json({ status: 201, message: "IMPORT COMPLETE" });
          			}
          		});
          	} // end done

          	var errorFunc = function(error) {
          		res.send(error);
          	} // end error

          	formatGameId();

      } // end importSessions


      importGames();

    } // admin exists
  } // logged in exists

}); // end imports/admin


router.post('/example', function(req, res) {

  if (req.session.loggedInUser) {
    if (req.session.loggedInUser.username == 'admin') {

      // import all games
      var importGames = function() {
            var games = require('../data/exampleGames');
          	var counter = 0;
          	var gamesToImport = [];

          	var makeRequest = function() {
          		request('https://bgg-json.azurewebsites.net/thing/' + games[counter].gameId, function (error, response, body) {
          		  if (!error && response.statusCode == 200) {
          				var gameFromBGG = JSON.parse(body);
          				gameFromBGG.acquired = games[counter].acquired;
                  gameFromBGG.userName = "example";
          				// console.log(JSON.parse(body));
          				gamesToImport.push(gameFromBGG);
          				counter++;
          				if (counter >= games.length) {
          					return done();
          				} else {
          					return makeRequest();
          				}
          		  } else {
          				console.log('BGG Request ERROR: ', error);
          				return runError(error);
          			}
          		});
          	} // end makeRquest

          	var done = function() {
          		console.log('DONE');
          		Game.create(gamesToImport, function(err, importedGames) {
          			if (err) {
          				res.send(err);
          			} else {
          				importPlayers();
          			}
          		});
          	}

          	var runError = function(err) {
          		res.send(err);
          	}

            makeRequest();

      } // end importGames




      // import all players
      var importPlayers = function() {
            var players = require('../data/examplePlayers');
            Player.create(players, function(err, createdPlayers) {
              if (err) {
                res.json(err);
              } else {
                importSessions();
              }
            });
      } // end importPlayers




      // import all sessions (requires games and players imported first)
      var importSessions = function() {
            var sessions = require('../data/exampleSessions');
          	var counter = 0;
          	var playerCounter = 0;
          	var formattedSessions = [];

          	console.log('MAX INDEXES: ', sessions.length - 1);

          	var formatGameId = function() {
          		console.log('FINDING GAME INDEX: ', counter);
          		Game.findOne({ name: sessions[counter].name, userName: "example" }, 'id plays', function(err, foundGame) {
          			if (err) {
          				return error(err);
          			} else {
          				console.log('GAME INDEX ' + counter + ' FOUND: ', foundGame);
          				foundGame.plays++;
          				foundGame.save(function(gamePlayErr, savedGame) {
          					sessions[counter].game = savedGame.id;
                    sessions[counter].userName = "example";
          					return formatPlayerIds();
          				});
          			}
          		});
          	} // end formatGameIds;


          	var formatPlayerIds = function() {
          		Player.findOne({ name: sessions[counter].scores[playerCounter].name }, 'id', function(err, foundPlayer) {

          			if (err) {
          				return errorFunc(err);
          			} else {
          				// formattedSessions[counter].scores.push({ name: foundPlayer.id, score: sessions[counter].scores[playerCounter].score })
          				sessions[counter].scores[playerCounter].player = foundPlayer.id;
          				playerCounter++;
          				if (playerCounter >= sessions[counter].scores.length) {
          					counter++;
          					playerCounter = 0;
          					if (counter >= sessions.length) {
          						return done();
          					} else {
          						return formatGameId();
          					}
          				} else {
          					return formatPlayerIds();
          				}
          			}
          		})
          	} // end formatPlayerIds

          	var done = function() {
          		console.log(sessions);
          		Session.create(sessions, function(err, createdSessions) {
          			if (err) {
          				res.json(err);
          			} else {
          				res.json({ status: 201, message: "IMPORT COMPLETE" });
          			}
          		});
          	} // end done

          	var errorFunc = function(error) {
          		res.send(error);
          	} // end error

          	formatGameId();

      } // end importSessions


      importGames();

    } // if user is 'admin'
  } // if logged InUser exists

}); // end imports/admin


module.exports = router;
