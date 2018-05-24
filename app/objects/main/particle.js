import Animations from 'config/animations.js';

class Particle extends Phaser.Sprite {
	constructor(game, cx, cy){
		super(game, -1000, -1000, 'sprites');
			this.game = game;
			this.anchor.setTo(.5, .5);

			//Handle entering and exiting the board
			this.hasEnteredBounds = false;
			this.checkWorldBounds = true;
			this.events.onEnterBounds.add(this._handleEnterBounds, this);
			this.events.onOutOfBounds.add(this._handleExitBounds, this);
			
			//Particle state
			this.type = 1;
			this.color = 0xffffff; //A tint value
			this.shape = ''; //hex, tri, orb, or cube
			this.cx = cx; //centerX of board
			this.cy = cy; //centerY of board
			this.maxSpeed = .03;
			this.speed = 0.0065; //how many radians to move per update
			this.radius = 0; //the distance from the center of the board
			this.radians = 0; //the current position on the track

			//Flags
			this.isPaused = false;
			this.collisionLocked = false;

			//Signals
			this.onDead = new Phaser.Signal();

			//Animations
			var forge = game.plugins.forge;
				forge.animation(Animations.ORB_GLOW, this);
				forge.animation(Animations.HEX_GLOW, this);
				forge.animation(Animations.CUBE_GLOW, this);
				forge.animation(Animations.TRI_GLOW, this);
				forge.animation(Animations.SPECIAL_GLOW, this);

			this.update = this.updatePosition;
			this.game.add.existing(this);
			this.exists = false;
	}

	_handleEnterBounds(){
		//The phaser signals for entering and exiting bounds seem to trigger simultaneously in some scenarios,
		//causing a premature onExitBounds event
		//Timeout is to delay settin tthe hasEnteredBounds flag until the particle is surely in bounds
		setTimeout(() => {
			this.hasEnteredBounds = true;
		}, 100);
	}

	_handleExitBounds(){
		if (this.hasEnteredBounds){
			this.hasEnteredBounds = false;
			this.exists = false;
		}
	}

	_calculateSpeed(percent){
			//			min	 +	max - min			*	 percent of total speed	
			return .005 + ((.03 - .005) * (percent * .01));
	}

	pause(){
		this.isPaused = true;
		this.update = function(){};
	}

	resume(){
		this.isPaused = false;
		this.update = this.updatePosition;
	}

	start(type, shape, color, speed, radius){
		//Update state
		this.type = type;
		this.shape = shape;
		this.color = this.tint = color; //set both the color and the tint
		this.speed = this.maxSpeed * (speed * .01);
		this.radius = radius; //the radius of a track
		this.radians = speed < 0 ? 2.6 : .5; //set the starting point for this orb

		//play appropriate animation
		this.animations.play(shape + 'Glow');

		//Allow update
		this.collisionLocked = false;
		this.exists = true;
	}

	//Instead of being recycled, particles that collide with the player are destroyed.
	//I beleive there is an issue with sprite bounds not updating when the 'exists' flag
	//is set to false, which causes fake collisions to be triggered. Since there is a simple 
	//and not-too-hackish work-around (just destroy the sprite and make a new one for the pool),
	//I'm just going to leave it as is.
	die(){
		this.onDead.dispatch(this);
		this.destroy();
	}

	updatePosition(){
		this.x = this.cx + (Math.sin(this.radians) * this.radius); //Update position
		this.y = this.cy + (Math.cos(this.radians) * this.radius);
		this.radians += this.speed; //Update speed
	}

}

export default Particle;