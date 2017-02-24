var express = require('express'); 
var request = require('request'); 
var path    = require("path");
var routes = require('./routes');
var client_id = process.env.SPOTIFY_CLIENT_ID; 
var client_secret = process.env.SPOTIFY_SECRET;

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');



app.get('/', routes.index, function(req, res) { 
  
});

app.get('/search', function(req, res) { 
  var uri = "https://api.spotify.com/v1/search";
  request.get(uri, function(error,response,body){
    if (error){
      console.log(error);
    } else{
      console.log(body); 
    }
  });
}); 

console.log('Listening on 8888');
app.listen(8888);