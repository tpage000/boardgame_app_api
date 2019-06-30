const express         = require('express');
const router          = express.Router();
const Session         = require('../models/session');
const Game            = require('../models/game');
const Guest           = require('../models/guest');
const exampleSessions = require('../data/exampleSessions');

// Get all users' sessions -- req.user comes in through auth middleware
router.get('/', (req, res) => {
  if (!req.user) {
    res.json(exampleSessions);
  } else {
    Session.find({ user_id: req.user.id }, null, {sort: '-date'}, (err, sessions) => {
      if (err) throw err;
      const opts = [{ path: 'game', select: 'name thumbnail'}, { path: 'gameresults.player.info', select: 'username avatar'}]
      const promise = Session.populate(sessions, opts)
      promise.then((allSessions) => {
        res.json(allSessions);
      });
    });
  }
});

// Get all sessions for a particular game
router.get('/byGame/:game_id', (req, res) => {
  if (!req.user) {
    res.json([]);
  } else {
    Session.find({ game: req.params.game_id }, null, {sort: '-date'}, (err, sessions) => {
      if (err) throw err;
      const opts = [{ path: 'game', select: 'name thumbnail'}, { path: 'gameresults.player.info', select: 'username avatar'}]
      const promise = Session.populate(sessions, opts)
      promise.then((gameSessions) => {
        res.json(gameSessions);
      });
    });
  }
});

// Get a particular session
router.get('/:id', async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    const opts = [{ path: 'game', select: 'name thumbnail'}, { path: 'gameresults.player.info', select: 'username avatar'}]
    const populatedSession = await Session.populate(session, opts);
    res.status(200).json(populatedSession);
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: err.message })
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
        console.log(err);
        res.status(400).send({ message: err.message });
      } else {
        const opts = [{ path: 'game', select: 'name thumbnail'}, { path: 'gameresults.player.info', select: 'username avatar'}]
        const promise = Session.populate(newSession, opts)
        promise.then((gameSessions) => {
          // update game plays field 
          Game.findById(req.body.game, (findGameErr, foundGame) => {
            foundGame.plays++;
            foundGame.save((saveGameErr, savedGame) => {
              res.json(gameSessions);
            });
          });
        });
      };
    });
  }
});

// Update a session
router.put('/:id', async (req, res) => {
  if (req.query.updateComments) {
    try {
      const updatedSession = await Session.findByIdAndUpdate(
        req.params.id, { $set: { comments: req.body.comments } }, { new: true }
      );
      res.status(200).json(updatedSession)
    } catch (err) {
      console.log(err)
      res.status(400).json(err.message)
    }
  }
})

module.exports = router;
