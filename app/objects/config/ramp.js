import DifficultyRamp from 'math/difficulty-ramp.js';

const Ramp = new DifficultyRamp();
			Ramp.addValue('minSpeed', 20, 45);
			Ramp.addValue('maxSpeed', 30, 55);
			Ramp.addValue('uniformSpeed', 27, 49);
			Ramp.addValue('spawnInterval', 700, 400);

export default Ramp;