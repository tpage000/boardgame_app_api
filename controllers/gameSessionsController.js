const express = require('express');
const router = express.Router();
const Session = require('../models/session');
const Game = require('../models/game');
const Player = require('../models/player');
const exampleSessions = require('../data/exampleSessions');

// Get all users' sessions -- req.user comes in through auth middleware
router.get('/', (req, res) => {
  if (!req.user) {
    res.json(exampleSessions);
  } else {
    Session.find({ username: req.user.username }, null, {sort: '-date'}, (err, sessions) => {
      if (err) throw err;
      const opts = [{ path: 'game', select: 'name thumbnail'}, { path: 'scores.player', select: 'name avatar'}]
      const promise = Session.populate(sessions, opts)
      promise.then((allSessions) => {
        res.json(allSessions);
      });
    });
  }
});

// Get game sessions for a game
router.get('/:game_id', (req, res) => {
  Session.find({ game: req.params.game_id}, null, {sort: '-date'}, (err, sessions) => {
    if (err) throw err;
    const opts = [{ path: 'game', select: 'name thumbnail'}, { path: 'scores.player', select: 'name avatar'}]
    const promise = Session.populate(sessions, opts)
    promise.then((gameSessions) => {
      res.json(gameSessions);
    });
  });
});

// Create new game session
router.post('/', (req, res) => {
  if (!req.user) {
    res.send({status: 401, message: "Unauthorized"});
  } else {
    req.body.username = req.user.username;
    Session.create(req.body, (err, newSession) => {
      if (err) {
        console.log('Error creating session: ', err);
        res.status(400).send({ message: 'error creating session' });
      } else {
        // update game plays field ( used mostly for populating game show page
        // with expansion plays data, easier if you don't have to also query the session
        // just to get plays )
        Game.findById(req.body.game, (findGameErr, foundGame) => {
          foundGame.plays++;
          foundGame.save((saveGameErr, savedGame) => {
            console.log('plays incremented for game: ', foundGame.name);
            res.json(newSession);
          });
        });
      };
    });
  }
});

module.exports = router;
