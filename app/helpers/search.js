const request = require('request')

//TODO: use bodyParser instead of JSON.parse

module.exports = {
  searchTracks: (req, res) => {
    const accessToken = localStorage.getItem('access_token')
    const options = {
      url: 'https://api.spotify.com/v1/search?q='+ req.query.track + '&type=track',
      headers: { 'Authorization': 'Bearer ' + accessToken },
      json: true
    }

    request.get(options, (error, response) => {
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
