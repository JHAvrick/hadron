class AudioToggle extends Phaser.Sprite {
	constructor(game, atlas, frameOn, frameOff){
		super(game, 25, 25, atlas);
		this.game = game;
		this.settings = this.game.plugins.settings;
		this.audio = this.game.plugins.audio;
		
		this._muted = this.settings.get('muted');
		this.frameOn = frameOn;
		this.frameOff = frameOff;

		this.frameName = this._muted ? this.frameOff : this.frameOn;

		this.inputEnabled = true;
		this.events.onInputDown.add(this.toggleState, this);
		
		this.onMute = new Phaser.Signal();
		this.onUnmute = new Phaser.Signal();

		this.scale.x = this.scale.y = .75;
		this.game.add.existing(this);
	}

	get isMuted(){ return this._muted; }

	mute(suppressEvent){
		this.audio.mute = true;
		this.settings.set('muted', true);

		this._muted = true;
		this.frameName = this.frameOff;

		if (!suppressEvent)
			this.onMute.dispatch();
	}

	unmute(suppressEvent){
		this.audio.mute = false;
		this.settings.set('muted', false);

		this._muted = false;
		this.frameName = this.frameOn;

		if (!suppressEvent)
			this.onUnmute.dispatch();
	}

	toggleState(){
		if (this._muted)
			this.unmute();
		else
			this.mute();
	}

}

export default AudioToggle;