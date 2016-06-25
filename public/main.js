var game = new Phaser.Game(400, 600, Phaser.AUTO);

game.state.add('Boost', Boost);
game.state.add('Preload', Preload);
game.state.add('Menu', Menu);
game.state.add('Game', Game);
game.state.add('GameOver', GameOver);

game.state.start('Boost');