class CollectBurst extends Phaser.Particles.Arcade.Emitter {
	constructor(game){
		super(game, 0, 0, 50);
		this.game = game;

		this.emitter = this.game.add.emitter(0, 0, 100);
    this.makeParticles(['sprites'], ['confettiOne', 'confettiTwo', 'confettiThree']);
		this.setScale(1, 0.1, 1, 0.1, 10000, Phaser.Easing.Quintic.Out);
		this.minParticleSpeed.set(-150, -1000);
		this.gravity = -300;
		this.width = 100;

		this.tintMode = 'damage';
		this.tint =  0xff0000;
	}

	set tint(tint){
		this.setAll('tint', tint);
	}

	update(){
		if (this.tintMode === 'random')
			this.setAll('tint', Phaser.Color.getRandomColor(), true, true);
	}

	burstUp(x, y){
		this.x = x;
		this.y = y;

		this.minParticleSpeed.set(-150, -1000);
		this.gravity = -300;

		this.start(true, 2000, null, 10);		
	}

	burstDown(x, y){
		this.x = x;
		this.y = y;

		this.minParticleSpeed.set(-150, 1100);
		this.gravity = 300;

		this.start(true, 2000, null, 10);		
	}

	burst(x, y){
		this.x = x;
		this.y = y;

		this.minParticleSpeed.set(-150, -1000);
		this.gravity = 0;

		this.start(true, 2000, null, 10);	
	}

}

export default CollectBurst;