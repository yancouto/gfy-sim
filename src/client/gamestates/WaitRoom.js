"use strict";

const Gamestate = require("./Gamestate");
const RU = require("../../client/RenderUtils");
const Utils = require("../../common/Utils");

class WaitRoom extends Gamestate {
	constructor() {
		super();
		this.name = "WaitRoom";

		// Start button
		this.start_but = document.createElement("input");
		this.start_but.type = "button";
		this.start_but.onclick = this.on_start_click.bind(this);
		this.start_but.value = "I'm first!";
		this.start_but.style.position = "absolute";
		document.body.appendChild(this.start_but);

		// Ready but
		this.ready_but = document.createElement("input");
		this.ready_but.type = "button";
		this.ready_but.onclick = this.on_ready_click.bind(this);
		this.ready_but.value = "I'm ready.";
		this.ready_but.style.position = "absolute";
		document.body.appendChild(this.ready_but);

		this.start_name = null;
		this.confirmed = false;
		this.my_name = "";
		this.players = [];
	}

	draw(ctx) {
		super.draw(ctx);
		const W = RU.W,
			H = RU.H;
		if (!this.room_name) {
			RU.set_font(40);
			ctx.fillStyle = "rgb(0, 0, 0)";
			RU.draw_text_align("Loading...", W / 2, H / 2);
			return;
		}
		RU.set_font(15);
		RU.draw_text_align(
			"Wating room: " + this.room_name,
			W / 2,
			10,
			undefined,
			RU.ALIGN_TOP
		);
		RU.set_font(13);
		RU.draw_text_align(
			"My name: " + this.my_name,
			W / 2,
			H * 0.15,
			RU.ALIGN_CENTER,
			RU.ALIGN_CENTER
		);

		this.start_but.style.left = Math.floor(
			(W - this.start_but.offsetWidth) / 2
		);
		this.start_but.style.top = Math.floor(
			H * 0.3 - this.start_but.offsetHeight / 2
		);

		this.ready_but.style.left = Math.floor(
			(W - this.ready_but.offsetWidth) / 2
		);
		this.ready_but.style.top = Math.floor(
			H * 0.4 - this.ready_but.offsetHeight / 2
		);

		if (this.start_name)
			RU.draw_text_align(
				"First Player: " + this.start_name,
				W / 2,
				H * 0.5,
				RU.ALIGN_CENTER,
				RU.ALIGN_CENTER
			);

		RU.draw_text_align(
			"Ready: " +
				this.players
					.filter(p => p.confirmed)
					.map(p => p.name)
					.join(", "),
			W / 2,
			H * 0.6,
			RU.ALIGN_CENTER,
			RU.ALIGN_CENTER
		);
		RU.draw_text_align(
			"Not Ready: " +
				this.players
					.filter(p => !p.confirmed)
					.map(p => p.name)
					.join(", "),
			W / 2,
			H * 0.7,
			RU.ALIGN_CENTER,
			RU.ALIGN_CENTER
		);

		if (this.last_winner)
			RU.draw_text_align(
				"Last Winner: " + this.last_winner + " (" + this.win_streak + ")",
				W / 2,
				H * 0.8,
				RU.ALIGN_CENTER,
				RU.ALIGN_CENTER
			);
	}

	sync_to_server(data) {
		this.room_name = data.room_name;
		this.start_but.disabled = data.start_i !== null;
		this.start_name =
			data.start_i !== null ? data.players[data.start_i].name : null;
		this.ready_but.disabled = this.confirmed = data.confirmed;
		this.players = data.players;
		this.my_name = data.my_name;
		this.last_winner = data.last_winner;
		this.win_streak = data.win_streak;
	}

	on_start_click() {
		Utils.client_socket.emit("i will start");
	}

	on_ready_click() {
		Utils.client_socket.emit("i am ready");
	}

	exit() {
		this.start_but.parentNode.removeChild(this.start_but);
		this.ready_but.parentNode.removeChild(this.ready_but);
	}
}

module.exports = WaitRoom;
