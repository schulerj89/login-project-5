const express = require('express');
const router = new express.Router();
const passport = require('passport');

function home (req, res) {
  res.render('home');
}

function login (req, res) {
  if(req.user) {
    res.redirect('/dashboard');
  } else {
    res.render('login');
  }
}

function register (req, res) {
  res.render('register');
}

function forgotPassword (req, res) {
  res.render('forgotpassword');
}
function buttons (req, res) {
  res.render('buttons');
}

router.get('/', login);
router.get('/login', login);
router.get('/register', register);
router.get('/forgot-password', forgotPassword);

module.exports = router;