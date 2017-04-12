const express  = require('express')
const app      = express()
const port     = process.env.PORT || 8080
const mongoose = require('mongoose')
const passport = require('passport')
const flash    = require('connect-flash')

const morgan       = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser   = require('body-parser')
const session      = require('express-session')

const configDB = require('./config/database.js')

// ***** CONFIGURATION *****

// --- Database ---
mongoose.connect(configDB.url);

/*
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Conected')
});
*/

require('./config/passport')(passport);

// --- Setup express application ---
app.use(morgan(`dev`)) // log every request to the console
app.use(cookieParser()) // read cookies (needed for auth)
app.use(bodyParser()) // get information from html forms

app.set(`view engine`, `ejs`)

// -- Setup passport ---
app.use(session({ secret: `ilovescotchscotchyscotchscotch` })) // session secret
app.use(passport.initialize())
app.use(passport.session()) // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// --- Routes ---
require(`./app/routes.js`)(app, passport) // load our routes and pass in our app and fully configured passport

// --- Lauch ---
app.listen(port);
console.log(`The magic happens on port ${port}`)