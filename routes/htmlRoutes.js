var db = require("../models");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    db.Song.findAll({}).then(function(dbExamples) {
      res.render("index", {
        examples: dbExamples
      });
    });
  });

  // Load example page and pass in an example by id
  app.get("/example/:id", function(req, res) {
    db.Song.findOne({ where: { id: req.params.id } }).then(function(dbExample) {
      res.render("example", {
        example: dbExample
      });
    });
  });
  
  // Load account page
  app.get("/account", function(req, res) {
    res.render("account", {
    });
  });
  // Load playlists page
  app.get("/playlists", function(req, res) {
    res.render("playlists", {
    });
  });
  // Load community page
  app.get("/community", function(req, res) {
    res.render("community", {
    });
  });

  app.get("/tester", function(req, res) {
    console.log('test');
    res.render("index", {
      renderModal: 'false'
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
