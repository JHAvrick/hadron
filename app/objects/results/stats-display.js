import BitmapTextCounter from 'display/bitmaptext-counter.js';

/*
	This class is responsible for showing a visually interesting stat/score display.
	The code is hacked together really poorly and will need to be rewritten eventually for maintainability. 
	I'm pretty sure the next time I look at this code I will have no fucking idea what is going on.
*/
class StatsDisplay extends Phaser.Sprite {
	constructor(game, bestOnly){
		super(game, 0, 0, null);
		this.game = game;
		this.showingCurrent = bestOnly ? false : true;
		this.bestOnly = bestOnly;

		//The main ring of the display
		this.ring = this.game.make.sprite(this.game.width / 2, this.game.height / 2.25, 'results');
		this.ring.alpha = 0;
		this.ring.frameName = 'statsRing';
		this.ring.width = this.ring.width - 250;
		this.ring.height = this.ring.height - 250;
		this.ring.anchor.setTo(.5, .5);
		this.game.add.existing(this.ring);
		
		//Hint label
		this.label = this.game.add.bitmapText(this.game.width / 2, this.game.height * .80, 'Modeka', 'Tap to see best', 32);
		this.label.anchor.setTo(.5, .5);
		this.label.alpha = 0;

		//Don't show the hint label at all if bestOnly is set to true
		if (this.bestOnly) this.label.exists = false;


		//The stat orbs and score label
		this.scoreLabel = new ScoreLabel(this.game, this.ring.x, this.ring.y);
		this.orbsCleared = new StatsOrb(this.game, 'orbs', 'O R B S', 32, 0, 200, 'statsOrb');
		this.rechargesCleared = new StatsOrb(this.game, 'recharges', 'R E C H A R G E', 28, 2.0944, 200, 'statsCube');
		this.rechargesCleared.label.anchor.setTo(.5, -1); //offset a little extra because the font is smaller
		this.wavesCleared = new StatsOrb(this.game, 'waves', 'W A V E S', 32, 4.1888, 200, 'statsHex');
		this.stats = [this.orbsCleared, this.rechargesCleared, this.wavesCleared, this.scoreLabel];

		//Only allow switching between current and best scores if the flag is not set to true
		if (!this.bestOnly){

			this.ring.inputEnabled = true;
			this.ring.events.onInputDown.add(() => {
				if (this.showingCurrent)
					this.showBest();
				else
					this.showCurrent();
			});	

		}

		this.game.add.existing(this);
	}

	showBest(){
		this.stats.forEach((stat) => {
			stat.showBest();
		});

		this.showingCurrent = false;
		this.label.text = 'Tap to see current';
	}

	showCurrent(){
		this.stats.forEach((stat) => {
			stat.showCurrent();
		});

		this.showingCurrent = true;
		this.label.text = 'Tap to see best';
	}

	reveal(time, best){
		this.stats.forEach((stat) => {
			stat.reveal(time, best);
		});

		this.game.add.tween(this.ring).to( { alpha: 1 }, time || 8000, Phaser.Easing.Quadratic.Out, true);
		this.game.add.tween(this.label).to( { alpha: 1 }, time || 8000, Phaser.Easing.Quadratic.Out, true);
	}

	update(){
		this.ring.angle += 1;
	}
}

class ScoreLabel extends BitmapTextCounter {
	constructor(game, x, y){
		super(game, x, y, 'Modeka', '0', 45);
		this.alpha = 0;

		this.text = this._pad(this.game.plugins.stats.getSession('score'));
		this.tint = this.game.plugins.stats.isSessionBest('score') ? 0x00ff00 : 0xffffff;
		//this.showCurrent();
	}

	reveal(time, best){

		if (best){
			this.text = this._pad(this.game.plugins.stats.getBest('score'));
			this.tint = 0xAE56FA;
		}

		this.game.add.tween(this).to( { alpha: 1 }, 2000, Phaser.Easing.Quadratic.Out, true);
	}

	showCurrent(){
		this.toCount(this.game.plugins.stats.getSession('score'));
		this.tint = this.game.plugins.stats.isSessionBest('score') ? 0x00ff00 : 0xffffff;
	}

