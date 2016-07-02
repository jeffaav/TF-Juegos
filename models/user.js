var mongoose = require("mongoose"),
    Schema = mongoose.Schema;
    
var UserSchema = new Schema({
    name: String,
    facebookId: String,
    ranking: String,
    _id: String
});

module.exports = mongoose.model('User', UserSchema);
