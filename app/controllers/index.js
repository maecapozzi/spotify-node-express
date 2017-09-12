const authHelpers = require('../helpers/authentication')
const cors = require('cors')
const routes = require('express').Router()
const search = require('../helpers/search')
const trackAnalysis = require('./tracks/audioAnalysis')
const querystring = require('querystring')
const request = require('request')

routes.get('/', (req, res) => {
  res.render('index')
})

// I can't hit Spotify's API from the client side. I need to hit it from the server side. The problem is that the redirect makes Spotify think that I am trying to hit it from the client. How do I just get the /authorize endpoint, rather than redirecting to it.

routes.get('/login', cors(), (req, res) => {
  const clientId = process.env.SPOTIFY_CLIENT_ID
  const redirectUri = 'http://localhost:3001/callback'
  const stateKey = 'spotify_auth_state'
  const state = authHelpers.generateRandomString(16)
  const scope = 'user-read-private user-read-email'

  res.cookie(stateKey, state)

  res.send('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: clientId,
      scope: scope,
      redirect_uri: redirectUri,
      state: state
    })
  )
})

routes.get('/search', (req, res) => {
  search.searchTracks(req, res)
})

routes.get('/analyze/:id', cors(), (req, res) => {
  const id = req.params.id
  trackAnalysis.analyzeTrack(req, res, id)
})

module.exports = routes
