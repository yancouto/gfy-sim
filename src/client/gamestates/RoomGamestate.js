"use strict";

const Gamestate = require("./Gamestate");
const RU = require("../../client/RenderUtils");
const Utils = require("../../common/Utils");
const Room = require("../../common/Room");
const CardDrawer = require("../../client/CardDrawer");

class RoomGamestate extends Gamestate {

	constructor() {
		super();
		this.name = "Room";
		this.room = null;
		this.me = null;
	}

	update(dt) {
	}

	draw(ctx) {
		if(!this.room) {
			RU.set_font(40);
			RU.draw_centered_text("Loading...", RU.W / 2, RU.H / 2);
			return;
		}

		CardDrawer.draw_hand_horizontal(ctx, this.me.hand, RU.W * .1, RU.H * .7, RU.W * .8, RU.H * .3 - 10);
	}

	sync_to_server(data) {
		this.room = Object.setPrototypeOf(data.room, Room);
		this.me = this.room.player_list.find((p) => p.pid == Utils.client_socket.id);
		console.log(this.me);
	}
}

module.exports = RoomGamestate;
