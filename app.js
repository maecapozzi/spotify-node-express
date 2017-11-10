require('dotenv').config()

const cookieParser = require('cookie-parser')
const routes = require('./routes')

const app = require('express')()

app.use('/', routes)
app.use(cookieParser('keyboard_cat'))
app.set('trust proxy', 1)

const dbUsername = process.env.SPOTIFY_DB_USERNAME
const dbPassword = process.env.SPOTIFY_DB_PASSWORD

const MongoClient = require('mongodb').MongoClient
const port = process.env.PORT || 3001

MongoClient.connect('mongodb://' + dbUsername + ':' + dbPassword + '@ds121171.mlab.com:21171/spotify-node-express', (err) => {
  if (err) return console.log(err)

  app.listen(port, (err) => {
    if (err) {
      console.log('something is broken')
    }
    console.log('server is listening on 3001')
  })
})

module.exports = app
