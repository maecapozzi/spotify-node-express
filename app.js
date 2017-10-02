require('dotenv').config()

const clientId = process.env.SPOTIFY_CLIENT_ID
const clientSecret = process.env.SPOTIFY_SECRET
const search = require('./app/helpers/search')
const trackAnalysis = require('./app/controllers/tracks/audioAnalysis')
const cookieParser = require('cookie-parser')
const express = require('express')
const passport = require('passport')
let LocalStorage = require('node-localstorage').LocalStorage
localStorage = new LocalStorage('./localStorage')
const SpotifyStrategy = require('./lib/passport-spotify/index').Strategy
const cors = require('cors')
const request = require('request')
const CALLBACK_URL = 'https://spotify-viz-api.herokuapp.com/callback'
const FRONTEND_URL = 'http://spotify-viz-frontend.herokuapp.com'

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
    localStorage.setItem('access_token', accessToken)
    localStorage.setItem('refresh_token', refreshToken)

    process.nextTick(function () {
      return done(null, profile)
    })
  }))

const app = express()
app.use(express.static(__dirname + '/public'))
  .use(cookieParser())
app.use(passport.initialize())
app.use(passport.session())
app.set('views', __dirname + '/app/views')
app.set('view engine', 'pug')

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

// app.get('/tokens', cors(), (req, res) => {
//   const accessToken = localStorage.getItem('access_token')
//   var authOptions = {
//     url: 'https://api.spotify.com/v1/me',
//     headers: {
//       'Authorization': 'Bearer ' + accessToken
//     },
//     json: true
//   }

//   request.get(authOptions, (error, response, body) => {
//     if (!error && response.statusCode === 200) {
//       res.sendStatus(response.statusCode)
//     } else {
//       res.send(error)
//     }
//   })
// })

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
