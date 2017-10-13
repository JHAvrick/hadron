class Ripples {
	constructor(options){
		this.game = options.game;
		this.atlas = options.atlas;
		this.images = options.images;
		this.variation = options.variation || 0; //affects duration and interval time 
		this.interval = options.interval || 1000; //time between ripples
		this.duration = options.duration || 1000; //ripple explode/fade time
		this.count = options.count || 1; //how many ripples to make on each iteration
		this.endScale = options.endScale || 3; //scale of item
		this.startAlpha = options.startAlpha || 1; //scale of item
		this.easing = options.easing || Phaser.Easing.Quadratic.Out; //phaser easing type
		this.filters = options.filters || null;
		
		this.items = [];
		this._isStopped = false;
		this._isBlurred = false;

		//Stop timer when tab is not active, restart when tab is active
		window.addEventListener('blur', () => { 
			clearTimeout(this.timer);
			this._isBlurred = true; 
		});
		window.addEventListener('focus', () => {
			if (this._isBlurred){
				this._isBlurred = false; 
				this.triggerRipple();
			}
		});

	}

	_variate(duration, variation){
		return duration - (duration * (this.game.rnd.integerInRange(-variation, variation) * .01));
	}

	makeItems(count){
		for (var i = 0; i < count; i++){

			let image = this.images[this.game.rnd.integerInRange(0, this.images.length - 1)];
			let item = 	this.atlas 
						? this.game.add.sprite(0, 0, this.atlas, image)
						: this.game.add.sprite(0, 0, image);

			item.alpha = 0;
			item.anchor.setTo(.5, .5);
			item.filters = this.filters;

			this.items.push(item);

		}

		return this;
	}

	ripple(){
		let x = this.game.rnd.integerInRange(0, this.game.width);
		let y = this.game.rnd.integerInRange(0, this.game.height);
		let duration = this._variate(this.duration, this.variation);
		
		//Get an item
		if (this.items.length > 0){
			var item = 	this.items[0]; //get the first item
			this.items.push(this.items.shift()); //move this item to the back of the array
		} else {
			return;
		}

		//Set initial item state
		item.alpha = this.startAlpha;
		item.x = x;
		item.y = y;
		item.scale.x = 0;
		item.scale.y = 0;
	
		this.game.add.tween(item.scale).to({ x: this.endScale, y: this.endScale }, duration, this.easing, true);
		this.game.add.tween(item).to({ alpha: 0 }, duration, this.easing, true)

	}

	triggerRipple(){
		for (var i = 0; i < this.count; i++){
			this.ripple();
		}

		//Queue the next interval if not halted
		if (!this._isStopped && !this._isBlurred)
			this.timer = setTimeout(this.triggerRipple.bind(this), this._variate(this.interval, this.variation));
	}

	start(){ this.triggerRipple(); }
	stop(){ this._isStopped = true; }

}

export default Ripples;