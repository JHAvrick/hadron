var webpack = require('webpack');
var path = require('path');

var APP_DIR = path.resolve(__dirname, 'app');
var BUILD_DIR = path.resolve(__dirname, '..', 'hadron-cordova', 'www');

var config = {
	devtool: "cheap-module-source-map",
	entry: path.resolve(APP_DIR, 'app.js'),
	output: {
			devtoolLineToLine: true,
			pathinfo: true,
			path: BUILD_DIR,
			filename: 'bundle.js'
	},
	module : {
		loaders : [{
			test : /\.js?/,
			include : APP_DIR,
			loader : 'babel-loader'
		}]
	},
	resolve: {
		alias: {
			//Main objects directory
			objects: path.resolve(__dirname, 'app/objects'),
			
			//Base class directories 
			display: path.resolve(__dirname, 'app/objects/base/display'),
			fx: path.resolve(__dirname, 'app/objects/base/fx'),
			math: path.resolve(__dirname, 'app/objects/base/math'),
			util: path.resolve(__dirname, 'app/objects/base/util'),
			
			//Game source directories
			config: path.resolve(__dirname, 'app/objects/config'),
			state: path.resolve(__dirname, 'app/state'),
			menu: path.resolve(__dirname, 'app/objects/menu'),
			main: path.resolve(__dirname, 'app/objects/main'),
			results: path.resolve(__dirname, 'app/objects/results')
		}
	}
};

module.exports = config;