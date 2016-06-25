var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");
    
var config = {
    port: process.env.PORT,
    ip: process.env.IP
}

mongoose.connect('mongodb://' + config.ip + '/tf');
    
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var user = require('./routes/user.js');
app.use('/api/users', user);

app.use('/api', function (req, res) {
    res.json({ message: 'holi' });
});

app.listen(config.port);