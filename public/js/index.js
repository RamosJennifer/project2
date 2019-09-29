// Get references to page elements
var $firstName = $("#firstName");
var $lastName = $("#lastName");
var $username = $("#username");
var $password = $("#password");
var $submitSignup = $("#submitSignup");
var $submitLogin = $("#submitLogin");

// The API object contains methods for each kind of request we'll make
var API = {
  saveUser: function(user) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "api/users",
      data: JSON.stringify(user)
    });
  },
  loginUser: function(user) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "users/login",
      data: JSON.stringify(user)
    });
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
  saveSong: function(song) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "api/users",
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


// At line 148, change hard-coded emotion in filterSongs() to change data set
var handleArtistSearch = function () {
  event.preventDefault();
  var artist = $("#textarea1").val();
  var emotion = $("#select").vak();

  return $.ajax({
      type: "POST",
      url: "/pullsongs",
      data: {artist: artist},
      success: function(data) {
                   // need to link emotion below to index.hndlbrs
        filterSongs(data, 'happy');
      }
    });
  
};

$("#submitArtist").on("click", handleArtistSearch);

var displaySongs = function (data) {
  let results = $("#resultsArea");
  results.empty();
  
    for (var i = 0; i < data.length; i++) {
      let songDiv = $("<div>");
      let songname = $("<h4>");
      let artist = $("<h4>");
      let valence = $("<h2>");
      let energy = $("<h3>");
      songname.text(data[i].title);
      artist.text(data[i].artist);
      valence.text(data[i].valence);
      energy.text(data[i].energy);
      songDiv.append(songname)
      songDiv.append(artist);
      songDiv.append(valence);
      songDiv.append(energy);
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
}



