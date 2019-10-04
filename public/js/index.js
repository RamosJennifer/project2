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

// The API object contains methods for each kind of request we'll make
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
      success: function () {
        displayWelcome();
      }
    });
  },
  logoutUser: function() {
    return $.ajax({
      url: "api/users/logout",
      type: "POST"
    })
  },
  getUsers: function() {
    return $.ajax({
      url: "api/users",
      type: "GET"
    });
  },
  deleteUser: function(userID) {
    return $.ajax({
      url: "api/users/" + userID,
      type: "DELETE"
    });
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
  },
  getPlaylists: function(userID) {
    return $.ajax({
      url: "api/users/" + userID + "/playlists",
      type: "GET"
    });
  },
  deleteSong: function(songID, userID) {
    return $.ajax({
      url: "api/users/" + userID + "/" + songID,
      type: "DELETE"
    });
  }
};

// refreshExamples gets new examples from the db and repopulates the list
var refreshPlaylists = function() {
  API.getPlaylists().then(function(data) {
    var $examples = data.map(function(example) {
      var $a = $("<a>")
        .text(example.text)
        .attr("href", "/example/" + example.id);

      var $li = $("<li>")
        .attr({
          class: "list-group-item",
          "data-id": example.id
        })
        .append($a);

      var $button = $("<button>")
        .addClass("btn btn-danger float-right delete")
        .text("ｘ");

      $li.append($button);

      return $li;
    });

    $exampleList.empty();
    $exampleList.append($examples);
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

  if (!(user.username && user.password)) {
    alert("You must enter a username and password!");
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
};


// handleDeleteBtnClick is called when an example's delete button is clicked
// Remove the example from the db and refresh the list
var handleDeleteBtnClick = function() {
  var idToDelete = $(this)
    .parent()
    .attr("data-id");

  API.deleteExample(idToDelete).then(function() {
    refreshExamples();
  });
};

// $exampleList.on("click", ".delete", handleDeleteBtnClick);


// Grabbing / displaying relevant song information through API routing
var handleArtistSearch = function () {
  
  event.preventDefault();
  var artist = $("#searchArtist").val();
  var emotion = $('select').val();

  return $.ajax({
    type: "POST",
    url: "/pullsongs",
    data: {artist: artist},
    success: function(data) {
      filterSongs(data, emotion);
    }
  });
};

var filterSongs = function (data, emotion) {
  let result;
  switch (emotion) {
    case 'happy':
      for (var i = 0; i < data.length; i++) {
        result = data.filter(elem => elem.valence > 0.6 && elem.energy > 0.6)
      }
      displaySongs(result);
      break;
    case 'sad':
      for (var i = 0; i < data.length; i++) {
        result = data.filter(elem => elem.valence < 0.3 && elem.energy < 0.5)
      }
      displaySongs(result);
      break;
    case 'mad':
      for (var i = 0; i < data.length; i++) {
        result = data.filter(elem => elem.valence < 0.5 && elem.energy > 0.5)
      }
      displaySongs(result);
      break;
    default:
      break;
  }
};

var displaySongs = function (data) {
  let results = $("#resultsArea");
  let emotion = $('select').val();
  results.empty();

  if (data.length === 0) {
    results.text("Sorry, this artist doesn't seem to have any " + emotion + " songs...");
  }
  
    for (var i = 0; i < data.length; i++) {
      let songDiv = $("<div>");
      let spotifyPlayer = $("<iframe>");
      let songname = $("<h5>");
      let artist = $("<h6>");
      let addButton = $("<button>");
      let URI = data[i].URI;

      spotifyPlayer.attr('src', 'https://open.spotify.com/embed/track/' + URI.toString().slice(14));
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
      addButton.attr("data-URIsrc", data[i].URI.toString().slice(14));
      addButton.attr("data-title", data[i].title);
      addButton.attr("data-artist", data[i].artist);

      songDiv.append(artist);
      songDiv.append(songname)
      songDiv.append(spotifyPlayer);
      songDiv.append(addButton);

      results.append(songDiv);
    };
};

$("#submitArtist").on("click", handleArtistSearch);


// Store song information / pass to API.saveSong method
var addButtonClick = function() {

  let thisButton = $(this).parent();

  let emotion = $('select').val();

  let songToAdd = {
    artist: $(this).attr("data-artist"),
    title: $(this).attr("data-title"),
    spotifyURI: $(this).attr("data-URIsrc"),
    emotion: emotion
  }

  checkCurrentSession().then(function(sesh) {
    console.log(sesh.bool);
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

let welcomeMessage = $("#welcome");
var displayWelcome = function() {
  checkCurrentSession().then(function(sesh) {
    console.log(sesh.firstName);
    if (sesh.firstName) {
      welcomeMessage.text("Hi, " + sesh.firstName + ", welcome back");
    } else {
      welcomeMessage.text("Welcome! Create an account or Login to discover and save songs");
    }
  });
};
displayWelcome();





