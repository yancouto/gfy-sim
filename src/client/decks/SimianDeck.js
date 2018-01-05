const simian_deck = module.exports = {};
simian_deck.cw = 252;
simian_deck.ch = 347;
simian_deck.sheet = new Image();
simian_deck.sheet.src = "assets/simian_cards.png";

simian_deck.map = new Map();

let c_i = 0, c_j = 3;

for(let s = 0; s < 4; s++)
	for(let c = 0; c < 13; c++) {
		simian_deck.map["23456789TJQKA"[c] + "HCDS"[s]] = [4 + c_j * 6 + c_j * simian_deck.cw, 13 + c_i * 6.7 + c_i * simian_deck.ch];
		c_j++;
		if(c_j == 4) {
			c_i++;
			c_j = 0;
		}
	}
simian_deck.map["??"] = [4 + c_j * 6 + c_j * simian_deck.cw, 13 + c_i * 6.7 + c_i * simian_deck.ch];

simian_deck.draw_card = function(ctx, card, x, y, w, h) {
	let [dx, dy] = this.map[card];
	ctx.drawImage(this.sheet, dx, dy, this.cw, this.ch, x, y, w, h);
};

simian_deck.draw_back = function(ctx, x, y, w, h) {
	simian_deck.draw_card(ctx, "??", x, y, w, h);
};
