/*
	Written By: Joshua Avrick
	Use: This class allows you to set up a single difficulty scale for any number
				of variables with their own disparate min and max ranges. Each value can
				also have it's own easing function or use the global easing function.

*/
import Easing from './easing.js';

class DifficultyRamp {
	constructor(scaleMin = 0, scaleMax = 100, easing = 'linear', precision = 2){
		this._scaleMin = scaleMin;
		this._scaleMax = scaleMax;
		this._precision = precision;
		this._easing = easing;
		this._allowOutOfBounds = true;
		this._values = {};
	}

	allValuesAt(position){
		var allValues = {};
		for (var key in this._values){
			allValues[key] = this.valueAt(key, position);
		}

		return allValues;
	}

	valueAt(key, position){
		
		//Forces values to be returned within bounds if allowOutOfBounds is false
		if (!this._allowOutOfBounds && position > this._scaleMax) 
			return this.valueAt(key, this._scaleMax);
		if (!this._allowOutOfBounds && position < this._scaleMin)
			return this.valueAt(key, this._scaleMin);

		//Get the value's min and max range and ease type
		let min = this._values[key].min;
		let max = this._values[key].max;

		//Get the easing function, or if it doesn't exist use 'linear'
		let easingFunc = Easing[this._values[key].easing] || Easing.linear;

		//Convert to float between 0 and 1 and then feed into easing function
		//If the easing is linear it will just return the same float
		let easedRatio = easingFunc(position / (this._scaleMax - this._scaleMin));

		return min + ((max - min) * easedRatio);
	}

	addValue(key, min = 0, max = 100, easing){
		this._values[key] = {
			min: min,
			max: max,
			easing: easing || this._easing
		}
	}

	//Accessor methods
	set allowOutOfBounds(value){ this._allowOutOfBounds = value; }
	get allowOutOfBounds(){ return this._allowOutOfBounds; }

}

export default DifficultyRamp;