"use strict";

const Gamestate = require("./Gamestate");
const GamestateManager = require("./GamestateManager").GM;
const RU = require("../../client/RenderUtils");
const Utils = require("../../common/Utils");
const Room = require("./RoomGamestate");

class WaitRoom extends Gamestate {
	constructor() {
		super();
		this.name = "WaitRoom";
		
		// Start button
		this.start_but = document.createElement("input");
		this.start_but.type = "button";
		this.start_but.onclick = this.on_start_click.bind(this);
		this.start_but.value = "I'll start!";
		this.start_but.style.position = "absolute";
		document.body.appendChild(this.start_but);

		// Ready but
		this.ready_but = document.createElement("input");
		this.ready_but.type = "button";
		this.ready_but.onclick = this.on_ready_click.bind(this);
		this.ready_but.value = "I'm ready.";
		this.ready_but.style.position = "absolute";
		document.body.appendChild(this.ready_but);

		this.confirmed = false;
		this.confirmed_total = 0;
		this.total = 1;
	}

	draw(ctx) {
		super.draw(ctx);
		const W = RU.W, H = RU.H;
		if(!this.room_name) {
			RU.set_font(40);
			ctx.fillStyle = "rgb(0, 0, 0)";
			RU.draw_text_align("Loading...", W / 2, H / 2);
			return;
		}
		RU.set_font(15);
		RU.draw_text_align("Wating room: " + this.room_name, W / 2, 10, undefined, RU.ALIGN_TOP);

		this.start_but.style.left = Math.floor((W - this.start_but.offsetWidth) / 2);
		this.start_but.style.top = Math.floor(H * .3 - this.start_but.offsetHeight / 2);

		this.ready_but.style.left = Math.floor((W - this.ready_but.offsetWidth) / 2);
		this.ready_but.style.top = Math.floor(H * .4 - this.ready_but.offsetHeight / 2);

		RU.draw_text_align("Ready: " + this.confirmed_total + " out of " + this.total, W / 2,  H * .6, RU.ALIGN_CENTER, RU.ALIGN_CENTER);
	}

	sync_to_server(data) {
		this.room_name = data.room_name;
		this.start_but.disabled = (data.start_i !== null);
		this.ready_but.disabled = this.confirmed = (data.confirmed);
		this.total = data.total;
		this.confirmed_total = data.confirmed_total;
	}

	wrong_data(data) {
		if(data.name === "Room") { // We should be in the room
			GamestateManager.switch_to(new Room());
			GamestateManager.sync_data(data); // risky?
		}
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
