// Handles input for the RoomGamestate
"use strict";

const PCControls = require("./RoomPCControls");
const Utils = require("../../common/Utils");

class RoomInputHandler {
	constructor() {
		this.controls = new PCControls(this); // maybe do touch later
	}

	play_card(index) {
		if(index < 0) {
			// clicked on stack
			return;
		}
		console.log("Playing card " + index);
		Utils.client_socket.emit("play card", index);
	}

	send_sticker(index) {
		console.log("Sending sticker " + index);
	}

	destroy() {
		this.controls.destroy();
	}
}

module.exports = RoomInputHandler;
