const mongoose = require('mongoose');

const voterSchema = new mongoose.Schema({
  pollId: String,
  ipAddress: String
});

module.exports = mongoose.model('Voter', voterSchema);