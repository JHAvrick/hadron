class StateNavButton extends Phaser.Sprite {
	constructor(game, toState, label, align = 'left', fadeTime = 500){
		super(game, 0, 0, game.make.bitmapText(0, 0, 'Modeka', label, 60).generateTexture());
		this.game = game;
		this.layout = game.plugins.layout;

		//The state that this button loads
		this._toState = toState;

		//Fade to black time
		this._fadeTime = fadeTime;

		//Called before switching states, can return false to abort
		this._onBeforeGoToState = function(){ return true };

		//Set the alignment
		if (align === 'left') this.alignLeft();
		else this.alignRight();

		this.inputEnabled = true;
		this.events.onInputDown.add(this.goToState, this);
		
		this.game.add.existing(this);
	}

	set onBeforeGoToState(func){
		this._onBeforeGoToState = func;
	}

	goToState(){
		if (!this._onBeforeGoToState()) return;

		this.game.camera.fade(0x000000, this._fadeTime);
		this.game.camera.onFadeComplete.addOnce(() => {
				this.game.state.start(this._toState);
		});
	}

	alignLeft(){
		this.anchor.setTo(0, .5);
		this.x = this.layout.ratioX(7);
		this.y = this.layout.ratioY(92);
	}

	alignRight(){
		this.anchor.setTo(1, .5);
		this.x = this.layout.ratioX(93);
		this.y = this.layout.ratioY(92);
	}


}

export default StateNavButton;