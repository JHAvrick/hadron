import Animations from 'config/animations.js';

class Player extends Phaser.Sprite {
	constructor(game, board){
		super(game, board.CX + board.getRadius(2), game.height / 2, 'sprites');
			this.game = game;
			this.anchor.setTo(.5, .5);
			this.alpha = 0;

			this.tracks = board.tracks;
			this.cx = board.CX;
			this.cy = board.CY;
			this.track = 2; //index of track

			this.game.plugins.forge.animation(Animations.PLAYER, this).play();

			//Control events
			this.game.input.onDown.add(this.tapMove, this);
			this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT).onDown.add(this.keyLeft, this);
			this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT).onDown.add(this.keyRight, this);

			//Signals/Evemts
			this.onMove = new Phaser.Signal();

			//This sprite acts as a collision proxy w/ a smaller bounding box than the actual player
			this.proxy = this.game.add.sprite(this.x, this.y, null);
			this.proxy.anchor.setTo(.5, .5);
			this.proxy.width = 10;
			this.proxy.height = 10;

			//Player cannot move when isPaused is true;
			this.isPaused = true;

			//Last particle
			this.lastParticle = {
				shape: null,
				color: null
			}

			this.game.add.existing(this);
	}

	update(){ 
		this.angle += 2; 
		this.proxy.x = this.x;
		this.proxy.y = this.y;
	}

	keyLeft(){
		if (this.track !== 0 && !this.isPaused){
			this.track -= 1;
			this.x = this.cx + this.tracks[this.track].radius;
			this.onMove.dispatch(this.track);
		}
	}

	keyRight(){
		if (this.track < this.tracks.length - 1 && !this.isPaused){
			this.track += 1;
			this.x = this.cx + this.tracks[this.track].radius;
			this.onMove.dispatch(this.track);
		}
	}

	tapMove(){
		if (!this.isPaused){
			let pointer = this.game.input.activePointer;

			if (pointer.targetObject !== null) return; //If the player is tapping the pause button (most likely), don't move

			if (pointer.x < this.game.width  / 2){
				
				if (this.track !== 0){
					this.track -= 1;
					this.x = this.cx + this.tracks[this.track].radius;
					this.onMove.dispatch(this.track);
				}

			} else {

				if (this.track < this.tracks.length - 1){
					this.track += 1;
					this.x = this.cx + this.tracks[this.track].radius;
					this.onMove.dispatch(this.track);
				}

			}

		}

	}


}

export default Player;