class Boot extends Phaser.State {

	init(){

        //This is specifically for itch.io and is necessary to allow the game
        //to pause properly when the back button is pressed on mobile. If Phaser
        //is not paused, a WegGL error will be thrown and the game will not resume
        //properly.
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            window.onresize = () => {
                this.game.paused = this.game.paused ? false : true;
                console.log("Phaser Pause Toggled");
            }          
        }


        //Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
        //this.stage.disableVisibilityChange = true;
        this.game.input.maxPointers = 1;

        if (this.game.device.desktop) {

            //  If you have any desktop specific settings, they can go in here
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;

        } else {

            //  Same goes for mobile settings.
            //  In this case we're saying "scale the game, no lower than 480x260 and no higher than 1024x768"
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            //this.scale.forceLandscape = true;
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
            //this.scale.setMinMax(720, 1100, 1280 / 1.5 , 1280);

        }

	}

    preload() {
        console.log("Boot");
    }

  	create() {
        this.game.state.start('Preload');
  	}

}

export default Boot;