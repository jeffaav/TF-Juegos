var SpaceShip = function (game, playerInfo, isCurrentPlayer) {
    
    var pos = {
        x: game.world.centerX,
        y: game.world.centerY
    };
    
    if (playerInfo.position) {
        pos.x = playerInfo.position.x;
        pos.y = playerInfo.position.y;
    }
    
    Phaser.Sprite.call(this, game, pos.x, pos.y, playerInfo.shipKey);
    game.add.existing(this);
    game.physics.arcade.enable(this);
    
    this.angularVelocity = 200;
    this.isMoving = false;
    this.sendPosition = false;
    this.isCurrentPlayer = isCurrentPlayer != undefined || isCurrentPlayer == true;
    
    this.playerInfo = playerInfo;
    

    this.game = game;
    this.anchor.setTo(0.5);
    
    if (this.playerInfo.angle) {
        this.angle = this.playerInfo.angle;
    }
    
    if (this.isCurrentPlayer) {
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.game.camera.follow(this);
    }
}

SpaceShip.prototype = Object.create(Phaser.Sprite.prototype);
SpaceShip.prototype.constructor = SpaceShip;

SpaceShip.prototype.update = function () {
    if (this.isCurrentPlayer) {
        this.useCursors();
    }
}

SpaceShip.prototype.useCursors = function () {
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
    this.body.angularVelocity = 0;
    
    if (this.cursors.left.isDown)
    {
        this.body.angularVelocity = -this.angularVelocity;
        this.isMoving = true;
    }
    else if (this.cursors.right.isDown)
    {
        this.body.angularVelocity = this.angularVelocity;
        this.isMoving = true;
    }
    
    if (this.cursors.up.isDown) {
        this.game.physics.arcade.velocityFromAngle(this.angle, 300, this.body.velocity);
        this.isMoving = true;
    }
    
    if (this.sendPosition && !this.isMoving) {
        this.sendPosition = false;
        this.preparePlayerInfo();
        socket.emit('updatePosition', this.playerInfo);
    }
    
    if (this.isMoving) {
        this.isMoving = false;
        this.sendPosition = true;
        this.preparePlayerInfo();
        socket.emit('updatePosition', this.playerInfo);
    } 
}

SpaceShip.prototype.preparePlayerInfo = function () {
    this.playerInfo.position = this.position;
    this.playerInfo.bodyVelocity = this.body.velocity;
    this.playerInfo.angularVelocity = this.body.angularVelocity;
    this.playerInfo.angle = this.angle;
}

SpaceShip.prototype.updatePosition = function (playerInfo) {
    this.playerInfo = playerInfo;
    this.body.velocity.x = this.playerInfo.bodyVelocity.x;
    this.body.velocity.y = this.playerInfo.bodyVelocity.y;
    this.body.angularVelocity = this.playerInfo.angularVelocity;
}