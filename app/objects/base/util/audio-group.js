class AudioGroup {
	constructor(game, keys){
		this.game = game;

		this._keys = keys;
		this._audio = [];
		this._index = 0;

		//Generate audio files
		keys.forEach((key) => {
			this._audio.push(game.add.audio(key));
		});

	}

	//NOT TESTED
	random(){
		Phaser.ArrayUtils.getRandomItem(this._audio).play();
	}

	//NOT TESTED
	previous(){
		this._audio[this._index].play();
		
		this._index -= 1;
		if (this._index === 0)
			this._index =  this._audio.length - 1;
	}

	next(){
		this._audio[this._index].play();
		
		this._index += 1;
		if (this._index === this._audio.length - 1)
			this._index = 0;
	}
}

export default AudioGroup;