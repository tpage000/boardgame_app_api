const express         = require('express');
const router          = express.Router();
const Session         = require('../models/session');
const Game            = require('../models/game');
const Player          = require('../models/player');
const exampleSessions = require('../data/exampleSessions');

// Get all users' sessions -- req.user comes in through auth middleware
router.get('/', (req, res) => {
  if (!req.user) {
    console.log('sending example sessions ..');
    res.json(exampleSessions);
  } else {
    Session.find({ username: req.user.username }, null, {sort: '-date'}, (err, sessions) => {
      if (err) throw err;
      const opts = [{ path: 'game', select: 'name thumbnail'}, { path: 'gameresults.player', select: 'name avatar'}]
      const promise = Session.populate(sessions, opts)
      promise.then((allSessions) => {
        res.json(allSessions);
      });
    });
  }
});

// Get game sessions for a game
router.get('/:game_id', (req, res) => {
  if (!req.user) {
    res.json([]);
  } else {
    Session.find({ game: req.params.game_id }, null, {sort: '-date'}, (err, sessions) => {
      if (err) throw err;
      const opts = [{ path: 'game', select: 'name thumbnail'}, { path: 'gameresults.player', select: 'name avatar'}]
      const promise = Session.populate(sessions, opts)
      promise.then((gameSessions) => {
        res.json(gameSessions);
      });
    });
  }
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
        res.status(400).send({ message: err.message });
      } else {
        const opts = [{ path: 'game', select: 'name thumbnail'}, { path: 'gameresults.player', select: 'name avatar'}]
        const promise = Session.populate(newSession, opts)
        promise.then((gameSessions) => {

          // update game plays field ( used mostly for populating game show page
          Game.findById(req.body.game, (findGameErr, foundGame) => {
            foundGame.plays++;
            foundGame.save((saveGameErr, savedGame) => {
              console.log('plays incremented for game: ', foundGame.name);
              res.json(gameSessions);
            });
          });

        });
      };
    });
  }
});

module.exports = router;
