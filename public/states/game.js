var Game = function (game) {
}

Game.prototype = {
    init: function (playerInfo) {
        this.playerInfo = playerInfo;
    },
    preload: function () {
        this.game.state.disableVisibilityChange = true;
    },
    create: function () {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        
        this.player = new SpaceShip(this, this.playerInfo, true);
        this.otherPlayers = this.game.add.group();
        
        this.defineSocketEvents();
    },
    getPlayerByClientId: function (clientId) {
        return this.otherPlayers.children.find(function (player) { 
            return player.playerInfo.clientId == clientId; 
        });
    },
    
    defineSocketEvents: function () {
        that = this;
        
        socket.emit('newPlayer', this.playerInfo);
        
        socket.on('playerJoining', function (playerInfo) {
            that.otherPlayers.add(new SpaceShip(that, playerInfo));
        });
        
        socket.on('updatePlayersInfo', function(playersInfo) {
            for (var clientId in playersInfo) {
                that.otherPlayers.add(new SpaceShip(that, playersInfo[clientId]));
            }
        })
        
        socket.on('playerDisconnected', function(clientId) {
            var player = that.getPlayerByClientId(clientId);
            if (player) {
                player.kill();
                that.otherPlayers.remove(player);
            }
        });
        
        socket.on('playerMoving', function (playerInfo) {
            var player = that.getPlayerByClientId(playerInfo.clientId);
            if (player) {
                player.updatePosition(playerInfo);
            }
        });
    }
}