import ClampValue from 'util/clamp-value.js';
import WrapValue from 'util/wrap-value.js';
import EaseValue from 'util/ease-value.js';
import NormalValue from 'util/normal-value.js';
import DivisibleValue from 'util/divisible-value.js';


class RampEngine {
	constructor(model){
		this._values = {};
		this._events = {};

		this._parseValues(model.values);
		this._parseEvents(model.events);
	}

	//A model\
	_parseValues(values){
		for (var key in values){
			this._values[key] = new values[key].type(values[key]);
		}
	}

	_parseEvents(events){
		for (var key in events){

			var event = events[key]; //The event meta

			//Create a new ramp event and add it to the events dictionary
			this._events[key] = new RampEvent({


				trigger: this._values[event.trigger], //reslove trigger string to a value object
				triggerEvent: event.event, //pass event name along

				//resolve child objects where necessary, return empty array otherwise
				toIncrement: 	event.increment ? event.increment.map((childKey) => { return this._values[childKey] }) : [],
				toDecrement: 	event.decrement ? event.decrement.map((childKey) => { return this._values[childKey] }) : []

			});

		}
	}

	on(eventKey, callback){
		this._events[eventKey].addSubscriber(callback);
	}

	value(key){
		return this._values[key].value;
	}

	inRange(keyOne, keyTwo){
		return Math.random() * (this.value(keyTwo) - this.value(keyOne)) + this.value(keyOne);
	}

	increment(key, amount){
		this._values[key].increment(amount);
	}

	decrement(key, amount){
		this._values[key].decrement(amount);
	}

	logValues(){
		console.log("----------RAMP ENGINE VALUES---------- ");
		for (var key in this._values){
			console.log(key + ": " + this._values[key].value);
		}
		console.log("-------------------------------------- ");
	}

}

class RampEvent {
	constructor(options){

		//Subscribe to the parent trigger's callback event
		this.trigger = options.trigger;
		this.triggerEvent = options.triggerEvent;
		this.trigger[this.triggerEvent] = this.triggerRampEvent.bind(this);

		this._eventActions = {
			toIncrement:{
				callback: 'increment',
				children: options.toIncrement
			},
			toDecrement:{
				callback: 'decrement',
				children: options.toDecrement
			} 
		}

		this._subscriberCallbacks = [];

	}

	//These callbacks are also called when the parent event is triggered
	addSubscriber(callback){
		this._subscriberCallbacks.push(callback);
	}

	triggerRampEvent(value){
		//Go through the list of possible actions and call
		for (var key in this._eventActions){

			var action = this._eventActions[key];

			action.children.forEach((valueObj) => {
				//trigger the respective action for each eventAction type (see constructor)
				valueObj[action.callback]();

			});

		}

		//call other subscribers
		this._subscriberCallbacks.forEach((callback) => {
			callback();
		});

	}

}

RampEngine.WrapValue = WrapValue;
RampEngine.ClampValue = ClampValue;
RampEngine.EaseValue = EaseValue;
RampEngine.NormalValue = NormalValue;
RampEngine.DivisibleValue = DivisibleValue;

export default RampEngine;
