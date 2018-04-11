
//Perfect - all zeros
//Good - no incorrect orbs, missed some recharge orbs
//Acceptable - either one orb missed, or one wrong orb, but not both
//Poor - 
//Inferior

class WaveRater {
	constructor(onRating = function(){}){
		this._onRating = onRating;

		this._rechargesCollected = 0;
		this._rechargesMissed = 0;
		this._orbsMissed = 0;
		this._wrongOrbs = 0;
	}

	_reset(){
		this._rechargesCollected = 0;
		this._rechargesMissed = 0;
		this._orbsMissed = 0;
		this._wrongOrbs = 0;
	}

	rechargeCollected(){ this._rechargesCollected += 1; }
	rechargeMissed(){ this._rechargesMissed += 1; }
	wrongOrb(){ this._wrongOrbs += 1; }
	orbMissed(){ this._orbsMissed += 1; }

	rateWave(){
		//PERFECT - No orbs or recharges missed, no wrong orbs collected
		if (this._rechargesMissed == 0 && this._orbsMissed == 0 && this._wrongOrbs == 0){
			this._onRating('perfect');

		//GOOD - No orbs missed, but missed recharges
		} else if (this._orbsMissed == 0 && this._wrongOrbs < 2) {
			this._onRating('good');


		//ACCEPTABLE - Missed an orb, or collected the wrong type, but not both
		} else if (this._orbsMissed == 0 && this._wrongOrbs > 1 || this._wrongOrbs == 0 && this._orbsMissed > 0) {
			this._onRating('acceptable');

		//POOR - Missed an orb AND collected the wrong type
		} else if (this._orbsMissed > 0 && this._wrongOrbs > 0){
			this._onRating('poor');

		//POOR - Missed multiple orbs AND collected multiple incorrect
		} else if (this._orbsMissed > 1 && this._wrongOrbs > 1) {
			this._onRating('inferior');

		}

		this._reset();
	}

}

export default WaveRater;