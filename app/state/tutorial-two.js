import TutorialSprites from 'config/tutorial-sprites.js';
import FadeTransition from 'fx/fade-transition.js';
import RGBSplitFilter from 'fx/rgb-split-filter.js';
import ParticleDrift from 'fx/particle-drift.js';
import Animations from 'config/animations.js';
import StateNavButton from 'menu/state-nav-button.js';

//This page shows the controls
class TutorialTwo extends Phaser.State {
	create(){
		this.game.camera.flash(0x000000, 500);

		//convenience accessors for plugins
		var layout = this.game.plugins.layout;
		var forge = this.game.plugins.forge;	
		

		//-------------------FX / AMBIENCE--------------------------------------------------------------------------------------------
		this.game.stage.filters = null;
		new ParticleDrift(this.game, [new RGBSplitFilter()]);

		/*	
				-------------------PAGE TWO-------------------------------------------------------------------------------------------------
				GOAL: 	"Collect the orbs of the indicated color or shape"
				----------------------------------------------------------------------------------------------------------------------------
		*/
		let goal = forge.bitmapText(TutorialSprites.GOAL, '50%', '20%', 'Modeka');
		let goalTwo = forge.bitmapText(TutorialSprites.GOAL_TWO, '50%', '35%', 'Modeka');
		let goalThree = forge.bitmapText(TutorialSprites.GOAL_THREE, '50%', '60%', 'Modeka');

		let shapeLabel = forge.bitmapText(TutorialSprites.SHAPE_LABEL, '60%', '40%', 'Modeka');
		let colorLabel = forge.bitmapText(TutorialSprites.COLOR_LABEL, '60%', '55%', 'Modeka');
		let rechargeLabel = forge.bitmapText(TutorialSprites.RECHARGE_LABEL, '60%', '70%', 'Modeka');
		

		let hex = forge.sprite(TutorialSprites.HEX, '50%', '45%', 'sprites', 'hexShape');
		//let tri = forge.sprite(TutorialSprites.TRI, '40%', '45%', 'sprites', 'triShape');
		//let orb = forge.sprite(TutorialSprites.ORB, '60%', '45%', 'sprites', 'orbShape');
		//let cube = forge.sprite(TutorialSprites.CUBE, '80%', '45%', 'sprites', 'cubeShape');

		//let flashHex = forge.sprite(TutorialSprites.FLASH, '80%', '70%', 'sprites', 'hexShape');
		let flashTri = forge.sprite(TutorialSprites.FLASH, '50%', '70%', 'sprites', 'triShape');
		//let flashOrb = forge.sprite(TutorialSprites.FLASH, '40%', '70%', 'sprites', 'orbShape');
		//let flashCube = forge.sprite(TutorialSprites.FLASH, '20%', '70%', 'sprites', 'cubeShape');

		this.header = new FadeTransition({ game: this.game, duration: 1000,
			enterSlideX: layout.ratioX(75),
			exitSlideX: -layout.ratioX(75),
			items: [goal]
		});

		this.goalTwo = new FadeTransition({
			game: this.game, 
			duration: 1000,
			enterSlideX: -layout.ratioX(75),
			exitSlideX: layout.ratioX(75),
			items: [goalTwo]
		});

		this.specificColors = new FadeTransition({
			game: this.game, 
			duration: 1000,
			enterSlideX: layout.ratioX(75),
			exitSlideX: -layout.ratioX(75),
			items: [hex]
		});

		this.goalThree = new FadeTransition({
			game: this.game, 
			duration: 1000,
			enterSlideX: -layout.ratioX(75),
			exitSlideX: layout.ratioX(75),
			items: [goalThree]
		});

		this.anyColors = new FadeTransition({
			game: this.game, 
			duration: 1000,
			enterSlideX: layout.ratioX(75),
			exitSlideX: -layout.ratioX(75),
			items: [flashTri]
		});

		FadeTransition.chainEnter([this.header, this.goalTwo, this.specificColors, this.goalThree, this.anyColors]);

		const returnState = this.game.device.desktop ? 'TutorialOneDesktop' : 'TutorialOne';
		let backBtn = new StateNavButton(this.game, returnState, '<< Back', 'left', 500);
		let nextBtn = new StateNavButton(this.game, 'TutorialThree', 'Next >>', 'right', 500);
				//nextBtn.events.onInputDown.add(this.pageTwo.exit, this.pageTwo);

	}



}

export default TutorialTwo;