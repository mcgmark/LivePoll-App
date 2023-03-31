const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

router.get('/register', (req, res) => {
    let messages = req.session.messages?.message;
    // clear session variable
    req.session.messages = [];
    res.render('users/register', {
        title: 'Register',
        messages: messages,
        user: req.user
    });
});

router.post('/register', (req, res) => {
    User.register(new User ({
        username: req.body.username,
    }), req.body.password,
    (err, user) => {
        if (err) {
            // store error in session variable
            console.log(err);
            req.session.messages = err; 
            res.redirect('/users/register');
        } else {
            res.redirect('/users/login');
        }
    });
});

router.get('/login', (req, res) => {
    let messages = req.session.messages;
    req.session.messages = [];
    res.render('users/login', {
        title: 'Login',
        messages: messages,
        user: req.user
    });
});


router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureMessage: 'Invalid Login'
}));

router.get('/logout', (req, res) => {
    req.session.messages = [];
    req.logout((err) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
});


router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}), (req, res) => {});

router.get('/google/callback', passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureMessage: 'Could not authenticate with google'
}))


module.exports = router;