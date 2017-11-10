var request = require('request-promise')
var Promise = require('bluebird')

module.exports = {
  analyzeTrack: function (req, res, id) {
    const accessToken = localStorage.getItem('access_token_' + req.session.id)
    var requests = [{
      url: 'https://api.spotify.com/v1/audio-features/' + id,
      headers: { 'Authorization': 'Bearer ' + accessToken },
      json: true
    }, {
      url: 'https://api.spotify.com/v1/tracks/' + id,
      headers: { 'Authorization': 'Bearer ' + accessToken },
      json: true
    },
    {
      url: 'https://api.spotify.com/v1/audio-analysis/' + id,
      headers: { 'Authorization': 'Bearer ' + accessToken },
      json: true
    }]

    Promise.map(requests, (obj) => {
      return request(obj).then((body) => {
        return body
      })
    }).then((results) => {
      res.send(results)
    }, {concurrency: 3}, (err) => {
      console.log(err)
    })
  }
}
