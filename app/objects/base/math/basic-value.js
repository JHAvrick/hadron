/*
	WRITTEN BY: Joshua Avrick
	USE: This is the parent class to a suite of "Value" classes with their own distinct characteristics.
*/

class EventDispatcher {
	constructor(){
		this._events = {};
	}

	addEvent(key, callback){
		if (!this._events[key])
			this._events[key] = [];

		this._events[key].push(callback);
	}

	removeEvent(key, callback){
		if (this._events[key])
			this._events[key].splice(this._events[key].indexOf(callback), 1);
	}

	removeAll(){
		this._events = {};
	}

	dispatch(key, ...params){
		if (!this._events[key]) return;
		this._events[key].forEach((callback) => {
				callback(...params);
		});
	}

}

class BasicValue {
	constructor(value = 0, step = 1){

		this._initValue = value;
		this._value = value;
		this._step = step;

		this._childValues = [];
		this._events = new EventDispatcher();
	}

	set value(newValue){ this._value = newValue; }
	get value(){ return this._value; }
	
	set step(newStep){ this._step = newStep; }
	get step(){ return this._step; }

	increment(){ 
		this.value += this._step;
		this._incrementChildValues();
	}

	decrement(){ 
		this.value -= this._step;
		this._decrementChildValues();
	}
	
	add(amount){ this.value += amount; }
	subtract(amount){ this.value -= amount; }

	reset(){ 
		this.value = this._initValue;
	}

	_incrementChildValues(){
		this._childValues.forEach((value) => {
			value.increment();
		});
	}

	_decrementChildValues(){
		this._childValues.forEach((value) => {
			value.decrement();
		});		
	}

	addChild(valueObj){
		if (valueObj instanceof BasicValue)
			this._childValues.push(valueObj);
	}

	on(eventKey, callback){
		this._events.addEvent(eventKey, callback);
	}

	removeEvents(){
		this._events.removeAll();
	}

}

export default BasicValue;