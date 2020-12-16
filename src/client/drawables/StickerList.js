const list = {};

// Suits
for (const suit of "CDSH") list[suit] = "assets/stickers/" + suit + ".png";

// Cards
for (const card of "23456789TJQKA")
	list[card] = "assets/stickers/" + card + ".png";

// Extra
for (const name of ["laugh", "tongue", "me", "you"])
	list[name] = "assets/stickers/" + name + ".png";

// Creating Images for the stickers
for (const name in list) {
	const img = new Image();
	img.src = list[name];
	list[name] = img;
}

export default list;
