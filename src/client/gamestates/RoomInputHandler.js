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

	send_sticker(name) {
		console.log("Sending sticker " + name);
		Utils.client_socket.emit("send sticker", name);
	}

	destroy() {
		this.controls.destroy();
	}
}

module.exports = RoomInputHandler;
