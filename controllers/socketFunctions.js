const mongoose = require('mongoose');
const Poll = require('../models/poll');
const Voter = require('../models/voter');

module.exports = io => {

    io.on('connection', (socket) => {

        // Grab user ip
        const ipAddress = socket.handshake.headers["x-forwarded-for"].split(",")[0];
       
        // Initialize variables to store id of player socket client
        const userId = socket.id;

        // Server player connected message 
        console.log('Socket Connected: ' + userId); 

        // Handle join
        socket.on('join', room => {
            socket.join(room);
            console.log(userId + " joined " + room);
            io.to(room).emit('connected-to-poll');
        });

        // Handle poll votes
        socket.on('pollVote', async (id,vote) => {
            try {
                const updatedPoll = await Poll.findOneAndUpdate(
                    { _id: id },
                    { $inc: { [vote]: 1 } },
                    { new: true } // To return the updated document
                );
                const voteCount = updatedPoll[vote];     
                io.to(id).emit('update-poll-results', vote, voteCount);
                const newVote = await Voter.create({ pollId: id, ipAddress: ipAddress });
                console.log('vote success');
            } catch (err) {
                console.log('vote error');
            }
        });
      });    
};