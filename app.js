require('dotenv').config()

const express = require('express')
const request = require('request')
const controllers = require('./app/controllers')
const querystring = require('querystring')
const cookieParser = require('cookie-parser')
const clientId = process.env.SPOTIFY_CLIENT_ID
const clientSecret = process.env.SPOTIFY_SECRET

let LocalStorage = require('node-localstorage').LocalStorage
localStorage = new LocalStorage('./localStorage')

const app = express()

app.use('/', controllers)
app.set('views', __dirname + '/app/views')
app.set('view engine', 'pug')
app.use(express.static(__dirname + '/public'))
  .use(cookieParser())

app.get('/callback', function(req, res) {
  const stateKey = 'spotify_auth_state',
    state = req.query.state || null,
    storedState = req.cookies ? req.cookies[stateKey] : null

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      })
    )
  } else {
    res.clearCookie(stateKey)
    requestTokensFromSpotify(req, res)
  }
})

const setTokens = (body, res) => {
  const access_token = body.access_token,
    refresh_token = body.refresh_token

  localStorage.setItem('access_token', access_token)

  res.redirect('/#' +
    querystring.stringify({
      access_token: access_token,
      refresh_token: refresh_token
    })
  )
}

const requestTokensFromSpotify = (req, res) => {
  const code = req.query.code || null,
    redirectUri = 'http://localhost:3001/callback'

  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(clientId + ':' + clientSecret).toString('base64'))
    },
    json: true
  }

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      setTokens(body, res)
    } else {
      res.redirect('/#' +
        querystring.stringify({
          error: 'invalid_token'
        })
      )
    }
  })
}

app.get('/refresh_token', function(req, res) {
  // requesting access token from refresh token
  const refresh_token = req.query.refresh_token
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(clientId + ':' + clientSecret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  }

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      const access_token = body.access_token
      res.send({
        'access_token': access_token
      })
    }
  })
})

//access db auth from env
const dbUsername = process.env.SPOTIFY_DB_USERNAME
const dbPassword = process.env.SPOTIFY_DB_PASSWORD
const MongoClient = require('mongodb').MongoClient

MongoClient.connect('mongodb://' + dbUsername + ':' + dbPassword + '@ds121171.mlab.com:21171/spotify-node-express', (err) => {
  if (err) return console.log(err)

  app.listen(3001, (err) => {
    if (err) {
      console.log('something is broken')
    }
    console.log('server is listening on 3001')
  })
})

console.log('Listening on 8888')
app.listen(8888)
