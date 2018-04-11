/*
	WRITTEN BY: Joshua Avrick
	USE: This class represents a value with a min and max.
	EVENTS:
		- clampMax : fired when the value hits its upper bound
		- clampMin : fired when the value hits its lower bound
*/

import BasicValue from './basic-value.js';

class BoundedValue extends BasicValue  {
	constructor(value, step, min = 0, max = 10){
		super(value, step);
		this._min = min;
		this._max = max;
	}

	set value(newValue){
		if (newValue >= this._max){
			this._value = this._max;
			this._events.dispatch('clampMax', this._value);
		} else if (newValue <= this._min){
			this._value = this._min;
			this._events.dispatch('clampMin', this._value);
		} else {
			this._value = newValue;
		}
	}

	get value(){
		return this._value;
	}
}

export default BoundedValue;