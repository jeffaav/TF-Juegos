var SpaceShip = function (game, playerInfo, isCurrentPlayer, isEnemy) {
    
    var pos = {
        x: game.world.centerX,
        y: game.world.centerY
    };
    console.log(playerInfo);
    
    if (playerInfo.position) {
        pos.x = playerInfo.position.x;
        pos.y = playerInfo.position.y;
    }
    
    Phaser.Sprite.call(this, game, pos.x, pos.y, playerInfo.shipKey);
    game.add.existing(this);
    game.physics.arcade.enable(this);
    
    this.playerInfo = playerInfo;
    
    this.angularVelocity = 200;
    this.isMoving = false;
    this.isCurrentPlayer = isCurrentPlayer != undefined && isCurrentPlayer == true;
    this.isEnemy = isEnemy != undefined && isEnemy == true;
    this.movements = [];
    this.points = 0;
    this.shoot = {
        can: false,
        time: 100,
        elapsed: 0
    };
    
    if (!this.playerInfo.id) {
        this.playerInfo.id = guid();   
    }
    
    if (!this.isEnemy) {
        this.life = this.playerInfo.configuration.lifebar.life;
    } else {
        this.life = this.playerInfo.configuration.lifebar.enemylife;
    }

    this.game = game;
    this.anchor.setTo(0.5);
    this.body.collideWorldBounds = true;
    this.checkWorldsBounds = true;
    
    if (this.playerInfo.angle) {
        this.angle = this.playerInfo.angle;
    }
    
    if (this.isCurrentPlayer) {
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.spaceBar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        this.game.camera.follow(this);
        
        this.pilot = this.game.add.sprite(0, 0, 'pilot');
        this.pilot.fixedToCamera = true;
        this.pilot.cameraOffset.setTo(0, this.game.game.height - this.pilot.height);
        
        this.pointText = this.game.add.text(0, 0, 'Puntos: ' + this.points, {
           fill: '#fff',
           font: '22px pixel'
        });
        this.pointText.fixedToCamera = true;
        this.pointText.cameraOffset.setTo(this.pilot.width + 10, this.game.game.height - this.pilot.height + 10);
        this.lifeBar = new LifeBar(this.game.game, 
            this.pilot.width + 10, 
            this.game.game.height - this.pilot.height + 40, 
            this.playerInfo.configuration.lifebar.width, 
            this.playerInfo.configuration.lifebar.height, 
            this.life);
    } else {
        console.log(this.playerInfo);
        this.lifeBar = new LifeBar(this.game, 
            this.x, 
            this.y - this.height / 2, 
            this.playerInfo.configuration.lifebar.enemyWidth, 
            this.playerInfo.configuration.lifebar.enemyHeight, 
            this.life,
            this.isEnemy);
    }
    
    this.bullets = this.game.add.group();
}

SpaceShip.prototype = Object.create(Phaser.Sprite.prototype);
SpaceShip.prototype.constructor = SpaceShip;

SpaceShip.prototype.update = function () {
    if (!this.isEnemy) {
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
        this.body.angularVelocity = 0;
            
        if (this.isCurrentPlayer) {
            this.useCursors();
        }
        
        if (this.movements.length > 0) {
            console.log(this.movements[this.movements.length - 1]);
            this.setMovement(this.movements[0]);
            this.movements.splice(0, 1);
        }   
    }
}

SpaceShip.prototype.createBullet = function (send) {
    var bullet = this.bullets.getFirstDead();
    if (bullet) {
        bullet.reset(this.x, this.y);
        this.game.physics.arcade.velocityFromAngle(this.angle, 500, bullet.body.velocity);
    } else {
        bullet = this.game.add.sprite(this.x, this.y, 'bullet');
        bullet.anchor.setTo(0.5);
        bullet.checkWorldBounds = true;
        bullet.outOfBoundsKill = true;
        this.game.physics.arcade.enable(bullet);
        this.game.physics.arcade.velocityFromAngle(this.angle, 500, bullet.body.velocity);
        bullet.damage = this.game.rnd.between(3, 10);
        this.bullets.add(bullet);
    }
    if (send != undefined && send == true) {
        socket.emit('shoot', this.playerInfo.id);   
    }
}

SpaceShip.prototype.useCursors = function () {
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
    
    if (this.isMoving) {
        this.isMoving = false;
        this.preparePlayerInfo();
        socket.emit('movePlayer', this.playerInfo);
    } 
    
    if (!this.shoot.can) {
        this.shoot.elapsed += this.game.time.elapsed;
    }
    
    if (this.spaceBar.isDown && this.shoot.can) {
        this.shoot.can = false;
        this.shoot.elapsed = 0;
        this.createBullet(true);
    }
    
    if (this.shoot.elapsed > this.shoot.time) {
        this.shoot.can = true;
    }
}

SpaceShip.prototype.preparePlayerInfo = function () {
    this.playerInfo.position = this.position;
    this.playerInfo.bodyVelocity = this.body.velocity;
    this.playerInfo.angularVelocity = this.body.angularVelocity;
    this.playerInfo.angle = this.angle;
}

SpaceShip.prototype.addMovement = function (playerInfo) {
    this.movements.push(playerInfo);
    this.playerInfo = playerInfo;
}

SpaceShip.prototype.setMovement = function(playerInfo){
    //this.body.position = playerInfo.position;
    //this.angle = playerInfo.angle;
    this.body.velocity.x = this.playerInfo.bodyVelocity.x;
    this.body.velocity.y = this.playerInfo.bodyVelocity.y;
    this.body.angularVelocity = this.playerInfo.angularVelocity;
}
SpaceShip.prototype.scoreKillEnemy = function () {
    this.points += 10;
    this.pointText.text = 'Puntos: ' + this.points;
    
}