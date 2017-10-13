class NormalValue {
	constructor(options){
		this._value = options.value || 0;
		this._step = options.step || 1;
	}

	set value(newValue){
		this._value = newValue;
	}

	get value(){
		return this._value;
	}

	increment(){
		this._value += this._step;
		return this._value;
	}

	decrement(){
		this._value -= this._step;
		return this._value;
	}

}

export default NormalValue;