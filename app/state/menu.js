import MenuSprites from 'config/menu-sprites.js'; //property configs for menu sprites
import MenuButton from 'menu/menu-button.js';
import AudioToggle from 'util/audio-toggle.js';

import FadeTransition from 'fx/fade-transition.js';
import ParticleDrift from 'fx/particle-drift.js';
import RGBSplitFilter from 'fx/rgb-split-filter.js';

class Menu extends Phaser.State {
	create(){
		//convenience accessors for plugins
		var layout = this.game.plugins.layout;
		var forge = this.game.plugins.forge;
		this.settings = this.game.plugins.settings;
		this.audio = this.game.plugins.audio;

		//Audio toggle
		this.audioToggle = new AudioToggle(this.game, 'menu', 'unmuted', 'muted');

		/*	-------------------FX / AMBIENCE--------------------------------------------------------------------------------------------
				RGB: 				A light RGB split for retro / low-fi effect
				PARTICLES: 	Upward drifting partcles, because it looks cool
				----------------------------------------------------------------------------------------------------------------------------
		*/
		var RGB = new RGBSplitFilter();
		this.game.stage.filters = [RGB];

		//background music
		this.audio.music('coldwire');

		//Particle drift effect
		new ParticleDrift(this.game, [RGB]);

		/*	-------------------TITLE REVEAL--------------------------------------------------------------------------------------------
				Title: 			Fades in and slides down by 20% of game height 
				Arc Left: 	Fades in and slides right by 10% of game width
				Arc Right: 	Fades in and slides left by 10% of game width
				----------------------------------------------------------------------------------------------------------------------------
		*/
		let titleRevealTime = 3000;
		var title = forge.sprite(MenuSprites.HIDDEN_CENTERED, layout.ratioX(50), layout.ratioY(25), 'menu', 'title');
		var arcLeft = forge.sprite(MenuSprites.ARC_LEFT, layout.ratioX(10), layout.ratioY(25), 'menu', 'arc');
		var arcRight = forge.sprite(MenuSprites.ARC_RIGHT, layout.ratioX(90), layout.ratioY(25), 'menu', 'arc');

		new FadeTransition({ game: this.game, duration: titleRevealTime, enterSlideY: -layout.ratioY(10), items: [title] }).enter(); //Title
		new FadeTransition({ game: this.game, duration: titleRevealTime, enterSlideX: -layout.ratioX(10), items: [arcLeft] }).enter(); //Arc left
		new FadeTransition({ game: this.game, duration: titleRevealTime, enterSlideX: layout.ratioX(10), items: [arcRight] }).enter(); //Arc right


		/*	-------------------BUTTON REVEAL--------------------------------------------------------------------------------------------
				Each button and the icon contained within fades upward and in
				----------------------------------------------------------------------------------------------------------------------------
		*/

		var playBtn = new MenuButton(this.game, layout.ratioX(80), layout.ratioY(60), 'dottedCircle', 'play', this.handleStartGame.bind(this));
		var tutorialBtn = new MenuButton(this.game, layout.ratioX(50), layout.ratioY(60), 'dottedCube', 'tutorial', this.handleStartTutorial.bind(this));
		var scoresBtn = new MenuButton(this.game, layout.ratioX(20), layout.ratioY(60), 'dottedHex', 'trophy', this.handleStartScores.bind(this));

		new FadeTransition({
			game: this.game, 
			duration: 2500,
			enterSlideY: layout.ratioY(10), 
			items: [tutorialBtn, playBtn, scoresBtn]
		}).enter(); 

	}

	handleStartGame(){
		//Fade camera to black and then start the next state
		this.audio.fadeOut('coldwire', 1400);
		this.game.camera.fade(0x000000, 1500);
		this.game.camera.onFadeComplete.addOnce(() => {

			if (this.settings.get('showTutorial'))
				this.game.state.start(this.game.device.desktop ? 'TutorialOneDesktop' : 'TutorialOne');
			 else 
				this.game.state.start('Main');
			
		});
	}

	handleStartTutorial(){
		this.game.camera.fade(0x000000, 1500);
		this.game.camera.onFadeComplete.addOnce(() => {
			this.game.state.start(this.game.device.desktop ? 'TutorialOneDesktop' : 'TutorialOne');
		});
	}

	handleStartScores(){
		this.game.camera.fade(0x000000, 1500);
		this.game.camera.onFadeComplete.addOnce(() => {
				this.game.state.start('Scores');
		});
	}

}

export default Menu;