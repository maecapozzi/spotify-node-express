const request = require('request'); 
const client_id = process.env.SPOTIFY_CLIENT_ID;
const redirect_uri = "http://localhost:3000/"; 

module.exports = { 
  login: function(req, res) { 
    const uri = 'https://accounts.spotify.com/authorize/?client_id=' + client_id + '& response_type=code&redirect_uri=' + redirect_uri; 
    request.get(uri, function(error, response, body) { 
      if (error) { 
        res.render(error); 
      } else { 
        res.render('index');
        console.log('success');
      }
    }); 
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
