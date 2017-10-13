class PointIndicator extends Phaser.Group {
	constructor(game){
		super(game);
		this.game = game;

		this._makeSprites(5);
	}

	_makeSprites(count){
		var style = { font: "30px Arial", fill: "#ffffff", align: "center" };
		for (var i = 0; i < count; i++){
			var text = this.game.add.text(0, 0, "", style);
					text.anchor.setTo(.5, .5);
					text.exists = false;

			this.add(text);
		}
	}

	show(x, y, text, duration = 1000, tint = 0xffffff){
		var sprite = this.getFirstExists(false, false, x, y);

		//If all the sprites are already in play, don't do anything
		if (!sprite) return;

		sprite.tint = tint;
		sprite.setText(text);
		sprite.alpha = 1;

		this.game.add.tween(sprite).to({ x: sprite.x, y: sprite.y - 50 }, duration, Phaser.Easing.Quadratic.Out, true);
		this.game.add.tween(sprite).to({ alpha: 0 }, duration, Phaser.Easing.Quadratic.Out, true)
		.onComplete.addOnce(() => {
			sprite.exists = false;
		});
	}

}

export default PointIndicator;