//A WrapValue has the same functionality as a ClampValue but can wrap as well as constrain
class WrapValue {
	constructor(options){
		this._value = options.value || 0;
		this._min = options.min || 0;
		this._max = options.max || 10;
		this._step = options.step || 1;
		this._wrapOverflow = options.wrapOverflow || true;
		this._wrapUnderflow = options.wrapUnderflow || true;
		this._snapToBounds = options.snapToBounds || false;

		this._onWrap = options.onWrap || function(){};
	}

	set onWrap(func){ this._onWrap = func; }
	set step(step){ this._step = step; }
	set min(min){ this._min = min; }
	set max(max){ this._step = step; }
	
	get value() { return this._value; }
	set value(newValue){
		//If new value is in bounds, apply new value
		if (newValue <= this._max && newValue >= this._min){
			
			this._value = newValue;

		//If the new value is too large
		} else if (newValue > this._max){

			this._onOverflow(newValue - this._max);

		//If the new value is too small
		} else if (newValue < this._min){

			this._onUnderflow(this._min - newValue)

		}
	}

	increment(){ this.value = this._value + this._step }
	decrement(){ this.value = this._value - this._step }

	_onUnderflow(underflow){
		switch(true){

			//Don't wrap, just constrain value to min
			case (!this._wrapUnderflow):
				this.value = this._min;
				break;

			//Wrap value, but discard extra underflow
			case (this._snapToBounds):
				this.value = this._max;
				break;

			//wrap value, include underflow
			default:
				this.value = this._max - underflow;

		}

		this._onWrap(this._value);
	}

	_onOverflow(overflow){
		switch(true){

			//Don't wrap, just constrain value to max
			case (!this._wrapOverflow):
				this.value = this._max;
				break;

			//Wrap value, but discard extra overflow
			case (this._snapToBounds):
				this.value = this._min;
				break;

			//wrap value, include underflow
			default:
				this.value = this._min + overflow;

		}

		this._onWrap(this._value);
	}

}

export default WrapValue;