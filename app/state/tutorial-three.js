import TutorialSprites from 'config/tutorial-sprites.js';
import FadeTransition from 'fx/fade-transition.js';
import RGBSplitFilter from 'fx/rgb-split-filter.js';
import ParticleDrift from 'fx/particle-drift.js';
import Animations from 'config/animations.js';
import StateNavButton from 'menu/state-nav-button.js';

//This page shows the controls
class TutorialThree extends Phaser.State {
	create(){
		this.game.camera.flash(0x000000, 500);

		//convenience accessors for plugins
		var layout = this.game.plugins.layout;
		var forge = this.game.plugins.forge;	
		var audio = this.game.plugins.audio;
		

		//-------------------FX / AMBIENCE--------------------------------------------------------------------------------------------
		this.game.stage.filters = null;
		new ParticleDrift(this.game, [new RGBSplitFilter()]);

		/*	
				-------------------PAGE TWO-------------------------------------------------------------------------------------------------
				GOAL: 	"Collect the orbs of the indicated color or shape"
				----------------------------------------------------------------------------------------------------------------------------
		*/
		let goal = forge.bitmapText(TutorialSprites.GOAL_FOUR, '50%', '20%', 'Modeka');
		let recharge = forge.sprite(TutorialSprites.RECHARGE_INDICATOR, '50%', '50%', 'sprites');
									 forge.animation(Animations.SPECIAL_GLOW, recharge).play();

		this.pageThree = new FadeTransition({
			game: this.game, 
			duration: 1000,
			enterSlideX: layout.ratioX(75),
			items: [goal, recharge]
		}).enter();


		//Nav buttons
		let menuBtn = new StateNavButton(this.game, 'Menu', '<< Menu', 'left', 500);
				menuBtn.y = layout.ratioY(85);

		let backBtn = new StateNavButton(this.game, 'TutorialTwo', '<< Back', 'left', 500);
		let nextBtn = new StateNavButton(this.game, 'Main', 'Begin >>', 'right', 1000);
				nextBtn.events.onInputDown.add(() => {
					audio.fadeOut('coldwire', 900);
					this.pageThree.exit();
				});

		//If the tutorial has been viewed, don't show it before playing
		this.game.plugins.settings.set('showTutorial', false);
	}

}

export default TutorialThree;