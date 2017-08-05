require('dotenv').config()

const LocalStorage = require('node-localstorage').LocalStorage
localStorage = new LocalStorage('./localStorage')

const express = require('express')
const request = require('request')
const path = require("path")
const controllers = require('./app/controllers')
const querystring = require('querystring')
const cookieParser = require('cookie-parser')
const client_id = process.env.SPOTIFY_CLIENT_ID
const client_secret = process.env.SPOTIFY_SECRET
const redirect_uri = 'http://localhost:3000/callback'
const stateKey = 'spotify_auth_state'

const app = express()

app.use('/', controllers)
app.set('views', __dirname + '/app/views')
app.set('view engine', 'pug')
app.use(express.static(__dirname + '/public'))
.use(cookieParser())

app.get('/callback', function(req, res) {
  // your application requests refresh and access tokens
  // after checking the state parameter
  const code = req.query.code || null
  const state = req.query.state || null
  const storedState = req.cookies ? req.cookies[stateKey] : null

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }))
  } else {
    res.clearCookie(stateKey)
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    }

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        const access_token = body.access_token,
        refresh_token = body.refresh_token

        localStorage.setItem('access_token', access_token)

        const options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        }

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          console.log(options)
          console.log(body)
        })

        // we can also pass the token to the browser to make requests from there
        res.redirect('/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }))
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }))
      }
    })
  }
})

app.get('/refresh_token', function(req, res) {
  // requesting access token from refresh token
  const refresh_token = req.query.refresh_token;
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      const access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});

//access db auth from env
const dbUsername = process.env.SPOTIFY_DB_USERNAME
const dbPassword = process.env.SPOTIFY_DB_PASSWORD
const MongoClient = require('mongodb').MongoClient

MongoClient.connect("mongodb://" + dbUsername + ":" + dbPassword + "@ds121171.mlab.com:21171/spotify-node-express", (err, database) => {
  if (err) return console.log(err)
    db = database

  app.listen(3000, (err) => {
    console.log('server is listening on 3000')
  })
})

console.log('Listening on 8888')
app.listen(8888)
