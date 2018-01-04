'use strict';

const GameEngine = require('lance-gg').GameEngine;

class GFYGameEngine extends GameEngine {

	start() {
		super.start();
		console.log('Starting GameEngine');
	}

	processInput(inputData, playerId) {
		super.processInput(inputData, playerId);
		console.log('processInput');
	}
}

module.exports = GFYGameEngine;
