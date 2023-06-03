const express = require('express');
const Voter = require('../models/voter');
const mongoose = require('mongoose');

// public function auth check for anywhere on the site
exports.isAuthenticated = (req, res, next) => {
    // if user is logged in let them continue
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/users/login');
    }
};

exports.hasVoted = async (req, res, next) => {
    const pollId = req.params.id;
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    try {
        console.log(pollId + ipAddress);
        const existingVote = await Voter.findOne({ pollId, ipAddress });
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