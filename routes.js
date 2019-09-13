const cors = require('cors')
let LocalStorage = require('node-localstorage').LocalStorage
localStorage = new LocalStorage('./localStorage')
const passport = require('passport')
let session = require('express-session')
const search = require('./app/helpers/search')
const store = require('./store')
const trackAnalysis = require('./app/helpers/audioAnalysis')
const request = require('request')
const routes = require('express').Router()

const clientId = process.env.SPOTIFY_CLIENT_ID
const clientSecret = process.env.SPOTIFY_SECRET

const CALLBACK_URL = process.env.CALLBACK_URL || 'http://localhost:3001/callback'
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000'

const SpotifyStrategy = require('./lib/passport-spotify/index').Strategy

const corsOptions = {
  origin: FRONTEND_URL,
  credentials: true
}

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((obj, done) => {
  done(null, obj)
})

routes.use(session({
  key: 'user_sid',
  secret: 'keyboard_cat',
  resave: false,
  saveUninitialized: true,
  cookie: { expires: 60000 * 60 * 24, secure: false, httpOnly: false }

}))

routes.use(passport.initialize())
routes.use(passport.session())

passport.use(new SpotifyStrategy({
  clientID: clientId,
  clientSecret: clientSecret,
  callbackURL: CALLBACK_URL
},
  (accessToken, refreshToken, profile, done) => {
    process.nextTick(() => {
      let user = { spotifyId: profile.id, access_token: accessToken, refresh_token: refreshToken }
      const spotifyId = profile.id
      store.findOrCreateUser(spotifyId, accessToken, refreshToken)
      return done(null, user)
    })
  }))

routes.get('/auth/spotify',
  passport.authenticate('spotify', {scope: ['user-read-email', 'user-read-private'], showDialog: true}),
  (req, res) => {
  })

routes.get('/callback', passport.authenticate('spotify', { failureRedirect: '/' }), (req, res) => {
  const sessionId = req.session.id
  const spotifyId = req.user.spotifyId
  store.setSessionId(spotifyId, sessionId)
  localStorage.setItem('access_token_' + req.session.id, req.user.access_token)
  localStorage.setItem('refresh_token_' + req.session.id, req.user.refresh_token)
  res.redirect(FRONTEND_URL)
})

routes.get('/refreshToken', (req, res) => {
  var refresh_token = localStorage.getItem('refresh_token')

  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(clientId + ':' + clientSecret).toString('base64'))
    },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  }

  request.post(authOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      var accessToken = body.access_token
      localStorage.setItem('access_token', accessToken)
      res.send({
        'access_token': accessToken
      })
    }
  })
})

routes.get('/', cors(corsOptions), (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ isAuthenticated: true })
  } else {
    res.status(200).json({ isAuthenticated: false })
  }
})

routes.get('/search', cors(corsOptions), (req, res) => {
  search.searchTracks(req, res)
})

routes.get('/analyze/:id', cors(corsOptions), (req, res) => {
  const id = req.params.id
  trackAnalysis.analyzeTrack(req, res, id)
})

routes.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})

module.exports = routes
