import TutorialSprites from 'config/tutorial-sprites.js';
import FadeTransition from 'fx/fade-transition.js';
import RGBSplitFilter from 'fx/rgb-split-filter.js';
import ParticleDrift from 'fx/particle-drift.js';
import Animations from 'config/animations.js';
import TapEffect from 'main/tap-effect.js';

class Tutorial extends Phaser.State {
	create(){
		//convenience accessors for plugins
		var layout = this.game.plugins.layout;
		var forge = this.game.plugins.forge;	
		

		//-------------------FX / AMBIENCE--------------------------------------------------------------------------------------------

		this.game.stage.filters = null;
		new ParticleDrift(this.game, [new RGBSplitFilter()]);

		//Effect when player taps
		let tapEffect = new TapEffect(this.game);

		/*
				-------------------PAGE ONE-------------------------------------------------------------------------------------------------
				CONTROLS: 	"Tap left or right to move"
				----------------------------------------------------------------------------------------------------------------------------
		*/
		//This button is on both pages, the label changes
		var nextButton = forge.sprite(TutorialSprites.NEXT_BUTTON, '70%', '90%', 'Modeka');
				nextButton.events.onInputDown.add(this.handleSwitchPage.bind(this)); //goes to next page

		//Page one items
		let controls = forge.bitmapText(TutorialSprites.CONTROLS, layout.ratioX(50), layout.ratioY(20), 'Modeka');
		let divider = forge.sprite(TutorialSprites.DIVIDER, layout.ratioX(50), layout.ratioY(50), 'menu', 'divider');
		let tapIcon = forge.sprite(TutorialSprites.TAP_ICON, layout.ratioX(25), layout.ratioY(50), 'menu', 'tap');
		let continueLabel = forge.bitmapText(TutorialSprites.CONTINUE_LABEL, layout.ratioX(70), layout.ratioY(90), 'Modeka');

		//"Page" one enters automatically
		this.pageOne = new FadeTransition({ 
			game: this.game, 
			duration: 1000,
			enterSlideX: layout.ratioX(50),
			exitSlideX: -layout.ratioX(75),
			items: [controls, divider, tapIcon, continueLabel]
		}).enter(() => {
			//After fade, move the tap icon back and forth a few times
			this.game.add.tween(tapIcon).to({ x: layout.ratioX(75) }, 750, Phaser.Easing.Quadratic.Out, true, 0, 0, true);

		}); 


		/*	
				-------------------PAGE TWO-------------------------------------------------------------------------------------------------
				GOAL: 	"Collect the orbs of the indicated color or shape"
				----------------------------------------------------------------------------------------------------------------------------
		*/
		let goal = forge.bitmapText(TutorialSprites.GOAL, '50%', '20%', 'Modeka');
		//let memo = forge.bitmapText(TutorialSprites.MEMO, '50%', '85%', 'Modeka');
		let playLabel = forge.bitmapText(TutorialSprites.PLAY_LABEL, '70%', '90%', 'Modeka');
		let shapeLabel = forge.bitmapText(TutorialSprites.SHAPE_LABEL, '60%', '40%', 'Modeka');
		let colorLabel = forge.bitmapText(TutorialSprites.COLOR_LABEL, '60%', '55%', 'Modeka');
		let rechargeLabel = forge.bitmapText(TutorialSprites.RECHARGE_LABEL, '60%', '70%', 'Modeka');
		let shape = forge.sprite(TutorialSprites.SHAPE_INDICATOR, '25%', '40%', 'sprites', 'hexShape');
		let color = forge.sprite(TutorialSprites.COLOR_INDICATOR, '25%', '55%', 'sprites', 'triShape');
		let recharge = forge.sprite(TutorialSprites.RECHARGE_INDICATOR, '25%', '70%', 'sprites');
									 forge.animation(Animations.SPECIAL_GLOW, recharge).play();

		this.pageTwo = new FadeTransition({
			game: this.game, 
			duration: 1000,
			enterSlideX: layout.ratioX(75),
			items: [goal, playLabel, shape, color, recharge, shapeLabel, colorLabel, rechargeLabel]
		});

	}

	//Navigates to pageTwo on first click
	//Goes to Main state on second click
	handleSwitchPage(){
		if (this.pageOne.isEntered) {

			this.pageOne.exit();
			this.pageTwo.enter();

		} else {

			if (!this.pageOne.isEntered){
				this.game.camera.fade(0x000000, 1000);
				this.game.camera.onFadeComplete.addOnce(() => {
						this.game.state.start('Main');
				});
			}

		}

	}

}

export default Tutorial;