// Helper to draw cards on the screen
"use strict";
const CardDrawer = module.exports = {};

const img = new Image();
img.src = "assets/classic_cards.png";

const map = new Uint8Array(128);

for(let i = 0; i < 14; i++)
	map["A23456789TJQK".charCodeAt(i)] = i;

for(let i = 0; i < 4; i++)
	map["CDHS".charCodeAt(i)] = i;

const cw = 280;
const ch = 390;

CardDrawer.fix_size = function(w, h) {
	let sc = Math.min(w? w / cw : 1, h? h / ch : 1);
	return [cw * sc, ch * sc];
};

CardDrawer.draw_card = function(ctx, card, x, y, w, h) {
	let sc = Math.min(w? w / cw : 1, h? h / ch : 1);
	ctx.lineWidth = 2; // thickness
	ctx.drawImage(img, map[card.charCodeAt(0)] * cw, map[card.charCodeAt(1)] * ch, cw, ch, x, y, cw * sc, ch * sc);
	ctx.strokeRect(x, y, cw * sc, ch * sc);
};

CardDrawer.draw_hand_horizontal = function(ctx, hand, x, y, w, h) {
	const hl = hand.length;
	if(hl == 0) return;
	let cw = w / Math.max(7, hl / 3);
	let ch = h;
	[cw, ch] = CardDrawer.fix_size(cw, ch);
	if(hl == 1) {
		CardDrawer.draw_card(ctx, hand[0], x + ((w - cw) / 2), y + ((h - ch) / 2), cw, ch);
		return;
	}
	let dw = Math.min(cw + 10, (w - cw) / (hl - 1));
	let ow = (w - ((hl - 1) * dw + cw)) / 2;
	for(let i = 0; i < hl; i++)
		CardDrawer.draw_card(ctx, hand[i], x + ow + dw * i, y + ((h - ch) / 2), cw, ch);
};
