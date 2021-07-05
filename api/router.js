const express = require('express');
const router = new express.Router();
const passport = require('passport');
// const { redirect } = require('statuses');

function loginUser (req, res, next) {
    console.log('we here');
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/register'
    });
}

router.post('/login', loginUser);

module.exports = router;