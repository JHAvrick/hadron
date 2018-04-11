import AudioGroup from './audio-group.js';

class AudioManager extends Phaser.Plugin {
	constructor(game){
		super(game);
		this.game = game;

		this._instances = {};
		this._groups = {};
	}

	/*
	 * Load music. No difference to loadFX(). The function is seperate for the sake
	 * of consistency w/ AndroidAudioManager which requires the distiction for 
	 * loading purposes.
	 */ 
	loadMusic(manifest){
		for (let key in manifest){
			this.game.load.audio(key, manifest[key]);
		}
	}

	/*
	 * Load fx. No difference to loadMusic().
	 */ 
	loadFX(manifest){
		for (let key in manifest){
			this.game.load.audio(key, manifest[key]);
		}
	}

	/*
	 * Inform the callback when a particular audio file is decoded.
	 */ 
	onDecoded(key, callback){
		this.game.sound.setDecodedCallback(key, callback);
	}

	/*
	 * Add as new audio group consisting of the given keys. Audio groups allow
	 * for audio to be played in sequence of randomly from the pool.
	 */ 
	addAudioGroup(groupKey, audioKeys){
		this._groups[groupKey] = new AudioGroup(this.game, audioKeys); 
	}

	/*
	 * Play the previous audio file in an already-existing audio-group. Wrapper 
	 * for AudioGroup's method of the same name.
	 */ 
	previous(groupKey){
		this._groups[groupKey].previous(); 
	}

	/*
	 * Play the next audio file in an already-existing audio-group. Wrapper for 
	 * AudioGroup's method of the same name.
	 */ 
	next(groupKey){
		this._groups[groupKey].next(); 
	}

	/*
	 * Play a random audio file in an already-existing audio-group. Wrapper for 
	 * AudioGroup's method of the same name.
	 */ 
	random(groupKey){
		this._groups[groupKey].random(); 
	}

	/*
	 * Play a music audio file. Music audio is looped by default.
	 */ 
	music(key, volume = 1){
		if (this._instances[key] && this._instances[key].isPlaying) return;

		//Create the sound if it doesn't exist
		if (!this._instances[key])
			this._instances[key] = this.game.add.audio(key);
		
		//Set volume and start loop
		this._instances[key].volume = volume;
		this._instances[key].loopFull();
	}

	/*
	 * Play an audio file. Looping opional.
	 */ 
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

	/*
	 * Fade out audio over duration,
	 */ 
	fadeOut(key, duration = 1000){
		this._instances[key].fadeOut(duration);
		this._instances[key].onFadeComplete.add(() => {
			this._instances[key].destroy();
			this._instances[key] = null;
		});
	}

	/*
	 * Fade in audio over duration,
	 */ 
	fadeIn(key, duration = 1000, loop = false){
		if (this._instances[key] && this._instances[key].isPlaying) return;

		this._instances[key].fadeIn(duration, loop);
	}

	/*
	 * Wrapper/Accessor for setting Phaser mute
	 */ 
	set mute(value){ 
		this.game.sound.mute = value;
	}

	/*
	 * Wrapper/Accessor for Phaser global mute.
	 */ 
	get mute(){
		return this.game.sound.mute
	}

}

export default AudioManager;