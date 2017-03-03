var request = require('request'); 

module.exports = { 
  searchArtists: function(req, res) { 
    var uri = "https://api.spotify.com/v1/search?q="+ req.query.q + "&type=artist";
    request.get(uri, function(error, response, body){
      if (error){
        res.render(error);
      } else{
        var artist = JSON.parse(response.body).artists.items[0];
        var name = artist.name;
        var popularity = artist.popularity;
        var followers = artist.followers.total
        res.render('search', { name: name, popularity: popularity, followerSize: followers, ratio: (popularity/followers) * 100 });  
      }
    });
  }
}

//bodyParser