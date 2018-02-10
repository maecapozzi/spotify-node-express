var request = require('request-promise')
var Promise = require('bluebird')

const sendResponse = (requests, res) => {
  Promise.map(requests, obj => {
    return request(obj).then(body => {
      return body
    })
  }).then(
    results => {
      res.send(results)
    },
    { concurrency: 3 },
    err => {
      throw Error(err)
    }
  )
}

const requestBuilder = (uri, id, headers, json) => {
  let url = uri + id
  return {
    url: url,
    headers: headers,
    json: json
  }
}

const buildRequests = (req, res, id) => {
  const accessToken = localStorage.getItem('access_token_' + req.session.id)
  const headers = {
    Authorization: 'Bearer ' + accessToken
  }

  const requests = [
    requestBuilder('https://api.spotify.com/v1/audio-features/', id, headers, true), 
    requestBuilder('https://api.spotify.com/v1/tracks/', id, headers, true), 
    requestBuilder('https://api.spotify.com/v1/audio-analysis/', id, headers, true)
  ]
  return requests
}

module.exports = {
  analyzeTrack: (req, res, id) => {
    sendResponse(buildRequests(req, res, id))
  }
}
