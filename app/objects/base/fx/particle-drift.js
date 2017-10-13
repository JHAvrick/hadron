class ParticleDrift {
	constructor(game, filters){
		//Particle emmitter from bottom of the stage
		this.bottomEmitter = game.add.emitter(0, game.height + 100, 200);
		this.bottomEmitter.makeParticles(['menu'], ['confettiOne', 'confettiTwo', 'confettiThree']);
		this.bottomEmitter.setAlpha(.7, 0, 10000);
		this.bottomEmitter.setScale(1, 0.1, 1, 0.1, 10000, Phaser.Easing.Quintic.Out);
		this.bottomEmitter.minParticleSpeed.set(350, -350);
		this.bottomEmitter.width = game.width * 2;
		this.bottomEmitter.gravity = -200;
		this.bottomEmitter.start(false, 5000, 20);

		if (filters) this.bottomEmitter.filters = filters;
		
	}
}

export default ParticleDrift;