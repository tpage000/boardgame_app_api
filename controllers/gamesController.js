const express = require('express');
const router = express.Router();
const Game = require('../models/game');
const Session = require('../models/session');
const jwt = require('jsonwebtoken');
const exampleGames = require('../data/exampleGames');

// index of user's games -- req.user set by auth middleware
// if no req.user, send examples instead
router.get('/', (req, res) => {
  if (!req.user) {
    res.json(exampleGames)
  } else {
    Game.find({ userName: req.user.username })
      .sort({date: 'descending'}).exec((err, games) => {
        if (err) throw err;
        res.json(games);
      })
  }
});

// show a game -- not yet secure per user
router.get('/:id', (req, res) => {
  console.log('id param: ', req.params.id);
  Game.findById(req.params.id, (err, foundGame) => {
    if (err) throw err;

    if (foundGame.isExpansion) {
      Game.find({ 'gameId' : foundGame.expands[0].gameId }, 'name id plays', (experr, parentGames) => {
        foundGame.expansions = parentGames;
        res.json(foundGame);
      });
    } else {
      Game.find({ 'expands.gameId': foundGame.gameId}, 'name id plays', (err, expansions) => {
        console.log('expansions: ', expansions);
          foundGame.expansions = expansions;
          res.json(foundGame);
      });
    }
  });
});

// create a new game belonging to the user -- req.user comes from auth
// middleware
router.post('/', (req, res) => {
  if (!req.user) {
    res.status(401).send({ message: "Unauthorized" });
  } else {
    req.body.username = req.user.username;
    Game.create(req.body, (err, newGame) => {
      if (err) {
        console.log('Create game Error: ', err);
        res.status(400).send({ message: 'error creating game' });
      } else {
        console.log('game successfully added to database for user: ', req.user.username);
        res.json({ status: 201, game: newGame });
      }
    });
  }
});

module.exports = router;
