const express = require('express');
const router = express.Router();

// use Poll model for poll questions, answers, and counts
const Poll = require('../models/poll');

// global auth check to make methods private
const global = require('../controllers/globalFunctions');

/* GET polls index */
router.get('/', (req, res) => {
    // get all polls from database
    Poll.find((err, polls) => {
        if (err) {
            console.log(err)
        }
        else {
            console.log(polls);
            res.render('home', {
                title: 'Polls list',
                polls: polls,
                user: req.user
            });
        }
    });
});


// make public
module.exports = router;