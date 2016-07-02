var express = require("express"),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose")
    
var config = {
    port: process.env.PORT,
    ip: process.env.IP,
    useWebServices: true
}
    
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

if (config.useWebServices) {
    mongoose.connect('mongodb://' + config.ip + '/tf');
    
    var user = require('./routes/user.js');
    app.use('/api/users', user);
    
    app.use('/api', function (req, res) {
        res.json({ message: 'holi' });
    });
}

var players = {};

io.on('connection', function (socket) {
    
    socket.on('newPlayer', function (playerInfo) {
        players[playerInfo.id] = playerInfo;
        socket.emit('updatePlayersInfo', players);
        socket.broadcast.emit('playerJoining', playerInfo);
        socket.playerId = playerInfo.id;
    });
    
    socket.on('movePlayer', function (playerInfo) {
        socket.broadcast.emit('playerMoving', playerInfo);
        players[playerInfo.id] = playerInfo;
    });
    
    socket.on('shoot', function(playerId) {
        socket.broadcast.emit('createBullet', playerId);
    })
    
    socket.on('disconnect', function() {
        delete players[socket.playerId];
        console.log(socket.playerId);
        console.log(players);
        socket.broadcast.emit('playerDisconnected', socket.playerId);
    });
});


server.listen(config.port, config.ip);