class ResumeButton extends Phaser.Sprite {
	constructor(game, x, y, circleFrame, iconFrame, onDown){
		super(game, x, y, 'menu', circleFrame);
		this.game = game;
		this.anchor.setTo(.5, .5);
		
		//The icon at the center of the spinning circle
		this.icon = this.game.add.sprite(this.x, this.y,  'menu', iconFrame);
		this.icon.anchor.setTo(.5, .5);

		this.events.onInputDown.add(() => { onDown(); });

		this.game.add.existing(this);
		this.inputEnabled = true;
	}

	update(){
		this.angle += 1;
	}

}

export default ResumeButton;