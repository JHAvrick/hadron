import LayoutManager from 'util/layout-manager.js';
import AudioManager from 'util/audio-manager.js';
import AndroidAudioManager from 'util/android-audio-manager.js';
import SpriteForge from 'util/sprite-forge.js';
import SettingsManager from 'util/settings-manager.js';
import StatsManager from 'util/stats-manager.js';
import CameraShake from 'fx/camera-shake.js';
import ScoreRequest from 'results/score-request.js';

class Preload extends Phaser.State {

	init(){
		//Add plugins
		this.game.plugins.layout = this.game.plugins.add(new LayoutManager(this.game));
		this.game.plugins.forge = this.game.plugins.add(new SpriteForge(this.game));
		this.game.plugins.shake = this.game.plugins.add(new CameraShake(this.game));
		this.game.plugins.settings = this.game.plugins.add(new SettingsManager(this.game, 'hadronSettings'));
		this.game.plugins.stats = this.game.plugins.add(new StatsManager(this.game, 'hadronStats'));
		this.game.plugins.audio = window.device && window.device.platform === "Android" ? 
								  this.game.plugins.add(new AndroidAudioManager(this.game)) :
								  this.game.plugins.add(new AudioManager(this.game));

		this.game.plugins.settings.default({
			muted: false,
			showTutorial: true
		});

		//this.game.plugins.stats.clearStore();
		this.game.plugins.stats.addStats({
			orbs: 0,
			waves: 0,
			recharges: 0,
			score: 0
		});
		
		//Loading status label
		let style = { font: "30px Arial", fill: "#ffffff", align: "center" };
		this.loadingLabel = this.game.add.text(this.game.world.centerX, this.game.world.centerY, "L O A D I N G  F I L E S . . .", style);
		this.loadingLabel.anchor.setTo(.5, .5);
	}


	preload(){
		
		//Load stuff
		this.game.load.bitmapFont('Modeka', 'assets/font/modeka.png', 'assets/font/modeka.xml');
		this.game.load.atlas('menu', 'assets/sprites/menu.png', 'assets/sprites/menu.json');
		this.game.load.atlas('gradients', 'assets/sprites/gradients.png', 'assets/sprites/gradients.json');
		this.game.load.atlas('sprites', 'assets/sprites/sprites.png', 'assets/sprites/sprites.json');
		this.game.load.atlas('misc', 'assets/sprites/misc.png', 'assets/sprites/misc.json');
		this.game.load.atlas('tracks', 'assets/sprites/tracks.png', 'assets/sprites/tracks.json');
		this.game.load.atlas('results', 'assets/sprites/results.png', 'assets/sprites/results.json');

		/*
		 * Audio asset loading is handled by the AudioManager plugin to accomodate
		 * different platforms.
		 */
		let audioManager = this.game.plugins.audio;
			audioManager.loadMusic({
				coldwire: ['assets/audio/coldwire.ogg', 'assets/audio/coldwire.mp3'],
				bluewave: ['assets/audio/bluewave.ogg', 'assets/audio/bluewave.mp3'],
			});

			audioManager.loadFX({
				success: ['assets/audio/success.ogg', 'assets/audio/success.mp3'],
				move: ['assets/audio/move.ogg', 'assets/audio/move.mp3'],
				recharge: ['assets/audio/recharge.ogg', 'assets/audio/recharge.mp3'],
				miss: ['assets/audio/miss.ogg', 'assets/audio/miss.mp3'],
				hitOne: ['assets/audio/hit_one.ogg', 'assets/audio/hit_one.mp3'],
				hitTwo: ['assets/audio/hit_two.ogg', 'assets/audio/hit_two.mp3'],
				hitThree: ['assets/audio/hit_three.ogg', 'assets/audio/hit_three.mp3'],
				hitFour: ['assets/audio/hit_four.ogg', 'assets/audio/hit_four.mp3'],
				hitFive: ['assets/audio/hit_five.ogg', 'assets/audio/hit_five.mp3'],
				hitSix:  ['assets/audio/hit_six.ogg', 'assets/audio/hit_six.mp3'],
				hitSeven: ['assets/audio/hit_seven.ogg', 'assets/audio/hit_seven.mp3'],
				hitEight: ['assets/audio/hit_eight.ogg', 'assets/audio/hit_eight.mp3'],
				gameover: ['assets/audio/gameover.ogg', 'assets/audio/gameover.mp3']
			});

		this.game.load.onLoadComplete.addOnce(() => {
			this.loadingLabel.setText("D E C O D I N G   A U D I O...");
		});

	}

	create(){
		let audioManager = this.game.plugins.audio;
		audioManager.onDecoded('coldwire', () => {
			audioManager.mute = this.game.plugins.settings.get('muted');
			this.game.state.start('Menu');
		});
	}

}

export default Preload;