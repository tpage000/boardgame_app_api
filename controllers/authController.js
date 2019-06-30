const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// TODO refactor async await
// TODO validation middleware
router.post('/login', (req, res) => {
  if (!req.body.password) {
    res.status(401).send({ message: 'No password provided' })
  } else {
    User.findOne({ username: req.body.username }, (err, foundUser) => {
      if (!foundUser) {
        res.status(401).send({ message: 'No user found by that name' });
      } else if (foundUser.authenticate(req.body.password)) {
        const token = jwt.sign({
            id: foundUser.id, 
            username: foundUser.username,
          },
          process.env.JWT_SECRET,
          { expiresIn: '7d' }
        )
        let { username, avatar, _id } = foundUser;
        res.status(200).json({ username, id: _id, avatar, token });
      } else {
        res.status(401).send({ message: 'password does not match' })
      }
    });
  }
});

// TODO validation middleware
// TODO sanitization middleware
// TODO refactor async await
router.post('/register', (req, res) => {
  User.create(req.body, (err, createdUser) => {
    if (err) {
      console.log('error saving user: ', err);
      res.status(400).send({message: err.message });
    } else {
      const token = jwt.sign({
          id: createdUser.id, 
          username: createdUser.username
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      )
      res.json({ status: 201, username: createdUser.username, token: token })
    }
  });
});

module.exports = router;
