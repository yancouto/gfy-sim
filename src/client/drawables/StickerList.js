"use strict";

const list = module.exports = {};

// TODO follow this format and add all stickers
list.oi = "assets/card_back.png";

for(let i = 1; i <= 10; i++)
	list["oi" + i] = "assets/card_back.png";

// Creating Images for the stickers
for(let name in list) {
	const img = new Image();
	img.src = list[name];
	list[name] = img;
}
