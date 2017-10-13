import { Howl } from 'howler';

class AudioManager extends Phaser.Plugin {
	constructor(game){
		super(game);
		this.game = game;

		this._blurMute = false;
		this._globalMute = false;

		this._instances = {};
		this._groups = {};

	}

	addAudioGroup(groupKey, audioKeys){ this._groups[groupKey] = new AudioGroup(this.game, audioKeys); }
	previous(groupKey){ this._groups[groupKey].previous(); }
	next(groupKey){ this._groups[groupKey].next(); }
	random(groupKey){ this._groups[groupKey].random(); }

	music(key, volume = 1){
		if (this._instances[key] && this._instances[key].isPlaying) return;

		//Create the sound if it doesn't exist
		if (!this._instances[key])
			this._instances[key] = this.game.add.audio(key);
		
		//Set volume and start loop
		this._instances[key].volume = volume;
		this._instances[key].loopFull();
	}

	play(key, loop = false, volume = 1){
		//Create the sound if it doesn't exist
		if (!this._instances[key]){
			this._instances[key] = this.game.add.audio(key);
			this._instances[key].allowMultiple = true;
		}

		//Set volume
		this._instances[key].volume = volume;
		
		//Loop or play
		if (loop) this._instances[key].loopFull();
		else this._instances[key].play();
	}

	fadeOut(key, duration = 1000){
		this._instances[key].fadeOut(duration);
		this._instances[key].onFadeComplete.add(() => {
			this._instances[key].destroy();
			this._instances[key] = null;
		});
	}

	fadeIn(key, duration = 1000, loop = false){
		if (this._instances[key] && this._instances[key].isPlaying) return;

		this._instances[key].fadeIn(duration, loop);
	}

}


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

export default AudioManager;