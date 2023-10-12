const mongoose = require('mongoose'); // require Mongoose
const Poll = require('../models/poll'); // require poll model
const Voter = require('../models/voter'); // require voter model

module.exports = io => {

    io.on('connection', (socket) => {

        // Grab user ip
        const ipAddress = socket.handshake.headers["x-forwarded-for"]?.split(",")[0] ?? "::1";
   
 
        // Initialize variables to store id of player socket client
        const userId = socket.id;

        // Handle join message
        socket.on('join', room => {
            socket.join(room); // join the socket to the roomn specific to the poll
            io.to(userId).emit('connected-to-poll'); // emit connected to room message to clients connected to specific room
        });

        // Handle pollVote message
        socket.on('pollVote', async (pollVoteClientData) => {
            const id = pollVoteClientData.pollId;
            const vote = pollVoteClientData.vote

            // Find vote based on ip and poll id
            const existingVote = await Voter.findOne({ pollId: id, ipAddress: ipAddress }); 

            if (!existingVote) {
                try {
                    // find specific poll using id and increment fields
                    const updatedPoll = await Poll.findOneAndUpdate(  
                        { _id: id },
                        { $inc: { [vote]: 1, totalVotes: 1 } },
                        { new: true } // To return the updated document
                    );
                    // store vote in database
                    const newVote = await Voter.create({ pollId: id, ipAddress: ipAddress, vote: vote });
                    // setup updated vote data to update all connected socket clients
                    const voteData = {
                        vote: vote,
                        voteCount: updatedPoll[vote],
                        totalVotes: updatedPoll['totalVotes']
                    }; 
                    // emit message to vote socket that their vote was successfully counted
                    io.to(userId).emit('vote-success');
                    // emit message to all sockets connected to specific poll to update pol
                    io.to(id).emit('update-poll-results', voteData); 
                } catch (err) {
                    console.log('vote error');
                }
            } else if (existingVote) {
                io.to(userId).emit('already-voted');
            };
        });
      });    
};