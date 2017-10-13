class DivisibleValue {
	constructor(options){
		this._value = options.value || 0;
		this._step = options.step || 1;
		this._divisor = options.divisor || 1;

		this._onDivisible = options.onDivisible || function(){};
	}

	set value(newValue){
		this._value = newValue;

		if (this._value % this._divisor === 0)
			this._onDivisible(this._value);
		

	}

	get value(){
		return this._value;
	}

	set onDivisible(func){
		this._onDivisible = func;
	}

	increment(){
		this.value = this.value + this._step;
		return this.value;
	}

	decrement(){
		this.value = this.value- this._step;
		return this.value;
	}

}

export default DivisibleValue;