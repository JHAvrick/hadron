class SettingsManager extends Phaser.Plugin {
	constructor(game, storeKey){
		super(game);
		this.game = game;

		this._storeKey = storeKey;
		this._settings = this._fetchStore(storeKey);
		this._guid = this.getGUID();
	}

	//This code from https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
	_generateGUID (){
		function s4() {
		  return Math.floor((1 + Math.random()) * 0x10000)
		    .toString(16)
		    .substring(1);
		}

	  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
	    s4() + '-' + s4() + s4() + s4();
	}


	_fetchStore(storeKey){
		if (localStorage.getItem(storeKey))
			return JSON.parse(localStorage.getItem(storeKey));
		else
			return {}
	}

	//The stats are stored as a stringified array rather than an object
	_commitStore(){
		localStorage.setItem(this._storeKey, JSON.stringify(this._settings));
	}

	getGUID(){
		var guid = localStorage.getItem('!!guid!!');

		if (guid){

			return JSON.parse(guid);

		} else {

			var newGUID = this._generateGUID();
			localStorage.setItem('!!guid!!', JSON.stringify(newGUID));

			return newGUID;
		}
	}

	default(defaults){
		for (var key in defaults){
			if (this._settings[key] == null)
				this._settings[key] = defaults[key];
		}

		this._commitStore();
	}

	set(key, value){
		this._settings[key] = value;
		this._commitStore();
	}

	get(key){
		return this._settings[key];
	}

	clearStore(){
		localStorage.removeItem(this._storeKey);
	}

}

export default SettingsManager;