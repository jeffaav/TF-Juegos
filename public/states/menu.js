var Menu = function (game) {
}

Menu.prototype = {
    create: function () {
        this.background = this.game.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'bg_stars');
        this.background.autoScroll(-20, -20);
        
        this.title = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 100, 'TF Juegos', {
           font: '40px prstart' ,
           fill: '#fff'
        });
        
        this.title.anchor.setTo(0.5);
        this.createFacebookButton();
        
        this.playerInfo = {};
    },
    chooseModality: function () {
        this.singlePlayerButton = this.game.add.sprite(this.game.world.centerX - 200, this.game.world.centerY, 'singleplayer');
        this.singlePlayerButton.modality = 'singleplayer';
        this.singlePlayerButton.anchor.setTo(0.5);
        this.singlePlayerButton.inputEnabled = true;
        this.singlePlayerButton.events.onInputDown.add(this.startGame, this);
        
        this.multiPlayerButton = this.game.add.sprite(this.game.world.centerX + 200, this.game.world.centerY, 'multiplayer');
        this.multiPlayerButton.modality = 'multiplayer';
        this.multiPlayerButton.anchor.setTo(0.5);
        this.multiPlayerButton.inputEnabled = true;
        this.multiPlayerButton.events.onInputDown.add(this.startGame, this);
    },
    startGame: function (button) {
        this.playerInfo.modality = button.modality;
        this.playerInfo.currentLevel = 0;
        this.game.state.start('Game', true, false, this.playerInfo);
    },
    createFacebookButton: function () {
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
                    resp.facebookId = resp.id.toString();
                    delete resp.id;
                    
                    that.playerInfo = resp;
                    that.loginButton.visible = false;
                    that.chooseModality();
                    
                    //$.get('/api/users/' + resp.facebookId, function (data) {
                    //    if (data == undefined) {
                    //        $.post('/api/users', that.playerInfo, function (data) {
                    //            if (data._id) {
                    //                that.loginButton.visible = false;
                    //                that.chooseModality();
                    //            }
                    //        }).fail(function (message) {
                    //            console.log(message);
                    //            alert(message);
                    //        });
                    //    } else {
                    //        that.loginButton.visible = false;
                    //        that.chooseModality();
                    //    }
                    //}).fail(function (message) {
                    //    console.log(message);
                    //    alert(message);
                    //});
                })
            }
        })
    },
    changeScroll: function () {
        var x = this.game.rnd.between(20, 100);
        var y = this.game.rnd.between(20, 100);
        
        
    }
}