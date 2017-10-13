class FadeTransition {
	constructor(options){
		this.game = options.game;
		this.items = options.items; //an array of display objects to fade

		//Timing
		this.duration = options.duration || 1000; //how long the fade should last, both in and out
		this.variation = options.variation || 0; //duration variation, expressed as percentage (0-100) of duration

		//Slide
		this.enterSlideX = options.enterSlideX || 0;
		this.enterSlideY = options.enterSlideY || 0;
		this.exitSlideX = options.exitSlideX || 0;
		this.exitSlideY = options.exitSlideY ||0;

		//Scale
		this.scaleIn = options.scaleIn; //how much to scale item during fade in
		this.scaleOut = options.scaleOut; //how much to scale item during fade out

		//Stagger
		this.enterStagger = options.enterStagger || 0;
		this.exitStagger = options.exitStagger || 0;

		//sequence ignores stagger, each element is faded in sequence with no overlap
		this.sequence = options.sequence || false; 

		//Easing
		this.easing = options.easing || Phaser.Easing.Quadratic.Out; //phaser easing type

		this._onEnterComplete = options.onEnterComplete || function(){};
		this._onExitComplete = options.onExitComplete || function(){};

		//state
		this._isEntered = false;
	}

	set onEnterComplete(func){ this._onEnterComplete = func; }
	set onExitComplete(func){ this._onExitComplete = func; }

	get isEntered(){
		return this._isEntered;
	}

	//Accepts a time duration and a percentage (0-100)
	//Adds or subtracts a random percentage (within in the range given) from the given duration
	_variate(duration, variation){
		return duration - (duration * (this.game.rnd.integerInRange(-variation, variation) * .01));
	}

	enter(onComplete){
		var onComplete =  onComplete || this._onEnterComplete;

		var promises = [];
		var staggerIndex = 0;
		this.items.forEach((item) => {

			promises.push(new Promise((resolve, reject) => {

				//The original state of the item, to which it will return
				let returnX = item.x; 
				let returnY = item.y;
				let returnScaleX = item.scale.x;
				let returnScaleY = item.scale.y;

				//Offset the item's position by slide amount
				item.x += this.enterSlideX;
				item.y += this.enterSlideY;
				item.scale.x = this.scaleIn || item.scale.x; //use the item's scale if none was set (i.e. no scale change)
				item.scale.y = this.scaleIn || item.scale.y;

				//Timing
				var duration = this._variate(this.duration, this.variation); //get duration w/ variation
				if (this.sequence) var delay = staggerIndex * duration; //get delay if fade should be sequenced
				else duration += (staggerIndex * this.enterStagger);	//add stagger to duration if not sequenced
				
				this.game.add.tween(item.scale).to({ x: returnScaleX, y: returnScaleY }, duration, this.easing, true, delay); //position tween for "scaleIn"
				this.game.add.tween(item).to({ x: returnX, y: returnY }, duration, this.easing, true, delay); //position tween for "slide"
				this.game.add.tween(item).to({ alpha: 1 }, duration, this.easing, true, delay) //alpha tween
				.onComplete.addOnce(() => {  resolve(); });

			}));
 		
			staggerIndex += 1;

		});

		Promise.all(promises).then(() => {
			this._isEntered = true;
			onComplete();
		});

		return this;
	}

	exit(onComplete){
		var onComplete =  onComplete || this._onExitComplete;

		var promises = [];
		var staggerIndex = 0;
		this.items.forEach((item) => {

			promises.push(new Promise((resolve, reject) => {

				//exit state of object
				let slideToX = item.x + this.exitSlideX;
				let slideToY = item.y + this.exitSlideY;
				let scaleToX = this.scaleOut || item.scale.x;
				let scaleToY = this.scaleOut || item.scale.y;

				//Timing
				var duration = this._variate(this.duration, this.variation); //get duration w/ variation
				if (this.sequence) var delay = staggerIndex * duration; //get delay if fade should be sequenced
				else duration += (staggerIndex * this.exitStagger);	//add stagger to duration if not sequenced

				this.game.add.tween(item.scale).to({ x: scaleToX, y: scaleToY }, duration, this.easing, true, delay);
				this.game.add.tween(item).to({ x: slideToX, y: slideToY }, duration, this.easing, true, delay); //position tween for "slide"
				this.game.add.tween(item).to({ alpha: 0 }, duration, Phaser.Easing.Quadratic.Out, true, delay)
				.onComplete.addOnce(() => {  resolve(); });

			}));
 	
 			staggerIndex += 1;

		});

		Promise.all(promises).then(() => {
			this._isEntered = false;
			onComplete();
		});

		return this;
	}

	static chainEnter(transitions, onComplete = function(){}){
		for (var i = 0; i < transitions.length; i++){
			if (i !== transitions.length - 1)
				transitions[i].onEnterComplete = transitions[i + 1].enter.bind(transitions[i + 1]);
			else 
				transitions[i].onEnterComplete = onComplete;
		}

		transitions[0].enter();
	}

	static chainExit(transitions, onComplete = function(){}){
		for (var i = 0; i < transitions.length; i++){
			if (i !== transitions.length - 1)
				transitions[i].onExitComplete = transitions[i + 1].exit.bind(transitions[i + 1]);
			else 
				transitions[i].onExitComplete = onComplete;
		}

		transitions[0].exit();
	}

	static enterAll(transitions){
		for (var i = 0; i < transitions.length; i++){
				transitions[i].enter();
		}
	}

	static exitAll(transitions){
		for (var i = 0; i < transitions.length; i++){
				transitions[i].exit();
		}
	}

}

export default FadeTransition;