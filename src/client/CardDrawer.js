// Helper to draw cards on the screen
"use strict";
const CardDrawer = module.exports = {};

const ClassicDeck = require("../client/decks/ClassicDeck"); // eslint-disable-line no-unused-vars
const SimianDeck = require("../client/decks/SimianDeck");

let deck = SimianDeck;

CardDrawer.fix_size = function(w, h) {
	let sc = Math.min(w? w / deck.cw : 1, h? h / deck.ch : 1);
	return [deck.cw * sc, deck.ch * sc];
};

CardDrawer.draw_card = function(ctx, card, x, y, w, h, hide) {
	let sc = Math.min(w? w / deck.cw : 1, h? h / deck.ch : 1);
	ctx.lineWidth = 2; // thickness
	if(hide)
		deck.draw_back(ctx, x, y, deck.cw * sc, deck.ch * sc);
	else {
		deck.draw_card(ctx, card, x, y, deck.cw * sc, deck.ch * sc);
		ctx.strokeRect(x, y, deck.cw * sc, deck.ch * sc);
	}
};

CardDrawer.draw_hand_horizontal = function(ctx, hand, x, y, w, h, hide) {
	const hl = hand.length;
	if(hl == 0) return;
	let cw = w / Math.max(7, hl / 3);
	let ch = h;
	[cw, ch] = CardDrawer.fix_size(cw, ch);
	if(hl == 1) {
		CardDrawer.draw_card(ctx, hide? "??" : hand[0], x + ((w - cw) / 2), y + ((h - ch) / 2), cw, ch, hide);
		return;
	}
	let dw = Math.min(cw + 10, (w - cw) / (hl - 1));
	let ow = (w - ((hl - 1) * dw + cw)) / 2;
	for(let i = 0; i < hl; i++)
		CardDrawer.draw_card(ctx, hide? "??" : hand[i], x + ow + dw * i, y + ((h - ch) / 2), cw, ch, hide);
};
