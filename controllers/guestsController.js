const express        = require('express');
const router         = express.Router();
const Guest          = require('../models/guest');
const examplePlayers = require('../data/examplePlayers');

// index of guests for a user -- req.user comes in from auth middleware
router.get('/', (req, res) => {
  if (!req.user) {
    res.json(examplePlayers);
  } else {
    Guest.find({ host_user_id: req.user.id }, (err, players) => {
      if (err) throw err;
      res.json(players);
    });
  }
});

router.post('/', (req, res) => {
  if (!req.user) {
    res.status(401).send({ message: 'Unauthorized' });
  } else {
    req.body.host_user_id = req.user.id;
    Guest.create(req.body, (err, createdPlayer) => {
      if (err) {
        res.status(400).send({ message: err.message });
      } else {
        res.json(createdPlayer);
      }
    });
  }
});

module.exports = router;
