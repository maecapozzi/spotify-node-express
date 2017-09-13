require('dotenv').config()

const express = require('express')
const request = require('request')
const controllers = require('./app/controllers')
const querystring = require('querystring')
const cookieParser = require('cookie-parser')
const clientId = process.env.SPOTIFY_CLIENT_ID
const clientSecret = process.env.SPOTIFY_SECRET
const cors = require('cors')
const SpotifyStrategy = require('./lib/passport-spotify/index').Strategy
const passport = require('passport')

let LocalStorage = require('node-localstorage').LocalStorage
localStorage = new LocalStorage('./localStorage')

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
    console.log(refreshToken)
    // asynchronous verification, for effect...
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

app.get('/auth/spotify',
  passport.authenticate('spotify', {
    scope: ['user-read-email', 'user-read-private'], showDialog: true
  }), (req, res) => {

  })

app.get('/callback',
  passport.authenticate('spotify', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/')
  })

app.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

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
