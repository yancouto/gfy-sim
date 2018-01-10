"use strict";

const Gamestate = require("./Gamestate");
const RU = require("../../client/RenderUtils");
const Utils = require("../../common/Utils");
const Room = require("../../common/Room");
const CardDrawer = require("../../client/CardDrawer");
const RoomInputHandler = require("./RoomInputHandler");

const Event = require("../../common/Event");

const Text = require("../../client/drawables/Text");
const DisappearingDrawable = require("../../client/drawables/DisappearingDrawable");

const StickerPanel = require("../../client/drawables/StickerPanel");

class RoomGamestate extends Gamestate {

	constructor() {
		super();
		this.name = "Room";
		this.background = new Image();
		this.background.src = "assets/felt.jpg";

		this.sticker_panel = new StickerPanel();
	}

	enter() {
		this.room = null;
		this.me = null;
		this.input_handler = new RoomInputHandler();
		this.drawables = {};
	}

	exit() {
		this.input_handler.destroy();
	}

	update(dt) { // eslint-disable-line no-unused-vars
		this.sticker_panel.update(dt);
		for(let pid in this.drawables)
			for(let d of this.drawables[pid])
				d.update(dt);
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
		RU.draw_text_align("Room Code: " + this.room.name, RU.W - 10, RU.H * .65, RU.ALIGN_RIGHT, RU.ALIGN_CENTER);

		ctx.fillStyle = "rgb(0, 0, 0)";
		CardDrawer.draw_hand_horizontal(ctx, this.me.hand, RU.W * .1, RU.H * .7, RU.W * .8, RU.H * .3 - 10, false, this.room.turn_i === m_i? "rgb(255, 0, 0)" : undefined);

		const pl = this.room.player_list.length;
		for(let i = 1; i < pl; i++) {
			let j = (m_i + i) % pl;
			const pi = this.room.player_list[j];
			const x = (i - 1) * (RU.W * .9 / (pl - 1)) + i * (RU.W * .1 / pl);
			const y = 10;
			const w = RU.W * .9 / (pl - 1);
			const h = RU.H * .2;

			CardDrawer.draw_hand_horizontal(ctx, pi.hand, x, y, w, h, true, this.room.turn_i === j? "rgb(255, 0, 0)" : undefined);

			if(this.drawables[pi.pid]) {
				const ds = this.drawables[pi.pid].length;
				for(let k in this.drawables[pi.pid]) {
					this.drawables[pi.pid][k].draw(ctx, x + w / 2, y + (parseInt(k, 10) + 1) * (h / (ds + 1)));
				}
			}
		}

		CardDrawer.draw_played_cards(ctx, this.room.played_cards, RU.W * .35, RU.H * .3, RU.W * .3, RU.H * .3, this.room.seed);

		CardDrawer.draw_stack(ctx, RU.W * .8, RU.H * .3, RU.W * .15, RU.H * .3);

		this.sticker_panel.draw(ctx, 10, RU.H * .3, RU.W * .3 - 20, RU.H * .3);

		for(let s in this.drawables)
			this.drawables[s] = this.drawables[s].filter(d => !d.can_delete);
	}
	
	add_drawable(pid, d) {
		if(!this.drawables[pid])
			this.drawables[pid] = [];
		this.drawables[pid].push(d);
	}

	process_event(ev) {
		if(ev.type === Event.SENT_STICKER) {
			let t = new Text("Sticker " + ev.source, "24px serif");
			this.add_drawable(ev.source, new DisappearingDrawable(t, [255, 0, 0], 8));
		}
	}

	sync_to_server(data) {
		this.room = Object.setPrototypeOf(data.room, Room);
		this.me = this.room.player_list.find((p) => p.pid == Utils.client_socket.id);
		for(let e of data.new_events)
			this.process_event(e);
	}
}

module.exports = RoomGamestate;
