class Boot extends Phaser.State {

	init(){
        //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
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
            //this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
            //this.scale.setMinMax(600, 900, 800, 1200);
            //this.scale.forceLandscape = true;
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;

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