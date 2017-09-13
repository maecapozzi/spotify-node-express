const cors = require('cors')
const passport = require('passport')
const request = require('request')
const routes = require('express').Router()
const search = require('../helpers/search')
const trackAnalysis = require('./tracks/audioAnalysis')

routes.get('/auth/spotify',
  passport.authenticate('spotify', {
    scope: ['user-read-email', 'user-read-private'], showDialog: true
  }), (req, res) => {})

routes.get('/callback',
  passport.authenticate('spotify', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/')
  })

routes.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

routes.get('/search', (req, res) => {
  search.searchTracks(req, res)
})

routes.get('/analyze/:id', cors(), (req, res) => {
  const id = req.params.id
  trackAnalysis.analyzeTrack(req, res, id)
})

module.exports = routes
