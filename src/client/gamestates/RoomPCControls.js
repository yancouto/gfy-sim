"use strict";

const GamestateManager = require("./GamestateManager").GM;
const CardDrawer = require("../../client/CardDrawer");
const RU = require("../../client/RenderUtils");

class RoomPCControls {
	constructor(input_handler) {
		this.input_handler = input_handler;
		let canvas = document.getElementById("canvas");
		this.mouse_down_listener = this.on_mouse_down.bind(this);
		canvas.addEventListener("mousedown", this.mouse_down_listener);
	}

	on_mouse_down(ev) {
		// This conversion from world coords should be better
		let x = ev.x - RU.CANVAS_BORDER;
		let y = ev.y - RU.CANVAS_BORDER;
		let gs = GamestateManager.current_gamestate;
		if(!gs.room) return;
		var index = CardDrawer.get_clicked_card(x, y);
		if(index !== -1) {
			this.input_handler.play_card(index);
			return;
		}
		let name = gs.sticker_panel.get_clicked_sticker(x, y);
		if(name) {
			this.input_handler.send_sticker(name);
			return;
		}
	}

	destroy() {
		let canvas = document.getElementById("canvas");
		canvas.removeEventListener("mousedown", this.mouse_down_listener);
	}
}

module.exports = RoomPCControls;
