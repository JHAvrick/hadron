import DisplacementFilter from './displacement-filter.js';

class DisplacementBurst {
	constructor(game, textureKey = 'null'){
		this.game = game;
		this._displaceTexture = textureKey;
		this._displaceFilter = new 

	}

	_addFilter(target, filter){
		var filters = target.filters != undefined ? target.filters.slice(0) : [] ;
			filters.push(filter);

		target.filters = null;
		target.filters = filters;
	}

	_removeFilter(target, filter){
		if (!target.filters || target.filters.length === 0) return;

		var filters = target.filters.slice(0)
			filters.splice(filters.indexOf(filter), 1);

		target.filters = null;

		if (filters.length === 0) 
			return;
		else 
			target.filters = filters;
	}
	
	start(target, amount = 30, duration = 750){
		if (!target) return;

		this._addFilter(target, this._displaceFilter);

		this.update = () => {

			this.displaceFilter.offset.x += 5;

		}

		return new Promise((resolve, reject) => {

			this.game.add.tween(this.displaceFilter.scale).to( {x: amount, y: amount} , duration, Phaser.Easing.Quadratic.In, true)
			.onComplete.add(() => {

				this.game.add.tween(this.displaceFilter.scale).to( {x: 0, y: 0} , duration, Phaser.Easing.Quadratic.In, true)
				.onComplete.add(() => {
					
					this._removeFilter(target, this.displaceFilter);
					this.update = () => {};

					resolve();

				});

			});	

		});

	}

}

export default DisplacementBurst;