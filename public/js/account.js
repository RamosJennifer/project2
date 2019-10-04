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
  getOneUser: function(userID) {
    return $.ajax({
      url: "/api/users/" + userID,
      type: "GET"
    });
  },
};

var getUser = function () {
  let test = $("#test");
  let urlSearch = window.location.href.slice(30);
  API.getOneUser(urlSearch).then(function(data) {
    console.log(data);
      let userDiv = $("<div>")
        .attr({class: "user-container", "data-id": data.id});

      let userLink = $("<a>")
        .text(data.username)
        .attr("href", "/account/" + data.id);

      userDiv.append(userLink);

      test.append(userDiv);
  });
};

getUser();