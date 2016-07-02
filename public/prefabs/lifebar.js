var LifeBar = function (game, x, y, width, height, life, isEnemy) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.totalLife = life;
    this.actualLife = life;
    this.isEnemy = isEnemy;
    this.meters = this.game.add.group();

    // create a plain black rectangle to use as the background of a health meter
    var meterBackgroundBitmap = this.game.add.bitmapData(this.width, this.height);
    meterBackgroundBitmap.ctx.beginPath();
    meterBackgroundBitmap.ctx.rect(0, 0, meterBackgroundBitmap.width, meterBackgroundBitmap.height);
    meterBackgroundBitmap.ctx.fillStyle = '#FF0000';
    meterBackgroundBitmap.ctx.fill();
 
    // create a Sprite using the background bitmap data
    var healthMeterBG = this.game.add.sprite(this.x, this.y, meterBackgroundBitmap);
    healthMeterBG.fixedToCamera = true;
    this.meters.add(healthMeterBG);
 
    // create a red rectangle to use as the health meter itself
    var healthBitmap = this.game.add.bitmapData(this.width, this.height);
    healthBitmap.ctx.beginPath();
    healthBitmap.ctx.rect(0, 0, healthBitmap.width, healthBitmap.height);
    healthBitmap.ctx.fillStyle = '#00FF00';
    healthBitmap.ctx.fill();
 
    // create the health Sprite using the red rectangle bitmap data
    this.health = this.game.add.sprite(this.x, this.y, healthBitmap);
    this.meters.add(this.health);
    
    if (this.isEnemy) {
        this.health.anchor.setTo(0.5);
    } else {
        this.health.fixedToCamera = true;   
    }
}

LifeBar.prototype.reduce = function (damage) {
    this.actualLife -= damage;
	if(this.actualLife<=0){
		this.actualLife=0;
	}
    var m = (this.actualLife)/this.totalLife;
    var bw = (this.width-8) * m;
    var offset = 0;
    this.health.key.context.clearRect(0, 0, this.health.width, this.health.height);
    this.health.key.context.fillRect(0, offset, bw, (this.height));
    this.health.key.dirty = true;
}