var Game = function (game) {
}

Game.prototype = {
    init: function (playerInfo) {
        this.playerInfo = playerInfo;
        this.playerInfo.configuration = this.game.cache.getJSON('configuration');
    },
    preload: function () {
        this.game.stage.disableVisibilityChange = true;
    },
    create: function () {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.world.setBounds(0, 0, this.game.world.width * 3, this.game.world.height * 3);
        
        this.background = this.game.add.tileSprite(0, 0, this.game.world.width * 3, this.game.world.height * 3, 'bg_stars');
        this.background.autoScroll(-20, -20);
        
        this.player = new SpaceShip(this, this.playerInfo, true);
        this.otherPlayers = this.game.add.group();
        
        this.enemies = this.game.add.group();
        this.numberOfEnemies = 0;
        this.enemiesAlive = 0;
        
        switch (this.playerInfo.modality) {
            case 'singleplayer':
                this.createEnemies();
                this.showLevel();
                this.showEnemyCount();
                break;
            case 'multiplayer':
                this.defineSocketEvents();   
                break;
        }
        
        that = this;
    },
    update: function () {
        switch (this.playerInfo.modality) {
            case 'singleplayer':
                this.enemies.forEachAlive(function (enemy) {
                    this.game.physics.arcade.overlap(enemy, this.player.bullets, this.bulletsCollision, null, this);
                    enemy.forEachAlive(function (e) {
                        this.game.physics.arcade.overlap(this.player, e.bullets, this.bulletsCollision, null, this);
                    }, this);
                }, this);   
                break;
            
            case 'multiplayer':
                this.game.physics.arcade.collide(this.player, this.otherPlayers, null, this.playersCollision, this);
                this.game.physics.arcade.overlap(this.otherPlayers, this.player.bullets, this.bulletsCollision, null, this);
                this.otherPlayers.forEachAlive(function (otherPlayer) {
                    this.game.physics.arcade.overlap(this.player, otherPlayer.bullets, this.bulletsCollision, null, this);
                }, this);    
                break;
        }
    },
    playersCollision: function (player, otherPlayer) {
        
    },
    bulletsCollision: function (player, bullet) {
        bullet.kill();
        if (player.lifeBar) {
            player.lifeBar.reduce(bullet.damage);   
            
            if (player.lifeBar.actualLife <= 0) {
                player.kill();
                if (player.isCurrentPlayer) {
                    this.playerInfo.win = false;
                    this.playerInfo.points = this.player.points;
                    this.game.state.start('GameOver', true, false, false);
                } else if(this.playerInfo.modality == 'multiplayer' && this.otherPlayers.countLiving() == 0) {
                    this.playerInfo.win = true;
                    this.playerInfo.points = this.player.points;
                    this.game.state.start('GameOver', true, false, true);
                }
                if (player.isEnemy) {
                    var groupIndex = player.groupIndex;
                    var enemyGroup = this.enemies.getAt(groupIndex);
                    
                    if (enemyGroup.countLiving() == 0) {
                        this.enemiesAlive--;
                    }
                    
                    this.textEnemyCount.text = 'Grupo de enemigos: ' + this.enemiesAlive;
                    
                    if (this.enemiesAlive == 0) {
                        this.changeLevel();
                    }
                }
            }
        }
        
        if (player.isEnemy) {
            this.player.scoreKillEnemy();
        }
    },
    getPlayerById: function (id) {
        return this.otherPlayers.children.find(function (player) { 
            return player.playerInfo.id == id; 
        });
    },
    createEnemies: function () {
        var paddingWorld = this.playerInfo.configuration.paddingWorld;
        var level = this.playerInfo.configuration.levels[this.playerInfo.currentLevel];
        var range = level.rangeNumberEnemy;
        this.numberOfEnemies = this.game.rnd.between(range.min, range.max);
        
        for (var i = 0; i < this.numberOfEnemies; i++) {
            var posX = this.game.rnd.between(paddingWorld, this.game.world.width - paddingWorld);
            var posY = this.game.rnd.between(paddingWorld, this.game.world.width - paddingWorld);
            var enemiesPerGroup = this.game.rnd.between(3, 6);
            var enemy = new Enemy(this, enemiesPerGroup, posX, posY, 150, this.playerInfo.configuration, i);
            this.enemies.add(enemy);   
            this.enemiesAlive = this.enemies.total;
        }
    },
    
    changeLevel: function () {
        this.playerInfo.currentLevel++;
        
        if (this.playerInfo.configuration.levels.length == this.playerInfo.level) {
            this.playerInfo.win = true;
            this.playerInfo.points = this.player.points;
            this.game.state.start('GameOver', true, false, this.playerInfo);
        }
        
        this.game.state.start('Game', true, false, this.playerInfo);
    },
    
    showLevel: function () {
        this.textLevel = this.game.add.text(0, 0, 'Nivel: ' + (this.playerInfo.currentLevel + 1), {
           fill: '#fff',
           font: '22px pixel' 
        });
    
        this.textLevel.fixedToCamera = true;
        this.textLevel.cameraOffset.setTo(this.game.width - this.playerInfo.configuration.levelText.x, this.playerInfo.configuration.levelText.y);
    },
    
    showEnemyCount: function () {
        this.textEnemyCount = this.game.add.text(0, 0, 'Grupo de enemigos: ' + this.enemies.total, {
           fill: '#fff',
           font: '22px pixel' 
        });
    
        this.textEnemyCount.fixedToCamera = true;
        this.textEnemyCount.cameraOffset.setTo(this.game.width - this.playerInfo.configuration.enemyGroupText.x, this.playerInfo.configuration.enemyGroupText.y);
    },
    
    defineSocketEvents: function () {
        socket.emit('newPlayer', this.playerInfo);
        
        socket.on('playerJoining', function (playerInfo) {
            that.otherPlayers.add(new SpaceShip(that, playerInfo));
        });
        
        socket.on('updatePlayersInfo', function(playersInfo) {
            for (var id in playersInfo) {
                if (id != that.player.playerInfo.id && that.getPlayerById(id) == undefined) {
                    that.otherPlayers.add(new SpaceShip(that, playersInfo[id]));
                }
            }
        });
        
        socket.on('playerMoving', function (playerInfo) {
            var player = that.getPlayerById(playerInfo.id);
            if (player) {
                player.addMovement(playerInfo);
            }
        });
        
        socket.on('createBullet', function(id) {
            var player = that.getPlayerById(id);
            if (player) {
                player.createBullet();
            }
        });
        
        socket.on('playerDisconnected', function(id) {
            var player = that.getPlayerById(id);
            if (player) {
                player.kill();
                that.otherPlayers.remove(player);
            }
        });
    }
}