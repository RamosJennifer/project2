// Get references to page elements
var $firstName = $("#firstName");
var $lastName = $("#lastName");
var $username = $("#username");
var $password = $("#password");
var $submitSignup = $("#submitSignup");
var $submitLogin = $("#submitLogin");

$(document).ready(function(){
  $(document).on("click", ".songAdder", addButtonClick);
// Choose an Emotion Dropdown
  $('select').formSelect();
// Sidenav
  $('.sidenav').sidenav();

  allcookies = document.cookie;
  console.log(allcookies);
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
      data: JSON.stringify(user)
    });
  },
  logoutUser: function(user) {
    return $.ajax({
      url: "api/users/logout",
      type: "POST"
    })
  },
  // getUsers: function() {
  //   return $.ajax({
  //     url: "api/users",
  //     type: "GET"
  //   });
  // },
  deleteUser: function(userID) {
    return $.ajax({
      url: "api/users/" + userID,
      type: "DELETE"
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

// handleFormSubmit is called whenever we submit a new example
// Save the new example to the db and refresh the list
var handleFormSubmit = function(event) {
  event.preventDefault();

  var user = {
    text: $exampleText.val().trim(),
    description: $exampleDescription.val().trim()
  };

  if (!(example.text && example.description)) {
    alert("You must enter an example text and description!");
    return;
  }

  API.saveExample(example).then(function() {
    refreshExamples();
  });

  $exampleText.val("");
  $exampleDescription.val("");
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

// Add event listeners to the submit and delete buttons
// $submitBtn.on("click", handleFormSubmit);
// $exampleList.on("click", ".delete", handleDeleteBtnClick);


var handleArtistSearch = function () {
  event.preventDefault();
  var artist = $("#textarea1").val();
  var emotion = $('select').val();
  console.log(emotion);

  return $.ajax({
      type: "POST",
      url: "/pullsongs",
      data: {artist: artist},
      success: function(data) {
        filterSongs(data, emotion);
      }
    });
  
};

$("#submitArtist").on("click", handleArtistSearch);

var displaySongs = function (data) {
  let results = $("#resultsArea");
  results.empty();
  
    for (var i = 0; i < data.length; i++) {
      let songDiv = $("<div>");
      let spotifyPlayer = $("<iframe>");
      let songname = $("<h4>");
      let artist = $("<h4>");
      let addButton = $("<button>");
      let URI = data[i].URI;

      spotifyPlayer.attr('src', 'https://open.spotify.com/embed/track/' + URI.toString().slice(14));
      spotifyPlayer.attr('width', '400');
      spotifyPlayer.attr('height', '75');
      spotifyPlayer.attr('frameborder', '0');
      spotifyPlayer.attr('allowtransparency', 'true');
      spotifyPlayer.attr('allow', 'encrypted-media');

      songname.text(data[i].title);
      artist.text(data[i].artist);
      addButton.addClass("songAdder");
      addButton.text("Add this track");
      addButton.attr("data-URIsrc", data[i].URI.toString().slice(14));
      addButton.attr("data-title", data[i].title);
      addButton.attr("data-artist", data[i].artist);

      songDiv.append(songname)
      songDiv.append(artist);
      songDiv.append(spotifyPlayer);
      songDiv.append(addButton);

      results.append(songDiv);
    };
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

var addButtonClick = function() {
  let emotion = $('select').val();
  let songToAdd = {
    title: $(this).attr("data-title"),
    artist: $(this).attr("data-artist"),
    spotifyURI: $(this).attr("data-URIsrc"),
    emotion: emotion
  }

  API.saveSong(songToAdd);

  $(this).hide();
};



let loginClick = function() {
  let username = $("#username").val();
  let password = $("#password").val();
  let user = {
    username: username,
    password: password
  }
  API.loginUser(user);
};

$("#subLog").on("click", loginClick);

