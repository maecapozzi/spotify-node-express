require('dotenv').config()

const clientId = process.env.SPOTIFY_CLIENT_ID
const clientSecret = process.env.SPOTIFY_SECRET
const controllers = require('./app/controllers')
const cookieParser = require('cookie-parser')
const express = require('express')
const passport = require('passport')
let LocalStorage = require('node-localstorage').LocalStorage
localStorage = new LocalStorage('./localStorage')
const SpotifyStrategy = require('./lib/passport-spotify/index').Strategy
const cors = require('cors')
const request = require('request')

passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(function (obj, done) {
  done(null, obj)
})

passport.use(new SpotifyStrategy({
  clientID: clientId,
  clientSecret: clientSecret,
  callbackURL: 'http://localhost:3001/callback'
},
  (accessToken, refreshToken, profile, done) => {
    console.log(accessToken)
    localStorage.setItem('access_token', accessToken)
    localStorage.setItem('refresh_token', refreshToken)

    process.nextTick(function () {
      return done(null, profile)
    })
  }))

const app = express()

app.use('/', controllers)
app.set('views', __dirname + '/app/views')
app.set('view engine', 'pug')
app.use(express.static(__dirname + '/public'))
  .use(cookieParser())
app.use(passport.initialize())
app.use(passport.session())

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/auth/spotify',
  passport.authenticate('spotify', {
    scope: ['user-read-email', 'user-read-private'], showDialog: true
  }), (req, res) => {})

app.get('/callback',
  passport.authenticate('spotify', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('http://localhost:3000')
  })

app.get('/refresh_token', function (req, res) {
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
    console.log(refresh_token)
    console.log(response.body.error)
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token
      res.send({
        'access_token': access_token
      })
    }
  })
})

app.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})
app.get('/search', (req, res) => {
  search.searchTracks(req, res)
})

app.get('/analyze/:id', cors(), (req, res) => {
  const id = req.params.id
  trackAnalysis.analyzeTrack(req, res, id)
})

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
