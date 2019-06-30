const express = require('express');
const router = express.Router();
const Game = require('../models/game');
const Session = require('../models/session');
const exampleGames = require('../data/exampleGames');
const rp = require('request-promise');
const parseXML = require('xml2js').parseString;

// index of user's games -- req.user set by auth middleware
// if no req.user, send examples instead
router.get('/', (req, res) => {
  if (!req.user) {
    res.json(exampleGames)
  } else {
    Game.find({ user_id: req.user.id }, (err, foundGames) => {
      if (err) {
        res.status(400).send({ message: err.message });
      } else {
        const reversedGames = foundGames.slice().reverse();
        res.status(200).json(reversedGames);
      }
    })
  }
});

// search external API for a set of matching title results
router.get('/search', async (req, res) => {
  let title = req.query.title;
  let options = {
    uri: `https://boardgamegeek.com/xmlapi2/search?query=${title}&type=boardgame`
  }
  try {
    let searchResult = await rp(options);
    parseXML(searchResult, (err, json) => {
      if (err) res.status(400).json({ err: err.message })
      let constructedResult = json.items.item.map(item => {
        let yearPublished = null;
        if (item.yearpublished) {
          yearPublished = item.yearpublished[0].$.value
        }
        let newItem = {
          name: item.name[0].$.value,
          id: item.$.id,
          yearPublished
        }
        return newItem;
      })
      res.status(200).json(constructedResult);
    })
  } catch (err) {
    res.status(400).send(err);
  }
});

// show a game and its related sessions
router.get('/:id', (req, res) => {
  Game.findById(req.params.id, (err, foundGame) => {
    if (err) {
      res.status(400).send({ message: err.message });
    }
    Session.find({ game: req.params.id}, null, {sort: '-date'}, (err, sessions) => {
      if (err) throw err;
      const opts = [{ path: 'gameresults.player.info', select: 'username avatar'}]
      const promise = Session.populate(sessions, opts)
      promise.then((gameSessions) => {
        res.json({ game: foundGame, sessions: gameSessions });
      });
    });
  });
});

// query an external API for extended details of a single game
router.get('/query/:id', async (req, res) => {
  let options = {
    uri: `https://bgg-json.azurewebsites.net/thing/${req.params.id}`,
    json: true
  }
  try {
    let gameResult = await rp(options) 
    res.status(200).json(gameResult)
  } catch (err) {
    res.status(400).send({ message: err.message })
  }
})

// create a new game belonging to the user -- req.user comes from auth
// middleware
router.post('/', (req, res) => {
  if (!req.user) {
    res.status(401).send({ message: "Unauthorized" });
  } else {
    req.body.user_id = req.user.id;
    Game.create(req.body, (err, newGame) => {
      if (err) {
        res.status(400).send({ message: err.message });
      } else {
        res.status(200).json(newGame);
      }
    });
  }
});

module.exports = router;
