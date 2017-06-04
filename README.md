# Boardgame tracker app API

## [Example site with Angular client](https://botch-app.herokuapp.com/)

<br>

FEATURES

* Curate your games collection
* See games played
* Manage players

<br>

**ENDPOINTS**

GET

* `/games` See all boardgames you've added to your collection. If not authenticated, returns example data.
* `/games/:id` See just one one your boardgames, with more detail on expansions. Get the `:id` from `/games`.
* `/sessions` See all the f.u.n. boardgame sessions you've had, with times, scores, comments, etc. If not authenticated, returns example data.
* `/sessions/:id` See all the boardgame sessions for a particular game. Get the `:id` from `/games`. 
* `/players` See all the people with whom you play these boardgames. If not authenticated, returns example data.

<br>

POST

Authenticate

* `/users` to register and receive a JSON Web Token in the response. Body data: `username` and `password`.
* `/users/login` to log back in and receive a JSON Web Token in the response. Body data: `username` and `password`.

All subsequent requests to endpoints other than `/users` should have an `x-access-token` header with the value of the JSON Web Token.

Token expires in 7 days.

<br>

POST

Add stuff to your account

* `/games` add a game (lotsa body data to provide...)
* JSON boardgame data can found at `'https://bgg-json.azurewebsites.net/thing/'` + BoardGameGeek game id. Use it to populate the new game request. A frontend client can query the JSON api then just swoop that stuff into the request.
* `/sessions` add a session (TBA)
* `/players` add a player (TBA)

<br>


SERVER: Node & Express
DB: Mongo & Mongoose

