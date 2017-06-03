const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// index
router.get('/', (req, res) => {
  User.find((err, users) => {
    if (err) throw err;
    res.json(users);
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
      const token = jwt.sign({
          id: foundUser.id, 
          username: foundUser.username
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      )
      res.json({ status: 200, username: foundUser.username, token: token });
    } else {
      console.log('Authentication error: password does not match');
      res.json({ status: 401, err: 'Wrong password' });
    }
  });
});

// create
router.post('/', (req, res) => {
  console.log('request from client: ', req.body);
  User.create(req.body, (err, createdUser) => {
    if (err) {
      console.log('error saving user: ');
      res.status(400).send({ err: err });
    } else {
      const token = jwt.sign({
          id: foundUser.id, 
          username: foundUser.username
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      )
      res.json({ status: 201, user: createdUser, token: token })
    }
  });
});

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    res.json({ status: 204 });
  });
});

// router.get('/loggedIn', (req, res) => {
//   if (!req.session.loggedInUser) {
//     res.json({ status: 404, message: 'No user logged in' });
//   } else {
//     User.findOne({ username: req.session.loggedInUser.username }, (err, foundUser) => {
//       res.json({ status: 200, user: foundUser });
//     });
//   }
// });

module.exports = router;
