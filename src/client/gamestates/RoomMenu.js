// Gamestate for the room menu, where you can create or join a room.

import Gamestate from "./Gamestate";
import RenderUtils from "../../client/RenderUtils";
import { GM as GamestateManager } from "../gamestates/GamestateManager";
import * as Utils from "../../common/Utils";
import WaitRoom from "./WaitRoom";
import NameGenerator from "../../client/utils/NameGenerator";

class RoomMenu extends Gamestate {
	constructor() {
		super();
		this.name = "RoomMenu";
		this.room_list = [];
		// form for inputting room name
		const room_frm = document.createElement("div");
		room_frm.id = "room_form";
		room_frm.style.position = "absolute";
		let txt = document.createElement("input");
		txt.type = "text";
		const but = document.createElement("input");
		but.style.margin = "10px";
		but.type = "button";
		but.onclick = this.on_button_click.bind(this);
		but.value = "Go to room";
		room_frm.appendChild(txt);
		room_frm.appendChild(but);
		document.body.appendChild(room_frm);
		this.room_frm = room_frm;
		// form for inputting your name
		const name_frm = document.createElement("div");
		name_frm.style.position = "absolute";
		txt = document.createElement("input");
		txt.type = "text";
		txt.value = NameGenerator.get_random_name();
		const desc = document.createElement("label");
		desc.textContent = "My name: ";
		name_frm.appendChild(desc);
		name_frm.appendChild(txt);
		this.name_frm = name_frm;
		document.body.appendChild(name_frm);
	}

	update(dt) {
		super.update(dt);
	}

	draw(ctx) {
		super.draw(ctx);
		const W = RenderUtils.W;
		const H = RenderUtils.H;
		this.room_frm.style.left = Math.floor((W - this.room_frm.offsetWidth) / 2);
		this.room_frm.style.top = Math.floor(
			H * 0.05 - this.room_frm.offsetHeight / 2
		);
		this.name_frm.style.left = Math.floor((W - this.room_frm.offsetWidth) / 2);
		this.name_frm.style.top =
			Math.floor(H * 0.05 - this.room_frm.offsetHeight / 2) + 50;
		RenderUtils.set_font(22);
		RenderUtils.draw_text_align("Currently Open Rooms", W / 2, H * 0.3);
		const from = H * 0.35;
		const to = H * 0.95;
		RenderUtils.set_font(10);
		for (let i = 0; i < this.room_list.length; i++)
			RenderUtils.draw_text_align(
				this.room_list[i],
				W / 2,
				from + ((to - from) / (this.room_list.length + 1)) * (i + 1)
			);

		RenderUtils.set_font(5);
		RenderUtils.draw_text_align(
			"v" + Utils.game_version,
			RenderUtils.W - 10,
			RenderUtils.H - 10,
			RenderUtils.ALIGN_RIGHT,
			RenderUtils.ALIGN_BOTTOM
		);
	}

	sync_to_server(data) {
		this.room_list = data.room_list;
	}

	on_button_click() {
		const user_name = this.name_frm.children[1].value;
		const room_name = this.room_frm.children[0].value;
		if (
			/^\w{1,20}$/.test(room_name) &&
			user_name.length >= 1 &&
			user_name.indexOf(",") == -1 &&
			user_name.length <= 100
		) {
			console.log("Switching to room " + room_name);
			GamestateManager.switch_to(new WaitRoom());
			Utils.client_socket.emit("change room", room_name, user_name);
		}
	}

	exit() {
		this.room_frm.parentNode.removeChild(this.room_frm);
		this.name_frm.parentNode.removeChild(this.name_frm);
	}
}

export default RoomMenu;
