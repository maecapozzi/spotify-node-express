require('dotenv').config()

const express = require('express')
const request = require('request')
const controllers = require('./app/controllers')
const querystring = require('querystring')
const cookieParser = require('cookie-parser')
const clientId = process.env.SPOTIFY_CLIENT_ID
const clientSecret = process.env.SPOTIFY_SECRET
const cors = require('cors')

let LocalStorage = require('node-localstorage').LocalStorage
localStorage = new LocalStorage('./localStorage')

const app = express()

app.use('/', controllers)
app.set('views', __dirname + '/app/views')
app.set('view engine', 'pug')
app.use(express.static(__dirname + '/public'))
  .use(cookieParser())

app.get('/callback', cors(), function (req, res) {
  const stateKey = 'spotify_auth_state'
  const state = req.query.state || null
  const storedState = req.cookies ? req.cookies[stateKey] : null

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

app.get('/refreshToken', cors(), function (req, res) {
  const refreshToken = localStorage.getItem('refresh_token')
  console.log(refreshToken)
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      refresh_token: refreshToken,
      grant_type: 'refresh_token'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(clientId + ':' + clientSecret).toString('base64'))
    },
    json: true
  }

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      const accessToken = body.access_token
      const refreshToken = body.refresh_token

      localStorage.setItem('access_token', accessToken)

      res.redirect('/#' +
        querystring.stringify({
          access_token: accessToken,
          refresh_token: refreshToken
        })
      )
    } else {
      res.redirect('/#' +
        querystring.stringify({
          error: 'invalid_token'
        })
      )
    }
  })
})

const setTokens = (body, res) => {
  const accessToken = body.access_token
  const refreshToken = body.refresh_token
  const expiresIn = body.expires_in

  localStorage.setItem('access_token', accessToken)
  localStorage.setItem('expires_in', expiresIn)
  localStorage.setItem('refresh_token', refreshToken)

  res.redirect('/#' +
    querystring.stringify({
      access_token: accessToken,
      refresh_token: refreshToken
    })
  )
}

const requestTokensFromSpotify = (req, res) => {
  const code = req.query.code || null
  const redirectUri = 'http://localhost:3001/callback'

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

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      setTokens(body, res)
    } else {
      console.log('failure')
      res.redirect('/#' +
        querystring.stringify({
          error: 'invalid_token'
        })
      )
    }
  })
}

// access db auth from env
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

module.exports = app
