const request = require('request'); 

module.exports = { 
  analyzeTrack: function(req, res, id) { 
    const access_token = localStorage.getItem('access_token');
    const uri = "https://api.spotify.com/v1/audio-features/" + id + "?access_token=" + access_token;
    request.get(uri, function(error, response, body) { 
      if (error) { 
        res.render(error);
      } else {     
        console.log(JSON.parse(response.body));
      }
    })
  } 
}