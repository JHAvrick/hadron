class SettingsManager extends Phaser.Plugin {
	constructor(game, storeKey){
		super(game);
		this.game = game;

		this._storeKey = storeKey;
		this._settings = this._fetchStore(storeKey);
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