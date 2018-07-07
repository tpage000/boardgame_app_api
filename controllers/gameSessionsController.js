const express         = require('express');
const router          = express.Router();
const Session         = require('../models/session');
const Game            = require('../models/game');
const Guest           = require('../models/guest');
const exampleSessions = require('../data/exampleSessions');

// Get all users' sessions -- req.user comes in through auth middleware
router.get('/', (req, res) => {
  if (!req.user) {
    console.log('sending example sessions ..');
    res.json(exampleSessions);
  } else {
    Session.find({ user_id: req.user.id }, null, {sort: '-date'}, (err, sessions) => {
      if (err) throw err;
      const opts = [{ path: 'game', select: 'name thumbnail'}, { path: 'gameresults.player.info', select: 'name avatar'}]
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
      const opts = [{ path: 'game', select: 'name thumbnail'}, { path: 'gameresults.player.info', select: 'name avatar'}]
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
    res.status(401).send({ message: "Unauthorized" });
  } else {
    req.body.user_id = req.user.id;
    Session.create(req.body, (err, newSession) => {
      if (err) {
        console.log('Error creating session: ', err);
        res.status(400).send({ message: err.message });
      } else {
        const opts = [{ path: 'game', select: 'name thumbnail'}, { path: 'gameresults.player.info', select: 'username avatar'}]
        const promise = Session.populate(newSession, opts)
        promise.then((gameSessions) => {
          res.json(gameSessions);
          // update game plays field ( used mostly for populating game show page
          // Game.findById(req.body.game, (findGameErr, foundGame) => {
          //   foundGame.plays++;
          //   foundGame.save((saveGameErr, savedGame) => {
          //     console.log('plays incremented for game: ', foundGame.name);
          //     res.json(gameSessions);
          //   });
          // });

        });
      };
    });
  }
});

module.exports = router;
