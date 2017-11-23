import Particle from 'main/particle.js';

class ParticlePool extends Phaser.Group {
	constructor(game, count, board){
		super(game);
		this.game = game;
		this.board = board;

		this.make(count || 0);
		this.active = [];

	}

	_handleParticleDead(particle){
		this.removeChild(particle);
		this.make(1);
	}

	make(count){
		for (var i = 0; i < count; i++){
			var newParticle = new Particle(this.game, this.board.CX, this.board.CY);
					newParticle.onDead.add(this._handleParticleDead, this);

			this.addChild(newParticle);
		}
	}

	pause(){
		this.callAllExists('pause', true);
	}

	resume(){
		this.callAllExists('resume', true);
	}

	clearExisting(){
		
		//Move particles into a new array so that this group isn't modified
		//during the operation (will cause some particles to be missed)
		var toRemove = []
		this.forEachExists((particle) => {
			toRemove.push(particle);
		});	

		//Make more particles for the quantity removed
		this.make(toRemove.length - 1);

		//Clear the particles
		toRemove.forEach((particle) => { particle.die(); });
		
	}

}

export default ParticlePool;