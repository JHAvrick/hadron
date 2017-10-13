class ScoreBoard {
	constructor(game, columnCount = 3, font = 'Arial', fontSize = 32){
		this.game = game;

		this._font = font;
		this._fontSize = fontSize;

		this._paddingLeft = this.game.width * .5;
		this._paddingRight = this.game.width * .5;
		this._colStartY = this.game.width * .10;
		this._colStartX = this._paddingLeft;
		this._colWidth = (this.game.width - (this.game.width * .10)) / 3;
		this._colVerticalSpacing = 100;

		this._columns = [];

	}

	reveal(){
		var ySpaceIndex = this._colStartY;
		var duration = 500;
		this._columns.forEach((col) => {
			col.reveal(this._colStartX, ySpaceIndex, duration);

			ySpaceIndex += this._colVerticalSpacing;
			duration += 200;

		});
	}

	addScores(scores){
		scores.forEach((score) => {

		})
	}

}

class ScoreItem extends Phaser.Sprite {
	constructor(game, columns, font, fontSize){
		super(game, 0, 0, null);
		this.game = game;
		this.anchor.setTo(0, .5);

		this._font = font;
		this._fontSize = fontSize;

		this._cols = this._makeLabels(columns);
	}

	reveal(x, y, duration){
		this._cols.forEach((col) = > {
			col.x = x;
			col.y = 
		})

	}

	_makeLabels(columns){
		var labels = [];
		columns.forEach((columnText) => {
			labels.push(this.game.add.bitmapText(0, 0, this._font, columnText, this._fontSize))
		});
		return labels;
	}

}

export default ScoreBoard;