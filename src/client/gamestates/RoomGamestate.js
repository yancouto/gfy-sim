"use strict";

const Gamestate = require("./Gamestate");
const RU = require("../../client/RenderUtils");
const Utils = require("../../common/Utils");
const Room = require("../../common/Room");
const CardDrawer = require("../../client/CardDrawer");
const RoomInputHandler = require("./RoomInputHandler");

const Event = require("../../common/Event");

const CenteredImage = require("../../client/drawables/CenteredImage");
const CenteredText = require("../../client/drawables/CenteredText");
const DisappearingDrawable = require("../../client/drawables/DisappearingDrawable");

const StickerPanel = require("../../client/drawables/StickerPanel");
const StickerList = require("../../client/drawables/StickerList");

function get_hand_color(room, turn) {
	if (room.turn_i === turn) return "rgb(255, 0, 0)";
	else if (room.this_turn_or_mixed(turn))
		// mixed turn
		return "rgb(0, 255, 0)";
	else return "rgb(0, 0, 0)";
}

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

	update(dt) {
		// eslint-disable-line no-unused-vars
		this.sticker_panel.update(dt);
		for (let pid in this.drawables)
			for (let d of this.drawables[pid]) {
				d.dy = Math.min(1, d.dy + dt * 0.5);
				d.update(dt);
			}
		for (let s in this.drawables)
			this.drawables[s] = this.drawables[s].filter(d => !d.can_delete);
	}

	draw(ctx) {
		let sc = Math.min(3000 / RU.W, 2001 / RU.H);
		ctx.drawImage(
			this.background,
			0,
			0,
			RU.W * sc,
			RU.H * sc,
			0,
			0,
			RU.W,
			RU.H
		);
		if (!this.room) {
			RU.set_font(40);
			ctx.fillStyle = "rgb(0, 0, 0)";
			RU.draw_text_align("Loading...", RU.W / 2, RU.H / 2);
			return;
		}
		let m_i = this.room.player_list.findIndex(p => p.pid === this.me.pid);

		ctx.fillStyle = "rgb(255, 255, 255)";
		RU.set_font(12);
		RU.draw_text_align(
			"Room Code: " + this.room.name,
			RU.W - 10,
			RU.H * 0.65,
			RU.ALIGN_RIGHT,
			RU.ALIGN_CENTER
		);

		const pl = this.room.player_list.length;
		for (let i = 1; i < pl; i++) {
			let j = (m_i + i) % pl;
			const pi = this.room.player_list[j];
			const x = (i - 1) * ((RU.W * 0.9) / (pl - 1)) + i * ((RU.W * 0.1) / pl);
			const y = 10;
			const w = (RU.W * 0.9) / (pl - 1);
			const h = RU.H * 0.2;

			CardDrawer.draw_hand_horizontal(
				ctx,
				pi.hand,
				x,
				y,
				w,
				h,
				true,
				get_hand_color(this.room, j)
			);

			if (this.drawables[pi.pid])
				for (let k in this.drawables[pi.pid]) {
					const d = this.drawables[pi.pid][k];
					d.drawable.sz = Math.min(w, h) / 3;
					d.draw(ctx, x + w * d.dx, y + (1 / 6 + (4 / 6) * (1 - d.dy)) * h);
				}
		}

		ctx.fillStyle = "rgb(0, 0, 0)";
		CardDrawer.draw_hand_horizontal(
			ctx,
			this.me.hand,
			RU.W * 0.1,
			RU.H * 0.7,
			RU.W * 0.8,
			RU.H * 0.3 - 10,
			false,
			get_hand_color(this.room, m_i)
		);

		CardDrawer.draw_played_cards(
			ctx,
			this.room.played_cards,
			RU.W * 0.35,
			RU.H * 0.3,
			RU.W * 0.3,
			RU.H * 0.3,
			this.room.seed
		);

		CardDrawer.draw_stack(ctx, RU.W * 0.8, RU.H * 0.3, RU.W * 0.15, RU.H * 0.3);

		this.sticker_panel.draw(ctx, 10, RU.H * 0.3, RU.W * 0.3 - 20, RU.H * 0.3);

		if (this.drawables[this.me.pid]) {
			const [x, y] = [RU.W * 0.3, RU.H * 0.3];
			const [w, h] = [RU.W * 0.5, RU.H * 0.3];
			for (let k in this.drawables[this.me.pid]) {
				const d = this.drawables[this.me.pid][k];
				d.drawable.sz = Math.min(w, h) / 3;
				d.draw(ctx, x + w * d.dx, y + (1 / 6 + (4 / 6) * (1 - d.dy)) * h);
			}
		}
	}

	add_drawable(pid, d) {
		if (!this.drawables[pid]) this.drawables[pid] = [];
		d.dy = 0;
		d.dx = Math.random() / 3 + 1 / 3;
		this.drawables[pid].push(d);
	}

	process_event(ev) {
		console.log("Got event " + ev.type + " from " + ev.source);
		let drawable = null;
		let color = [0, 0, 0];
		let timeout = 2;
		if (ev.type === Event.SENT_STICKER) {
			drawable = new CenteredImage(StickerList[ev.info.name], 50);
		} else if (ev.type === Event.DRAW) {
			let text;
			if (ev.info.reason === "4")
				text = "Broke Silence Rule (+" + ev.info.draw_count + ")";
			else if (ev.info.reason === "stack")
				text = "Draw " + ev.info.draw_count + " from stack";
			else text = "Draw " + ev.info.draw_count;
			drawable = new CenteredText(text);
		} else if (ev.type === Event.EFF_7) {
			drawable = new CenteredText("+" + ev.info.draw_count);
		} else if (ev.type === Event.EFF_J) {
			drawable = new CenteredText(
				"Swapped " + ev.info.card_a + " and " + ev.info.card_b
			);
		} else if (ev.type === Event.EFF_8) {
			drawable = new CenteredText("Changed suit to " + ev.info.new_suit);
		}

		if (drawable)
			this.add_drawable(
				ev.source,
				new DisappearingDrawable(drawable, color, timeout)
			);
	}

	sync_to_server(data) {
		this.room = Object.setPrototypeOf(data.room, Room.prototype);
		this.me = this.room.player_list.find(p => p.pid == Utils.client_socket.id);
		for (let e of data.new_events) this.process_event(e);
	}
}

module.exports = RoomGamestate;
