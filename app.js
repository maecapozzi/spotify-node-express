const express = require('express'); 
const request = require('request'); 
const path    = require("path");
const controllers = require('./app/controllers');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
const client_id = process.env.SPOTIFY_CLIENT_ID; 
const client_secret = process.env.SPOTIFY_SECRET;

const app = express();

app.use('/', controllers); 
app.set('views', __dirname + '/app/views');
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'))
   .use(cookieParser());

//access db auth from env
const dbUsername = process.env['DB_USERNAME']
const dbPassword = process.env['DB_PASSWORD']
const MongoClient = require('mongodb').MongoClient

 
MongoClient.connect("mongodb://" + dbUsername + ":" + dbPassword + "@ds119250.mlab.com:19250/spotify-node-express-db", (err, database) => {
  if (err) return console.log(err)
  db = database

  app.listen(3000, (err) => { 
    console.log('server is listening on 3000')
  })
})

console.log('Listening on 8888');
app.listen(8888);