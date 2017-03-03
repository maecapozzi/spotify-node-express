var express = require('express'); 
var request = require('request'); 
var path    = require("path");
var routes = require('./routes');
var client_id = process.env.SPOTIFY_CLIENT_ID; 
var client_secret = process.env.SPOTIFY_SECRET;

var app = express();
app.use('/', routes); 
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

console.log('Listening on 8888');
app.listen(8888);