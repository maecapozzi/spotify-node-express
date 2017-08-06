const request = require('request');
const analyzer = require('../controllers/tracks/audioAnalysis')

module.exports = {
  searchArtists: function(req, res) {
    const uri = "https://api.spotify.com/v1/search?q="+ req.query.artist + "&type=artist";
    request.get(uri, function(error, response, body){
      if (error){
        res.render(error);
      } else {
        const artist = JSON.parse(response.body).artists.items[0];
        const name = artist.name;
        const popularity = artist.popularity;
        const followers = artist.followers.total
        res.render('searchResults', { name: name, popularity: popularity, followerSize: followers, ratio: (popularity/followers) * 100 });
      }
    });
  },

  searchTracks: function(req, res) {
    const access_token = localStorage.getItem('access_token')
    const options = {
      url: "https://api.spotify.com/v1/search?q="+ req.query.track + "&type=track",
      headers: { 'Authorization': 'Bearer ' + access_token },
      json: true
    }

    request.get(options, function(error, response, body){
      if (error){
        res.render(error);
      } else {
        const results = []
        response.body.tracks.items.forEach((item) => {
          results.push(item)
        })
        res.render('searchResults', { results: results } )
      }
    });
  }
}

//TODO: use bodyParser instead of JSON.parse
