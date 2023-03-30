// require mongoose modules
const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');
const findOrCreate = require('mongoose-findorcreate');

// schemea fields
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    oauthProvider: String,
    oauthId: String
});

// convert this model to user management model
userSchema.plugin(plm);

//find or create
userSchema.plugin(findOrCreate);

module.exports = mongoose.model('User', userSchema);