const routes = require('express').Router()
const login = require('./authentication/login')
const search = require('../helpers/search')
const authHelpers = require('../helpers/authentication')
const cookieParser = require('cookie-parser')
const querystring = require('querystring')
const client_id = process.env.SPOTIFY_CLIENT_ID
const client_secret = process.env.SPOTIFY_SECRET
const redirect_uri = 'http://localhost:3001/callback'
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
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    })
  )
})

routes.get('/profile', (req, res) => {
  const access_token = localStorage.getItem('access_token')
  const options = {
    url: 'https://api.spotify.com/v1/me',
    headers: { 'Authorization': 'Bearer ' + access_token },
    json: true
  }

  request.get(options, (error, response, body) => {
    console.log(body)
  })
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
