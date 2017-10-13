//The StatsManager maintains 
class StatsManager extends Phaser.Plugin {
	constructor(game, storeKey){
		super();
		this.game = game;

		this._storeKey = storeKey;
		this._stats = {};

		this._fetchStore();
	}

	_fetchStore(){
		if (localStorage.getItem(this._storeKey)){
			var store = JSON.parse(localStorage.getItem(this._storeKey));

			store.forEach((stat) => {
				this._stats[stat.name] = new Stat(stat);
			});

		}
	}

	//The stats are stored as a stringified array rather than an object
	_commitStore(){
		var store = [];
		for (var key in this._stats){
			store.push(this._stats[key].getSimple());
		}

		localStorage.setItem(this._storeKey, JSON.stringify(store));
	}

	//Create a stat from an object with stat meta (see Stat object)
	addStat(stat){

		if (stat.name){

			if (!this._stats[stat.name])
				this._stats[stat.name] = new Stat(stat);

			this._commitStore();

			return;
		}
		
		console.warn("A stat must have a name property!");
		return;
	}

	//Stats object with stat names only, creates empty stats if they don't already exist
	addStats(stats){
		for (var name in stats){
			if (!this._stats[name]){
				this._stats[name] = new Stat({ name: name });
			}
		}

		this._commitStore();
	}

	setStat(name, value){
		this._stats[name].session = value;
		this._commitStore();
	}

	setStats(stats){
		for (var name in stats){
			this._stats[name].session = stats[name];
		}

		this._commitStore();
	}

	isSessionBest(name){ return this._stats[name].isSessionBest(); }
	getSession(name){ return this._stats[name].session; }
	getBest(name){ return this._stats[name].best; }
	getHistory(name){ return this._stats[name].history; }
	
	clearStore(){
		localStorage.removeItem(this._storeKey);
	}

}

class Stat {
	constructor(meta){
		this._name = meta.name;
		this._best = meta.best || 0;
		this._session = meta.session || 0;
		this._history = meta.history || [];
		this._comparator = meta.comparator || "GreaterThan";
	}

	set session(value){
		//Add latest to history stack
		var lastSessionStat = this._session;
		this._history.push({
			stat: lastSessionStat,
			date: new Date().toString()
		});

		//Update the current session stat
		this._session = value;

		//Check against best stat
		this._best = Stat.Comparators[this._comparator](this._best, this._session);
	}

	get session(){ return this._session; }
	get best(){ return this._best; }
	get history(){ return this._history; }

	isSessionBest(){
		return this._session === this._best;
	}

	getSimple(){
		return {
			name: this._name,
			best: this._best,
			session: this._session,
			history: this._history
		}
	}

}

Stat.Comparators = {
	GreaterThan: function(a, b){
		return a > b ? a : b;
	},
	LessThan: function(a, b){
		return a < b ? a : b;
	}
}

export default StatsManager;