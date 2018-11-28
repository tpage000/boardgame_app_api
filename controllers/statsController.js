const express = require('express');
const Game = require('../models/game');
let router = express.Router();

router.get('/plays', (req, res) => {
  if (!req.user) res.status(401).json({ message: 'Unauthorized' });
  Game.find({ user_id: req.user.id }, 'name plays')
      .sort({ plays: -1 })
      .exec((err, games) => {
        if (err) res.status(400).json({ err: err.message });
        res.send(games);
      });
});

module.exports = router;
