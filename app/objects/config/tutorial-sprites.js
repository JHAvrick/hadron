const TutorialSprites = {
	CONTROLS: {
		"alpha" : 0,
		"anchor.x" : .5,
		"anchor.y" : .5,
		"fontSize" : 76,
		"text" : "Tap left or right to move."
	},

	CONTROLS_DESKTOP: {
		"alpha" : 0,
		"anchor.x" : .5,
		"anchor.y" : .5,
		"fontSize" : 76,
		"text" : "Use the arrow keys to move."
	},

	KEY_UP: {
		"alpha" : 0,
		"anchor.x" : .5,
		"anchor.y" : .5
	},

	KEY_DOWN: {
		"alpha" : 0,
		"anchor.x" : .5,
		"anchor.y" : .5,
		"scale.y" : -1
	},

	KEY_LEFT: {
		"alpha" : 0,
		"anchor.x" : .5,
		"anchor.y" : .5,
		"angle" : -90,
		"tint" : 0x00ff00
	},

	KEY_RIGHT: {
		"alpha" : 0,
		"anchor.x" : .5,
		"anchor.y" : .5,
		"angle" : 90,
		"tint" : 0x00ff00
	},

	GOAL: {
		"alpha" : 0,
		"anchor.x" : .5,
		"anchor.y" : .5,
		"fontSize" : 56,
		"align": 'center',
		"text" : "Collect particles of the correct \n shape and/or color."
	},

	GOAL_TWO: {
		"alpha" : 0,
		"anchor.x" : .5,
		"anchor.y" : .5,
		"fontSize" : 56,
		"align": 'center',
		"text" : "The indicator will guide you."
	},

	GOAL_THREE: {
		"alpha" : 0,
		"anchor.x" : .5,
		"anchor.y" : .5,
		"fontSize" : 56,
		"align": 'center',
		"text" : ". . . or any color, when flashing"
	},

	GOAL_FOUR: {
		"alpha" : 0,
		"anchor.x" : .5,
		"anchor.y" : .5,
		"fontSize" : 56,
		"align": 'center',
		"text" : "Collect recharge orbs to \n restore stability."
	},

	DIVIDER: {
		"alpha" : 0,
		"anchor.x" : .5,
		"anchor.y" : .5
	},

	TAP_ICON: {
		"alpha" : 0,
		"anchor.x" : .5,
		"anchor.y" : .5
	},

	CONTINUE_LABEL: {
		"alpha" : 0,
		"anchor.x" : .5,
		"anchor.y" : .5,
		"fontSize" : 56,
		"text" : "C O N T I N U E >>"
	},

	PLAY_LABEL: {
		"alpha" : 0,
		"anchor.x" : .5,
		"anchor.y" : .5,
		"fontSize" : 56,
		"text" : "B E G I N >>"
	},

	SHAPE_LABEL: {
		"alpha" : 0,
		"anchor.x" : .5,
		"anchor.y" : .5,
		"fontSize" : 56,
		"align": 'left',
		"text" : " -- Specific color"
	},

	COLOR_LABEL: {
		"alpha" : 0,
		"anchor.x" : .5,
		"anchor.y" : .5,
		"fontSize" : 56,
		"align": 'left',
		"text" : " -- Any color"
	},

	RECHARGE_LABEL: {
		"alpha" : 0,
		"anchor.x" : .5,
		"anchor.y" : .5,
		"fontSize" : 56,
		"align": 'left',
		"text" : " -- Recharge orb"
	},

	NEXT_BUTTON: {
		"alpha" : 0,
		"anchor.x" : .5,
		"anchor.y" : .5,
		"width" : 300,
		"height" : 100,
		"inputEnabled" : true
	},

	HEX: {
		"alpha" : 1,
		"tint" : 0xaa00ff,
		"anchor.x" : .5,
		"anchor.y" : .5,
		"scale.x" : 1.5,
		"scale.y" : 1.5,
		"*update" : function(){ 
			this.angle += 1;
		}
	},

	TRI: {
		"alpha" : 1,
		"tint" : 0x00ffd2,
		"anchor.x" : .5,
		"anchor.y" : .5,
		"scale.x" : 1.5,
		"scale.y" : 1.5,
		"*update" : function(){ 
			this.angle += 1;
		}
	},

	ORB:{
		"alpha" : 1,
		"tint" : 0x00aaff,
		"anchor.x" : .5,
		"anchor.y" : .5,
		"scale.x" : 1.5,
		"scale.y" : 1.5,
		"*update" : function(){ 
			this.angle += 1;
		}		
	},

	CUBE:{
		"alpha" : 1,
		"tint" : 0xff00aa,
		"anchor.x" : .5,
		"anchor.y" : .5,
		"scale.x" : 1.5,
		"scale.y" : 1.5,
		"*update" : function(){ 
			this.angle += 1;
		}
	},

	FLASH: {
		"alpha" : 1,
		"anchor.x" : .5,
		"anchor.y" : .5,
		"scale.x" : 1.5,
		"scale.y" : 1.5,
		"*update" : function(){
			this.tint = Phaser.Color.getRandomColor();
			this.angle -= 1;
		}
	},

	RECHARGE_INDICATOR: {
		"alpha" : 0,
		"anchor.x" : .5,
		"anchor.y" : .5,
		"scale.x" : 2,
		"scale.y" : 2,
		"*update" : function(){ 
			this.angle += 1;
		}
	}

}

export default TutorialSprites;