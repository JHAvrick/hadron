import RampEngine from 'util/ramp-engine.js';


//------------------------------------------CONTROL VARIABLES-----------------------------------------

const orbsPerWave = 6; //Wraps on the seventh

//Total # of waves is the product of the two variables below
const difficultySteps = 40; //Total number of times the difficulty can be raised
const raiseDiffucltyAfterWaves = 1; //Number of waves before progressing difficulty, wraps on the 2nd

const easing = RampEngine.EaseValue.Easing.easeInOutQuad;

const RampModel = {
	values: {

		//-------------------------------- BEST COUNTS ---------------------------------------

		//-------------------------------- SCORE COUNTS ------------------------------------

		//The total number of orbs that have been cleared during this match
		orbsTotal: {
			type: RampEngine.NormalValue,
			value: 0
		},

		//Keeps track of how many recharge orbs are collected over the course of a game
		rechargeTotal: {
			type: RampEngine.NormalValue,
			value: 0
		},

		//The number of orbs that have been cleared during this wave
		scoreTotal: {
			type: RampEngine.ClampValue,
			value: 0,
			min: 0,
			max: Infinity,
			step: 10
		},

		//The number of orbs that have been cleared during this wave
		wavesTotal: {
			type: RampEngine.NormalValue,
			value: 0,
			step: 1
		},

		//-------------------------------- STATE COUNTS -----------------------------------

		//The number of orbs that have been cleared during this wave
		currentOrbsCleared: {
			type: RampEngine.WrapValue,
			snapToBounds: true,
			value: 0,
			min: 0,
			max: orbsPerWave
		},

		//Life meter count, when this reaches zero the player loses
		stabilityCount: {
			type: RampEngine.ClampValue,
			value: 20,
			step: 1,
			min: 1,
			max: 20
		},

		//----------------------- DIFFICULTY TRIGGERS --------------------------

		//Incremented every new wave, triggers a difficulty-raising event when it wraps
		difficultyStepTrigger: {
			type: RampEngine.WrapValue,
			snapToBounds: true,
			min: 0,
			max: raiseDiffucltyAfterWaves  //wrap is 0-based, but for readability the variable up top is 1-based
		},

		//Incremented By: difficultyStepTrigger
		//Increments: the patternBankIndex whenever it is divisible by four
		patternIncrementor: {
			type: RampEngine.DivisibleValue,
			divisor: 4,
			value: 0
		},

		patternBankIndex: {
			type: RampEngine.ClampValue,
			value: 1,
			min: 1,
			max: 5
		},

		//----------------------- DIFFICULTY VALUES --------------------------
		minOrbSpeed: {
			type: RampEngine.EaseValue,
			start: 25,
			end: 100,
			steps: difficultySteps,
			easing: easing
		},

		maxOrbSpeed: {
			type: RampEngine.EaseValue,
			start: 35,
			end: 125,
			steps: difficultySteps,
			easing: easing
		},

		orbSpawnInterval: {
			type: RampEngine.EaseValue,
			start: 700,
			end: 600,
			steps: difficultySteps,
			easing: easing
		}
	},

	//-------------------------------- EVENTS -------------------------------------
	events: {

		//This event triggers an increment to the difficulty trigger
		waveCleared:{
			trigger: 'currentOrbsCleared',
			event: 'onWrap',
			increment: ['difficultyStepTrigger', 'wavesTotal']
		},

		//This is triggered when the difficulty trigger reachs its wrap value
		raiseDifficulty:{
			trigger: 'difficultyStepTrigger',
			event: 'onWrap', 
			increment: ['patternIncrementor', 'minOrbSpeed', 'maxOrbSpeed', 'orbSpawnInterval']
		},

		//The pattern bank index is read by the sequencer to choose the correct bank
		nextPatternBank: {
			trigger: 'patternIncrementor',
			event: 'onDivisible',
			increment: ['patternBankIndex']
		},

		//This is triggered when the player has collected enough recharge orbs to gain a life
		stabilityMeterEmpty:{
			trigger: 'stabilityCount',
			event: 'onMinClamp'
		}
		
	}

}

export default RampModel;