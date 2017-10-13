class Value {
	constructor(options = {}){
		this._step = options.step || 1;
		this._value = options.value 0;
	}

	set value(newValue){ this._value = newValue; }
	get value(){ return this._value; }
	
	set step(newStep){ this._step = newStep; }
	get step(){ return this._step; }

	increment(amount){
		this.value += (amount || this._step);
	}

	decrement(amount){
		this.value -= (amount || this._step);
	}

}

export default Value;