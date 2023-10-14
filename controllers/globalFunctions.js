const express = require('express'); //Require express
const mongoose = require('mongoose'); //Require mongoose database
const Voter = require('../models/voter'); //Require voter model
const Poll = require('../models/poll');

// public function auth check 
exports.isAuthenticated = (req, res, next) => {
  try { 
  // if user is logged in let them continue
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/users/login'); // if user is not logged in send them to login route
    };
  } catch (error) {
      console.log(error);
  };  
};

// public function to check if user has voted
exports.hasVoted = async (req, res, next) => {
    const pollId = req.params.id; // grab the poll id from request params
    const ipAddress = req.query.userId;
    // const ipAddress = req.ip ?? "::1";  // grab client ip *doesn't work on current cheap server
    try {
        const existingVote = await Voter.findOne({ pollId, ipAddress }); // Find vote based on ip and poll id
        if (existingVote) {
            req.hasVoted = true; // set boolean to true
            req.vote = existingVote.vote; // set the users vote
          } else {
            req.hasVoted = false;
          }
        } catch (error) {
          console.log(error);
    }  
    next(); // continue
};

exports.pollOpen = async (req, res, next) => {
  const pollId = req.params.id; // grab the poll id from request params
  try {
    const poll = await Poll.findById(pollId);
    if (poll.active) {
      const date = Date.now();
      let expiryTimer = [];
      let timeTest = ((date - poll.expiry) / 3.6e+6) * -1;
      timeTest = timeTest.toFixed(2);
      timeTest = timeTest.toString();
      let timerSplit = timeTest.split(".");
      let timerHours = timerSplit[0];
      let timerMinutes = timerSplit[1];
      timerMinutes = `.${timerMinutes}`;
      timerMinutesS = parseFloat(timerMinutes);
      timerMinutes = timerMinutes * 60;
      timerMinutes = timerMinutes.toFixed();
      req.hours = timerHours;
      req.minutes = timerMinutes;
      if (date >= poll.expiry){ // closed
        await Poll.findOneAndUpdate({_id: pollId}, {active: false})
        req.active = false;
      } else if (date <= poll.expiry){ // open
        req.active = true;
      }
    } else {
      req.active = false;
    }
  } catch (error) {
    console.log(error);
  }
  next(); // continue
};