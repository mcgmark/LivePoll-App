const mongoose = require('mongoose');

const voterSchema = new mongoose.Schema({
  pollId: String,
  ipAddress: {
    type: String,
    default: '::1'
},
  vote: String,
});

module.exports = mongoose.model('Voter', voterSchema);