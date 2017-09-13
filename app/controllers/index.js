const authHelpers = require('../helpers/authentication')
const cors = require('cors')
const routes = require('express').Router()
const search = require('../helpers/search')
const trackAnalysis = require('./tracks/audioAnalysis')
const querystring = require('querystring')
const request = require('request')

routes.get('/', (req, res) => {
  res.render('index')
})

routes.get('/search', (req, res) => {
  const expiresIn = localStorage.getItem('expires_in')
  console.log(expiresIn)
  search.searchTracks(req, res)
})

routes.get('/analyze/:id', cors(), (req, res) => {
  const id = req.params.id
  trackAnalysis.analyzeTrack(req, res, id)
})

module.exports = routes
