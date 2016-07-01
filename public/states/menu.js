var Menu = function (game) {
}

Menu.prototype = {
    create: function () {
        this.title = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 100, 'TF Juegos', {
           font: '40px prstart' ,
           fill: '#fff'
        });
        
        this.title.anchor.setTo(0.5);
        
        this.loginButton = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'login-facebook');
        this.loginButton.anchor.setTo(0.5);
        this.loginButton.inputEnabled = true;
        this.loginButton.events.onInputDown.add(this.loginFacebook, this);
    },
    loginFacebook: function () {
        var that = this;
        FB.login(function (resp) {
            if (resp.status == 'connected') {
                FB.api('/me', function (resp) {
                    resp.shipKey = 'ship' + that.game.rnd.between(1, 7);
                    that.game.state.start('Game', true, false, resp);
                })
            }
        })
    }
}