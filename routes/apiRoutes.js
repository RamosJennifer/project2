var db = require("../models");
require("dotenv").config();
const keys = require("../keys.js");
const SpotifyWebApi = require("spotify-web-api-node");
const spotify = new SpotifyWebApi(keys.spotify);


module.exports = function (app) {
  // Get all songs
  app.get("/api/songs", function (req, res) {
    db.Song.findAll({}).then(function (songs) {
      res.json(songs);
    });
  });

  // Get a song by id
  app.get("/api/songsbyid/:id", function (req, res) {
    db.Song.findAll({ where: { id: req.params.id } }).then(function (songs) {
      res.json(songs);
    });
  });

  // Get all songs by emotion
  app.get("/api/songsbyemotion/:emotion", function (req, res) {
    db.Song.findAll({ where: { emotion: req.params.emotion } }).then(function (songs) {
    });
  });
  // Get all users
  app.get("/api/users", function(req, res) {
    db.User.findAll({include: db.Song}).then(function(songs) {

      res.json(songs);
    });
  });

  // Get specific user and all their songs
  app.get('/api/users/:id', function(req, res) {
    db.User.findOne({
      where: {
        id : req.params.id
        },
        include: [db.Song]
        }).then(function(data) {
      res.json(data);
    });
  });

  // Create a new example
  app.post("/api/examples", function (req, res) {
    db.Example.create(req.body).then(function (dbExample) {
      res.json(dbExample);
    });
  });

  // Delete all songs
  app.delete("/api/songs/delete", function (req, res) {
    db.Song.destroy({}).then(function (songs) {
      res.json(songs);
    });
  });

  // Delete a song by id
  app.delete("/api/songs/deletebyid/:id", function (req, res) {
    db.Song.destroy({ where: { id: req.params.id } }).then(function (songs) {
      res.json(songs);
    });
  });

  // Delete all songs by emotion
  app.delete("/api/songsbyemotion/:emotion", function (req, res) {
    db.Song.destroy({ where: { emotion: req.params.emotion } }).then(function (songs) {
      res.json(songs);
    });
  });

  // Spotify API call, grabbing songs and sending to client to be filtered
  app.post("/pullsongs", function(req, res) {

    let artistInput = req.body.artist;

    spotifyFind(artistInput);

    function getFeatures() {

      let processedItems = 0;

      artistsSongs.forEach(elem => {
        spotify.getAudioFeaturesForTracks([elem.trackID])
          .then(function (responses) {
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
          .catch(function (err) {
            console.log(err);
          });
      })
    }

    let artistsSongs = [];

    let albums = [];

    function spotifyFind(artist) {

      spotify.clientCredentialsGrant().then(
        function (data) {

          spotify.setAccessToken(data.body['access_token']);

          spotify.search(artist, ['artist'])
            .then(function (response) {
              let artistId = response.body.artists.items[0].id;

              spotify.getArtistTopTracks(artistId, 'US').then(function (res) {

                for (var i = 0; i < res.body.tracks.length; i++) {

                  artistsSongs.push({
                    title: res.body.tracks[i].name,
                    artist: res.body.tracks[i].artists[0].name,
                    trackID: res.body.tracks[i].id,
                    URI: res.body.tracks[i].uri
                  });

                }
                getFeatures();
              }).catch(function (err) {
                console.log(err);
              })
            })
            .catch(function (err) {
              console.log(err);
            })

        },

        function (err) {
          console.log(err);
        });

    };

    function sendTheData() {
      res.json(artistsSongs);
    }

  });

};
