const request = require('request')

const buildRequests = (req, res) => {
  const accessToken = localStorage.getItem('access_token_' + req.session.id)
  const options = {
    url: 'https://api.spotify.com/v1/search?q=' + req.query.track + '&type=track',
    headers: { Authorization: 'Bearer ' + accessToken },
    json: true
  }
  return options
}

const handleSuccess = (response, res) => {
  if (response.body.tracks === undefined) {
    res.status(500).send('The search query was empty')
  } else {
    const results = []
    response.body.tracks.items.map(item => {
      results.push(item)
    })
    res.send({ results: results })
  }
}

module.exports = {
  searchTracks: (req, res) => {
    request.get(buildRequests(req), (error, response) => {
      if (error) {
        res.status(500).send('Something is not working as expected.')
      } else {
        try {
          handleSuccess(response, res)
        } catch (err) {
          res.status(500).send('Your search query is empty. Please input a search query into the search bar.')
        }
      }
    })
  }
}
