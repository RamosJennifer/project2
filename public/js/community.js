$(document).ready(function(){
// Click event on 'add song' button. Function found at line 248
  $(document).on("click", ".songAdder", addButtonClick);
  // Choose an Emotion Dropdown
  $('select').formSelect();
  // Sidenav
  $('.sidenav').sidenav();
  // Create an Account Form
  $('input#input_text, textarea#textarea2').characterCounter();
  //Open Modal
  $('.modal').modal();
});
var API = {
  saveUser: function(user) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "api/users/signup",
      data: JSON.stringify(user)
    });
  },
  loginUser: function(user) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "api/users/login",
      data: JSON.stringify(user),
      success: function() {
        displayWelcome();
      }
    });
  },
  logoutUser: function() {
    return $.ajax({
      url: "/api/users/logout",
      type: "POST"
    })
  },
  getUsers: function() {
    return $.ajax({
      url: "api/users",
      type: "GET"
    });
  },
  getSongs: function() {
    return $.ajax({
      url: "/api/songs",
      type: "GET"
    })
  },
  saveSong: function(song) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      url: "api/users/songs",
      type: "POST",
      data: JSON.stringify(song)
    });
  }
};

// checks to see if a user is in session
var checkCurrentSession = function() {
  return $.ajax({
      url: "/auth/checksession",
      type: "POST",
      data: {bool: null},
      success: function(data) {
        return (data);
      }
    });
};


// Sign-up user onclick / pass to API.saveUser method
let handleSignup = function(event) {
  event.preventDefault();

  let user = {
    firstName: $("#firstName").val().trim(),
    lastName: $("#lastName").val().trim(),
    username: $("#username").val().trim(),
    password: $("#password").val().trim()
  };

  if (!(user.username && user.password && user.firstName && user.lastName)) {
    alert("All fields are required");
    return;
  };

  if(user.password !== $("#password2").val().trim()) {
    alert("Passwords do not match");
    return;
  };

  API.saveUser(user);

  $("#modal1").hide();
  $("#firstName").val("");
  $("#lastName").val("");
  $("#username").val("");
  $("#password").val("");
  $("#password2").val("");
};
$("#createAccount").on("click", handleSignup);


// Gather username / password information, pass to API.loginUser method
let handleLogin = function() {
  event.preventDefault();
  let username = $("#usernameLogin").val().trim();
  let password = $("#passwordLogin").val().trim();
  let user = {
    username: username,
    password: password
  }
  API.loginUser(user);
};
$("#submitLogin").on("click", handleLogin);


// Handle user logout, redirect to home page
let handleLogout = function() {
  API.logoutUser();
  window.location = window.location.origin;
};
$("#logoutButton").on("click", handleLogout);


// Method to redirect user to their own playlists page
let findMyPlaylists = function () {
  checkCurrentSession().then(function(sesh) {
    if(sesh.bool) {
    window.location = window.location.origin + "/playlists/" + sesh.id;
    } else {
      $("#createAccount").show();
      $("#modal1").show();
      $("#modal1").css('zIndex', '200');
      }
  });
};
$("#playlistsButton").on("click", findMyPlaylists);


// Set navbar to include user's name
let navName = $("#navName");
var displayWelcome = function() {
  checkCurrentSession().then(function(sesh) {
    if (sesh.firstName) {
      navName.text(sesh.firstName);
    } else {
      navName.text("");
    }
  });
};
displayWelcome();


// Storing user first name and id to later refererence when showing song information
var refUserByID = [];

var getUsers = function () {
  let test = $("#test");
  API.getUsers().then(function(data) {
    data.forEach(element => {

      refUserByID.push({
        id: element.id,
        user: element.firstName
        });

      let userDiv = $("<div>")
        .attr({class: "user-container", "data-id": element.id});

      let userLink = $("<a>")
        .text(element.username)
        .attr("href", "/playlists/" + element.id);

      userDiv.append(userLink);

      test.append(userDiv);
    });
  });
};
getUsers();

// parsing through all song information, finding match of song.UserId to previously stored id + first name
// to show which user added the song to which playlist
var getSongs = function() {
  let songs = $("#songsComm");
  API.getSongs().then(function(data) {

  for (var i = 0; i < data.length; i++) {
      let songDiv = $("<div>");
      let spotifyPlayer = $("<iframe>");
      let songname = $("<h5>");
      let artist = $("<h6>");
      let addButton = $("<button>");
      let URI = data[i].spotifyURI;
      let addedBy = $("<p>");

      for (var u = 0; u < refUserByID.length; u++) {
        if (refUserByID[u].id == data[i].UserId) {
          addedBy.text("Added by " + refUserByID[u].user + " when they were feeling " + data[i].emotion + ".");
        }
      }

      spotifyPlayer.attr('src', 'https://open.spotify.com/embed/track/' + URI);
      spotifyPlayer.attr('width', '400');
      spotifyPlayer.attr('height', '75');
      spotifyPlayer.attr('frameborder', '0');
      spotifyPlayer.attr('allowtransparency', 'true');
      spotifyPlayer.attr('allow', 'encrypted-media');

      songDiv.addClass("songContainer");
      songname.addClass("songnameH");
      songname.text(data[i].title);

      artist.addClass("artistH");
      artist.text(data[i].artist);

      addButton.addClass("songAdder btn");
      addButton.text("+");
      addButton.attr("data-URIsrc", URI);
      addButton.attr("data-title", data[i].title);
      addButton.attr("data-artist", data[i].artist);
      addButton.attr("data-emotion", data[i].emotion);

      songDiv.append(artist);
      songDiv.append(songname)
      songDiv.append(spotifyPlayer);
      songDiv.append(addButton);
      songDiv.append(addedBy);

      songs.prepend(songDiv);
    };
  });
};
getSongs();


// Handling a song add to a user's tracks
var addButtonClick = function() {

  let thisButton = $(this);

  let songToAdd = {
    artist: $(this).attr("data-artist"),
    title: $(this).attr("data-title"),
    spotifyURI: $(this).attr("data-URIsrc"),
    emotion: $(this).attr("data-emotion")
  }

  checkCurrentSession().then(function(sesh) {
      if (!sesh.bool) {
      $("#createAccount").show();
      $("#modal1").show();
      $("#modal1").css('zIndex', '200');
      }
      else {
      API.saveSong(songToAdd);
      thisButton.hide();
      }
  });
};
