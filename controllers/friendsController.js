const express = require('express');
const router = express.Router();
// const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Guest = require('../models/guest');
const Game = require('../models/game');
const Session = require('../models/session');

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

// all the friends and guests and oneself
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

router.get('/:id', async (req, res) => {
  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized' })
  } else {
    let user = await User.findById(req.user.id);
    let friend = await User.findById(req.params.id);
    console.log(`the friend is ${friend.username} ${friend._id}`)

    let foundFriend = user.friends.find(foundFriend => parseInt(foundFriend) == parseInt(friend._id));

    if (foundFriend) {
      console.log(`USER ${foundFriend.username} IS A FRIEND OF THE LOGGED-IN USER`)

      let games = await Game.find({ user_id: friend._id })
      let sessions = await Session.find({ user_id: friend._id })
      const opts = [{ path: 'game', select: 'name thumbnail'}, { path: 'gameresults.player.info', select: 'username avatar'}]
      await Session.populate(sessions, opts)
      res.send({ friend, games, sessions });

    } else {
      console.log('NOT A FRIEND OF THE LOGGED IN USER')
      res.status(401).json({ message: 'Not a friend' })
    }
  }
})

module.exports = router;

