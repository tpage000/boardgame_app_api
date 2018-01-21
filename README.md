# Boardgame tracker app API

**[React client](https://github.com/singular000/boardgame_app_react_client)**

**[Hosted Angular client using older version of API](https://botch-app.herokuapp.com/)**

<br>

FEATURES

* Curate your collection of boardgames
* See games (sessions) played -- with players and scores
* Manage players
* See dates when a boardgame was played, and track the number of plays

<br>
To run, add a `.env` file with `JWT_SECRET=yoursecret`
<br>

**ENDPOINTS**

GET

* **`/games`** See all boardgames you've added to your collection. If not authenticated, returns example data.
* **`/games/:id`** See just one one your boardgames, with more detail including the game's sessions. Get the `:id` from `/games`.
* **`/sessions`** See all the boardgame sessions you've had, with times, scores, comments, etc. If not authenticated, returns example data.
* **`/sessions/:game_id`** See just the boardgame sessions for a particular game. Get the `:game_id` from `/games`. 
* **`/players`** See all the people with whom you play these boardgames. If not authenticated, returns example data.

<br>

POST

Authenticate

* **`/users`** to register and receive a JSON Web Token in the response. Body data: `username` and `password`.
* **`/users/login`** to log back in and receive a JSON Web Token in the response. Body data: `username` and `password`.

All subsequent requests to base routes other than **`/users`** should have an **`x-access-token`** header with the value of the JSON Web Token.

Token expires in 7 days.

<br>

POST

Add stuff to your account

* **`/games`** add a game (lotsa body data to provide...)
* JSON boardgame data can found at **`'https://bgg-json.azurewebsites.net/thing/'` + BoardGameGeek game id**. Use it to populate the new game request. A frontend client can query the JSON api then just swoop that stuff into the request.
* **`/sessions`** add a game session. Body data: 
  * **`date`** _required_
  * **`game`** with the id of the game in your collection. _required_
  * **`comments`** _optional_
  * **`gameresults`** is an array of objects. _required_. Each object contains:
    * **`player`** with the id of the player. _required_ 
    * **`score`**, a number. _required_
* **`/players`** add a player. Body data: 
  * **`name`** _required_
  * **`avatar`** an img url (img ideally 100x100px). _optional_. A default avatar is provided
  * **`date`**, a date when the player joined. 

<br>


SERVER: Node & Express
DB: Mongo & Mongoose

