var Preload = function (game) {
}

Preload.prototype = {
    preload: function () {
        this.preloading = this.game.add.sprite(this.game.world.centerX,this.game.world.centerY,'loading');
        this.preloading.anchor.setTo(0.5);
        
        this.game.load.setPreloadSprite(this.preloading);
        
        this.game.load.image('login-facebook', 'assets/images/login-facebook.png');
        
        this.game.load.image('ship1', 'assets/images/ship1.png');
        this.game.load.image('ship2', 'assets/images/ship2.png');
        this.game.load.image('ship3', 'assets/images/ship3.png');
        this.game.load.image('ship4', 'assets/images/ship4.png');
        this.game.load.image('ship5', 'assets/images/ship5.png');
        this.game.load.image('ship6', 'assets/images/ship6.png');
        this.game.load.image('ship7', 'assets/images/ship7.png');
        this.game.load.image('bg_stars', 'assets/images/bg_stars.png');
    },
    create: function () {
        var tween = this.game.add.tween(this.preloading).to({ alpha: 0 }, 500);
        tween.onComplete.add(function () {
            this.game.state.start('Menu');
        }, this);
        tween.start();
    }
}