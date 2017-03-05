const express = require('express'); 
const request = require('request'); 
const path    = require("path");
const routes = require('./routes');
const client_id = process.env.SPOTIFY_CLIENT_ID; 
const client_secret = process.env.SPOTIFY_SECRET;

const app = express();
app.use('/', routes); 
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

const dbUsername = process.env['DB_USERNAME']
const dbPassword = process.env['DB_PASSWORD']
const MongoClient = require('mongodb').MongoClient

MongoClient.connect("mongodb://" + dbUsername + ":" + dbPassword + "@ds115870.mlab.com:15870/skeleton-db", (err, database) => {
  if (err) return console.log(err)
  db = database

  app.listen(3000, (err) => { 
    console.log('server is listening on 3000')
  })
})

app.get('/', (req, res) => {  
  res.render('home', {
    name: 'Mae'
  })
})

console.log('Listening on 8888');
app.listen(8888);