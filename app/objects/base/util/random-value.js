class RandomValue {
	constructor(options){
		this._min = options.min || 0;
		this._max = options.max || 10;
		this._value =  this._getRandomInRange();
	}

	get value(){
		return this._value;
	}

	_getRandomInRange() {
	  return Math.random() * (this._max - this._min) + this._min;
	}

	increment(){
		this._value = this._getRandomInRange();
		return this._value;
	}

	decrement(){
		this._value = this._getRandomInRange();
		return this._value;
	}

}

export default RandomValue;