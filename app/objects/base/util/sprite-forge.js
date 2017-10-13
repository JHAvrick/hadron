import { set } from "lodash";
import { get } from "lodash";
import { isFunction } from "lodash";
import LayoutManager from 'util/layout-manager.js';

//Apply common property configurations to a sprite without five lines of code
class SpriteForge extends Phaser.Plugin {
	constructor(game){
		super();
		this.game = game;
		this.hasUpdate = false;
		this.hasRender = false;

		this._assignFuncChar = '*';
	}

	set assignFuncChar(char){
		this._assignFuncChar = char;
	}

	_resolveX(x){
		switch (typeof x){
			case 'string':
				if (x.indexOf('%') > -1) return this.game.width * (parseFloat(x.replace('%', '')) * .01); //return percent 
				else return parseFloat(x);

			case 'number':
				return x;
		}
	}

	_resolveY(y){
		switch (typeof y){
			case 'string':
				if (y.indexOf('%') > -1) return this.game.height * (parseFloat(y.replace('%', '')) * .01); //return percent 
				else return parseFloat(y);

			case 'number':
				return y;
		}
	}

	make(config, x, y, image, frameName){
		var resolvedX = this._resolveX(x);
		var resolvedY = this._resolveY(y);

		var sprite = this.game.make.sprite(resolvedX, resolvedY, image, frameName);
		return this.apply(config, sprite);
	}

	sprite(config, x, y, image, frameName){
		var resolvedX = this._resolveX(x);
		var resolvedY = this._resolveY(y);

		var sprite = this.game.add.sprite(resolvedX, resolvedY, image, frameName);

		return this.apply(config, sprite);
	}

	bitmapText(config, x, y, font, text, size){
		var resolvedX = this._resolveX(x);
		var resolvedY = this._resolveY(y);

		var bitmapText = this.game.add.bitmapText(resolvedX, resolvedY, font, text || '', size || 16 );
		return this.apply(config, bitmapText);
	}

	animation(config, sprite){
		if (!config.name || !config.frames)
			console.warn("FORGE: It is highly suggested that animation configs include 'name' and 'frames' properties.");

		var anim = sprite.animations.add(config.name || 'anim',
																		 config.frames || '');

		return this.apply(config, anim);
	}

	apply(config, object){
		for (var key in config){

			//If the config property corresponds to a function on the target object,
			//call the function with the config value
			if (isFunction(object[key])){

				object[key](config[key]);

			//Otherwise, resolve the config key to a property and assign it to the target object
			} else {

				//remove the assignFuncChar for the actual object property
				set(object, key.replace(this._assignFuncChar, ''), config[key]);

			}

		}

		return object;
	}

}

export default SpriteForge;
