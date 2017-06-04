// DEPENDENCIES
const express    = require('express');
const mongoose   = require('mongoose');
const bodyParser = require('body-parser');
const jwt        = require('jsonwebtoken');
const morgan     = require('morgan');
const cors       = require('cors');

// CONFIG
const app = express();
const port = process.env.PORT || 2080;
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/boardgame_app_api'
require('dotenv').config();

// DB
mongoose.connect(mongoURI, () => console.log('Mongo running at: ', mongoURI));

// CONTROLLERS
const playersController = require('./controllers/playersController');
const gamesController = require('./controllers/gamesController');
const gameSessionsController = require('./controllers/gameSessionsController');
const usersController = require('./controllers/usersController');

// MIDDLEWARE
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Auth middleware
const authUser = (req, res, next) => {
  console.log('Running auth middleware...');
  const token = req.headers['x-access-token']
  if (!token) {
    console.log('no auth token, no user set in req.user')
    return next();
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        console.log('failed to authenticate, no user set in req.user')
        return next();
      } else {
        console.log('decoded token: ', decodedToken);
        req.user = decodedToken;
        next();
      }
    });
  }
}

// Controllers as middleware -- protected routes use authUser
app.use('/users', usersController);
app.use('/games', authUser, gamesController);
app.use('/sessions', authUser, gameSessionsController);
app.use('/players', authUser, playersController);

// Root API route
app.get('/', (req, res) => {
  res.send('Board game app API');
});

// LISTENER
app.listen(port, () => {
  console.log('Boardgame API is running on port: ' + port);
});

