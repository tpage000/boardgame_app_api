# Boardgame tracker app API



**[Angular client consuming API](https://botch2.herokuapp.com/)**

**[API on Heroku](https://botch-app-api.herokuapp.com/)**

---

FEATURES

* Curate your collection of boardgames
* See games (sessions) played -- with players and scores
* Manage players
* See dates when a boardgame was played, and track the number of plays

---

To use locally:

* Add a `.env` file with `JWT_SECRET=yoursecret`
* Mongo server running

---

**ENDPOINTS**

AUTH

* **`POST /auth/login`** to log back and receive a JSON Web Token in the response. Body data: `username` and `password`.
* **`POST /auth/register`** to register and receive a JSON Web Token in the response. Body data: `username` and `password`.

All subsequent requests to base routes other than **`/auth`** should have an **`x-access-token`** header with the value of the JSON Web Token.

Token expires in 7 days.

<br>

GAMES

* **`GET /games`** See all boardgames you've added to your collection.
* **`GET /games/:id`** See just one one your boardgames, with more detail including the game's sessions.
* **`POST /games`** add a game
	* JSON boardgame data can found at **`'https://bgg-json.azurewebsites.net/thing/'` + BoardGameGeek game id**. Use it to populate the new game request. A frontend client can query the JSON api then just swoop that stuff into the request.

<br>

SESSIONS

* **`GET /sessions`** See all the boardgame sessions you've had, with times, scores, comments, etc.
* **`GET /sessions/:game_id`** See just the boardgame sessions for a particular game. 
* **`POST /sessions`** add a game session. Body data: 
  * **`date`** _required_
  * **`game`** with the id of the game in your collection. _required_
  * **`comments`** _optional_
  * **`gameresults`** is an array of objects. _required_. Each object contains:
		* **`player`** with the id of the player. _required_ 
    	* **`score`**, a number. _required_

USERS

* tbd

FRIENDS

* tbd

GUESTS

* tbd

STATS

* tbd


---


SERVER: Node

DB: Mongo

