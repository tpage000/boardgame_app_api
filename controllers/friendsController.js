const express = require('express');
const router = express.Router();
// const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Guest = require('../models/guest');

// Just the friends
router.get('/', (req, res) => {
  if (!req.user) {
    res.status(401).send({ message: 'Unauthorized' });
  } else {
    User.findById({ _id: req.user.id })
     .populate('friends') 
     .exec((err, foundUser) => {
        if (err) {
          console.log('error getting friends: ', err);
          res.status(400).send({ message: err.message });
        } else {
          res.status(200).json(foundUser.friends);
        }
      })
  }
});

// potential friends excluding oneself  - id, username
// todo - exclude: existing friends
router.get('/pool', (req, res) => {
  if (!req.user) {
    res.status(401).send({ message: 'Unauthorized' });
  } else {  
    User.find({ "_id": { $ne: req.user.id } }, (err, users) => {
      let mappedUsers = users.map(user => {
        return {
          username: user.username,
          _id: user._id,
          avatar: user.avatar
        }
      });
      if (err) throw err;
      res.status(200).json(mappedUsers);
    });
  }
});

router.get('/self', (req, res) => {
  if (!req.user) {
    res.status(401).send({ message: 'Unauthorized' });
  } else {  
    User.findById(req.user.id, (err, self) => {
      if (err) throw err;
      res.status(200).json(self);
    });
  }
});

router.get('/allplayers', (req, res) => {
  if (!req.user) {
    res.status(401).send({ message: 'Unauthorized' })
  } else {
    User.findById({ _id: req.user.id })
     .populate('friends') 
     .exec((err, foundUser) => {
        if (err) {
          console.log('error getting friends: ', err);
          res.status(400).send({ message: err.message });
        } else {
          Guest.find({ host_user_id: foundUser._id }, (err, guests) => {
            if (err) throw err;

            let allPlayers = [];
            let { id, username, avatar, kind } = foundUser;
            let self = { id, username, avatar, kind };
            allPlayers.push(self);
            foundUser.friends.forEach(({ id, username, avatar, kind }) => allPlayers.push({ id, username, avatar, kind }));
            guests.forEach(({ id, username, avatar, kind }) => allPlayers.push({ id, username, avatar, kind }));
            console.log(allPlayers);            

            res.status(200).json(allPlayers);
          })
        }
      })
  }
})

router.post('/', (req, res) => {
  console.log('Incoming friend:', req.body)
  if (!req.user) {
    res.status(401).send({ message: "Unauthorized" });
  } else {
    User.findById(req.user.id, (err, foundUser) => {
      if (err) throw err;
      foundUser.friends.push(req.body.id);
      foundUser.save((err, savedUser) => {
        if (err) {
          console.log(err);
          res.status(400).send({ err: err.message })
        } else {
          console.log('saved user: ', savedUser)
          res.status(201).json({ message: 'ok' });
        }
      });
    });
  }
});

module.exports = router;

