// Handles input for the RoomGamestate
"use strict";

const PCControls = require("./RoomPCControls");
const GamestateManager = require("./GamestateManager").GM;
const Utils = require("../../common/Utils");

class RoomInputHandler {
	constructor() {
		this.controls = new PCControls(this); // maybe do touch later
	}

	play_card(index) { // eslint-disable-line no-unused-vars
		if(index < 0) {
			// clicked on stack
			return;
		}
		console.log("Playing card " + index);
		Utils.client_socket.emit("play card", index);
	}

	destroy() {
		this.controls.destroy();
	}
}

module.exports = RoomInputHandler;
