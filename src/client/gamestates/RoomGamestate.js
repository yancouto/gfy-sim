"use strict";

const Gamestate = require("./Gamestate");

class RoomGamestate extends Gamestate {

	constructor() {
		super();
		this.name = "Room";
		this.room = null;
	}

	update(dt) {
	}

	draw(ctx) {
	}

	sync_to_server(data) {
		this.room = data.room;
	}

}

module.exports = RoomGamestate;
