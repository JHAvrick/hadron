class EaseValue {
	constructor(options){
		this._start = options.start || 0;
		this._end = options.end || 10;
		this._steps = !options.steps || options.steps <= 0 ? 100 : options.steps;
		this._easing = options.easing || EaseValue.Easing.linear;
		this._currentStep = 0;
		this._value = this._start;
	}

	get value(){ return this._value; }

	//Step will clamp to min or max values
	setCurrentStep(newStep){
		if (newStep >= 0 && newStep <= this._steps)
			this._currentStep = newStep;

		this._value = this._calculateValueAt(this._currentStep);

		return this._value;
	}

	increment(){
		//increment step value if it has not exceeded max, clamp if it has
		if (this._currentStep < this._steps) this._currentStep += 1;
		else this._currentStep = this._steps;

		this._value = this._calculateValueAt(this._currentStep);

		return this._value;
	}

	decrement(){
		//decrement step as long as it is not below zero
		if (this._currentStep > 0) this._currentStep -= 1;
		else this._currentStep = 0;

		this._value = this._calculateValueAt(this._currentStep);

		return this._value;
	}

	_calculateValueAt(step){
		let diff = this._end - this._start; //the actual value range we're working with
		let easeStep = this._easing((1 / this._steps) * step); //ease value represents a percentage of the diff

		return this._start + (easeStep * diff);
	}

}

EaseValue.Easing = {
  // no easing, no acceleration
  linear: function (t) { return t },
  // accelerating from zero velocity
  easeInQuad: function (t) { return t*t },
  // decelerating to zero velocity
  easeOutQuad: function (t) { return t*(2-t) },
  // acceleration until halfway, then deceleration
  easeInOutQuad: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
  // accelerating from zero velocity 
  easeInCubic: function (t) { return t*t*t },
  // decelerating to zero velocity 
  easeOutCubic: function (t) { return (--t)*t*t+1 },
  // acceleration until halfway, then deceleration 
  easeInOutCubic: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
  // accelerating from zero velocity 
  easeInQuart: function (t) { return t*t*t*t },
  // decelerating to zero velocity 
  easeOutQuart: function (t) { return 1-(--t)*t*t*t },
  // acceleration until halfway, then deceleration
  easeInOutQuart: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
  // accelerating from zero velocity
  easeInQuint: function (t) { return t*t*t*t*t },
  // decelerating to zero velocity
  easeOutQuint: function (t) { return 1+(--t)*t*t*t*t },
  // acceleration until halfway, then deceleration 
  easeInOutQuint: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t }
}

export default EaseValue;