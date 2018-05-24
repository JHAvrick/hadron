/*
	Class: Main
	DESCRIPTION: This is the core game loop. All that really happens here is that
	the various core game/logic classes are linked together and game state/indexes
	are modified.
*/

//Core game/logic objects
import Indexes from 'config/indexes.js';
import Ramp from 'config/ramp.js';
import ParticlePool from 'main/particle-pool.js';
import ParticleSequencer from 'main/particle-sequencer.js';
import ParticleCollider from 'main/particle-collider.js';
import TopTenCheck from 'main/top-ten-check.js';
import WaveRater from 'main/wave-rater.js';
import TrackBoard from 'main/track-board.js';
import Player from 'main/player.js';
import Bumper from 'main/bumper.js';

//FX
import RGBSplitFilter from 'fx/rgb-split-filter.js';
import FadeTransition from 'fx/fade-transition.js';
import CollectBurst from 'main/collect-burst.js';
import PointIndicator from 'display/point-indicator.js';
import BitmapTextCounter from 'display/bitmaptext-counter.js';
import BackgroundFader from 'display/background-fader.js';
import TapEffect from 'main/tap-effect.js';

//Display Objects
import ShapeColorIndicator from 'main/shape-color-indicator.js';
import LifeIndicator from 'main/life-indicator.js';
import PauseMenu from 'main/pause-menu.js';
import Banner from 'display/banner.js';

class Main extends Phaser.State {

	init(){
		//Convenience accessors for plugins
		this.stats = this.game.plugins.stats;
		this.layout = this.game.plugins.layout; 
		this.audio = this.game.plugins.audio;
		this.forge = this.game.plugins.forge;
		this.shake = this.game.plugins.shake;

		//State flags (most state is maintained by core game objects)
		this.gameIsPaused = false;
		this.gameIsOver = false;
	}

	create(){
		//Fade in
		this.game.camera.flash(0x000000, 2500);
	

		/*
			------------------------------AUDIO --------------------------------------
		*/
		var hitKeys = ['hitOne', 'hitTwo', 'hitThree', 'hitFour', 
									'hitFive', 'hitSix','hitSeven','hitEight']

		this.audio.addAudioGroup('hits', hitKeys);
		this.audio.music('bluewave');


		/*
			---------------------------- FX ------------------------------------------
		*/

		this.game.stage.filters = [new RGBSplitFilter({x: 2, y: 2}, {x: 1, y: -1}, {x: -1, y: 2})];
		this.invalidBurstFX = new CollectBurst(this.game); //tint is red by default
		this.validBurstFX = new CollectBurst(this.game);
		this.validBurstFX.tintMode = 'random';


		/*
			---------------------------- Core Game Objects ---------------------------
		*/

		//handles increasing difficulty and state indexes
		this.indexes = Indexes.reset(); //reset all indexes, returns itself
		this.ramp = Ramp;

		//handles placement of player and particles
		this.board = new TrackBoard(this.game); 
		
		//manages and recycles the particles
		this.pool = new ParticlePool(this.game, 75, this.board); 

		//Parses the the patterns and spawns new particles
		this.sequencer = new ParticleSequencer(this.game, this.board, this.pool, false);
		//this.sequencer.useDebugMode('7-0');

		//Handles collision detection
		this.collider = new ParticleCollider(this.game);

		//The player object
		this.player = new Player(this.game, this.board);
		

		this.points = new PointIndicator(this.game);
		this.rater = new WaveRater(this.handleWaveRating.bind(this));
		this.topTenCheck = new TopTenCheck();


		//Bumpers trigger events when an orb has not been collected by the player
		this.topBumper = new Bumper(this.game, this.layout.ratioX(50), this.layout.ratioY(25));
		this.bottomBumper = new Bumper(this.game, this.layout.ratioX(50), this.layout.ratioY(75));


		/*
			--------------------------- Display Objects ------------------------------
		*/
		
		//Effect when player taps
		let tapEffect = new TapEffect(this.game);

		//Pause overlay
		this.pauseMenu = new PauseMenu(this.game, this.handlePause.bind(this), this.handleResume.bind(this));
		this.pauseMenu.bgAlpha = .8;


		//Shows the current wave shape/color rules
		this.indicator = new ShapeColorIndicator(this.game);

		//Fades between different background gradients
		this.bgFader = new BackgroundFader(this.game, 'gradients', ['bg_3', 'bg_2' ,'bg_1','bg_4','bg_5','bg_6']);

		//Health bar
		this.meter = new LifeIndicator(this.game);

		//Score text
		this.score = new BitmapTextCounter(this.game, this.game.width - 10, this.game.height - 5, 'Modeka', '000000', 50);
		this.score.anchor.setTo(1, 1);
		this.score.usePadding("00000");		

		//Rating banner
		this.banner = new Banner(this.game, 'sprites', 'banner', 1000, 750, 500);

		/*
			--------------------------- Events----------------------------------------
		*/
		this.player.onMove.add(this.board.flash, this.board); //flash effect on player move

		//Collision events
		this.collider.collide(this.player.proxy, this.pool, this.handlePlayerHit.bind(this));
		this.collider.collide(this.topBumper, this.pool, this.handleTopBumperHit.bind(this));
		this.collider.collide(this.bottomBumper, this.pool, this.handleBottomBumperHit.bind(this));
	
		//Index events
		this.indexes.health.on('clampMin',this.gameOver.bind(this));
		this.indexes.orbsCleared.on('wrapMax', this.endWave.bind(this));

		/*
			----------------------------Reveal ---------------------------------------
		*/

		//Start the background gradient fades
		this.bgFader.start(10000);

		//This reveals the player and the HUD, triggered after the board is revealed
		this.reveal = new FadeTransition({
			game: this.game,
			duration: 500,
			variation: 50,
			items: [this.player]
		});

		//After both the board and HUD are reveal, start the first wave
		this.board.reveal(() => {

			this.meter.enter(); //show the health meter
			this.reveal.enter(() => {
					//allow the player to move, unless the game was paused during the fade-ins
					if (!this.gameIsPaused) 
						this.player.isPaused = false;

					this.wave();
			});

		});

	}

