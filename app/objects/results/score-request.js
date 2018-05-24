class ScoreRequest {
	constructor(){
		this._route = 'https://playhadron.herokuapp.com';
	}

	sendScore(guid, alias, score){
		return new Promise((resolve, reject) => {
			var request = new Request(this._route + '/insert_score', 
									{
										method: 'POST', 
										headers: { 'Content-Type': 'application/json' },
										body: JSON.stringify({
											guid: guid,
											alias: alias,
											score: score
										})
									});

			fetch(request).then((response) => {
				resolve();
			}).catch((err) => {

				console.warn(err);

				reject();
			});		

		});
	}

	fetchRank(score){
		return new Promise((resolve, reject) => {
			var request = new Request(this._route + '/fetch_rank', 
									{
										method: 'POST', 
										headers: { 'Content-Type': 'application/json' },
										body: JSON.stringify({
											score: score
										})
									});

			fetch(request).then((response) => {

				response.json().then((result) => {
					
					resolve(parseInt(result.rank));

				});

			}).catch((err) => {

				console.warn(err);

				reject();

			});		

		});
	}

	fetchTop(){

		console.log("Fetching Top Scores...");

		return new Promise((resolve, reject) => {
			var request = new Request(this._route + '/fetch_top', 
									{
										method: 'POST', 
										headers: { 'Content-Type': 'application/json' },
									});

			fetch(request).then((response) => {

				response.json().then((result) => {
					
					resolve(result.top);

				});

			}).catch((err) => {

				console.warn(err);

				reject();

			});		

		});
	}

}

export default ScoreRequest;