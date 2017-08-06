const routes = require('express').Router()
const login = require('./authentication/login')
const authHelpers = require('../helpers/authentication')
const cookieParser = require('cookie-parser')
const querystring = require('querystring')
const client_id = process.env.SPOTIFY_CLIENT_ID
const client_secret = process.env.SPOTIFY_SECRET
const redirect_uri = 'http://localhost:3000/callback'
const stateKey = 'spotify_auth_state'
const request = require('request')

routes.get('/', (req, res) => {
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

routes.get('/search', (req, res) => {
  const access_token = localStorage.getItem('access_token')
  query = "sprained&20ankle"
  const options = {
    url: 'https://api.spotify.com/v1/search?q=' + query + '&' + 'type=track',
    headers: { 'Authorization': 'Bearer ' + access_token },
    json: true
  }

  request.get(options, (error, response, body) => {
    console.log(body)
  })
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

routes.get('/albums', (req, res) => {
  const access_token = localStorage.getItem('access_token')
  const options = {
    url: 'https://api.spotify.com/v1/albums/0sNOF9WDwhWunNAHPD3Baj',
    headers: { 'Authorization': 'Bearer ' + access_token },
    json: true
  }

  request.get(options, (error, response, body) => {
    res.send(JSON.stringify(body.artists[0].name))
  })
})

routes.get('/searchTracks', (req, res) => {
  res.render('searchTracks'); 
});

routes.get('/searchResults', (req, res) => {
  if (req.query.track) {
    search.searchTracks(req, res);
  } else {
    search.searchArtists(req, res);
  }
});

routes.get('/analyze', (req, res) => {
  trackAnalysis.analyzeTrack(req, res);
});


module.exports = routes
