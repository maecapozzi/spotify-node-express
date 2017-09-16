const clientId = process.env.SPOTIFY_CLIENT_ID
const clientSecret = process.env.SPOTIFY_SECRET
const cors = require('cors')
const passport = require('passport')

const routes = require('express').Router()
const search = require('../helpers/search')
const trackAnalysis = require('./tracks/audioAnalysis')

module.exports = routes
