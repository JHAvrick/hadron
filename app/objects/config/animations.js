const playerFrames = Phaser.Animation.generateFrameNames('player_', 0, 12, '', 2);
const hexFrames = Phaser.Animation.generateFrameNames('hex_', 0, 12, '', 2);
const orbFrames = Phaser.Animation.generateFrameNames('orb_', 0, 12, '', 2);
const cubeFrames = Phaser.Animation.generateFrameNames('cube_', 0, 12, '', 2);
const triFrames = Phaser.Animation.generateFrameNames('tri_', 0, 12, '', 2);

//const containerFrames = Phaser.Animation.generateFrameNames('container_', 0, 12, '', 2);
//const glitchFrames = Phaser.Animation.generateFrameNames('void_', 0, 12, '', 2);

//this.containerFrames = containerFrames.concat(containerFrames.slice().reverse());
//this.glitchFrames = Phaser.ArrayUtils.shuffle(glitchFrames.concat(glitchFrames.slice().reverse()));

const Animations = {
	PLAYER: {
		name: 'glow',
		loop: true,
		speed: 15,
		frames: playerFrames.concat(playerFrames.slice().reverse())
	},

	ORB_GLOW: {
		name: 'orbGlow',
		loop: true,
		speed: 25,
		frames: orbFrames.concat(orbFrames.slice().reverse())
	},

	HEX_GLOW: {
		name: 'hexGlow',
		loop: true,
		speed: 25,
		frames: hexFrames.concat(hexFrames.slice().reverse())
	},

	CUBE_GLOW: {
		name: 'cubeGlow',
		loop: true,
		speed: 25,
		frames: cubeFrames.concat(cubeFrames.slice().reverse())
	},

	TRI_GLOW: {
		name: 'triGlow',
		loop: true,
		speed: 25,
		frames: triFrames.concat(triFrames.slice().reverse())
	},

	SPECIAL_GLOW: {
		name: 'specialGlow',
		loop: true,
		speed: 15,
		frames: Phaser.Animation.generateFrameNames('specialOrb_', 0, 15, '', 2)
	},

	COLOR_BLOB: {
		name: 'glow',
		loop: true,
		speed: 15,
		frames: Phaser.Animation.generateFrameNames('colorBlob_', 0, 15, '', 2)
	}
}

export default Animations;