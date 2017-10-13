class ClampValue {
	constructor(options){
		this._min = options.min || 0;
		this._max = options.max || 10;
		this._value = options.value && options.value > this._min ? options.value : this._min;
		this._step = options.step || 1;
		this._onClamp = options.onClamp || function(){};
		this._onMinClamp = options.onMinClamp || function(){};
		this._onMaxClamp = options.onMaxClamp || function(){};
	}

	set min(min){ this._min = min; }
	set max(max){ this._max = max; }
	set step(step){ this._step = step; }
	set onClamp(func){ this._onClamp = func; }
	set onMinClamp(func){ this._onMinClamp = func; }
	set onMaxClamp(func){ this._onMaxClamp = func; }

	get value() { return this._value; }
	set value(newValue){
		switch (true){

			//New value was larger than max
			case (newValue > this._max):
				this._value = this._max;
				this._onClamp(this._value);
				this._onMaxClamp(this._value);
				break;

			//New value was smaller than min
			case (newValue < this._min):
				this._value = this._min;
				this._onClamp(this._value);
				this._onMinClamp(this._value);
				break;

			default:
				this._value = newValue;

		}
	}

	increment(amount){ 
		this.value = this._value + (amount || this._step);
	}

	decrement(amount){ 
		this.value = this._value - (amount || this._step);
	}

}

export default ClampValue;