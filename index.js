const express = require('express');
const app = express();
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const { usersModel, hashPass } = require('./models/user.js');
const connectEnsureLogin = require('connect-ensure-login'); //authorizations

// Register '.html' extension with The Mustache Express
app.engine('html', mustacheExpress());

// Register body parsing
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use(session({ secret: 'passport-tutorial', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false })); // needed for passport to work correctly

// Serialize user
passport.serializeUser(function(user, done) {
  console.log('we came to serializeUser');
  console.log(user);
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  console.log('we came to deserializeUser');
  console.log(user);
  done(null, user);
});

// Setup passport
app.use(passport.initialize());
app.use(passport.session());

// Setup passport strategy
passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  },
  async function(username, password, done) {
    console.log('we can here for auth ' + username + ' ' + password);

    // password check goes here
    let check = await usersModel.checkPassword(username, password);
    console.log(check);
    if(check) {
      return done(null, false, { message: 'Incorrect username and/or password' })
    }
    return done(null, {id: "user@gmail.com", username: "user@gmail.com"});
  }
));

function home (req, res) {
  res.render('home');
}

function buttons (req, res) {
  res.render('buttons');
}

function logout (req, res) {
  req.session.destroy();
  req.logout();
  res.redirect('/');
}

function ensureAuthenticated(req, res, next) {
  try {
    if(!req.user) {
      res.redirect('/');
    } else {
      next();
    }
  } catch(err) {
    next(err);
  }
}

// view engine setup
app.set('views', path.join(__dirname, '/site'));
app.set('view engine', 'html');

// Load the routes
app.use(express.static('public'))
app.use(express.static('node_modules/bootstrap/dist'))
app.use(require('./site/router'));

app.get('/dashboard', ensureAuthenticated, home);
app.get('/buttons', ensureAuthenticated, buttons);
app.get('/logout', logout);
app.post('/api/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/', // see text
  failureFlash: false // optional, see text as well
}));

app.post('/api/register', function(req, res) {
  let username = req.params.email;
  let password = hashPass(req.params.password);

  let data = {username: username, password: password}

  usersModel.create(data);
})

module.exports = app;