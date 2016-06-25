var mongoose = require("mongoose"),
    Schema = mongoose.Schema;
    
var UserSchema = new Schema({
    name: String,
    facebookId: String
});

module.exports = mongoose.model('User', UserSchema);
