const express = require('express');
const router = express.Router();
const Game = require('../models/game');
const exampleGames = require('../data/exampleGames');

// index of user's games -- req.user set by auth middleware
// if no req.user, send examples instead
router.get('/', (req, res) => {
  if (!req.user) {
    console.log('sending example games ..');
    res.json(exampleGames)
  } else {
    console.log('getting games for: ', req.user.username);
    Game.find({ user_id: req.user.id }, (err, foundGames) => {
      if (err) {
        console.log('error getting games: ', err);
        res.status(400).send({ message: err.message });
      } else {
        const reversedGames = foundGames.slice().reverse();
        res.json(reversedGames);
      }
    })
  }
});

// show a game and its related sessions
router.get('/:id', (req, res) => {
  console.log('id param: ', req.params.id);
  Game.findById(req.params.id, (err, foundGame) => {
    if (err) {
      console.log('error getting game: ', err);
      res.status(400).send({ message: err.message });
    }
    Session.find({ game: req.params.id}, null, {sort: '-date'}, (err, sessions) => {
      if (err) throw err;
      const opts = [{ path: 'gameresults.player.info', select: 'username avatar'}]
      const promise = Session.populate(sessions, opts)
      promise.then((gameSessions) => {
        res.json({ game: foundGame, sessions: gameSessions });
      });
    });
  });
});
    // Sending related expansion and parent games:
    // THIS DOES NOT WORK because it finds expansion and parent games by
    // BGG id, not by the db id of the games. Therefore expansion and parent
    // games could belong to a different user. Find a fix when req.user
    // is implemented.
    //
    // if (foundGame.isExpansion) {
    //   Game.find({ 'gameId' : foundGame.expands[0].gameId }, 
    //     'name id plays', (experrames) => {
    //     foundGame.expansions = parentGames;
    //     res.json(foundGame);
    //   });
    // } else {
    //   Game.find({ 'expands.gameId': foundGame.gameId}, 
    //     'name id plays', (err, expansions) => {
    //     console.log('expansions: ', expansions);
    //       foundGame.expansions = expansions;
    //       res.json(foundGame);
    //   });
    // }

// create a new game belonging to the user -- req.user comes from auth
// middleware
router.post('/', (req, res) => {
  if (!req.user) {
    res.status(401).send({ message: "Unauthorized" });
  } else {
    req.body.user_id = req.user.id;
    Game.create(req.body, (err, newGame) => {
      if (err) {
        console.log('Create game Error: ', err);
        res.status(400).send({ message: err.message });
      } else {
        console.log('game successfully added to database for user: ', req.user.username);
        res.json({ status: 201, game: newGame });
      }
    });
  }
});

module.exports = router;
