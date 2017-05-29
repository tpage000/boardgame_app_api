const express = require('express');
const router = express.Router();
const Player = require('../models/player');

// index
router.get('/', function(req, res) {
  let searchName;
  if (!req.session.loggedInUser) {
    searchName = "example"
  } else {
    searchName = req.session.loggedInUser.username;
  }

  // const searchName = req.session.loggedInUser.username || "example";
  console.log("Finding all players for: ", searchName);
  Player.find({ userName: searchName }, function(err, players) {
    if (err) throw err;
    res.json(players);
  });
});

// create
router.post('/', function(req, res) {
  if (!req.session.loggedInUser.username) {
    res.send({status: 401, message: "Unauthorized"});
  } else {
    req.body.userName = req.session.loggedInUser.username;
    console.log('Incoming data: ', req.body);
    Player.create(req.body, function(err, player) {
      if (err) {
        res.json(err);
      } else {
        res.json(player);
      }
    });
  }
});

module.exports = router;
