// DEPENDENCIES
const express    = require('express');
const mongoose   = require('mongoose');
const bodyParser = require('body-parser');
const session    = require('express-session');
const morgan     = require('morgan');
require('dotenv').config();

// CONFIG
const app = express();
const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/botch_app'

// DB
mongoose.connect(mongoURI);

// CONTROLLERS
const playersController = require('./controllers/playersController');
const gamesController = require('./controllers/gamesController');
const gameSessionsController = require('./controllers/gameSessionsController');
const usersController = require('./controllers/usersController');
const importsController = require('./controllers/importsController');

// MIDDLEWARE
app.use(morgan('dev'));

app.use(session({
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: false,
  maxAge: 2592000000
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/players', playersController);
app.use('/games', gamesController);
app.use('/sessions', gameSessionsController);
app.use('/imports', importsController);
app.use('/users', usersController);

app.get('/', (req, res) => {
  res.send('Board game app API');
});

// LISTENER
app.listen(port, () => {
  console.log('BOTCH APP is running on port ' + port);
});
