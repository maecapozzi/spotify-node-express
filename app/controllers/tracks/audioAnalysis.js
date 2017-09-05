const request = require('request')

module.exports = {
  analyzeTrack: function (req, res, id) {
    const accessToken = localStorage.getItem('access_token')
    const options = {
      url: 'https://api.spotify.com/v1/audio-features/' + id,
      headers: { 'Authorization': 'Bearer ' + accessToken },
      json: true
    }

    request.get(options, (error, response, body) => {
      if (error) {
        res.render(error)
      } else {
        res.send(body)
      }
    })
  }
}
