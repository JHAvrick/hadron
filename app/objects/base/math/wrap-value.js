/*
	WRITTEN BY: Joshua Avrick
	USE: This class represents a value with a min and max.
	EVENTS:
		- clampMax : fired when the value hits its upper bound
		- clampMin : fired when the value hits its lower bound
*/

import BasicValue from './basic-value.js';

class WrapValue extends BasicValue  {
	constructor(value, step, min = 0, max = 10, discardRemainder = false){
		super(value, step);
		this._min = min;
		this._max = max;
		this._discardRemainder = discardRemainder;
	}

	set value(newValue){
		if (newValue > this._max){

			if (this._discardRemainder)
				this._value = this._min; //Wrap around and, set value to min
			else
				this.value = this._min + (newValue - this._max); //Accumulate extra

			this._events.dispatch('wrapMax', this._value);

		} else if (newValue < this._min){

			if (this._discardRemainder)
				this._value = this._max;
			else
				this.value = this._max + (newValue - this._min);

			this._events.dispatch('wrapMin', this._value);

		} else {

			this._value = newValue;

		}
	}

	get value(){
		return this._value;
	}
}

export default WrapValue;