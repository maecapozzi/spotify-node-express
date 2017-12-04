require('dotenv').config()

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

const PORT = 'https://spotify-viz-api.herokuapp.com/'

const cookieParser = require('cookie-parser')
const routes = require('./routes')
const express = require('express')
const bodyParser = require('body-parser')
const db = require('./db')

const app = express()

app.use('/', routes)
app.use(cookieParser('keyboard_cat'))
app.use(express.static('public'))
app.use(bodyParser.json())
app.set('trust proxy', 1)

app.listen(PORT, () => { 
  console.log(`Server is listening on port ${PORT}`)
})

module.exports = app
