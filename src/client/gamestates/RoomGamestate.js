"use strict";

const Gamestate = require("./Gamestate");
const RU = require("../../client/RenderUtils");
const Utils = require("../../common/Utils");
const Room = require("../../common/Room");
const CardDrawer = require("../../client/CardDrawer");
const RoomInputHandler = require("./RoomInputHandler");

class RoomGamestate extends Gamestate {

	constructor() {
		super();
		this.name = "Room";
		this.background = new Image();
		this.background.src = "assets/felt.jpg";
	}

	enter() {
		this.room = null;
		this.me = null;
		this.input_handler = new RoomInputHandler();
	}

	exit() {
		this.input_handler.destroy();
	}

	update(dt) { // eslint-disable-line no-unused-vars
	}

	draw(ctx) {
		let sc = Math.min(3000 / RU.W, 2001 / RU.H);
		ctx.drawImage(this.background, 0, 0, RU.W * sc, RU.H * sc, 0, 0, RU.W, RU.H);
		if(!this.room) {
			RU.set_font(40);
			ctx.fillStyle = "rgb(0, 0, 0)";
			RU.draw_text_align("Loading...", RU.W / 2, RU.H / 2);
			return;
		}
		let m_i = this.room.player_list.findIndex(p => p.pid === this.me.pid);

		ctx.fillStyle = "rgb(255, 255, 255)";
		RU.set_font(12);
		RU.draw_text_align("Room Code: " + this.room.name, RU.W - 10, RU.H - 10, RU.ALIGN_RIGHT, RU.ALIGN_BOTTOM);

		ctx.fillStyle = "rgb(0, 0, 0)";
		CardDrawer.draw_hand_horizontal(ctx, this.me.hand, RU.W * .1, RU.H * .7, RU.W * .8, RU.H * .3 - 10, false, this.room.turn_i === m_i? "rgb(255, 0, 0)" : undefined);

		const pl = this.room.player_list.length;
		for(let i = 1; i < pl; i++) {
			let j = (m_i + i) % pl;
			CardDrawer.draw_hand_horizontal(ctx, this.room.player_list[j].hand, (i - 1) * (RU.W * .9 / (pl - 1)) + i * (RU.W * .1 / pl), 10, RU.W * .9 / (pl - 1), RU.H * .2, true, this.room.turn_i === j? "rgb(255, 0, 0)" : undefined);
		}

		CardDrawer.draw_played_cards(ctx, this.room.played_cards, RU.W / 4, RU.H * .3, RU.W / 2, RU.H * .3, this.room.seed);

		CardDrawer.draw_stack(ctx, RU.W * .8, RU.H * .3, RU.W * .15, RU.H * .3);
	}

	sync_to_server(data) {
		this.room = Object.setPrototypeOf(data.room, Room);
		this.me = this.room.player_list.find((p) => p.pid == Utils.client_socket.id);
	}
}

module.exports = RoomGamestate;
