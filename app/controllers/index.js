var routes = require('express').Router();
var search = require('../helpers/search');

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
  } else { 
    search.searchArtists(req, res);
  }
}); 

module.exports = routes;
