const express = require('express');
const router = express.Router();

const User = require('../models/user');

// index
router.get('/', (req, res) => {
  User.find((err, users) => {
    if (err) throw err;
    res.json(users);
  });
});

router.get('/loggedIn', (req, res) => {
  if (!req.session.loggedInUser) {
    res.json({ status: 404, message: 'No user logged in' });
  } else {
    User.findOne({ username: req.session.loggedInUser.username }, (err, foundUser) => {
      res.json({ status: 200, user: foundUser });
    });
  }
});

// create
router.post('/', (req, res) => {
  User.create(req.body, (err, user) => {
    if (err) {
      res.json({ status: 422, error: err });
    } else {
      req.session.loggedInUser = { username: user.username, id: user.id }
      console.log('user is logged in: ', req.session.loggedInUser);
      res.json({ status: 201, user: user });
    }
  });
});

// authenticate
router.post('/login', (req, res) => {
  console.log('request from client: ', req.body)
  User.findOne({ username: req.body.username }, (err, foundUser) => {
    if (!foundUser) {
      console.log('Authentication error: no user found');
      res.status(401).send({ err: 'Username not found' });
    } else if (foundUser.authenticate(req.body.password)) {
      req.session.loggedInUser = { username: foundUser.username, id: foundUser.id }
      console.log('user is logged in: ', req.session.loggedInUser);
      res.json({ status: 200, user: foundUser });
    } else {
      console.log('Authentication error: password does not match');
      res.json({ status: 401, err: 'Wrong password' });
    }
  });
});

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    res.json({ status: 204 });
  });
});

module.exports = router;
