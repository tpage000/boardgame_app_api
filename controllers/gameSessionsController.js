const express = require('express');
const router = express.Router();
const Session = require('../models/session');
const Game = require('../models/game');
const Player = require('../models/player');

// Get all sessions
router.get('/', function(req, res) {
  let searchName;
  if (!req.session.loggedInUser) {
    searchName = "example"
  } else {
    searchName = req.session.loggedInUser.username;
  }
  console.log("Finding all sessions for: ", searchName);

  Session.find({ userName: searchName }, null, {sort: '-date'}, function(err, sessions) {
    if (err) throw err;
    const opts = [{ path: 'game', select: 'name thumbnail'}, { path: 'scores.player', select: 'name avatar'}]
    const promise = Session.populate(sessions, opts)
    promise.then(function(result) {
      res.json(result);
    });
  });
});

// Get game sessions list by GAME
router.get('/byGame/:game_id', function(req, res) {
  Session.find({ game: req.params.game_id}, null, {sort: '-date'}, function(err, sessions) {
    if (err) throw err;
    const opts = [{ path: 'game', select: 'name thumbnail'}, { path: 'scores.player', select: 'name avatar'}]
    const promise = Session.populate(sessions, opts)
    promise.then(function(result) {
      res.json(result);
    })
  });
});

// Create new game session
router.post('/', function(req, res) {
  if (!req.session.loggedInUser.username) {
    res.send({status: 401, message: "Unauthorized"});
  } else {
    req.body.userName = req.session.loggedInUser.username;
    Session.create(req.body, function(err, newSession) {
      if (err) {
        res.json(err);
      } else {
        // update game plays field ( used mostly for populating game show page
        // with expansion plays data, easier if you don't have to also query the session
        // just to get plays )
        Game.findById(req.body.game, function(err, foundGame) {
          foundGame.plays++;
          foundGame.save(function(gmerr, savedGame) {
            res.json(newSession);
          });
        });
      };
    });
  }
});


module.exports = router;
