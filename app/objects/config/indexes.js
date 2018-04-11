import BasicValue from 'math/basic-value.js';
import BoundedValue from 'math/bounded-value.js';
import WrapValue from 'math/wrap-value.js';

/*
	The Indexes object contains the various counts used by the game
*/
const Indexes = {

		//Score indexes
		orbsTotal: new BasicValue(0, 1),
		rechargeTotal: new BasicValue(0, 1),
		wavesTotal: new BasicValue(1, 1),
		scoreTotal: new BasicValue(0, 1),

		//Progress indexes
		orbsCleared: new WrapValue(0, 1, 0, 6, true),
		health: new BoundedValue(16, 1, 1, 16),

		//Game state indexes
		pattern: new WrapValue(1, 1, 1, 5),
		bank: new BoundedValue(0, 1, 0, 9)

}

//Resets all indexes, returns self
Indexes.reset = function(){
	for (var prop in this){
		if (this[prop] instanceof BasicValue)
			this[prop].reset();
	}

	return this;
}

//Some internal binding, should not be redeclared or deleted
Indexes.pattern.on('wrapMax', Indexes.bank.increment.bind(Indexes.bank));
Indexes.wavesTotal.addChild(Indexes.pattern);
Indexes.orbsCleared.addChild(Indexes.orbsTotal);


export default Indexes;