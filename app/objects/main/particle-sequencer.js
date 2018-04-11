import Ramp from 'config/ramp.js';
import Indexes from 'config/indexes.js';

import Palette from 'main/sequence/palette.js';
import Shapes from 'main/sequence/shapes.js';
import Sequences from 'main/sequence/sequences.js';

/*
	The ParticleSequencer synthesizes the ramp-engine state and the contents
	of several config files (palette, shapes, patterns) into a sequence which 
	represents the current difficulty state of the game.
*/
class ParticleSequencer {
	constructor(game, trackBoard, particlePool){
		this.game = game;
		this.ramp = Ramp;
		this.indexes = Indexes;
		this.board = trackBoard;
		this.pool = particlePool;

		//Holds the most recent five pattern IDs to prevent close duplicates
		this.sequenceIDs = [];

		//Debug indexes and flags
		this._debugBank = 0;
		this._debugSequence = 0;
		this._debugSequenceId = null;
		this._debugMode = false;

		//Pause state for timer
		this._isPaused = false;
	}

	/* 
		The method reconciles all necessary sequence data into a single object with
		correct formatting.
	*/
	_buildSequence(){

		let sequence = this._debugMode 
									? this._debugNextSequence() 
									: this._getRandomSequence();

		/* Uniform speed is used when variableSpeed is set to false */
		let uniformSpeed = this.ramp.valueAt('uniformSpeed', sequence.difficulty);

		/*
			If min and max speed are not explicitly defined in the pattern object,
			the default min/max ranges will be used
		*/
		let minSpeed = 	sequence.minSpeed 
										? this.ramp.valueAt('uniformSpeed', sequence.minSpeed)
										:	this.ramp.valueAt('minSpeed', sequence.difficulty);


		let maxSpeed = 	sequence.maxSpeed 
										? this.ramp.valueAt('uniformSpeed', sequence.maxSpeed)
										:	this.ramp.valueAt('maxSpeed', sequence.difficulty);


		/*
			Spawn interval can also be explicitly defined, but will use it's default
			value if not.
		*/
		let spawnInterval = sequence.interval 
												? this.ramp.valueAt('spawnInterval', sequence.interval)
												: this.ramp.valueAt('spawnInterval', sequence.difficulty);


		/*
			Shuffle the pattern
		*/										
		let pattern =	sequence.shuffle 
							 			? Phaser.ArrayUtils.shuffle(sequence.pattern) 
							 			: sequence.pattern;

		return {
			patternIndex: 0,
			id: sequence.id,
			palette: Palette,
			shapes: Shapes, 
			pattern: pattern,
			shuffle: sequence.shuffle,
			interval: spawnInterval,
			variableSpeed: sequence.variableSpeed,
			rules: this._getSequenceRules(Palette, Shapes, sequence.ruleType),
			minSpeed: sequence.variableSpeed ? minSpeed : uniformSpeed,
			maxSpeed: sequence.variableSpeed ? maxSpeed : uniformSpeed
		}

	}

	/* 
		Locates a sequence in a given bank with the given ID,
		returns false if no such sequence exists		
	*/
	_debugFindSequenceById(bankIndex, id){

		let bank = Sequences[bankIndex];
		for (let i = 0; i < bank.length; i++){
			if (bank[i].id === id)
				return bank[i];
		}

		return false;

	}

	/* Steps through patterns incrementally for debugging purposes */
	_debugNextSequence(){

		//If a specific ID is given, find the pattern and use it
		if (this._debugSequenceId !== null)
			return this._debugFindSequenceById(this._debugBank, this._debugSequenceId);

		//Otherwise, get the next pattern in the bank
		var sequence = Sequences[this._debugBank][this._debugSequence];

		//Increment bank, pattern, or both
		if (this._debugSequence === Sequences[this._debugBank].length - 1){
			this._debugBank = this._debugBank + 1;
			this._debugSequence = 0;
		} else {
			this._debugSequence++;
		}

		return sequence;
	}

	/*
		Returns a exclusive random pattern from the current bank
	*/
	_getRandomSequence(){
		//reset pattern ID array if it holds 5 IDs or more
		if (this.sequenceIDs.length >= 5) this.sequenceIDs = []; 

		//Get a random pattern from the bank
		let bankIndex = this.indexes.bank.value;
		let pattern = Phaser.ArrayUtils.getRandomItem(Sequences[bankIndex]);

		//Recursively find a pattern that hasn't already been used
		if (this.sequenceIDs.includes(pattern.id))
			return this._getRandomSequence();
		else 
			this.sequenceIDs.push(pattern.id);

		return pattern;

		/*
		return {
			id: patternMeta.id,
			difficulty: patternMeta.difficulty,
			variableSpeed: patternMeta.variableSpeed,
			pattern: patternMeta.shuffle 
							 ? Phaser.ArrayUtils.shuffle(patternMeta.pattern) 
							 : patternMeta.pattern,
			shuffle:  patternMeta.shuffle
		}
		*/


	}

	_getSequenceRules(palette, shapes, ruleType){

		//If the rule type is not NULL or 4, use the given ruletype
		//Both NULL and 4 will result in a random rule type
		var type = 	ruleType !== null && 
							 	ruleType !== 4
								? ruleType : Phaser.Utils.randomChoice(0, 2);
		

		//SHAPE ONLY, ANY COLOR
		if (type === 1){

			return {
				colorName: false,
				color: false,
				shape: Phaser.ArrayUtils.getRandomItem(shapes)
			}

		//COLOR ONLY, ANY SHAPE
		} else if (type === 2) {

			var color = Phaser.ArrayUtils.getRandomItem(palette);

			return {
				colorName: color.name,
				color: color.hex,
				shape: false
			}

		//BOTH SHAPE AND COLOR
		} else {

			var color = Phaser.ArrayUtils.getRandomItem(palette);

			return {
				colorName: color.name,
				color: color.hex,
				shape: Phaser.ArrayUtils.getRandomItem(shapes)
			}

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
			if (randomColor.hex == this.sequence.rules.color) return this._resolveColor(type);
			else return randomColor.hex;

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

	useDebugMode(id = '0-0', repeat = false){
		this._debugMode = true;

		//If repeat is not specified, the game will continue on from the id given
		this._debugBank = parseInt(id.split('-')[0]);
		this._debugSequence = parseInt(id.split('-')[1]);

		//If ID is specified that sequence will repeat infinitely 
		this._debugSequenceId = repeat ? id : null;
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

	dereference(){
		delete this.game;
		delete this.ramp;
		delete this.indexes;
		delete this.board;
		delete this.pool;
	}

	//Check's the particles type and calls the appropriate callback route
	isValidParticle(particle, callbacks){
		switch (Math.abs(particle.type)){
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

			let shape = this._resolveShape(Math.abs(next));
			let color = this._resolveColor(Math.abs(next));

			// 1 or -1, denoting the direction the particle should travel
			let speedFactor =  (next / Math.abs(next));
			let speed = speedFactor * this._floatInRange(this.sequence.minSpeed, this.sequence.maxSpeed, 4);

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

	_floatInRange(minValue = 0, maxValue = 1, precision = 4){
		return parseFloat(Math.min(minValue + (Math.random() * (maxValue - minValue)),maxValue).toFixed(precision));
	}

}

export default ParticleSequencer;