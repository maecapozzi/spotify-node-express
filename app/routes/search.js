var request = require('request'); 

module.exports = { 
  searchArtists: function(req, res) { 
    var uri = "https://api.spotify.com/v1/search?q="+ req.query.artist + "&type=artist";
    request.get(uri, function(error, response, body){
      if (error){
        res.render(error);
      } else{
        var artist = JSON.parse(response.body).artists.items[0];
        var name = artist.name;
        var popularity = artist.popularity;
        var followers = artist.followers.total
        res.render('searchResults', { name: name, popularity: popularity, followerSize: followers, ratio: (popularity/followers) * 100 });  
      }
    });
  }, 

  searchTracks: function(req, res) { 
    var uri = "https://api.spotify.com/v1/search?q="+ req.query.track + "&type=track";
    request.get(uri, function(error, response, body){
      if (error){
        res.render(error);
      } else{
        var track = JSON.parse(response.body).tracks.items[0]; 
        var artist = track.artists[0].name;
        res.render('searchResults', { name: artist });
      }
    });
  }
}

//TODO: use bodyParser instead of JSON.parse