//This plugin provides convenience functions for positioning objects
class LayoutManager extends Phaser.Plugin {
	constructor(game){
		super();
		this.game = game;
		this.hasUpdate = false;
		this.hasRender = false;
	}

	/* Resolves ratio (0 - 100) and, returns object {x, y} */
	ratio(percentX, percentY){
		return {
			x: this.game.width * (percentX * .01),
			x: this.game.height * (percentY * .01)
		}
	}

	/* Resolves a percent value (0-100) to an x-coordinate value */
	ratioX(percentX){
		return this.game.width * (percentX * .01);
	}

	/* Resolves a percent value (0-100) to a y-coordinate value */
	ratioY(percentY){
		return this.game.height * (percentY * .01);
	}

	fromEndX(distance){
		return this.game.width - distance;
	}

	fromEndY(distance){
		return this.game.height - distance;
	}

}

export default LayoutManager;