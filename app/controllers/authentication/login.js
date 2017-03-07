const request = require('request'); 
const client_id = process.env.SPOTIFY_CLIENT_ID;
const redirect_uri = "https://localhost:3000/callback"; 
const querystring = require('querystring'); 
const cookieParser = require('cookie-parser')

var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';


module.exports = { 
  login: function(req, res) { 
    const state = generateRandomString(16);
    res.cookie(stateKey, state);

    const scope = 'user-read-private user-read-email';
    res.redirect('https://accounts.spotify.com/authorize?' + 
      querystring.stringify({
        response_type: 'code', 
        client_id: client_id, 
        scope: scope, 
        redirect_uri: redirect_uri, 
        state: state
      }) 
    );
  }  
}


// searchArtists: function(req, res) { 
//     const uri = "https://api.spotify.com/v1/search?q="+ req.query.artist + "&type=artist";
//     request.get(uri, function(error, response, body){
//       if (error){
//         res.render(error);
//       } else{
//         const artist = JSON.parse(response.body).artists.items[0];
//         const name = artist.name;
//         const popularity = artist.popularity;
//         const followers = artist.followers.total
//         res.render('searchResults', { name: name, popularity: popularity, followerSize: followers, ratio: (popularity/followers) * 100 });  
//       }
//     });
//   }, 
