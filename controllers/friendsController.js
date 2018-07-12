const express = require('express');
const router = express.Router();
// const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Just the friends
router.get('/', (req, res) => {
  if (!req.user) {
    res.status(401).send({ message: 'Unauthorized' });
  } else {
    User.find({ user_id: req.user.id }, (err, foundUser) => {
      if (err) {
        console.log('error getting friends: ', err);
        res.status(400).send({ message: err.message });
      } else {
        res.status(200).json(foundUser.friends);
      }
    })
  }
});

module.exports = router;

