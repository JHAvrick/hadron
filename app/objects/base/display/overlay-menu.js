class OverlayMenu {
	constructor(game, bgImage = null, frameName = null){
		this.game = game;

		this._bg = this.game.add.sprite(0, 0, bgImage, frameName);
		this._bg.width = this.game.width + 10;
		this._bg.height = this.game.height + 10;
		this._bg.exists = false;

		//The opacity of the menu
		this._bgAlpha = 1;

		this._items = [];
	}

	get bgAlpha(){ return this._bgAlpha; }
	set bgAlpha(value){ this._bgAlpha = value; }

	removeItem(item){
		return this._items.splice(this._items.indexOf(item), 1);
	}

	addItem(item){
		this._items.push(item);
		item.exists = false;
	}

	addAll(items){
		items.forEach((item) =>{
			item.exists = false;
			this._items.push(item);
		});
	}

	show(){
		this._bg.alpha = this._bgAlpha;
		this._bg.exists = true;
		this._bg.bringToTop();

		this._items.forEach((item) => {
			item.exists = true;
			this.game.world.bringToTop(item);
		});
	}

	hide(){
		this._bg.exists = false;

		this._items.forEach((item) => {
			item.exists = false;
		});
	}

}

export default OverlayMenu;