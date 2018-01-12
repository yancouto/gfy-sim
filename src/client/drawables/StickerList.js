"use strict";

const list = module.exports = {};

// TODO Add images for all stickers

// Suits
for(const suit of "CDSH")
	list[suit] = "assets/card_back.png";

// Cards
for(const card of "23456789TJQKA")
	list[card] = "assets/card_back.png";

// Extra
list.oi = "assets/card_back.png";
list.tchau = "assets/card_back.png";

// Creating Images for the stickers
for(let name in list) {
	const img = new Image();
	img.src = list[name];
	list[name] = img;
}
