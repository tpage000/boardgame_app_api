// DEPENDENCIES
const express    = require('express');
const mongoose   = require('mongoose');
const bodyParser = require('body-parser');
const session    = require('express-session');
const morgan     = require('morgan');
const cors       = require('cors');
require('dotenv').config();

// CONFIG
const app = express();
const port = process.env.PORT || 2080;
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/botch_app'

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

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  maxAge: 2592000000,
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Controllers as middleware
app.use('/players', playersController);
app.use('/games', gamesController);
app.use('/sessions', gameSessionsController);
app.use('/users', usersController);

app.get('/', (req, res) => {
  res.send('Board game app API');
});

// LISTENER
app.listen(port, () => {
  console.log('Boardgame API is running on port: ' + port);
});

