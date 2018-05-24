import Animations from 'config/animations.js';

class TapEffect extends Phaser.Sprite {
	constructor(game){
		super(game, 0, 0, 'menu', 'tapRing');
		this.game = game;
		this.anchor.setTo(.5,.5);
        this.alpha = 0;

        this.game.input.onDown.add(() => {
            let pointer = this.game.input.activePointer;
            this.play(pointer.x, pointer.y);
        });

		this.game.add.existing(this);
    }
    
    play(x, y){
        this.alpha = 1;
        this.scale.x = .1;
        this.scale.y = .1;
        this.x = x;
        this.y = y;
        this.game.add.tween(this.scale).to({ x: 1, y: 1 }, 650, Phaser.Easing.Quartic.Out, true);
        this.game.add.tween(this).to({ alpha: 0 }, 650, Phaser.Easing.Quartic.Out, true);
    }

}

export default TapEffect;