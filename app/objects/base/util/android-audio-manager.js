import AudioGroup from './audio-group.js';

class AndroidAudioManager extends Phaser.Plugin {
	constructor(game){
		super(game);
		this.game = game;

		this._isMuted = false;
		this._instances = {};
		this._groups = {};
	}

	/*
	 * Load music/complex audio. Any audio that needs looping or fading should
	 * be loaded with this method.
	 */ 
	loadMusic(manifest){
		for (let key in manifest){

			this._instances[key] = {
				volume: 1,
				isComplex: true,
				isPlaying: false,
				isReady: false,
				decodedCallback: function(){}
			}

			window.plugins.NativeAudio.preloadComplex(key, manifest[key][0], 1, 1, 0, (msg) => {
				this._instances[key].isReady = true;
				this._instances[key].decodedCallback();
			}, (err) => {
				console.warn(err);
			});
		}
	}

	/*
	 * Load fx. Short and quick sound FX should be loaded with this method. No
	 * support for looping or fades.
	 */ 
	loadFX(manifest){
		for (let key in manifest){
			this.game.load.audio(key, manifest[key]);
		}
	}

	/*
	 * Inform the callback when a particular audio file is ready to be played.
	 */ 
	onDecoded(key, callback){
		//Check if instance exists
		if (this._instances[key]){
			/*
			 * If it exists and is already ready, trigger the callback.
			 * Otherwise, set the decodedCallback to be triggered when it is
			 * ready.
			 */
			if (this._instances[key].isReady) callback();
			else this._instances[key].decodedCallback = callback;
		}
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
	music(key, volume){
		if (!this._instances[key].isReady || this._instances[key].isPlaying) return;

		//Set volume (even if audio is muted, as it will be used for reset on unmute)
		this._instances[key].volume = volume || this._instances[key].volume;

		/*
		 * If audio is muted, loop the music but set the volume to zero. If not,
		 * set the volume based either on volume param or whatever the instances
		 * volume already was.
		 */ 
		if (this._isMuted){
			this._instances[key].isMuted = true;
			window.plugins.NativeAudio.setVolumeForComplexAsset(key, 0);
		} else {
			window.plugins.NativeAudio.setVolumeForComplexAsset(key, this._instances[key].volume);
		}

		this._instances[key].isPlaying = true;
		window.plugins.NativeAudio.loop(key);
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
		if (this._instances[key].isMuted || !this._instances[key].isPlaying) {
			window.plugins.NativeAudio.stop(key);
			this._instances[key].isMuted = false;
			this._instances[key].isPlaying = false;
			return;			
		}

		let vol = { vol: this._instances[key].volume }
		let fade = this.game.add.tween(vol).to({ vol: 0 }, duration, Phaser.Easing.Linear.In, true);

			//Change the volume in sync w/ the tween updates
			fade.onUpdateCallback(() => {
				window.plugins.NativeAudio.setVolumeForComplexAsset(key, vol.vol);
			}, this);

			//Stop the audio onces the fade is complete and update state
			fade.onComplete.addOnce(() => {
				window.plugins.NativeAudio.stop(key);
				this._instances[key].isMuted = false;
				this._instances[key].isPlaying = false;
			});

	}

	/*
	 * Fade in audio over duration.
	 * NOTE: Right now this is never used for HADRON, so it is just playing the
	 * music without the fade.
	 */ 
	fadeIn(key, duration = 1000, loop = false){
		this.music(key);
	}

	/*
	 * Sets volume for any active audio tracks to zero and flags them as muted.
	 */ 
	_globalMute(){
		for (let key in this._instances){
			let audio = this._instances[key];

			if (audio.isComplex && audio.isPlaying){
				audio.isMuted = true;
				window.plugins.NativeAudio.setVolumeForComplexAsset(key, 0);
			}
				
		}

		//Mute FX (Phaser Audio)
		this.game.sound.mute = true;
	}

	/*
	 * Resets the volume for any tracks that were muted.
	 */ 
	_globalUnmute(){
		//Unmute music (NativeAudio)
		for (let key in this._instances){
			let audio = this._instances[key];

			if (audio.isComplex && audio.isMuted){
				audio.isMuted = false;
				window.plugins.NativeAudio.setVolumeForComplexAsset(key, audio.volume);
			}
				
		}

		//Unmute FX (Phaser Audio)
		this.game.sound.mute = false;
	}

	/*
	 * Wrapper/Accessor for setting Phaser mute
	 */ 
	set mute(value){
		if (this._isMuted === value) return;
		else if (!this._isMuted && value) this._globalMute();
		else if (this._isMuted && !value) this._globalUnmute();

		this._isMuted = value;
	}

	/*
	 * Wrapper/Accessor for Phaser global mute.
	 */ 
	get mute(){
		return this._isMuted;
	}

}

export default AndroidAudioManager;