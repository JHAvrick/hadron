class MenuButton extends Phaser.Sprite {
	constructor(game, x, y, circleFrame, iconFrame, onDown){
		super(game, x, y, 'menu', circleFrame);
		this.game = game;
		this.anchor.setTo(.5, .5);
		this.alpha = 0;
		
		//The icon at the center of the spinning circle
		this.icon = this.game.add.sprite(this.x, this.y,  'menu', iconFrame);
		this.icon.anchor.setTo(.5, .5);
		this.icon.alpha = 0;

		this.events.onInputDown.add(() => {

			this.game.add.tween(this.scale).to({ x: 3, y: 3 }, 1500, Phaser.Easing.Quadratic.Out, true); //position tween for "slide"
			this.game.add.tween(this).to({ alpha: 0 }, 1500, Phaser.Easing.Quadratic.Out, true); //alpha tween

			onDown();

		});

		this.game.add.existing(this);
		this.inputEnabled = true;
	}



	update(){
		this.icon.visible = this.visible;
		this.icon.x = this.x;
		this.icon.y = this.y;
		this.icon.alpha  = this.alpha;
		this.angle += 1;
	}

}

export default MenuButton;