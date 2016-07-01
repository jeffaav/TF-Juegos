var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO);

game.state.add('Boost', Boost);
game.state.add('Preload', Preload);
game.state.add('Menu', Menu);
game.state.add('Game', Game);
game.state.add('GameOver', GameOver);

game.state.start('Boost');


var socket = io();

socket.on('connect', function (data) {
})