const express = require('express'); // require express
const router = express.Router(); // use router object
const passport = require('passport'); // require passport
const User = require('../models/user'); // require user model

// GET - Register form route
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

// POST - Register form save to database
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

// GET - Login form route
router.get('/login', (req, res) => {
    let messages = req.session.messages;
    req.session.messages = [];
    res.render('users/login', {
        title: 'Login',
        messages: messages,
        user: req.user
    });
});

// POST - Login form get authentication using passport middlware
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

// Passport Google route
router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}), (req, res) => {});

// Passport Google Auth callback
router.get('/google/callback', passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureMessage: 'Could not authenticate with google'
}))


module.exports = router;