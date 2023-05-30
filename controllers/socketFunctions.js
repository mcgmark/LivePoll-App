const Poll = require('../models/poll');

module.exports = io => {
    io.on('connection', (socket) => {

        // Add user socket to pollId socketIO room for live updates
        const pollId = socket.handshake.query.pollId;
        socket.join(pollId);

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
            console.log('user voted');
            try {
                const updatedPoll = await Poll.findOneAndUpdate(
                    { _id: id },
                    { $inc: { [vote]: 1 } },
                    { new: true } // To return the updated document
                );
                const voteCount = updatedPoll[vote];     
                io.to(id).emit('update-poll-results', vote, voteCount);
                console.log('vote success');
            } catch (err) {
                console.log('vote error');
            }
        });

      });    

};