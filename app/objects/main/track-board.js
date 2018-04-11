import TrackSprites from 'config/track-sprites.js';
import FadeTransition from 'fx/fade-transition.js';

class TrackBoard {
	constructor(game){
		this.game = game;
		this.forge = this.game.plugins.forge;

		//Get the center x and y
		const extraWidth = (this.game.width - 720) / 2;

		//The track is placed somewhat arbitrarily, but is adjusted depending on how wide the game is
		this.CX = (-1 * ((2500 / 2) - this.game.width)) - extraWidth;
		this.CY = this.game.world.centerY;

		//generate the board sprites
		this.trackSprite = this.forge.sprite(TrackSprites.MAIN, this.CX, this.CY, 'tracks', 'tracks');
		this.tracks = this._generateTracks();
		this.flashSprites = this._generateFlashSprites();
	}

	getRadius(index){
		return this.tracks[index].radius;
	}

	flash(index){
		//Audio FX
		this.game.plugins.audio.play('move', false, 0.4);

		this.flashSprites[index].alpha = 1;
		this.game.add.tween(this.flashSprites[index]).to( { alpha: 0 } , 500, Phaser.Easing.Quadratic.In, true);
	}

	reveal(onComplete){
		this.trackSprite.alpha = 1;
		onComplete();
	}

	_generateFlashSprites(){
		var sprites = [];
		for (var i = 0; i < 6; i++){
			var flashSprite = this.forge.sprite(TrackSprites.FLASH, this.CX, this.CY, 'tracks', 'glowTracks_' + i);
			sprites.push(flashSprite);
		}

		return sprites;
	}

	_generateTracks(){
		var tracks = [];
		var smallestTrackRadius = 600;
		for (var i = 700; i < 1300; i += 100){
		    var track = {
		                    radius: i,
		                    innerBound: i - 50,
		                    outerBound: i + 50
		                }
		    tracks.push(track);
		}

		return tracks;
	}

}

export default TrackBoard;