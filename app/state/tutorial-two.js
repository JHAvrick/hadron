import TutorialSprites from 'config/tutorial-sprites.js';
import FadeTransition from 'fx/fade-transition.js';
import RGBSplitFilter from 'fx/rgb-split-filter.js';
import ParticleDrift from 'fx/particle-drift.js';
import Animations from 'config/animations.js';
import StateNavButton from 'menu/state-nav-button.js';
import FerrisWheel from 'display/ferris-wheel.js';

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
		let tri = forge.sprite(TutorialSprites.TRI, '40%', '45%', 'sprites', 'triShape');
		let orb = forge.sprite(TutorialSprites.ORB, '60%', '45%', 'sprites', 'orbShape');
		let cube = forge.sprite(TutorialSprites.CUBE, '80%', '45%', 'sprites', 'cubeShape');

		var wheel = new FerrisWheel(this.game, layout.ratioX(50), layout.ratioY(60), 150, .010);
				wheel.addAll([hex, tri, orb, cube]);

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

		FadeTransition.chainEnter([this.header, this.goalTwo /*, this.specificColors, this.goalThree, this.anyColors */]);

		const returnState = this.game.device.desktop ? 'TutorialOneDesktop' : 'TutorialOne';
		let backBtn = new StateNavButton(this.game, returnState, '<< Back', 'left', 500);
		let nextBtn = new StateNavButton(this.game, 'TutorialThree', 'Next >>', 'right', 500);

	}

}

class OrbExamplesDisplay extends Phaser.Sprite {
	constructor(game, cx, cy, radians, radius){
		super(game, )
		this.game = game;
		this.anchor.setTo(.5, .5);

		this.CX = cx;
		this.CY = cy;



	}

	update(){
		this.x = this.CX + (Math.sin(this.radians) * this.radius); //Update position
		this.y = this.CY + (Math.cos(this.radians) * this.radius);
		this.radians += this.speed; //Update speed	
	}



}


export default TutorialTwo;

