const express = require('express');
const mongoose = require('mongoose');

const Voter = require('../models/voter');

// public function auth check for anywhere on the site
exports.isAuthenticated = (req, res, next) => {
    // if user is logged in let them continue
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/users/login');
    }
};

// public function to check if user has voted
exports.hasVoted = async (req, res, next) => {
    const pollId = req.params.id;
    const clientIpAddress = req.ip;
    try {
        const existingVote = await Voter.findOne({ pollId, clientIpAddress });
        if (existingVote) {
            req.hasVoted = true;
            req.messages = "Thank You For Voting!";
            next();
          } else {
            req.hasVoted = false;
            next();
          }
        } catch (error) {
          console.log(error);
    }  
};