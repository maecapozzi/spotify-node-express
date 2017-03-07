var routes = require('express').Router();
var login = require('./authentication/login'); 
var search = require('../helpers/search');
var trackAnalysis = require('./tracks/audioAnalysis'); 

routes.get('/', (req, res) => {
  res.render('index');
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
