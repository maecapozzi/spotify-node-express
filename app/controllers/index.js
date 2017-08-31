const routes = require('express').Router()
const search = require('../helpers/search')
const authHelpers = require('../helpers/authentication')
const querystring = require('querystring')
const clientId = process.env.SPOTIFY_CLIENT_ID
const redirectUri = 'http://localhost:3001/callback'
const stateKey = 'spotify_auth_state'
const request = require('request')
const trackAnalysis = require('./tracks/audioAnalysis')
const cors = require('cors')

routes.get('/', cors(), (req, res) => {
  res.render('index')
})

routes.get('/login', (req, res) => {
  const state = authHelpers.generateRandomString(16)
  res.cookie(stateKey, state)
  const scope = 'user-read-private user-read-email'

  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: clientId,
      scope: scope,
      redirect_uri: redirectUri,
      state: state
    })
  )
})

routes.get('/search', cors(), (req, res) => {
  if (req.query.track) {
    search.searchTracks(req, res)
  } else {
    search.searchArtists(req, res)
  }
})

routes.get('/analyze/:id', (req, res) => {
  const id = req.params.id
  trackAnalysis.analyzeTrack(req, res, id)
})

routes.get('/tracks/:id', (req, res) => {
  res.render()
})


module.exports = routes
