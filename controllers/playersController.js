const express        = require('express');
const router         = express.Router();
const Player         = require('../models/player');
const examplePlayers = require('../data/examplePlayers');

// index of players for a user -- req.user comes in from auth middleware
router.get('/', (req, res) => {
  if (!req.user) {
    console.log('sending example players ..');
    res.json(examplePlayers);
  } else {
    Player.find({ username: req.user.username }, (err, players) => {
      if (err) throw err;
      res.json(players);
    });
  }
});

// add a new player for a user
router.post('/', (req, res) => {
  if (!req.user) {
    res.status(401).send({ message: 'Unathorized' });
  } else {
    req.body.username = req.user.username;
    Player.create(req.body, (err, createdPlayer) => {
      if (err) {
        console.log('Error creating player: ', err);
        res.status(400).send({ message: err.message });
      } else {
        res.json(createdPlayer);
      }
    });
  }
});

module.exports = router;
