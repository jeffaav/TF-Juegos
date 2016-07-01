var express = require("express"),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose")
    
var config = {
    port: process.env.PORT,
    ip: process.env.IP
}

//mongoose.connect('mongodb://' + config.ip + '/tf');
    
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//var user = require('./routes/user.js');
//app.use('/api/users', user);

app.use('/api', function (req, res) {
    res.json({ message: 'holi' });
});

var players = {};

io.on('connection', function (socket) {
    
    socket.on('newPlayer', function (playerInfo) {
        playerInfo.clientId = socket.client.id;
        socket.broadcast.emit('playerJoining', playerInfo);
        socket.emit('updatePlayersInfo', players);
        players[socket.client.id] = playerInfo;
    });
    
    socket.on('updatePosition', function (playerInfo) {
        socket.broadcast.emit('playerMoving', playerInfo);
        players[socket.client.id] = playerInfo;
    });
    
    
    socket.on('disconnect', function() {
        socket.broadcast.emit('playerDisconnected', socket.client.id);
        delete players[socket.client.id];
    });
});


server.listen(config.port, config.ip);