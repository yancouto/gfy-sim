// Gamestate for the room menu, where you can create or join a room.
"use strict";
const Gamestate = require("./Gamestate");
const RenderUtils = require("../../client/RenderUtils");
const GamestateManager = require("./GamestateManager").GM;
const Utils = require("../../common/Utils");
const WaitRoom = require("./WaitRoom");

class RoomMenu extends Gamestate {

	constructor() {
		super();
		this.name = "RoomMenu";
		this.room_list = [];
		let frm = document.createElement("div");
		frm.id = "room_form";
		frm.style.position = "absolute";
		frm.style.left = "100px";
		frm.style.top = "100px";
		let txt = document.createElement("input");
		txt.type = "text";
		let but = document.createElement("input");
		but.style.margin = "10px";
		but.type = "button";
		but.onclick = this.on_button_click.bind(this);
		but.value = "Go to room";
		frm.appendChild(txt);
		frm.appendChild(but);
		document.body.appendChild(frm);
		this.frm = frm;
	}

	update(dt) {
		super.update(dt);
	}

	draw(ctx) {
		super.draw(ctx);
		let W = RenderUtils.W, H = RenderUtils.H;
		this.frm.style.left = Math.floor((W - this.frm.offsetWidth) / 2);
		this.frm.style.top = Math.floor(H * .05 - this.frm.offsetHeight / 2);
		RenderUtils.set_font(22);
		RenderUtils.draw_text_align("Currently Open Rooms", W / 2, H * .3);
		let from = H * .35, to = H * .95;
		RenderUtils.set_font(10);
		for(let i = 0; i < this.room_list.length; i++)
			RenderUtils.draw_text_align(this.room_list[i], W / 2, from + (to - from) / (this.room_list.length + 1) * (i + 1));

		RenderUtils.set_font(5);
		RenderUtils.draw_text_align("v" + Utils.game_version, RenderUtils.W - 10, RenderUtils.H - 10, RenderUtils.ALIGN_RIGHT, RenderUtils.ALIGN_BOTTOM);
	}

	sync_to_server(data) {
		this.room_list = data.room_list;
	}

	on_button_click() {
		console.log("button clicked");
		let name = this.frm.children[0].value;
		if(/^\w{2,20}$/.test(name)) {
			console.log("Switching to room " + name);
			GamestateManager.switch_to(new WaitRoom());
			Utils.client_socket.emit("change room", name);
		}
	}

	exit() {
		this.frm.parentNode.removeChild(this.frm);
	}
}

module.exports = RoomMenu;
