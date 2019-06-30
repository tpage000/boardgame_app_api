'use strict'

// DEPENDENCIES
const express    = require('express');
const mongoose   = require('mongoose');
const jwt        = require('jsonwebtoken');
const morgan     = require('morgan');
const cors       = require('cors');

// CONFIG
const app = express();
const PORT = process.env.PORT || 2080;
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/boardgame_app_api'
require('dotenv').config();

// DB
mongoose.connect(mongoURI, { useMongoClient: true });
mongoose.connection.on('open', () => console.log('Mongo at: ', mongoURI));
mongoose.connection.on('error', (err) => console.log('DB err: ', err.message));

// CONTROLLERS
const authController = require('./controllers/authController');
const gamesController = require('./controllers/gamesController');
const sessionsController = require('./controllers/sessionsController');
const usersController = require('./controllers/usersController');
const friendsController = require('./controllers/friendsController');
const guestsController = require('./controllers/guestsController');
const statsController = require('./controllers/statsController');

// MIDDLEWARE
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const authorize = require('./middleware/authorization')

// Controllers as middleware -- protected routes use authUser
app.use('/auth', authController);
app.use('/users', authorize, usersController);
app.use('/games', authorize, gamesController);
app.use('/sessions', authorize, sessionsController);
app.use('/guests', authorize, guestsController);
app.use('/friends', authorize, friendsController);
app.use('/stats', authorize, statsController);

// Root API route
app.get('/', (req, res) => {
  res.send({ 
    message: 'Board game app API',
    documentation: 'https://github.com/tpage000/boardgame_app_api'
  });
});

app.get('*', (req, res) => res.status(400).send({ message: '404 Not Found' }));

// LISTENER
app.listen(PORT, () => console.log(`Boardgame API is running on port: ${PORT}`));

