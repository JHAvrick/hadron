class BitmapTextInput extends Phaser.BitmapText {
	constructor(game, x, y, font, size, align){
		super(game, x, y, font, '', size, align);
		this.game = game;
		this.anchor.setTo(.5, .5);

		this._content = '';
		this._keyJustPressed = '';
		this._charLimit = 255;
		this._capsOnly = false;
		this._alphanumericOnly = false;
		this._textFilters = [BitmapTextInput.TextFilters.constrainLength];

		this.game.input.keyboard.addCallbacks(this, this._handleKeyDown);
		this.game.add.existing(this);
	}

	_applyTextFilters(string){
		var newString = string;

		this._textFilters.forEach((filter) => {
			newString = filter(newString, {
				key: this._keyJustPressed,
				charLimit: this._charLimit,
				textOnly: this._textOnly
			});
		});

		return newString;
	}

	_handleKeyDown(e){
		var key = this._keyJustPressed = e.key;

		//Apply special character processing
		if (BitmapTextInput.specialMap[key])
			this._content = BitmapTextInput.specialMap[key](this._content);
		else
			this._content = this._content + key;

		//Apply filters
		this.text = this._content = this._applyTextFilters(this._content);
	}

	addTextFilter(filter){
		if (this._textFilters.includes(filter)) return;
		this._textFilters.push(filter);
	}

	removeTextFilter(filter){
		this._textFilters.splice(this._textFilters.indexOf(filter), 1);
	}

	forceKeyDown(key){ 
		this._handleKeyDown({key: key}); 
	}

	set capsOnly(value){
		this._capsOnly = value;

		if (value) this.addTextFilter(BitmapTextInput.TextFilters.allCaps);
		else this.removeTextFilter(BitmapTextInput.TextFilters.allCaps);
	}

	set alphanumericOnly(bool){
		this._alphanumericOnly = bool;

		if (bool) this.addTextFilter(BitmapTextInput.TextFilters.alphanumericOnly);
		else this.removeTextFilter(BitmapTextInput.TextFilters.alphanumericOnly); 
	}

	set charLimit(value){ this._charLimit = value; }
	
	get alphanumericOnly(){ return this._alphanumericOnly; }
	get capsOnly(){ return this._capsOnly; }
	get charLimit(){ return this._charLimit; }

}

BitmapTextInput.specialMap = {
	Backspace: function(string){
		return string.substr(0, string.length - 1)
	},
	Shift: function(string){ return string; },
	Tab: function(string){ return string; },
	Alt: function(string){ return string; },
	Control: function(string){ return string; },
	CapsLock: function(string){ return string; }
}

BitmapTextInput.TextFilters = {
	constrainLength: function(string, data){
		return string.substr(0, data.charLimit);
	},
	alphanumericOnly: function(string, data){
		return string.replace(/\W/g, '');
	},
	allCaps: function(string, data){
		return string.toUpperCase();
	},
	noCaps: function(string, data){
		return string.toLowerCase();
	}
}


export default BitmapTextInput;