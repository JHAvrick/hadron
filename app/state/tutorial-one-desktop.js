import TutorialSprites from 'config/tutorial-sprites.js';
import FadeTransition from 'fx/fade-transition.js';
import RGBSplitFilter from 'fx/rgb-split-filter.js';
import ParticleDrift from 'fx/particle-drift.js';
import StateNavButton from 'menu/state-nav-button.js';
import TapEffect from 'main/tap-effect.js';

//This page shows the controls
class TutorialOneDesktop extends Phaser.State {
	create(){
		this.game.camera.flash(0x000000, 500);
		
		//convenience accessors for plugins
		var layout = this.game.plugins.layout;
		var forge = this.game.plugins.forge;	
		

		//-------------------FX / AMBIENCE--------------------------------------------------------------------------------------------
		this.game.stage.filters = null;
		new ParticleDrift(this.game, [new RGBSplitFilter()]);

		//Effect when player taps
		let tapEffect = new TapEffect(this.game);

		//Page one items
		let controls = forge.bitmapText(TutorialSprites.CONTROLS_DESKTOP, layout.ratioX(50), layout.ratioY(20), 'Modeka');

		let keyUp = forge.sprite(TutorialSprites.KEY_UP, layout.ratioX(50), layout.ratioY(40), 'menu', 'arrowKey');
		let keyLeft = forge.sprite(TutorialSprites.KEY_LEFT, layout.ratioX(25) - 10, layout.ratioY(57), 'menu', 'arrowKey');
		let keyDown = forge.sprite(TutorialSprites.KEY_DOWN, layout.ratioX(50), layout.ratioY(57), 'menu', 'arrowKey');
		let keyRight = forge.sprite(TutorialSprites.KEY_RIGHT, layout.ratioX(75) + 10, layout.ratioY(57), 'menu', 'arrowKey');
		
		//"Page" one enters automatically
		this.pageOne = new FadeTransition({ 
			game: this.game, 
			duration: 1000,
			enterSlideX: layout.ratioX(50),
			exitSlideX: -layout.ratioX(75),
			items: [controls, keyUp, keyDown, keyLeft, keyRight]
		}).enter();

		var menuBtn = new StateNavButton(this.game, 'Menu', '<< Menu', 'left', 500);
		var nextBtn = new StateNavButton(this.game, 'TutorialTwo', 'Next >>', 'right', 500);
				nextBtn.events.onInputDown.add(this.pageOne.exit, this.pageOne);

	}

}

export default TutorialOneDesktop;