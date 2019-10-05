# TheraTune
TheraTune is a playlist generating app based on your current emotion. Save songs, remove them, check out what others are listening to.

## the app, and how to use it
Visiting the homepage, you can select an emotion, and type in an artist to generate songs...

**BEFORE CONTINUING** you should create an account and login.
1. Navigate to the sidebar, and create an account.
2. Hit login on the sidebar, and enter your credentials.

**Next**, the user can now save songs to their playlist, and check out other's playlists in the Community tab from the sidebar.

Navigate to your own playlist page, and you have the ability to remove songs from your playlists.

## tech
Notable tech used within TheraTune
* materialize - front-end framework for site design
* dotenv - loads environment variables into process.env, unique to the computer that node is running on
* spotify-web-api - npm package to pull song information, filter songs per user
* cookie-parser - npm package to parse cookie / session data specific to user. for authentication
* express-session - npm package to store user's session data