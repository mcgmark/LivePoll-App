const express = require('express'); //Require express
const mongoose = require('mongoose'); //Require mongoose database
const Voter = require('../models/voter'); //Require voter model

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
    const ipAddress = req.ip; // grab client ip
    try {
        const existingVote = await Voter.findOne({ pollId, ipAddress }); // Find vote based on ip and poll id
        if (existingVote) {
            req.hasVoted = true; // set boolean to true
            req.messages = "Thank You For Voting!"; //set message
            req.vote = existingVote.vote; // set the users vote
            next(); // continue
          } else {
            req.hasVoted = false;
            next();
          }
        } catch (error) {
          onsole.log(error);
    }  
};