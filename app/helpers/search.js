const request = require('request')

module.exports = {
  searchTracks: (req, res, sessionId) => {
    const accessToken = localStorage.getItem('access_token_' + req.session.id)

    const options = {
      url: 'https://api.spotify.com/v1/search?q=' + req.query.track + '&type=track',
      headers: { 'Authorization': 'Bearer ' + accessToken },
      json: true
    }

    request.get(options, (error, response) => {
      if (error) {
        res.status(500)
      } else {
        const results = []
        response.body.tracks.items.map((item) => {
          results.push(item)
        })
        res.send({ results: results })
      }
    })
  }
}