	wave(){
		var seq = this.sequencer.resequence(); //builds and returns new sequence
		this.indicator.enter(seq.rules.shape, seq.rules.color, seq.rules.colorName, () => {
			this.audio.play('success', false, 0.4);
			this.sequencer.start();
		});

		//DELETE ME: FOR DEBUGGING PURPOSES 
		this.debugText = seq.id; 
	}

	endWave(){
		this.indicator.exit();

		//End and clear the sequence, increase the difficulty level
		this.sequencer.end();
		this.pool.clearExisting();

		//Update pause menu stats
		this.indexes.wavesTotal.increment();
		this.pauseMenu.setWaveCount(this.indexes.wavesTotal.value);
		
		//Show rating
		this.rater.rateWave();

		//Flash FX
		this.game.camera.flash(0xffffff, 1250);

		this.wave();		
	}

	gameOver(){

		//End the sequence and clear any remaining orbs
		this.sequencer.end();
		this.pool.clearExisting();
		this.updateScores();

		//Clean up references to Indexes singleton before the state ends
		this.sequencer.dereference();
		this.indexes.health.removeEvents();
		this.indexes.orbsCleared.removeEvents();

		//Fx and audio
		this.audio.play('gameover');
		this.audio.fadeOut('bluewave', 1900);
		this.shake.start(1000);
		this.game.camera.fade(0x660000, 2500);

		this.game.camera.onFadeComplete.addOnce(() => {
				this.shake.reset();

				//If the player scored in the top ten, go to InputAlias page
				if (this.topTenCheck.isTopTen(this.indexes.scoreTotal.value))
					this.game.state.start('InputAlias');
				else 
					this.game.state.start('Results');
		});	

	}

	/*
		This is called when the player collides with a particle.
	*/
	handlePlayerHit(particle){
		//prevents the particle-collider from triggering any more events for this particle
		particle.collisionLocked = true; 

		//The sequencer will trigger the callback depening on the particle's validity
		this.sequencer.isValidParticle(particle, {
			onInvalid: this.handleInvalidOrb.bind(this),
			onValid: this.handleValidOrb.bind(this),
			onRecharge: this.handleRechargeOrb.bind(this) 
		});
	}

	handleValidOrb(particle){
		//Destroy the particle and add a new one to the pool
		particle.die();
		this.pool.make(1);

		//Audio FX
		this.audio.next('hits');

		//Points throwup
		this.points.show(particle.x - 50, particle.y - 50, '+ 1 0');

		//Particle effect
		if (particle.speed > 0) this.validBurstFX.burstUp(particle.x, particle.y - 30);
		else this.validBurstFX.burstDown(particle.x, particle.y + 30);

		this.indexes.orbsCleared.increment();
		this.indexes.orbsTotal.increment();
		this.indexes.scoreTotal.add(10);

		this.score.toCount(this.indexes.scoreTotal.value); //add to score label
	}

