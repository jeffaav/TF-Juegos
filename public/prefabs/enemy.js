var Enemy = function (game, numberOfEnemies, centerX, centerY, radioEnemy, configuration, groupIndex) {
    Phaser.Group.call(this, game);
    game.add.existing(this);
    
    this.game = game;
    this.numberOfEnemies = numberOfEnemies;
    this.centerX = centerX;
    this.centerY = centerY;
    this.radioEnemy = radioEnemy;
    
    this.bulletElapsed = 0;
    this.bulletTime = this.game.rnd.between(500, 5000);
    
    var acumAngle = 0.0;
    for (var i = 0; i < this.numberOfEnemies; i++) {
        var pAngle = 1.0*2*Math.PI/this.numberOfEnemies*i;
		var deltaX = this.radioEnemy*Math.sin(pAngle);
		var deltaY = this.radioEnemy*Math.cos(pAngle);
		var posX = this.centerX + deltaX;
		var posY = this.centerY + deltaY;
		var rAngle = 1.0*2*Math.PI/this.numberOfEnemies;
		var sAngle = 360.0*rAngle/(2.0*Math.PI);
		var enemy = new SpaceShip(this.game.game, {
		    position: { x: posX, y: posY },
		    angle: acumAngle,
		    shipKey: 'ship1',
		    configuration: configuration
		}, false, true);
		enemy.groupIndex = groupIndex;
		enemy.index = i;
		
		acumAngle -= sAngle;
		this.add(enemy);
    }
}

Enemy.prototype = Object.create(Phaser.Group.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function () {
    
    if (!this.alive) {
        return;
    }
    
    this.bulletElapsed += this.game.time.elapsed;
    
    if (this.bulletElapsed >= this.bulletTime) {
        this.bulletElapsed = 0;
        this.forEach(function(enemy) {
            enemy.createBullet();
        }, this);
    }
    
    this.forEach(function (enemy) {
        var pDelta = -2.0;
    	enemy.angle += pDelta;
    	enemy.body.angularVelocity = pDelta / 2.0;
        enemy.game.physics.arcade.velocityFromAngle(enemy.angle, this.radioEnemy*-1 * pDelta, enemy.body.velocity);
        enemy.lifeBar.health.x = enemy.x;
        enemy.lifeBar.health.y = enemy.y - enemy.height / 2;
    }, this);
}