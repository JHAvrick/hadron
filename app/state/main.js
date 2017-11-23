import RampEngine from 'util/ramp-engine.js';
import RampModel from 'main/ramp-model.js';
import RGBSplitFilter from 'fx/rgb-split-filter.js';
import FadeTransition from 'fx/fade-transition.js';
import CollectBurst from 'main/collect-burst.js';
import PointIndicator from 'display/point-indicator.js';
import BitmapTextCounter from 'display/bitmaptext-counter.js';
import Bumper from 'main/bumper.js';
import TrackBoard from 'main/track-board.js';
import Player from 'main/player.js';
import ParticlePool from 'main/particle-pool.js';
import ParticleSequencer from 'main/particle-sequencer.js';
import ParticleCollider from 'main/particle-collider.js';
import ShapeColorIndicator from 'main/shape-color-indicator.js';
import LifeIndicator from 'main/life-indicator.js';
import PauseMenu from 'main/pause-menu.js';
import WaveRater from 'main/wave-rater.js';
import TopTenCheck from 'main/top-ten-check.js';

class Main extends Phaser.State {

	init(){
		this.stats = this.game.plugins.stats;
		this.layout = this.game.plugins.layout; //convenience accessors for plugins
		this.audio = this.game.plugins.audio;
		this.forge = this.game.plugins.forge;
		this.shake = this.game.plugins.shake;

		//State
		this.gameIsPaused = false;
		this.gameIsOver = false; //holds the color/shape rules for a given wave
	}

	create(){
		this.game.camera.flash(0x000000, 2000);

		/*
			---------------------------------------- AUDIO ------------------------------------------
		*/
		this.audio.addAudioGroup('hits', ['hitOne', 'hitTwo', 'hitThree', 'hitFour', 'hitFive', 'hitSix','hitSeven','hitEight']);
		this.audio.music('bluewave', true);

		/*
			---------------------------------------- FX ---------------------------------------------
		*/
		this.game.stage.filters = [new RGBSplitFilter({x: 2, y: 2}, {x: 1, y: -1}, {x: -1, y: 2})];
		this.invalidBurstFX = new CollectBurst(this.game); //tint is red by default
		this.validBurstFX = new CollectBurst(this.game);
		this.validBurstFX.tintMode = 'random';

		/*
			----------------------------- Core Game Objects -----------------------------------------
		*/
		this.pauseMenu = new PauseMenu(this.game, this.handlePause.bind(this), this.handleResume.bind(this));
		this.pauseMenu.bgAlpha = .8;

		this.rater = new WaveRater(this.handleWaveRating.bind(this));
		this.points = new PointIndicator(this.game);
		this.ramp = new RampEngine(RampModel); //handles increasing difficulty and game logistics
		this.board = new TrackBoard(this.game); //handles placement of player and particles
		this.pool = new ParticlePool(this.game, 50, this.board); //holds the reusable particles
		this.sequencer = new ParticleSequencer(this.game, this.board, this.ramp, this.pool); //parses and spawns particles
		this.collider = new ParticleCollider(this.game);
		this.player = new Player(this.game, this.board); //the user-controlled player
		this.indicator = new ShapeColorIndicator(this.game);
		this.meter = new LifeIndicator(this.game);
		this.topTenCheck = new TopTenCheck();
		this.score = new BitmapTextCounter(this.game, this.game.width - 10, this.game.height - 5, 'Modeka', '000000', 50);
		this.score.anchor.setTo(1, 1);
		this.score.usePadding("00000");

		//Bumpers trigger events when an orb has not been collected by the player
		this.topBumper = new Bumper(this.game, this.layout.ratioX(50), this.layout.ratioY(25));
		this.bottomBumper = new Bumper(this.game, this.layout.ratioX(50), this.layout.ratioY(75));

		/*
			-------------------------------------- Events / Subscriptions --------------------------
		*/
		this.player.onMove.add(this.board.flash, this.board); //flash effect on player move

		//Collision events
		this.collider.collide(this.player.proxy, this.pool, this.handlePlayerHit.bind(this));
		this.collider.collide(this.topBumper, this.pool, this.handleTopBumperHit.bind(this));
		this.collider.collide(this.bottomBumper, this.pool, this.handleBottomBumperHit.bind(this));
		
		//Ramp events
		this.ramp.on('stabilityMeterEmpty', this.gameOver.bind(this));
		this.ramp.on('waveCleared', this.endWave.bind(this));

		/*
			-------------------------------------- Reveal ------------------------------------------
		*/

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
		this.indicator.enter(seq.rules.shape, seq.rules.color, () => {
			this.audio.play('success', false, 0.4);
			this.sequencer.start();
		});
	}

	endWave(){
		this.indicator.exit();

		//End and clear the sequence, increase the difficulty level
		this.sequencer.end();
		this.pool.clearExisting();
		this.ramp.increment('difficultyStepTrigger');

		//Update pause menu stats
		this.pauseMenu.setWaveCount(this.ramp.value('wavesTotal'));
		
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

		//
		this.audio.play('gameover');

		this.audio.fadeOut('bluewave', 1900);
		this.shake.start(1000);
		this.game.camera.fade(0xff0000, 2500);
		this.game.camera.onFadeComplete.addOnce(() => {
				this.shake.reset();

				//If the player scored in the top ten, go to InputAlias page
				if (this.topTenCheck.isTopTen(this.ramp.value('scoreTotal')))
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

		this.ramp.increment('currentOrbsCleared');
		this.ramp.increment('scoreTotal', 10);
		this.ramp.increment('orbsTotal');
		this.score.toCount(this.ramp.value('scoreTotal')); //add to score label
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

		this.ramp.decrement('scoreTotal', 20);
		this.ramp.decrement('stabilityCount', 4);
		this.meter.life = this.ramp.value('stabilityCount') - 1;
		this.score.toCount(this.ramp.value('scoreTotal')); //add to score label
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
		this.ramp.increment('stabilityCount', 1);
		this.ramp.increment('scoreTotal', 25);
		this.ramp.increment('rechargeTotal');

		//For rating
		this.rater.rechargeCollected();

		//Change HUD
		this.score.toCount(this.ramp.value('scoreTotal')); //add to score label
		this.meter.life = this.ramp.value('stabilityCount') - 1; //health meter increase
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
		this.gameIsPaused = true;
		this.player.isPaused = true;
		this.pool.pause();
		this.sequencer.pause();
	}

	handleResume(){
		this.gameIsPaused = false;
		this.player.isPaused = false;
		this.pool.resume();
		this.sequencer.resume();
	}

	updateScores(){
		this.stats.setStats({
			orbs: this.ramp.value('orbsTotal'),
			waves: this.ramp.value('wavesTotal'),
			recharges: this.ramp.value('rechargeTotal'),
			score: this.ramp.value('scoreTotal')
		});
	}

	handleWaveRating(rating){
		var message = ''
		var points = 0;
		switch (rating){
			case 'perfect':
				message = 'P E R F E C T \n' + '+ 5 0';
				points = 50;
			break;
			case 'good':
				message = 'G O O D \n' + '+ 2 5';
				points = 25;
			break;
			case 'acceptable':
				message = 'A C C E P T A B L E \n' + '+ 1 0';
				points = 10;
			break;
			case 'poor':
				message = 'P O O R \n';
			break;
			case 'inferior':
				message = 'I N F E R I O R \n';
			break;
		}

		this.ramp.increment('scoreTotal', points);
		this.score.toCount(this.ramp.value('scoreTotal')); //add to score label
		this.points.show(this.game.world.centerX, this.layout.ratioY(40), message, 3000);
	}

}

export default Main;