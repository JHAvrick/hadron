import OverlayMenu from 'display/overlay-menu.js';
import PauseSprites from 'config/pause-sprites.js';
import ResumeButton from 'main/resume-button.js';
import AudioToggle from 'util/audio-toggle.js';

class PauseMenu extends OverlayMenu {
	constructor(game, onPuase = function(){}, onResume = function(){}){
		super(game, 'sprites', 'shadow');

		//Convenience accessors for plugins
		var layout = this.game.plugins.layout;
		var forge = this.game.plugins.forge;

		//Pause and resume callbacks
		this.onPause = onPuase;
		this.onResume = onResume;

		//The hamburger icon, NOT a part of the overlay menu
		this.hamburger = forge.sprite(PauseSprites.HAMBURGER, layout.fromEndX(10), 15, 'sprites', 'barIcon');
		this.hamburger.events.onInputDown.add(this.handlePause.bind(this));

		this.waveCount = forge.bitmapText(PauseSprites.LABEL_TEXT, '50%', '25%', 'Modeka');
		this.waveCount.setText("Wave: 1");

		//Menu items
		this.label = forge.bitmapText(PauseSprites.LABEL_TEXT, '50%', '15%', 'Modeka');
		this.resumeBtn = new ResumeButton(this.game, layout.ratioX(50), layout.ratioY(50), 'dottedCircle', 'play', this.handleResume.bind(this));

		//Add the items to this menu
		this.addAll([	this.label, 
									this.resumeBtn, 
									this.resumeBtn.icon, 
									this.waveCount,
									new AudioToggle(this.game, 'menu', 'unmuted', 'muted')
								]);
	}

	setWaveCount(count){
		this.waveCount.setText("Wave: " + count);
	}

	handlePause(){
		this.show();
		this.onPause();
	}

	//Hide the menu, trigger onResume callback
	handleResume(){
		this.hide();
		this.onResume(); //trigger callback
	}

}

export default PauseMenu;