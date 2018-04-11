//Fades one sprite into the next as a background effect


//Unimplemented features:
// - Shuffle frames
// - Add animation to sprites
class BackgroundFader {
	constructor(game, atlas = null, frames = [], scaleToGameSize = true){
		this.game = game;

		//Holds the actual sprites to be cycled
		this._bgSprites = this._makeBgSprites(atlas, frames, scaleToGameSize);

		//The current fade tween running
		this._activeTween = null;

		//Running flag
		this._isRunning = false;


	}

	//Creates sprites from the given frames
	_makeBgSprites(atlas, frames, scaleToGameSize){
		var sprites = [];
		frames.forEach((frameName) => {

			//If no atlas is provided, assume the frameName is a texture key
			var bgSprite = this.game.add.sprite(0, 0, atlas || frameName, atlas == null ? null : frameName);

			if (scaleToGameSize){
				bgSprite.height = this.game.height + 25;
				bgSprite.width = this.game.width + 25;
			}

			bgSprite.sendToBack();
			sprites.push(bgSprite);

		});
		return sprites;
	}

	_nextBgStart(duration){
		var nextBg = this._bgSprites[0];

		this._activeTween = this.game.add.tween(nextBg).to({ alpha: 0 }, duration, Phaser.Easing.Linear.In, true);
		this._activeTween.onComplete.addOnce(() => {

			//Move the bg to the back of the array AND to the back of the display list
			var justFinished = this._bgSprites.shift();
			this._bgSprites.push(justFinished); 
			justFinished.sendToBack();
			justFinished.alpha = 1;

			//Start the next bg fade
			this._nextBgStart(duration);

		});
	}


	start(duration = 2000){
		this._isRunning = true;
		this._nextBgStart(duration);
	}

	stop(){
		this._isRunning = false;

		if (this._activeTween)
			this._activeTween.stop();
	}

	destroy(){
		this.stop();
		this._bgSprites.forEach((sprite) => {
			sprite.destroy();
		});
	}

	getSprites(){
		return this._bgSprites;
	}

}

export default BackgroundFader;

