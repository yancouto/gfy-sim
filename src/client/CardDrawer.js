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

CardDrawer.drawCard = function(ctx, card, x, y, w, h) {
	w = w || cw;
	h = h || (w / cw) * ch;
	ctx.lineWidth = 2; // thickness
	ctx.drawImage(img, map[card.charCodeAt(0)] * cw, map[card.charCodeAt(1)] * ch, cw, ch, x, y, w, h);
	ctx.strokeRect(x, y, w, h)
};
