const Poll = require('../models/poll');

module.exports = io => {
    io.on('connection', (socket) => {

    // Initialize variables to store id of player socket client
    const userId = socket.id;

    // Server player connected message 
    console.log('Socket Connected: ' + userId); 
        socket.on('pollVote', async (id,vote) => {
            console.log('user voted');
            try {
                const updatedPoll = await Poll.updateOne(
                  { _id: id },
                  { $inc: { [vote]: 1 } }
                );
                console.log('vote success');
              } catch (err) {
                console.log('vote error');
              }
        });
      });  
    
};