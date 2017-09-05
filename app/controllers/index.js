const authHelpers = require('../helpers/authentication')
const cors = require('cors')
const routes = require('express').Router()
const search = require('../helpers/search')
const trackAnalysis = require('./tracks/audioAnalysis')
const querystring = require('querystring')

routes.get('/', cors(), (req, res) => {
  res.render('index')
})

routes.get('/login', (req, res) => {
  const clientId = process.env.SPOTIFY_CLIENT_ID
  const redirectUri = 'http://localhost:3001/callback'
  const stateKey = 'spotify_auth_state'
  const state = authHelpers.generateRandomString(16)
  const scope = 'user-read-private user-read-email'

  res.cookie(stateKey, state)

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
  search.searchTracks(req, res)
})

routes.get('/analyze/:id', (req, res) => {
  const id = req.params.id
  trackAnalysis.analyzeTrack(req, res, id)
})

routes.get('/tracks/:id', (req, res) => {
  res.render()
})

module.exports = routes
