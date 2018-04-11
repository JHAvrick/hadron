class LifeIndicator {
	constructor(game){
		this.game = game;
		this.layout = game.plugins.layout;

		this._totalLife = 16;
		this._life = 16;

		this._bar = this.game.add.sprite(this.game.width - 20, this.game.height - 65, 'sprites', 'fill');
		this._bar.scale.x = .5;
		this._bar.scale.y = 0;
		this._bar.anchor.setTo(.5, 1);
		
	}

	//Resizes the meter scale to match the current life count
	//Randomly changes tint during the tween, but resets back to white when complete
	_resize(){
		this.game.add.tween(this._bar.scale).to({ y: this._life / this._totalLife }, 1000, Phaser.Easing.Quadratic.Out)
		.onUpdateCallback(() => { 
			this._bar.tint = Phaser.Color.getRandomColor(); 
		}).start()
		.onComplete.add(() => { 
			this._bar.tint = Phaser.Color.interpolateColor(0xff0000, 0x00ff00, this._totalLife, this._life);
		});
	}

	enter(){
		this._resize();
	}

	set life(value){
		this._life = value;
		this._resize();
	}

	decrement(count){
		this._life = this._life - count;
		this._resize();
	}

	increment(count){
		this._life = this._life + count;
		this._resize();
	}

}

export default LifeIndicator;