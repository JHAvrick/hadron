import Palette from 'main/sequence/palette.js';
import Shapes from 'main/sequence/shapes.js';
import SequencePatterns from 'main/sequence/sequence-patterns.js';

/*
	The ParticleSequencer synthesizes the ramp-engine state and the contents
	of several config files (palette, shapes, patterns) into a sequence which 
	represents the current difficulty state of the game.

*/
class ParticleSequencer {
	constructor(game, trackBoard, rampEngine, particlePool){
		this.game = game;
		this.board = trackBoard;
		this.ramp = rampEngine;
		this.pool = particlePool;

		this._isPaused = false;
	}

	_buildSequence(){

		var palette = Phaser.ArrayUtils.getRandomItem(Palette);
		var patternMeta = this._getRandomPattern();
		var shapes = Shapes;

		return {
			palette: palette,
			shapes: shapes,
			rules: this._getSequenceRules(palette, shapes),
			pattern: patternMeta.pattern,
			variableSpeed: patternMeta.variableSpeed,
			shuffle: patternMeta.shuffle,
			patternIndex: 0,
			interval: this.ramp.value('orbSpawnInterval'),
			minSpeed: this.ramp.value('minOrbSpeed'),
			maxSpeed: this.ramp.value('maxOrbSpeed')
		}
	}

	_getSequenceRules(palette, shapes){
		var type = Phaser.Utils.randomChoice(0, 2);
		
		//BOTH
		if (type === 0){

			return {
				color: Phaser.ArrayUtils.getRandomItem(palette),
				shape: Phaser.ArrayUtils.getRandomItem(shapes)
			}

		//COLOR ONLY
		} else if (type === 1){

			return {
				color: Phaser.ArrayUtils.getRandomItem(palette),
				shape: false
			}

		//SHAPE ONLY
		} else {

			return {
				color: false,
				shape: Phaser.ArrayUtils.getRandomItem(shapes)
			}

		}

	}

	//returns a random pattern from the selected bank
	//Shuffles the pattern if the meta flag "shuffle" is set to true
	_getRandomPattern(bank){
		let bankIndex = this.ramp.value('patternBankIndex');
		let patternMeta = Phaser.ArrayUtils.getRandomItem(SequencePatterns[bankIndex]);

		return {
			variableSpeed: patternMeta.variableSpeed,
			pattern: patternMeta.shuffle ? Phaser.ArrayUtils.shuffle(patternMeta.pattern) : patternMeta.pattern,
			shuffle:  patternMeta.shuffle
		}

	}


	//The _getColor and _getShape methods resolve the shape or color for each particle
	//Particles of type 2 must be collected by the player and so the color/shape returned
	//is that of the rule-set. Particles of type 1 are random colors/shapes which are NOT
	//part of the rule-set for this sequence.
	_resolveColor(type){
		if (type === 3) return 0xffffff;

		//If the orb type is collectable and color is a part of the rule-set, return the rule-set color
		if (type === 2 && this.sequence.rules.color){

			return this.sequence.rules.color;

		//Otherwise get a random color that is NOT the rule-set color
		} else {

			var randomColor = Phaser.ArrayUtils.getRandomItem(this.sequence.palette);
			if (randomColor == this.sequence.rules.color) return this._resolveColor(type);
			else return randomColor;

		}
	}

	_resolveShape(type){
		if (type === 3) return 'special';

		//If the orb type is collectable and shape is a part of the rule-set, return the rule-set shape
		if (type === 2 && this.sequence.rules.shape){

			return this.sequence.rules.shape;

		//Otherwise get a random color that is NOT the rule-set shape, recursively if necessary
		} else {

			var randomShape = Phaser.ArrayUtils.getRandomItem(this.sequence.shapes);
			if (!this.sequence.rules.color && randomShape == this.sequence.rules.shape)
				return this._resolveShape(type);
			else
				return randomShape;
		}
	}

	//Ends the actively running sequence (if any)
	//Builds a new sequence
	resequence(){
		this.sequence = this._buildSequence();
		return this.sequence;
	}

	start(){
		this.timer = this.game.time.create(false);
		this.timer.loop(this.sequence.interval, this.next, this);
		this.timer.start();

		if (this._isPaused)
			this.timer.pause();
	}

	end(){
		if (this.timer) this.timer.stop();
	}

	pause(){
		if (this.timer) this.timer.pause();
		this._isPaused = true;
	}

	resume(){
		if (this.timer) this.timer.resume();
		this._isPaused = false;
	}

	//Check's the particles type and calls the appropriate callback route
	isValidParticle(particle, callbacks){
		switch (particle.type){
			case 1: callbacks.onInvalid(particle); break;
			case 2: callbacks.onValid(particle); break;
			case 3: callbacks.onRecharge(particle); break;
		}
	}

	next(){
		//loop through the current row
		var pattern = this.sequence.pattern;
		var row = pattern[this.sequence.patternIndex];
		for (var i = 0; i < 6; i++){
			var next = row[i]; 
			if (next !== 0){

			let shape = this._resolveShape(next);
			let color = this._resolveColor(next);

			//Set speed
			if (this.sequence.variableSpeed)
				var speed = (next / Math.abs(next)) * this.game.rnd.integerInRange(this.sequence.minSpeed, this.sequence.maxSpeed);
			else 
				var speed = this.sequence.minSpeed + ((this.sequence.maxSpeed - this.sequence.minSpeed)  / 2); //halfway between min and max

			//Get a particle object from the pool
			var particle = this.pool.getFirstExists(false);
					particle.start(next, shape, color, speed, this.board.getRadius(i));

			}
		}

		//Increment pattern index, reshuffle array if necessray
		if (this.sequence.patternIndex === pattern.length - 1){
			if (this.sequence.shuffle) Phaser.ArrayUtils.shuffle(this.sequence.pattern); //reshuffle on pattern end
			this.sequence.patternIndex = 0; //go back to beginning of the pattern
		} else {
			this.sequence.patternIndex += 1;
		}

	}


}

export default ParticleSequencer;