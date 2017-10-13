require('dotenv').config()

const clientId = process.env.SPOTIFY_CLIENT_ID
const clientSecret = process.env.SPOTIFY_SECRET
const search = require('./app/helpers/search')
const trackAnalysis = require('./app/controllers/tracks/audioAnalysis')
const cookieParser = require('cookie-parser')
var cookieSession = require('cookie-session')
const express = require('express')
const passport = require('passport')
let LocalStorage = require('node-localstorage').LocalStorage
localStorage = new LocalStorage('./localStorage')
const SpotifyStrategy = require('./lib/passport-spotify/index').Strategy
const cors = require('cors')
const request = require('request')
// const CALLBACK_URL = 'https://spotify-viz-api.herokuapp.com/callback/'
// const FRONTEND_URL = 'https://spotify-viz-frontend.herokuapp.com'
const CALLBACK_URL = 'http://localhost:3001/callback'
const FRONTEND_URL = 'http://localhost:3000'

passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(function (obj, done) {
  done(null, obj)
})

const app = express()
app.use(express.static(__dirname + '/public'))
  .use(cookieParser())
app.use(passport.initialize())
app.use(passport.session())
app.use(cookieSession({
  name: 'session',
  secret: 'keyboard_cat',
  maxAge: 24 * 60 * 60 * 1000
}))
app.set('views', __dirname + '/app/views')
app.set('view engine', 'pug')

let stateKey = 'spotify_auth_state'

app.get('/', cors(), (req, res) => {
  console.log(req.session.id)
  if (req.session.id === undefined) {
    res.sendStatus(401)
  } else {
    res.sendStatus(200)
  }
})

passport.use(new SpotifyStrategy({
  clientID: clientId,
  clientSecret: clientSecret,
  callbackURL: CALLBACK_URL
},
  (accessToken, refreshToken, profile, done) => {
    process.nextTick(function () {
      let user = { spotifyId: profile.id, access_token: accessToken, refresh_token: refreshToken }
      return done(null, user)
    })
  }))

app.get('/auth/spotify',
  passport.authenticate('spotify', {
    scope: ['user-read-email', 'user-read-private']
  }), (req, res) => {})

app.get('/callback', passport.authenticate('spotify', { failureRedirect: '/' }), (req, res) => {
  req.session.id = req.user.spotifyId
  localStorage.setItem('access_token_' + req.session.id, req.user.access_token)
  localStorage.setItem('refresh_token_' + req.session.id, req.user.refresh_token)

  res.redirect(FRONTEND_URL)
})

app.get('/refreshToken', function (req, res) {
  var refresh_token = localStorage.getItem('refresh_token')

  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Authorization': 'Basic ' + (new Buffer(clientId + ':' + clientSecret).toString('base64'))
    },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  }

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var accessToken = body.access_token
      localStorage.setItem('access_token', accessToken)
      res.send({
        'access_token': accessToken
      })
    }
  })
})

app.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

app.get('/search', cors(), (req, res) => {
  search.searchTracks(req, res)
})

app.get('/analyze/:id', cors(), (req, res) => {
  const id = req.params.id
  trackAnalysis.analyzeTrack(req, res, id)
})

const dbUsername = process.env.SPOTIFY_DB_USERNAME
const dbPassword = process.env.SPOTIFY_DB_PASSWORD
const MongoClient = require('mongodb').MongoClient
const port = process.env.PORT || 3001

MongoClient.connect('mongodb://' + dbUsername + ':' + dbPassword + '@ds121171.mlab.com:21171/spotify-node-express', (err) => {
  if (err) return console.log(err)

  app.listen(port, (err) => {
    if (err) {
      console.log('something is broken')
    }
    console.log('server is listening on 3001')
  })
})

module.exports = app
