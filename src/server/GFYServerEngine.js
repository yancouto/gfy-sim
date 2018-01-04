"use strict";

const ServerEngine = require("lance-gg").ServerEngine;

class GFYServerEngine extends ServerEngine {
	constructor(io, gameEngine, inputOptions) {
		super(io, gameEngine, inputOptions);
		// Register classes
		//this.serializer.registerClass(require("../common/Missile"));
		//this.serializer.registerClass(require("../common/Ship"));
	}

	start() {
		super.start();
		console.log("Starting ServerEngine");
	}

	onPlayerConnected(socket) {
		super.onPlayerConnected(socket);
		console.log("onPlayerConnected");
		// handle client restart requests
		//socket.on("requestRestart", makePlayerShip);
	}

	onPlayerDisconnected(socketId, playerId) {
		super.onPlayerDisconnected(socketId, playerId);
		console.log("onPlayerDisconnected");
	}
}

module.exports = GFYServerEngine;