	handleInvalidOrb(particle, missed){
		this.shake.start(); //shake effect

		//Particle effect
		if (particle.speed > 0) this.invalidBurstFX.burstUp(particle.x, particle.y - 30);
		else this.invalidBurstFX.burstDown(particle.x, particle.y + 30);

		//Audio FX
		this.audio.play('miss');

		//Points throwup
		this.points.show(particle.x - 60, particle.y, '- 2 0', 1000, 0xff0000);

		//Destroy the particle and add a new one to the pool
		particle.die();

		//Rating stats
		if (missed) this.rater.orbMissed();
		else this.rater.wrongOrb();

		//Adjust indexes
		this.indexes.scoreTotal.subtract(20);
		this.indexes.health.subtract(4);
		this.meter.life = this.indexes.health.value - 1;
		this.score.toCount(this.indexes.scoreTotal.value);
	}

	handleRechargeOrb(particle){
		//Audio FX
		this.audio.play('recharge');

		//Particle effect
		if (particle.speed > 0) this.validBurstFX.burstUp(particle.x, particle.y - 30);
		else this.validBurstFX.burstDown(particle.x, particle.y + 30);

		//Points throwup
		this.points.show(particle.x - 60, particle.y, '+ 2 5');

		//Kill the particlee
		particle.die();

		//Increment appropriate values
		this.indexes.health.increment();
		this.indexes.rechargeTotal.increment();
		this.indexes.scoreTotal.add(25);

		//For rating
		this.rater.rechargeCollected();

		//Change HUD
		this.score.toCount(this.indexes.scoreTotal.value);
		this.meter.life = this.indexes.health.value - 1;
	}


	/*
		This is called when a particle passes a certain point above the center of the
		game (where the player is). If the particle was valid, the 
	*/
	handleTopBumperHit(particle){
		if (particle.speed > 0 && particle.type === 2)
			this.handleInvalidOrb(particle, true);
		else if (particle.speed > 0 && particle.type === 3)
			this.rater.rechargeMissed();
	}

	handleBottomBumperHit(particle){
		if (particle.speed < 0 && Math.abs(particle.type) === 2)
			this.handleInvalidOrb(particle, true);
		else if (particle.speed < 0 && Math.abs(particle.type) === 3)
			this.rater.rechargeMissed();
	}

	handlePause(){
		//this.game.paused = true;
		this.gameIsPaused = true;
		this.player.isPaused = true;
		this.pool.pause();
		this.sequencer.pause();
	}

	handleResume(){
		//this.game.paused = false;
		this.gameIsPaused = false;
		this.player.isPaused = false;
		this.pool.resume();
		this.sequencer.resume();
	}

	updateScores(){
		this.stats.setStats({
			orbs: this.indexes.orbsTotal.value,
			waves: this.indexes.wavesTotal.value,
			recharges: this.indexes.rechargeTotal.value,
			score: this.indexes.scoreTotal.value
		});
	}

	/*
		This method determines the score bonus for each completed wave.
		More difficult waves give bigger score bonuses. 
	*/
	handleWaveRating(rating){
		var message = '';
		var points = 0;
		var tint = 0xffffff;

		switch (rating){
			case 'perfect':
				points = 50 * (this.indexes.bank.value + 1); //use one if the bank is 0
				message = 'P E R F E C T  +' + points;
				tint = 0x00ff00;
			break;
			case 'good':
				points = 25 * (this.indexes.bank.value + 1);
				message = 'G O O D  +' + points;
				tint = 0x00ff00;
			break;
			case 'acceptable':
				points = 10 * (this.indexes.bank.value + 1);
				message = 'A C C E P T A B L E   +' + points;
			break;
			case 'poor':
				message = 'P O O R';
				tint = 0xffa500;
			break;
			case 'inferior':
				message = 'I N F E R I O R ';
				tint = 0xff0000
			break;
		}

		this.banner.enter(this.game.height * .35, message, tint);
		this.indexes.scoreTotal.add(points);
		this.score.toCount(this.indexes.scoreTotal.value);
	}

}

export default Main;