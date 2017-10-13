import RGBSplitFilter from 'fx/rgb-split-filter.js';
import ParticleDrift from 'fx/particle-drift.js';
import StatsDisplay from 'results/stats-display.js';
import FadeTransition from 'fx/fade-transition.js';
import ResultsSprites from 'config/results-sprites.js';
import StateNavButton from 'menu/state-nav-button.js';

class Results extends Phaser.State {

	create(){
		//convenience accessors for plugins
		var layout = this.game.plugins.layout;
		var forge = this.game.plugins.forge;

		//FX
		var rgb = new RGBSplitFilter();
		new ParticleDrift(this.game, [rgb]);

		//Main stats display
		this.statsDisplay = new StatsDisplay(this.game);
		this.statsDisplay.reveal(); 

	
		//Labels
		var header = forge.bitmapText(ResultsSprites.HEADER, '50%', '10%', 'Modeka');

		//Nav Buttons
		var exitBtn = new StateNavButton(this.game, 'Menu', '<< Menu', 'left', 500);
		var againBtn = new StateNavButton(this.game, 'Main', 'Reboot >>', 'right', 500);

	}

}

export default Results;