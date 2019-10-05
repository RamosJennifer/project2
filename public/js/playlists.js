$(document).ready(function(){
// Click event on 'add song' button. Function found at line 248
  $(document).on("click", ".songDelete", handleDeleteSong);
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
      url: "/api/users/signup",
      data: JSON.stringify(user)
    });
  },
  loginUser: function(user) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "/api/users/login",
      data: JSON.stringify(user),
      success: function() {
          findMyPlaylists();
      }
    });
  },
  logoutUser: function() {
    return $.ajax({
      url: "/api/users/logout",
      type: "POST"
    })
  },
  getOneUser: function(userID) {
    return $.ajax({
      url: "/api/users/" + userID,
      type: "GET"
    });
  },
  saveSong: function(song) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      url: "/api/users/songs",
      type: "POST",
      data: JSON.stringify(song)
    });
  },
  deleteSong: function(songID) {
    return $.ajax({
      url: "/api/songs/deletebyid/" + songID,
      type: "DELETE"
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
}

var getUser = function () {

checkCurrentSession().then(function(sesh) {

  let test = $("#test");
  let happy = $("#happy");
  let sad = $("#sad");
  let mad = $("#mad");
  let urlSearch = window.location.href.slice(32);
  let canDelete = false;
  if (sesh.id == urlSearch) {
    canDelete = true;
  }

  API.getOneUser(urlSearch).then(function(data) {

      let userDiv = $("<div>").attr("class", "user-container");
      let username = $("<h3>").text(data.username);
      let fullname = $("<h4>").text(data.firstName + " " + data.lastName);
      userDiv.append(username).append(fullname);

      for (var i = 0; i < data.Songs.length; i++) {
        let songDiv = $("<div>");
        let spotifyPlayer = $("<iframe>");
        let songname = $("<h5>");
        let artist = $("<h6>");
        let URI = data.Songs[i].spotifyURI;

        spotifyPlayer.attr('src', 'https://open.spotify.com/embed/track/' + URI);
        spotifyPlayer.attr('width', '400');
        spotifyPlayer.attr('height', '75');
        spotifyPlayer.attr('frameborder', '0');
        spotifyPlayer.attr('allowtransparency', 'true');
        spotifyPlayer.attr('allow', 'encrypted-media');

        songDiv.addClass("songContainer");
        songname.addClass("songnameH");
        songname.text(data.Songs[i].title);

        artist.addClass("artistH");
        artist.text(data.Songs[i].artist);

        if (canDelete) {
            let deleteButton = $("<button>");
            deleteButton.addClass("songDelete btn");
            deleteButton.text("x");
            deleteButton.attr("data-id", data.Songs[i].id);
            songDiv.append(artist);
            songDiv.append(songname)
            songDiv.append(spotifyPlayer);
            songDiv.append(deleteButton);
        }
        else {
            let addButton = $("<button>");
            addButton.addClass("songAdder btn");
            addButton.text("+");
            addButton.attr("data-URIsrc", URI);
            addButton.attr("data-title", data.Songs[i].title);
            addButton.attr("data-artist", data.Songs[i].artist);
            addButton.attr("data-emotion", data.Songs[i].emotion);
            songDiv.append(artist);
            songDiv.append(songname)
            songDiv.append(spotifyPlayer);
            songDiv.append(addButton);
        }

        if (data.Songs[i].emotion == 'happy') {
            happy.append(songDiv);
        } else if (data.Songs[i].emotion == 'sad') {
            sad.append(songDiv);
        } else {
            mad.append(songDiv);
        }
      }
      test.append(userDiv);
    });
  });
};

getUser();

let handleDeleteSong = function() {
  API.deleteSong($(this).attr("data-id"));
  $(this).parent().hide();
};


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



let handleLogout = function() {
  API.logoutUser();
  window.location = window.location.origin;
};
$("#logoutButton").on("click", handleLogout);


let findMyPlaylists = function () {
  checkCurrentSession().then(function(sesh) {
    window.location = window.location.origin + "/playlists/" + sesh.id;
  });
};
$("#playlistsButton").on("click", findMyPlaylists);


var addButtonClick = function() {

  let thisButton = $(this);

  let emotion = $(this).attr("data-emotion");

  let songToAdd = {
    artist: $(this).attr("data-artist"),
    title: $(this).attr("data-title"),
    spotifyURI: $(this).attr("data-URIsrc"),
    emotion: emotion
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