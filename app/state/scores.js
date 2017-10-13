import RGBSplitFilter from 'fx/rgb-split-filter.js';
import ParticleDrift from 'fx/particle-drift.js';
import StatsDisplay from 'results/stats-display.js';
import FadeTransition from 'fx/fade-transition.js';
import ScoresSprites from 'config/scores-sprites.js';

import StateNavButton from 'menu/state-nav-button.js';

class Scores extends Phaser.State {

	create(){
		this.game.camera.flash(0x000000, 500);

		//convenience accessors for plugins
		var layout = this.game.plugins.layout;
		var forge = this.game.plugins.forge;

		//FX
		var rgb = new RGBSplitFilter();
		new ParticleDrift(this.game, [rgb]);

		this.statsDisplay = new StatsDisplay(this.game, true);
		this.statsDisplay.reveal(null, true); 

		//Labels
		var header = forge.bitmapText(ScoresSprites.BEST_HEADER, '50%', '10%', 'Modeka');

		//Nav buttons
		var exitBtn = new StateNavButton(this.game, 'Menu', '<< Menu', 'left', 500);
		var leaderboardBtn = new StateNavButton(this.game, 'Leaderboard', 'Leaderboard >>', 'right', 500);
	
	}

}

export default Scores;