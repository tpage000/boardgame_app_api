const express = require('express');
const router = express.Router();
const request = require('request');
const Game = require('../models/game');
const Session = require('../models/session');


// index
router.get('/', function(req, res) {
  let searchName;
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
