var Preload = function (game) {
}

Preload.prototype = {
    preload: function () {
        this.preloading = this.game.add.sprite(this.game.centerX,this.game.centerY,'loading');
        this.preloading.anchor.setTo(0.5);
        this.preloading.scale.setTo(3);
        this.game.load.setPreloadSprite(this.preloading);
    },
    create: function () {
        this.game.state.start('Menu');
    }
}