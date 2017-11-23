import ScoreRequest from 'results/score-request.js';

//This is a seperate class rather than a function to prevent clutter in the main state
class TopTenCheck {
	constructor(){

		this._topTen = false;
		var scoreRequest = new ScoreRequest();
				scoreRequest.fetchTop().then((top) => {	
					this._topTen = top;
				}).catch(() => {
					console.warn("Failed to fetch top ten.");
				});

	}

	isTopTen(score){
		if (!this._topTen) return false; //Failed to fetch the scores, assume player did NOT score in the top ten
		if (this._topTen.length < 10) return true; //Top ten by default, cause there aren't ten scores yet

		for (var i = 0; i < this._topTen.length; i++){
			if (score > this._topTen[i].score)
				return true;
		}
		
		return false;
	}

}

export default TopTenCheck;