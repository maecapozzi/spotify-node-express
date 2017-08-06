const request = require('request');

module.exports = {
  analyzeTrack: function(req, res, id) {
    const access_token = localStorage.getItem('access_token');
    const options = {
      url: 'https://api.spotify.com/v1/audio-features/' + id,
      headers: { 'Authorization': 'Bearer ' + access_token },
      json: true
    }

    request.get(options, function(error, response, body) {
      if (error) {
        res.render(error);
      } else {
        res.send(body)
      }
    })
  }
}
