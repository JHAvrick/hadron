class FerrisWheel extends Phaser.Group {
	constructor(game, cx = 0, cy = 0, radius = 140, speed = .025, sprites = []){
		super(game);
		this.game = game;
		this._cx = cx;
		this._cy = cy;
		this._radius = radius;
		this._speed = speed;
		this._sprites = [];

		this.addAll(sprites);
	}

	_arrangeSprites(){

		var radiansBetween = (2 * Math.PI) / this._sprites.length; //distance between each item

		console.log(radiansBetween);

		for (let i = 0; i < this._sprites.length; i++){
				this._sprites[i].position = i * radiansBetween; //Position on the circle
		}

	}

	add(sprite){

		this._sprites.push({
			sprite: sprite,
			position: 0
		});

		this._arrangeSprites();

	}

	addAll(sprites){
		sprites.forEach((sprite) => {
			this._sprites.push({
				sprite: sprite,
				position: 0
			});
		});

		this._arrangeSprites();

	}

	update(){

		var distanceBetween = 2 / this._sprites.length;
		this._sprites.forEach((sprite) => {

			for (let i = 0; i < this._sprites.length; i++){
					let sprite = this._sprites[i].sprite;
					let radians = this._sprites[i].position; //Position on the circle

					sprite.x = this._cx + (Math.sin(radians) * this._radius); //Update position
					sprite.y = this._cy + (Math.cos(radians) * this._radius);
					this._sprites[i].position += this._speed; //Update speed
			}



		});

	}

}

export default FerrisWheel;