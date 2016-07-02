var GameOver = function (game) {
}

GameOver.prototype = {
    init: function (playerInfo) {
        this.playerInfo = playerInfo;
    },
    create: function () {
        this.background = this.game.add.tileSprite(0, 0, this.game.world.width * 3, this.game.world.height * 3, 'bg_stars');
        this.background.autoScroll(-20, -20);
        
        if (this.playerInfo.win ) {
            this.title = this.game.add.text(this.game.world.width, this.game.world.height, 'GANASTE!', {
                fill: '#fff',
                font: '40px pixel' 
            });
            this.title.anchor.setTo(0.5);
        } else {
            this.title = this.game.add.text(this.game.world.width, this.game.world.height, 'PERDISTE!', {
                fill: '#fff',
                font: '40px pixel' 
            });
            this.title.anchor.setTo(0.5);
        }
        
        this.points = this.game.add.text(this.game.world.width, this.game.world.height + 100, 'puntos: ' + this.playerInfo.points, {
            fill: '#fff',
            font: '20px pixel' 
        });
        this.points.anchor.setTo(0.5);
    }
}