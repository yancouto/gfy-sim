"use strict";

const classic_deck = module.exports = {};
classic_deck.cw = 280;
classic_deck.ch = 390;
classic_deck.sheet = new Image();
classic_deck.sheet.src = "assets/classic_cards.png";
classic_deck.back = new Image();
classic_deck.back.src = "assets/card_back.png";

classic_deck.map = new Uint8Array(128);

for(let i = 0; i < 14; i++)
	classic_deck.map["A23456789TJQK".charCodeAt(i)] = i;

for(let i = 0; i < 4; i++)
	classic_deck.map["CDHS".charCodeAt(i)] = i;


classic_deck.draw_card = function(ctx, card, x, y, w, h) {
	ctx.drawImage(this.sheet, this.map[card.charCodeAt(0)] * this.cw, this.map[card.charCodeAt(1)] * this.ch, this.cw, this.ch, x, y, w, h);
};

classic_deck.draw_back = function(ctx, x, y, w, h) {
	ctx.drawImage(this.back, x, y, w, h);
};
