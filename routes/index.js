var routes = require('express').Router();
var search = require('./search'); 

routes.get('/', (req, res) => {
  res.render('index');
});

routes.get('/search', (req, res) => {
  search.searchArtists(req, res);
});

module.exports = routes;