	showBest(){
		this.toCount(this.game.plugins.stats.getBest('score'));
		this.tint = 0xAE56FA;
	}
}


class StatsOrb extends Phaser.Sprite {
	constructor(game, statName, label, fontSize, radians, radius, frameName) {
		super(game, 0, 0, 'results');
		this.game = game;
		this.frameName = frameName;
		this.statName = statName;
		this.anchor.setTo(.5, .5);

		//Labels to show the stat and what it was for
		this.label = this.game.make.bitmapText(0, 0, 'Modeka', label, fontSize);
		this.label.alpha = 0;
		this.label.anchor.setTo(.5, -.8);

		this.scoreLabel = this.game.make.bitmapText(0, 0, 'Modeka', '', 62);
		this.scoreLabel.alpha = 0;
		this.scoreLabel.anchor.setTo(.5, .7);

		//Defines the circle path for this sprite to follow
		this.CX = this.game.width / 2;
		this.CY = this.game.height / 2.25;
		this.radians = radians;
		this.radius = radius;
		this.speed = 0.25;
		this.alpha = 0;

		//Must add to game in this order for the labels to be on top
		this.game.add.existing(this);
		this.game.add.existing(this.label);
		this.game.add.existing(this.scoreLabel);

		//this.showCurrent();
	}

	//Initial reveal sequence, fades and slows the rotation aruond the circle path
	reveal(time, best){

		if (best){

			this.scoreLabel.text = this.game.plugins.stats.getBest(this.statName)
			this.scoreLabel.tint = 0xAE56FA;

		} else {

			//DO NOT reconcile this to the showCurrent() function
			this.scoreLabel.text = this.game.plugins.stats.getSession(this.statName);
			this.scoreLabel.tint = this.game.plugins.stats.isSessionBest(this.statName) ? 0x00ff00 : 0xffffff;

		}

		//Set initial positions
		this.label.x = this.scoreLabel.x = this.x
		this.label.y = this.scoreLabel.y = this.y;

		//Do tweens
		this.game.add.tween(this.label).to( { alpha: 1 }, time || 3000, Phaser.Easing.Quadratic.Out, true);
		this.game.add.tween(this.scoreLabel).to( { alpha: 1 }, time || 3000, Phaser.Easing.Quadratic.Out, true);
		this.game.add.tween(this).to( { speed: .005 }, time || 2000, Phaser.Easing.Quadratic.Out, true);
		this.game.add.tween(this).to( { alpha: 1 }, time || 2000, Phaser.Easing.Quadratic.Out, true)
	}

	//Switch label text, fade out --> switch text --> fade in
	setScoreLabel(score){
		this.spinFaster(500);

		this.scoreLabel.alpha = 0;
		this.scoreLabel.text = score;
		this.game.add.tween(this.scoreLabel).to( { alpha: 1 }, 1000, Phaser.Easing.Quadratic.Out, true);
	}

	//Shows current score w/ spinning effect
	//Score is green if it is the highest score
	showCurrent(){
		this.setScoreLabel(this.game.plugins.stats.getSession(this.statName));
		this.scoreLabel.tint = this.game.plugins.stats.isSessionBest(this.statName) ? 0x00ff00 : 0xffffff;
	}

	showBest(){
		this.setScoreLabel(this.game.plugins.stats.getBest(this.statName));
		this.scoreLabel.tint = 0xAE56FA;
	}

	//Speeds up the rotation around the circle path for a moment
	spinFaster(time, callback){

		var halfTime = time  ? time / 2 : 500;

		this.game.add.tween(this).to( { speed: 0.25 }, halfTime, Phaser.Easing.Quadratic.Out, true)
		.onComplete.add(() => {

			this.game.add.tween(this).to( { speed: .005 }, halfTime, Phaser.Easing.Quadratic.Out, true)
			.onComplete.add(() => {

				if (callback) callback();

			});

		});

	}

	update(){
		this.label.x = this.scoreLabel.x = this.x
		this.label.y = this.scoreLabel.y = this.y;
		this.x = this.CX + (Math.sin(this.radians) * this.radius); //Update position
		this.y = this.CY + (Math.cos(this.radians) * this.radius);
		this.radians += this.speed; //Update speed
	}

}

export default StatsDisplay;