class Bumper extends Phaser.Sprite {
	constructor(game, x, y){
		super(game, x, y, null);
		this.game = game;
		this.anchor.setTo(.5,.5);
		
		this.width = this.game.width;
		this.height = 25;

		this.game.add.existing(this);
	}
}

export default Bumper;