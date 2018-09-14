// Helper to draw cards on the screen
"use strict";
const CardDrawer = (module.exports = {});

const Utils = require("../common/Utils");
const PRNG = require("../external/PRNG");
const random = new PRNG(12);

const ClassicDeck = require("../client/decks/ClassicDeck"); // eslint-disable-line no-unused-vars
const SimianDeck = require("../client/decks/SimianDeck"); // eslint-disable-line no-unused-vars

let deck = SimianDeck;

CardDrawer.fix_size = function(w, h) {
	let sc = Math.min(w ? w / deck.cw : 1, h ? h / deck.ch : 1);
	return [deck.cw * sc, deck.ch * sc];
};

CardDrawer.draw_card = function(ctx, card, x, y, w, h, hide, border_color) {
	let sc = Math.min(w ? w / deck.cw : 1, h ? h / deck.ch : 1);
	if (hide) deck.draw_back(ctx, x, y, deck.cw * sc, deck.ch * sc);
	else deck.draw_card(ctx, card, x, y, deck.cw * sc, deck.ch * sc);
	ctx.lineWidth = 2; // thickness
	ctx.strokeStyle = border_color || "rgb(0, 0, 0)";
	ctx.strokeRect(x, y, deck.cw * sc, deck.ch * sc);
};

function can_fit(w, h, scale) {
	const [cw, ch] = [deck.cw * scale, deck.ch * scale];
	const rows = 1 + Math.floor((h - ch) / (ch * 0.4));
	const cols = Math.floor(w / (cw / 4));
	return rows * cols;
}

// Generator function that yields to the correct position of the cards.
function* get_positions(x, y, w, h, hl) {
	if (hl === 0) return;
	// binary search to find the largest possible card size
	let l = 0,
		r = CardDrawer.fix_size(w, h)[0] / deck.cw;
	for (let i = 0; i < 8; i++) {
		let m = (l + r) / 2;
		if (can_fit(w, h, m) >= hl) l = m;
		else r = m;
	}
	const [cw, ch] = [deck.cw * l, deck.ch * l];
	if (hl === 1) {
		yield [0, x + (w - cw) / 2, y + (h - ch) / 2, cw, ch];
		return;
	}
	const cols = Math.min(hl, Math.floor(w / (cw / 4)));
	const rows = Math.ceil(hl / cols);
	const dw = Math.min(cw + 10, (w - cw) / (cols - 1));
	const ow = (w - ((cols - 1) * dw + cw)) / 2;
	const dh = rows > 1 ? (h - ch) / (rows - 1) : 0;
	const oh = (h - ((rows - 1) * dh + ch)) / 2;
	let i = 0;
	for (let r = 0; r < rows; r++)
		for (let c = 0; c < cols; c++) {
			yield [i, x + ow + dw * c, y + oh + dh * r, cw, ch];
			if (++i === hl) return;
		}
}

let last_draw = null;
let stack_last_draw = null;

// Draws hand inside the rectangle area given by (x, y, w, h)
CardDrawer.draw_hand_horizontal = function(
	ctx,
	hand,
	x,
	y,
	w,
	h,
	hide,
	border_color
) {
	const hl = hand.length;
	if (!hide) {
		last_draw = [x, y, w, h, hl];
	}
	for (const [i, cx, cy, cw, ch] of get_positions(x, y, w, h, hl))
		CardDrawer.draw_card(
			ctx,
			hide ? "??" : hand[i],
			cx,
			cy,
			cw,
			ch,
			hide,
			border_color
		);
};

CardDrawer.get_clicked_card = function(xc, yc) {
	if (stack_last_draw) {
		const [xs, ys, ws, hs] = stack_last_draw;
		if (Utils.point_in_rect(xc, yc, xs, ys, ws, hs)) return -2;
	}
	if (!last_draw) return -1;
	const rev_cards = [...get_positions(...last_draw)].reverse();
	for (const [i, x, y, w, h] of rev_cards)
		if (Utils.point_in_rect(xc, yc, x, y, w, h)) return i;
	return -1;
};

CardDrawer.draw_played_cards = function(ctx, cards, x, y, w, h, seed) {
	const sq2 = Math.sqrt(2);
	let [cw, ch] = CardDrawer.fix_size(w / sq2, h / sq2);
	ctx.save();
	ctx.translate(x + w / 2, y + h / 2);
	random._seed = seed || random._seed;
	let prev_angle = undefined;
	for (let i = 0; i < cards.length; i++) {
		let ang;
		if (prev_angle == undefined)
			ang = (random.nextFloat() - 0.5) * (Math.PI / 2);
		else {
			ang = -Math.PI / 4 + random.nextFloat() * Math.PI * 0.3;
			if (Math.abs(ang - prev_angle) <= 0.1 * Math.PI) ang += Math.PI * 0.2;
		}
		prev_angle = ang;
		ctx.save();
		ctx.rotate(ang);
		CardDrawer.draw_card(ctx, cards[i], -cw / 2, -ch / 2, cw, ch);
		ctx.restore();
	}
	ctx.restore();
};

CardDrawer.draw_stack = function(ctx, x, y, w, h) {
	const n = 13;
	let [cw, ch] = CardDrawer.fix_size(w * 0.8, h * 0.95);
	let dw = (cw * (0.2 / 0.8)) / (n - 1);
	let ow = (w - dw * (n - 1) - cw) / 2;

	let dh = (ch * (0.05 / 0.95)) / (n - 1);
	let oh = (h - dh * (n - 1) - ch) / 2;
	for (let i = 0; i < n; i++)
		CardDrawer.draw_card(
			ctx,
			"??",
			x + ow + dw * i,
			y + oh + dh * i,
			cw,
			ch,
			true
		);
	stack_last_draw = [x + ow, y + oh, dw * (n - 1) + cw, dh * (n - 1) + ch];
};
