const mongoose = require('mongoose');

// create schema for poll document

const pollSchema = new mongoose.Schema({
    question: {
        type: String,
        required: 'Question is required'
        
    },
    username: {
        type: String,
        default: 'Admin'
    },
    date: {
        type: Date,
        default: Date.now
    },
    expiryLength: {
        type: Number,
        default: 1
    },
    expiry: {
        type: Date,
    },
    active: {
        type: Boolean,
        default: true
    },
    answerOne: {
        type: String,
        required: 'Atleast 2 poll options are required'
    },
    answerTwo: {
        type: String,
        required: 'Atleast 2 poll options are required'
    },
    answerThree: {
        type: String,
    },
    answerFour: {
        type: String,
    },
    answerOneCount: {
        type: Number,
        default: 0
    },
    answerTwoCount: {
        type: Number,
        default: 0
    },
    answerThreeCount: {
        type: Number,
        default: 0
    },
    answerFourCount: {
        type: Number,
        default: 0
    },
    totalVotes: {
        type: Number,
        default: 0
    }
});

// set poll expiry
pollSchema.pre('save', function(next) {
    console.log(this.expiry);
    const currentDate = this.date;
    const millisecondsInDay = this.expiryLength * 24 * 60 * 60 * 1000;
    this.expiry = new Date(currentDate.getTime() + millisecondsInDay);
    next();
  });

module.exports = mongoose.model('Poll', pollSchema);

