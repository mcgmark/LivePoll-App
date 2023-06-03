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
    const ipAddressA = req.headers['x-forwarded-for'];
    const ipAddressB = req.connection.remoteAddress;
    const ipAddressC = req.ip;
    try {
        console.log("A " + ipAddressA);
        console.log("b " + ipAddressB);
        console.log("c" + ipAddressC);
        const existingVote = await Voter.findOne({ pollId, ipAddressC });
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