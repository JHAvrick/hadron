import RGBSplitFilter from 'fx/rgb-split-filter.js';
import ParticleDrift from 'fx/particle-drift.js';
import StatsDisplay from 'results/stats-display.js';
import FadeTransition from 'fx/fade-transition.js';
import ScoresSprites from 'config/scores-sprites.js';
import TapEffect from 'main/tap-effect.js';
import StateNavButton from 'menu/state-nav-button.js';
import ScoreRequest from 'results/score-request.js';

class Scores extends Phaser.State {

	create(){
		this.game.camera.flash(0x000000, 500);

		//convenience accessors for plugins
		var layout = this.game.plugins.layout;
		var forge = this.game.plugins.forge;
		var stats = this.game.plugins.stats;

		//FX
		var rgb = new RGBSplitFilter();
		new ParticleDrift(this.game, [rgb]);

		this.statsDisplay = new StatsDisplay(this.game, true);
		this.statsDisplay.reveal(null, true); 

		//Effect when player taps
		let tapEffect = new TapEffect(this.game);

		//Labels
		var header = forge.bitmapText(ScoresSprites.BEST_HEADER, '50%', '10%', 'Modeka');
		
		//Fetch rank and display when ready
		var scoreRequest = new ScoreRequest();
				scoreRequest.fetchRank(stats.getBest('score')).then((rank) => {
					if (this.game.state.current != "Scores") return;
				
					var rankLabel = forge.bitmapText(ScoresSprites.RANK_LABEL, '50%', '75%', 'Modeka');
					let actualRank = rank === 0 ? 1 : rank;

					rankLabel.setText("Ranked at: " + (actualRank) + this.nth(actualRank));

					new FadeTransition({
						game: this.game,
						duration: 1000,
						enterSlideY: 50,
						items: [rankLabel]
					}).enter();

		}).catch(() => {
			console.warn("Failed to fetch rank");
		});

		//Nav buttons
		var exitBtn = new StateNavButton(this.game, 'Menu', '<< Menu', 'left', 500);
		var leaderboardBtn = new StateNavButton(this.game, 'Leaderboard', 'Leaderboard >>', 'right', 500);
	
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

export default Scores;