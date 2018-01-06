// Helper to draw cards on the screen
"use strict";
const CardDrawer = module.exports = {};

const Utils = require("../common/Utils");
const PRNG = require("../external/PRNG");
const random = new PRNG(12);

const ClassicDeck = require("../client/decks/ClassicDeck"); // eslint-disable-line no-unused-vars
const SimianDeck = require("../client/decks/SimianDeck"); // eslint-disable-line no-unused-vars

let deck = SimianDeck;

CardDrawer.fix_size = function(w, h) {
	let sc = Math.min(w? w / deck.cw : 1, h? h / deck.ch : 1);
	return [deck.cw * sc, deck.ch * sc];
};

CardDrawer.draw_card = function(ctx, card, x, y, w, h, hide, border_color) {
	let sc = Math.min(w? w / deck.cw : 1, h? h / deck.ch : 1);
	if(hide)
		deck.draw_back(ctx, x, y, deck.cw * sc, deck.ch * sc);
	else
		deck.draw_card(ctx, card, x, y, deck.cw * sc, deck.ch * sc);
	ctx.lineWidth = 2; // thickness
	ctx.strokeStyle = border_color || "rgb(0, 0, 0)";
	ctx.strokeRect(x, y, deck.cw * sc, deck.ch * sc);
};

let last_draw = null;

CardDrawer.draw_hand_horizontal = function(ctx, hand, x, y, w, h, hide, border_color) {
	const hl = hand.length;
	if(!hide) {
		last_draw = {
			x, y, w, h, hl
		};
	}
	if(hl == 0) return;
	let cw = w / Math.max(7, hl / 3);
	let ch = h;
	[cw, ch] = CardDrawer.fix_size(cw, ch);
	if(hl == 1) {
		CardDrawer.draw_card(ctx, hide? "??" : hand[0], x + ((w - cw) / 2), y + ((h - ch) / 2), cw, ch, hide, border_color);
		return;
	}
	let dw = Math.min(cw + 10, (w - cw) / (hl - 1));
	let ow = (w - ((hl - 1) * dw + cw)) / 2;
	for(let i = 0; i < hl; i++)
		CardDrawer.draw_card(ctx, hide? "??" : hand[i], x + ow + dw * i, y + ((h - ch) / 2), cw, ch, hide, border_color);
};

CardDrawer.get_clicked_card = function(xc, yc) {
	if(!last_draw) return -1;
	let {x, y, w, h, hl} = last_draw;
	if(hl == 0) return -1;
	let cw = w / Math.max(7, hl / 3);
	let ch = h;
	[cw, ch] = CardDrawer.fix_size(cw, ch);
	if(hl == 1) {
		return Utils.point_in_rect(xc, yc, x + ((w - cw) / 2), y + ((h - ch) / 2), cw, h)? 0 : -1;
	}
	let dw = Math.min(cw + 10, (w - cw) / (hl - 1));
	let ow = (w - ((hl - 1) * dw + cw)) / 2;
	for(let i = hl - 1; i >= 0; i--)
		if(Utils.point_in_rect(xc, yc, x + ow + dw * i, y + ((h - ch) / 2), cw, ch))
			return i;
	return -1;
};

CardDrawer.draw_played_cards = function(ctx, cards, x, y, w, h, seed) {
	const sq2 = Math.sqrt(2);
	let [cw, ch] = CardDrawer.fix_size(w / sq2, h / sq2);
	ctx.save();
	ctx.translate(x + w / 2, y + h / 2);
	random._seed = seed || random._seed;
	let prev_angle = undefined;
	for(let i = 0; i < cards.length; i++) {
		let ang;
		if(prev_angle == undefined)
			ang = (random.nextFloat() - .5) * (Math.PI / 2);
		else {
			ang = -Math.PI / 4 + (random.nextFloat() * Math.PI * .3);
			if(Math.abs(ang - prev_angle) <= .1 * Math.PI)
				ang += Math.PI * .2;
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
	let [cw, ch] = CardDrawer.fix_size(w * .8, h * .95);
	let dw = cw * (.2 / .8) / (n - 1);
	let ow = (w - dw * (n - 1) - cw) / 2;

	let dh = ch * (.05 / .95) / (n - 1);
	let oh = (h - dh * (n - 1) - ch) / 2;
	for(let i = 0; i < n; i++)
		CardDrawer.draw_card(ctx, "??", x + ow + dw * i, y + oh + dh * i, cw, ch, true);
};
