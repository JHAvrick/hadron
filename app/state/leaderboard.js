import RGBSplitFilter from 'fx/rgb-split-filter.js';
import ParticleDrift from 'fx/particle-drift.js';
import FadeTransition from 'fx/fade-transition.js';
import ScoresSprites from 'config/scores-sprites.js';
import StateNavButton from 'menu/state-nav-button.js';
import ScoreRequest from 'results/score-request.js';
import LeadersList from 'results/leaders-list.js';

class Leaderboard extends Phaser.State {

	create(){
		this.game.camera.flash(0x000000, 500);
		
		//convenience accessors for plugins
		var layout = this.game.plugins.layout;
		var forge = this.game.plugins.forge;

		//FX
		this.game.stage.filters = null;
		var rgb = new RGBSplitFilter();
		new ParticleDrift(this.game, [rgb]);

		//Labels
		var header = forge.bitmapText(ScoresSprites.HEADER, '50%', '10%', 'Modeka');


		var scoreRequest = new ScoreRequest();
				scoreRequest.fetchTop().then((top) => {
					if (this.game.state.current != "Leaderboard") return; //If this state is no longer active, don't show results

					var leadersList = new LeadersList(this.game, top);

		}).catch(() => {
			console.warn("Failed to fetch top scores.");
			if (this.game.state.current != "Leaderboard") return;

			var failLabel = forge.bitmapText(ScoresSprites.FAIL_LABEL, '50%', '50%', 'Modeka');
			new FadeTransition({
				game: this.game,
				duration: 1000,
				enterSlideY: 50,
				items: [failLabel]
			}).enter();

		});


		//Nav Buttons
		var exitBtn = new StateNavButton(this.game, 'Menu', 'Menu >>', 'right', 500);
		var scoresBtn = new StateNavButton(this.game, 'Scores', '<< Best', 'left', 500);

	}

}

export default Leaderboard;