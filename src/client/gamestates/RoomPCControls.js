"use strict";

const GamestateManager = require("./GamestateManager").GM;
const CardDrawer = require("../../client/CardDrawer");

class RoomPCControls {
	constructor(input_handler) {
		this.input_handler = input_handler;
		let canvas = document.getElementById("canvas");
		this.mouse_down_listener = this.on_mouse_down.bind(this);
		canvas.addEventListener("mousedown", this.mouse_down_listener);
	}

	on_mouse_down(ev) {
		let gs = GamestateManager.current_gamestate;
		if(!gs.room) return;
		var index = CardDrawer.get_clicked_card(ev.x, ev.y);
		if(index == -1) return;
		this.input_handler.play_card(index);
	}

	destroy() {
		let canvas = document.getElementById("canvas");
		canvas.removeEventListener("mousedown", this.mouse_down_listener);
	}
}

module.exports = RoomPCControls;
