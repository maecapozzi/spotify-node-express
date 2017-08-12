const request = require('request')
const analyzer = require('../controllers/tracks/audioAnalysis')

//TODO: use bodyParser instead of JSON.parse

module.exports = {
  searchTracks: (req, res) => {
    const access_token = localStorage.getItem('access_token')
    const options = {
      url: "https://api.spotify.com/v1/search?q="+ req.query.track + "&type=track",
      headers: { 'Authorization': 'Bearer ' + access_token },
      json: true
    }

    request.get(options, function(error, response, body){
      if (error){
        res.render(error)
      } else {
        const results = []
        response.body.tracks.items.forEach((item) => {
          results.push(item)
        })
        res.send({ results: results })
      }
    })
  }
}
