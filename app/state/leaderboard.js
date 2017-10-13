import RGBSplitFilter from 'fx/rgb-split-filter.js';
import ParticleDrift from 'fx/particle-drift.js';
import StatsDisplay from 'results/stats-display.js';
import FadeTransition from 'fx/fade-transition.js';
import ScoresSprites from 'config/scores-sprites.js';
import StateNavButton from 'menu/state-nav-button.js';

class Leaderboard extends Phaser.State {

	create(){
		this.game.camera.flash(0x000000, 500);
		
		//convenience accessors for plugins
		var layout = this.game.plugins.layout;
		var forge = this.game.plugins.forge;

		//FX
		var rgb = new RGBSplitFilter();
		new ParticleDrift(this.game, [rgb]);

		//Labels
		var header = forge.bitmapText(ScoresSprites.HEADER, '50%', '10%', 'Modeka');

		//Nav Buttons
		var exitBtn = new StateNavButton(this.game, 'Menu', 'Menu >>', 'right', 500);
		var scoresBtn = new StateNavButton(this.game, 'Scores', '<< Best', 'left', 500);

	}

}

export default Leaderboard;