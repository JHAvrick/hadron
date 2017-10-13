class Wave extends Phaser.Sprite {
	constructor(game, x, y, texture, frame){
		super(game, x, y, texture, frame);
		this.game = game;
		this.anchor.setTo(.5, .5);
		this.scale.x = 0;
		this.scale.y = 0;

		this.easing = Phaser.Easing.Quadratic.Out;

		this.game.add.existing(this);
		this.exists = false;
	}

	explode(duration = 1000, toScale = 3, toAlpha = 0, destroyOnComplete = false){
		this.exists = true;
		this.alpha = 1;
		this.scale.x = 0;
		this.scale.y = 0;

		this.game.add.tween(this.scale).to({ x: toScale, y: toScale }, duration, this.easing, true);
		this.game.add.tween(this).to({ alpha: toAlpha }, duration, this.easing, true)
		.onComplete.add(() => {
			if (destroyOnComplete)
				this.destroy(); return;

			//Reset if not destroyed
			this.scale.x = 0;
			this.scale.y = 0;
			this.exists = false;
		});
	}

}

export default Wave;