const mongoose = require('mongoose');

// create schema for poll document

const pollSchema = new mongoose.Schema({
    question: {
        type: String,
        required: 'Question is required'
        
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
    }
});

module.exports = mongoose.model('Poll', pollSchema);

