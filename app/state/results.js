import RGBSplitFilter from 'fx/rgb-split-filter.js';
import ParticleDrift from 'fx/particle-drift.js';
import StatsDisplay from 'results/stats-display.js';
import FadeTransition from 'fx/fade-transition.js';
import ResultsSprites from 'config/results-sprites.js';
import StateNavButton from 'menu/state-nav-button.js';

import ScoreRequest from 'results/score-request.js';

class Results extends Phaser.State {

	create(){
		this.game.camera.flash(0x660000, 1000);

		//convenience accessors for plugins
		var layout = this.game.plugins.layout;
		var forge = this.game.plugins.forge;
		var settings = this.game.plugins.settings;
		var stats = this.game.plugins.stats;


		//FX
		var rgb = new RGBSplitFilter();
		new ParticleDrift(this.game, [rgb]);

		//Main stats display
		this.statsDisplay = new StatsDisplay(this.game);
		this.statsDisplay.reveal(); 

		var scoreRequest = new ScoreRequest();
				scoreRequest.sendScore(settings.getGUID(), 'ANN', stats.getSession('score'));
				scoreRequest.fetchRank(stats.getSession('score')).then((rank) => {
					if (this.game.state.current != "Results") return;
					
					//Label if the score fetch is successful
					var header = forge.bitmapText(ResultsSprites.HEADER, '50%', '10%', 'Modeka');
							header.setText("You ranked " + (rank + 1) + this.nth(rank + 1));

					new FadeTransition({
						game: this.game,
						duration: 1000,
						enterSlideY: -30,
						items: [header]
					}).enter();

				}).catch(() => {
					if (this.game.state.current != "Results") return;

					//Label if the score fetch is not succesful
					var header = forge.bitmapText(ResultsSprites.HEADER, '50%', '10%', 'Modeka');
							header.setText("S I M --terminated");

					new FadeTransition({
						game: this.game,
						duration: 1000,
						enterSlideY: -30,
						items: [header]
					}).enter();

				});

		//Nav Buttons
		var exitBtn = new StateNavButton(this.game, 'Menu', '<< Menu', 'left', 500);
		var againBtn = new StateNavButton(this.game, 'Main', 'Reboot >>', 'right', 500);

	}

	//NOT WRITTEN BY ME
	//CREDIT TO: https://stackoverflow.com/questions/15397372/javascript-new-date-ordinal-st-nd-rd-th
	nth(d) {
		if(d>3 && d<21) return 'th'; // thanks kennebec
		switch (d % 10) {
			case 1:  return "st";
			case 2:  return "nd"; 
			case 3:  return "rd";
			default: return "th";
		}
	} 

}


export default Results;