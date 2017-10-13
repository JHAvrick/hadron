//This is a simple/niave collision plugin created after two hours of 
//trying to get Arcade Physics to work when IT SHOULD BE WORKING!
//This is made to fit hadron's requirements exactly, so no frills here...
//Perhaps ironically, but more like coincidentally, this class name has 
//the game's titular line in it...thematically at least...
//I guess the titular line would be if it was just called "hadron"
class ParticleCollider extends Phaser.Group {
	constructor(game){
		super(game);
		this.hasUpdate = true;

		this.game = game;
		this._isPaused = false;
		this._toCollide = [];
	}	

	pause(){ this._isPaused = true; }
	unpause(){ this._isPaused = false; }

	collide(sprite, phaserGroup, onCollide){
		this._toCollide.push({
			object: sprite,
			group: phaserGroup,
			callback: onCollide
		});
	}

	update(){
		if (this._isPaused) return;

		for (var i = 0; i < this._toCollide.length; i++){

			var object = this._toCollide[i].object;
			var group = this._toCollide[i].group;
			var callback = this._toCollide[i].callback;

			group.forEachExists((particle) => {
				if (!particle.collisionLocked){

					var boundsA = object.getBounds();
    			var boundsB = particle.getBounds();

    			if (Phaser.Rectangle.intersects(boundsA, boundsB)){
    				callback(particle);
    			}

				}
			}, this);

		}
	}

}

export default ParticleCollider;
