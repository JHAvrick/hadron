class Banner extends Phaser.Sprite {
	constructor(game, atlas = "null", frameName = "null", enterSpeed = 1000, exitSpeed = 500, linger = 750){
		super(game, 0, 0, atlas, frameName);
		this.game = game;

		//Initial state
		this.anchor.setTo(.5, .5);
		this.x = this.game.width / 2;
		this.y = this.game.height + this.height; 
		this.width = this.game.width;

		//Behavior variables
		this._enterSpeed = enterSpeed; //Speed that the banner will enter/exit the stage
		this._exitSpeed = exitSpeed;
		this._linger = linger; //Amount of time the banner will hang 

		//Add before creating label so the label will be on top
		this.game.add.existing(this);

		//Label sprite
		let style = { font: "30px Arial", fill: "#ffffff", align: "center" };
		this._label = this.game.add.text(this.x, this.y, "", style);
		this._label.anchor.setTo(.5, .5);

	}

	update(){
		this._label.x = this.x;
		this._label.y = this.y;
		this._label.alpha = this.alpha;
	}

	enter(yPos = (this.game.height * .5), text = "", tint = 0xffffff, onComplete = function(){}){

		this.alpha = 0;
		this._label.text = text;
		this._label.tint = tint;

		//ENTER
		this.game.add.tween(this).to({ alpha: 1 }, this._enterSpeed, Phaser.Easing.Quartic.Out, true);
		this.game.add.tween(this).to({ y: yPos }, this._enterSpeed, Phaser.Easing.Quartic.Out, true)
		.onComplete.addOnce(() => {

			//LINGER
			this.game.add.tween(this).to({ y: this.y }, this._linger, Phaser.Easing.Linear.In, true)
			.onComplete.addOnce(() => {

				//EXIT
				this.game.add.tween(this).to({ alpha: 0 }, this._exitSpeed, Phaser.Easing.Quartic.Out, true);
				this.game.add.tween(this).to({ y: 0 - this.height }, this._exitSpeed, Phaser.Easing.Quartic.In, true)
				.onComplete.addOnce(() => {

					//RESET
					this.y = this.game.height + this.height;
					onComplete();

				});

			});

		});

	}

}

export default Banner;