import "babel-polyfill";

import Boot from 'state/boot';
import Preload from 'state/preload';
import Menu from 'state/menu';
import Tutorial from 'state/tutorial';
import TutorialOneDesktop from 'state/tutorial-one-desktop';
import TutorialOne from 'state/tutorial-one';
import TutorialTwo from 'state/tutorial-two';
import TutorialThree from 'state/tutorial-three';
import Main from 'state/main';
import Results from 'state/results';
import Scores from 'state/scores';
import Leaderboard from 'state/leaderboard';
import InputAlias from 'state/input-alias';

const container = document.getElementById("game-container").getBoundingClientRect();
const windowAspectRatio = container.height / container.width;
const aspectRatio = windowAspectRatio < 1.5 ? 1.5 : windowAspectRatio;
const height = 1280;
const width = height / aspectRatio;
window.extraWidth = width > 720 ? width - 720 : 0;

var game = new Phaser.Game({
    width: width,
    height: height,
    renderer: Phaser.WEBGL,
    parent: 'game-container',
    transparent: false,
    antialias: true,
    scaleMode: Phaser.ScaleManager.SHOW_ALL
});

function onBoot() {
	game.state.add('Boot', Boot);
	game.state.add('Preload', Preload);
	game.state.add('Menu', Menu);
	game.state.add('Main', Main);
	game.state.add("Results", Results);
	game.state.add("TutorialOneDesktop", TutorialOneDesktop);
	game.state.add("TutorialOne", TutorialOne);
	game.state.add("TutorialTwo", TutorialTwo);
	game.state.add("TutorialThree", TutorialThree);
	game.state.add("Scores", Scores);
	game.state.add("Leaderboard", Leaderboard);
	game.state.add("InputAlias", InputAlias);
	game.state.start('Boot');
}

window.onload = function waitForDevice(){

	if (document.readyState === 'complete' || document.readyState === 'interactive'){
		 window.setTimeout(onBoot, 0);
	} else if (typeof window.cordova !== "undefined") {
		document.addEventListener('deviceready', onBoot, false);
	} else {
		document.addEventListener('DOMContentLoaded', this.onBoot, false);
		window.addEventListener('load', onBoot, false);
	}
	
}




