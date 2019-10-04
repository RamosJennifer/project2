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
  getSongs: function() {
    return $.ajax({
      url: "/api/songs",
      type: "GET"
    })
  }
};

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
        .attr("href", "/account/" + element.id);

      userDiv.append(userLink);

      test.append(userDiv);

    });
  });
};

getUsers();

var getSongs = function() {
  let songs = $("#songs");
  API.getSongs().then(function(data) {

    console.log(data)

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
      addButton.attr("data-URIsrc", data[i].URI);
      addButton.attr("data-title", data[i].title);
      addButton.attr("data-artist", data[i].artist);

      songDiv.append(artist);
      songDiv.append(songname)
      songDiv.append(spotifyPlayer);
      songDiv.append(addButton);
      songDiv.append(addedBy);

      songs.prepend(songDiv);
    };
    console.log(refUserByID);
  });
};

getSongs();