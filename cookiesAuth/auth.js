var cookieParser = require('cookie-parser');
var session = require('express-session');
var db = require("../models");

module.exports = function(app) {

app.use(cookieParser());
app.use(session({
    key: 'user_seshID',
    secret: 'test',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));

app.use((req, res, next) => {
    if (req.cookies.user_seshID && !req.session.user) {
        res.clearCookie('user_seshID');
    }
    next();
});

var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_seshID) {
        res.redirect('/');
    } else {
        next();
    }
};

app.route('/api/users/signup').get(sessionChecker, (req, res) => {
    res.render('signup');
}).post((req, res) => {
    db.User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        password: req.body.password
    }).then(user => {
        req.session.user = user.Datavalues;
        res.redirect('/');
        //res.send('signedup');
    }).catch(error => {
        res.send(error);
    });
});

app.route('/api/users/login').get(sessionChecker, (req, res) => {
    res.render('login');
}).post((req, res) => {
    var username = req.body.username,
        password = req.body.password;

        db.User.findOne({where: {username: username} }).then(function(user) {
            if (!user) {
                res.render('login');
            } else if (user.password !== password) {
                res.render('login');
            } else {
                req.session.user = user.dataValues;
                res.redirect('/');
            }
        });
});

app.get('/dashboard', (req, res) => {
    if (req.session.user && req.cookies.user_seshID) {
        res.sendFile(__dirname + '/public/dashboard.html');
    } else {
        res.redirect('/login');
    }
});

app.post('/api/users/logout', (req, res) => {
    
    if (req.session.user && req.cookies.user_seshID) {   
        res.clearCookie('user_seshID');
        res.redirect('/');
    } else {
        res.render('login');
    }
});

app.post("/api/users/songs", function(req, res) {
    db.Song.create({
      title: req.body.title,
      artist: req.body.artist,
      spotifyURI: req.body.spotifyURI,
      emotion: req.body.emotion,
      UserId: req.session.user.id
      }).then(function(newSong) {
      res.json(newSong)
    });
  });

app.use(function (req, res, next) {
    res.status(404).send('PAGE CANNOT BE FOUND');
});

};