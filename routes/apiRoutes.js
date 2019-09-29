var db = require("../models");
require("dotenv").config();
const keys = require("../keys.js");
const SpotifyWebApi = require("spotify-web-api-node");
const spotify = new SpotifyWebApi(keys.spotify);

module.exports = function(app) {
  // Get all examples
  app.get("/api/songs", function(req, res) {
    db.Song.findAll({}).then(function(songs) {
      res.json(songs);
    });
  });

  // Create a new example
  app.post("/api/examples", function(req, res) {
    db.Example.create(req.body).then(function(dbExample) {
      res.json(dbExample);
    });
  });

  // Delete an example by id
  app.delete("/api/examples/:id", function(req, res) {
    db.Example.destroy({ where: { id: req.params.id } }).then(function(dbExample) {
      res.json(dbExample);
    });
  });

  app.post("/pullsongs", function(req, res) {

    let artistInput = req.body.artist;

    spotifyFind(artistInput);
    
    function getFeatures() {

      let processedItems = 0;
      
      artistsSongs.forEach(elem => {
        spotify.getAudioFeaturesForTracks([elem.trackID])
        .then(function(responses) {
          for (var i = 0; i < responses.body.audio_features.length; i++) {
            elem['valence'] = responses.body.audio_features[i].valence;
            elem['energy'] = responses.body.audio_features[i].energy;
            processedItems++;
          }
          if (processedItems === artistsSongs.length) {
            sendTheData();
            return;
          }
        })
        .catch(function(err) {
          console.log(err);
        });
      })
    }

    let artistsSongs = [];
    
    let albums = [];

    function spotifyFind(artist) {

        spotify.clientCredentialsGrant().then(
            function(data) {

            spotify.setAccessToken(data.body['access_token']);

                spotify.search(artist, ['artist'])
                .then(function(response) {
                    let artistId = response.body.artists.items[0].id;

                    spotify.getArtistTopTracks(artistId, 'US').then(function(res) {
                      
                        for (var i = 0; i < res.body.tracks.length; i++) {

                            artistsSongs.push({
                                title: res.body.tracks[i].name,
                                artist: res.body.tracks[i].artists[0].name,
                                trackID: res.body.tracks[i].id,
                                URI: res.body.tracks[i].uri
                            });
                            
                        }
                        getFeatures();
                    }).catch(function(err) {
                        console.log(err);
                    })
                })
                .catch(function(err) {
                    console.log(err);
                })

            },
            
            function(err) {
            console.log(err);
            });

    };

    function sendTheData() {
      res.json(artistsSongs);
    }

  });

};
