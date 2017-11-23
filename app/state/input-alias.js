import RGBSplitFilter from 'fx/rgb-split-filter.js';
import ParticleDrift from 'fx/particle-drift.js';
import FadeTransition from 'fx/fade-transition.js';
import StateNavButton from 'menu/state-nav-button.js';
import ScoresSprites from 'config/scores-sprites.js';
import ScoreRequest from 'results/score-request.js';
import BitmapTextInput from 'display/text-input.js';
import SoftKeyboardSimple from 'display/soft-keyboard-simple.js';

class InputAlias extends Phaser.State {

	create(){
		this.game.camera.flash(0x000000, 500);
		
		//convenience accessors for plugins
		var layout = this.game.plugins.layout;
		var forge = this.game.plugins.forge;
		this.stats = this.game.plugins.stats;
		this.settings = this.game.plugins.settings;

		//FX
		this.game.stage.filters = null;
		var rgb = new RGBSplitFilter();
		new ParticleDrift(this.game, [rgb]);

		//header
		var header = forge.bitmapText(ScoresSprites.ALIAS_HEADER, '50%', '10%', 'Modeka');
		var subtitle = forge.bitmapText(ScoresSprites.ALIAS_SUBTITLE, '50%', '17%', 'Modeka');
		
		//Header reveal	
		new FadeTransition({ game: this.game, duration: 1500, enterSlideY: 100, items: [header] }).enter();
		new FadeTransition({ game: this.game, duration: 2000, enterSlideY: 100, items: [subtitle] }).enter();

		//Warning text
		this.inputValid = false;
		this.warning = forge.bitmapText(ScoresSprites.ALIAS_WARNING, '50%', '30%', 'Modeka');

		//Text input
		this.textInput = new BitmapTextInput(this.game, layout.ratioX(50), layout.ratioY(35), 'Modeka', 100, 'left');
		this.textInput.alphanumericOnly = true;
		this.textInput.capsOnly = true;
		this.textInput.charLimit = 6;

		//Soft keybaord
		var softKeyboard = new SoftKeyboardSimple(this.game, {
			texture: 'menu',
			frame: 'key',
			y: layout.ratioY(50)
		});

		softKeyboard.show();
		softKeyboard.onKeyPressed.add((letter) => {
			this.textInput.forceKeyDown(letter);
		});

		//Nav Buttons
		this.submitBtn = new StateNavButton(this.game, 'Leaderboard', 'Submit >>', 'right', 500);
		this.submitBtn.onBeforeGoToState = this.beforeGoToState.bind(this);

	}

	beforeGoToState(){
		if (this.inputValid)
			return true;
		else
			this.validateInitials();

		return false;
	}

	validateInitials(){
		if (this.textInput.text.length < 2){
			this.showInputWarning();
		} else{
			var scoreRequest = new ScoreRequest();
			var prom = scoreRequest.sendScore(this.settings.getGUID(), this.textInput.text, this.stats.getSession('score'));
					prom.then(() => {
							this.inputValid = true;
							this.submitBtn.goToState();
					});
		}
	}

	showInputWarning(){
		var warning = new FadeTransition({ 
			game: this.game, 
			duration: 2000, 
			enterSlideY: 100, 
			items: [this.warning] 
		}).enter(() => {
				warning.exit();
		});
	}

}

export default InputAlias;