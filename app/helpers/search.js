const request = require('request'); 
const analyzer = require('../controllers/tracks/audioAnalysis')

module.exports = { 
  searchArtists: function(req, res) { 
    const uri = "https://api.spotify.com/v1/search?q="+ req.query.artist + "&type=artist";
    request.get(uri, function(error, response, body){
      if (error){
        res.render(error);
      } else{
        const artist = JSON.parse(response.body).artists.items[0];
        const name = artist.name;
        const popularity = artist.popularity;
        const followers = artist.followers.total
        res.render('searchResults', { name: name, popularity: popularity, followerSize: followers, ratio: (popularity/followers) * 100 });  
      }
    });
  }, 

  searchTracks: function(req, res) { 
    const uri = "https://api.spotify.com/v1/search?q="+ req.query.track + "&type=track";
    request.get(uri, function(error, response, body){
      if (error){
        res.render(error);
      } else{
        const track = JSON.parse(response.body).tracks.items[0]; 
        const artist = track.artists[0].name;
        const id = track.artists[0].id;
        analyzer.analyzeTrack(req, res, id); 
        res.render('searchResults', { name: artist});
      }
    });
  }
}

//TODO: use bodyParser instead of JSON.parse