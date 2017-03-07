var routes = require('express').Router();
var login = require('./authentication/login'); 
var search = require('../helpers/search');
var trackAnalysis = require('./tracks/audioAnalysis'); 
const authHelpers = require('../helpers/authentication')
var cookieParser = require('cookie-parser');
var querystring = require('querystring');
var client_id = process.env.SPOTIFY_CLIENT_ID;
var client_secret = process.env.SPOTIFY_SECRET;
var redirect_uri = 'http://localhost:3000/callback'; 
var stateKey = 'spotify_auth_state';

routes.get('/', (req, res) => {
  res.render('index');
});

routes.get('/login', function(req, res) {
  const state = authHelpers.generateRandomString(16);
  console.log(state);
  res.cookie(stateKey, state);
  const scope = 'user-read-private user-read-email'; 

  res.redirect('https://accounts.spotify.com/authorize?' + 
    querystring.stringify({ 
      response_type: 'code', 
      client_id: client_id, 
      scope: scope, 
      redirect_uri: redirect_uri, 
      state: state
    })
  );

});

routes.get('/searchArtists', (req, res) => {
  res.render('searchArtists');
});

routes.get('/searchTracks', (req, res) => {
  res.render('searchTracks'); 
});

routes.get('/searchResults', (req, res) => { 
  if (req.query.track) {
    search.searchTracks(req, res);
    trackAnalysis.analyzeTrack(req, res); 
  } else { 
    search.searchArtists(req, res);
  }
}); 

module.exports = routes;
