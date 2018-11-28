// DEPENDENCIES
const express    = require('express');
const mongoose   = require('mongoose');
const jwt        = require('jsonwebtoken');
const morgan     = require('morgan');
const cors       = require('cors');

// CONFIG
const app = express();
const port = process.env.PORT || 2080;
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/boardgame_app_api'
require('dotenv').config();

// DB
mongoose.connect(mongoURI, { useMongoClient: true });
mongoose.connection.on('open', () => console.log('Mongo at: ', mongoURI));
mongoose.connection.on('error', (err) => console.log('DB err: ', err.message));

// CONTROLLERS
const guestsController = require('./controllers/guestsController');
const gamesController = require('./controllers/gamesController');
const gameSessionsController = require('./controllers/gameSessionsController');
const usersController = require('./controllers/usersController');
const friendsController = require('./controllers/friendsController');
const statsController = require('./controllers/statsController');

// MIDDLEWARE
app.use(morgan('dev'));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
app.use('/guests', authUser, guestsController);
app.use('/friends', authUser, friendsController);
app.use('/stats', authUser, statsController);

// Root API route
app.get('/', (req, res) => {
  res.send({ 
    message: 'Board game app API',
    documentation: 'https://github.com/tpage000/boardgame_app_api'
  });
});

// LISTENER
app.listen(port, () => {
  console.log('Boardgame API is running on port: ' + port);
});

