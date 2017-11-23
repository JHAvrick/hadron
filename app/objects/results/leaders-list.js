class LeadersList extends Phaser.Group {
	constructor(game, top){
		super(game);
		this.game = game;
		this.layout = this.game.plugins.layout;

		this._playerGUID = this.game.plugins.settings.getGUID();

		this._header = new HeaderItem(this.game);
		this._header.enter(this.layout.ratioY(10), 0);

		this._items = this._generateListItems(top);
	}

	_generateListItems(top){
		var items = [];
		var layoutY = 18;
		var delay = 0;
		for (var i = 0; i < top.length; i++){

			let y = this.layout.ratioY(layoutY);
			var leaderItem = new LeaderItem(this.game, i + 1, top[i].alias, top[i].score);
					leaderItem.enter(y, delay);

			//Tints text green if the score belongs to the vewing player
			if (top[i].guid === this._playerGUID)
				leaderItem.isUsersScore();

			layoutY += 7;
			delay += 100;
		}

		return items;
	}

}

class HeaderItem { 
	constructor(game){
		this.game = game;
		this.layout = game.plugins.layout;

		var offScreenY = game.height + 50;
		var style = { font: "36px Arial", fill: "#ffffff", align: "left" };

		this._rankLabel = this.game.add.text(this.layout.ratioX(15), offScreenY, 'R A N K', style);
		this._aliasLabel = this.game.add.text(this.layout.ratioX(50), offScreenY, 'N A M E', style);
		this._scoreLabel = this.game.add.text(this.layout.ratioX(85), offScreenY, 'S C O R E', style);

		this._rankLabel.anchor.setTo(.5, .5);
		this._aliasLabel.anchor.setTo(.5, .5);
		this._scoreLabel.anchor.setTo(.5, .5);

	}

	enter(y, delay){
		this.game.add.tween(this._rankLabel).to( { y: y }, 750, Phaser.Easing.Quadratic.Out, true);
		this.game.add.tween(this._aliasLabel).to( { y: y }, 750, Phaser.Easing.Quadratic.Out, true);	
		this.game.add.tween(this._scoreLabel).to( { y: y }, 750, Phaser.Easing.Quadratic.Out, true);	
	}
}

class LeaderItem {
	constructor(game, rank, alias, score){
		this.game = game;
		this.layout = game.plugins.layout;

		var offScreenY = game.height + 50;
		var style = { font: "32px Arial", fill: "#ffffff", align: "left" };

		this._rankLabel = this.game.add.text(this.layout.ratioX(15), offScreenY, rank, style);
		this._aliasLabel = this.game.add.text(this.layout.ratioX(50), offScreenY, alias.split('').join(' '), style);
		this._scoreLabel = this.game.add.text(this.layout.ratioX(85), offScreenY, score, style);

		this._rankLabel.anchor.setTo(.5, .5);
		this._aliasLabel.anchor.setTo(.5, .5);
		this._scoreLabel.anchor.setTo(.5, .5);

	}

	enter(y, delay){
		this.game.add.tween(this._rankLabel).to( { y: y }, 1000, Phaser.Easing.Quadratic.Out, true, delay);
		this.game.add.tween(this._aliasLabel).to( { y: y }, 1000, Phaser.Easing.Quadratic.Out, true, delay);	
		this.game.add.tween(this._scoreLabel).to( { y: y }, 1000, Phaser.Easing.Quadratic.Out, true, delay);	
	}

	//Sets each label's tint to green
	isUsersScore(){
		this._rankLabel.tint = 0x00ff00;
		this._aliasLabel.tint = 0x00ff00;
		this._scoreLabel.tint = 0x00ff00;
	}

}

export default LeadersList;