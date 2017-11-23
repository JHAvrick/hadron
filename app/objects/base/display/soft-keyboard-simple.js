class SoftKeyboardSimple extends Phaser.Group {
	constructor(game, options = {}){
		super(game);
		this.game = game;

		this._keyboardX = options.x || this.game.world.centerX;
		this._keyboardY = options.y || this.game.world.centerY;
		this._keyWidth = options.keyWidth || 60;
		this._keyHeight = options.keyHeight|| 80;
		this._horizontalPadding = options.horizontalPadding || 10;
		this._verticalPadding = options.verticalPadding || 10;

		this._keyTexture = options.texture || null;
		this._keyFrame = options.frame || null;
		this._keyOverFrame = options.keyOverFrame || null;
		this._keyOutFrame = options.keyOutFrame || null;
		this._keyDownFrame = options.keyDownFrame || null;
		this._keyUpFrame = options.keyUpFrame || null;
		this._keyStyle = options.keyStyle || { font: "30px Arial", fill: "#ffffff", align: "center" };

		this._numRow = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
		this._letterRowTop = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
		this._letterRowMid = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
		this._letterRowBottom = ['↑', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '←'];
		this._allRows = [this._numRow, this._letterRowTop, this._letterRowMid, this._letterRowBottom];

		this.onKeyPressed = new Phaser.Signal();

		this._keyMap = {};
		this._makeKeys();
		this._positionKeys();
	}

	_forKeysInOrder(callback){
		var rowIndex = 0;
		var letterIndex = 0;
		this._allRows.forEach((row) => {
			row.forEach((letter) => {
				callback(letter, rowIndex, letterIndex);
				letterIndex += 1;
			});
			letterIndex = 0;
			rowIndex += 1;
		});
	}

	_makeKeys(){
		this._forKeysInOrder((letter) => {
			this._keyMap[letter] = new SoftKeyboardButton(this.game, letter, this._keyStyle, this._keyTexture, this._keyFrame);
			this._keyMap[letter].keyWidth = this._keyWidth;
			this._keyMap[letter].keyHeight = this._keyHeight;
			this._keyMap[letter].onPressed.add(this._handleKeyPressed, this);

			this.addChild(this._keyMap[letter]);
		});
	}

	_positionKeys(){
		var keyWidth = this._keyMap['1'].width;
		var keyHeight = this._keyMap['1'].height;

		var rowHeight = keyHeight + this._verticalPadding;
		this._forKeysInOrder((letter, rowIndex, letterIndex) => {
			let row = this._allRows[rowIndex];

			let rowWidth = (row.length - 1) * (keyWidth + this._horizontalPadding);
			let rowStart = (this._keyboardX - (rowWidth / 2));

			let keyX = rowStart + ((keyWidth + this._horizontalPadding) * letterIndex);
			let keyY = this._keyboardY + (rowHeight * rowIndex);

			let key = this._keyMap[letter];
					key.setPosition(keyX, keyY);
		});
	}

	_handleKeyPressed(letter){
		this.onKeyPressed.dispatch(SoftKeyboardSimple.specialKeys[letter] || letter);
	}

	show(){ this.callAll('show'); }
	hide(){ this.callAll('hide'); }

}

SoftKeyboardSimple.specialKeys = {
	'←': 'Backspace',
	'↑': 'Shift'
}

class SoftKeyboardButton extends Phaser.Image {
	constructor(game, keyText, labelStyle, image, frame){
		super(game, 0, 0, image, frame);
		this.game = game;
		this.anchor.setTo(.5, .5);

		this.letter = keyText;
		this._keyText = keyText;
		this._labelStyle = labelStyle;
		this._keyLabel = this.game.add.text(this.x, this.y, keyText, labelStyle);
		this._keyLabel.anchor.setTo(.5, .5);
		this._keyLabel.exists = false;

		this._keyWidth = 60;
		this._keyHeight = 80;

		this.onPressed = new Phaser.Signal();

		this.inputEnabled = true;
		this.events.onInputOver.add(this._handleMouseOver, this);
		this.events.onInputOut.add(this._handleMouseOut, this);
		this.events.onInputDown.add(this._handleMouseDown, this);
		this.events.onInputUp.add(this._handleMouseUp, this);

		this.game.add.existing(this);
		this.exists = false;
	}

	set keyWidth(value){ this._keyWidth = this.width = value; }
	set keyHeight(value){ this._keyHeight = this.height = value; }

	_handleMouseOver(){ this.alpha = .5; }
	_handleMouseOut(){ this.alpha = 1; }

	_handleMouseDown(){
		this.alpha = 1;
		this.scale.x = this.scale.y = 1.3; 
		this._keyLabel.scale.x = this._keyLabel.scale.y = 1.3;

		this.onPressed.dispatch(this.letter);
	}

	_handleMouseUp(){  
		this.alpha = 1;
		this.width = this._keyWidth;
		this.height = this._keyHeight;
		this._keyLabel.scale.x = this._keyLabel.scale.y = 1;
	}

	toUpperCase(){ this._keyLabel.setText(this._keyLabel.text.toUpperCase()); }
	toLowerCase(){ this._keyLabel.setText(this._keyLabel.text.toLowerCase()); }

	setPosition(x, y){
		this.x = this._keyLabel.x = x;
		this.y = this._keyLabel.y = y;
	}

	show(){
		this.exists = true;
		this._keyLabel.exists = true;
	}

	hide(){
		this.exists = false;
		this._keyLabel.exists = false;
	}

}



export default SoftKeyboardSimple;