"use strict";

class Client {
	constructor(socket) {
		this.socket = socket;
		this.game = null;
		this.wait_room = null;
	}
	get id() {
		return this.socket.id;
	}
	get on_game() {
		return this.game !== null;
	}
	get on_room() {
		return this.game !== null || this.wait_room !== null;
	}
}

module.exports = Client;
