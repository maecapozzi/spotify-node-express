const routes = require('express').Router()
const login = require('./authentication/login')
const authHelpers = require('../helpers/authentication')
const cookieParser = require('cookie-parser')
const querystring = require('querystring')
const client_id = process.env.SPOTIFY_CLIENT_ID
const client_secret = process.env.SPOTIFY_SECRET
const redirect_uri = 'http://localhost:3000/callback'
const stateKey = 'spotify_auth_state'

routes.get('/', (req, res) => {
  res.render('index')
})

routes.get('/login', function(req, res) {
  const state = authHelpers.generateRandomString(16)
  res.cookie(stateKey, state)
  const scope = 'user-read-private user-read-email'

  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    })
  )
})

module.exports = routes;
