const request = require('request'); 

module.exports = { 
  analyzeTrack: function(req, res) { 
    const uri = 'https://api.spotify.com/v1/audio-features/' + req.query.id
    request.get(uri, function(error, response, body) { 
      if (error) { 
        res.render(error);    
      } else { 
        console.log(JSON.parse(response.body));
      }
    })
  } 
}