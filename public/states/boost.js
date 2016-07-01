var Boost = function (game) {
}

Boost.prototype = {
    preload: function () {
        this.game.load.image('loading', 'assets/images/loading.png');
        
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
    },
    create: function () {
        this.game.state.start('Preload');
    }
}
