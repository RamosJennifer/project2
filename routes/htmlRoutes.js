var db = require("../models");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
      res.render("index", {
      });
  });

  // Load account page
  app.get("/account/:id", function(req, res) {
    res.render("account", {
    });
  });
  // Load playlists page
  app.get("/playlists/:id/", function(req, res) {
    res.render("playlists", {
    });
  });
  
  // Load community page
  app.get("/community/", function(req, res) {
    res.render("community", {
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
