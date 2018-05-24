import TutorialSprites from 'config/tutorial-sprites.js';
import FadeTransition from 'fx/fade-transition.js';
import RGBSplitFilter from 'fx/rgb-split-filter.js';
import ParticleDrift from 'fx/particle-drift.js';
import StateNavButton from 'menu/state-nav-button.js';
import TapEffect from 'main/tap-effect.js';

//This page shows the controls
class TutorialOne extends Phaser.State {
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
		let controls = forge.bitmapText(TutorialSprites.CONTROLS, layout.ratioX(50), layout.ratioY(20), 'Modeka');
		let divider = forge.sprite(TutorialSprites.DIVIDER, layout.ratioX(50), layout.ratioY(50), 'menu', 'divider');
		let tapIcon = forge.sprite(TutorialSprites.TAP_ICON, layout.ratioX(25), layout.ratioY(50), 'menu', 'tap');

		var menuBtn = new StateNavButton(this.game, 'Menu', '<< Menu', 'left', 500);
		var nextBtn = new StateNavButton(this.game, 'TutorialTwo', 'Next >>', 'right', 500);

		//"Page" one enters automatically
		this.pageOne = new FadeTransition({ 
			game: this.game, 
			duration: 1000,
			enterSlideX: layout.ratioX(50),
			exitSlideX: -layout.ratioX(75),
			items: [controls, divider, tapIcon]
		}).enter(() => {
			//After fade, move the tap icon back and forth a few times
			this.game.add.tween(tapIcon).to({ x: layout.ratioX(75) }, 750, Phaser.Easing.Quadratic.Out, true, 0, 0, true);
		});

		nextBtn.events.onInputDown.add(this.pageOne.exit, this.pageOne);

	}

}

export default TutorialOne;