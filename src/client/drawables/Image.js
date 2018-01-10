// Simple image
"use strict";

const Drawable = require("./Drawable");

class Image extends Drawable {
	constructor(img) {
		super();
		if(img instanceof Image)
			this.img = img;
		else {
			this.img = new Image();
			this.img.src = img;
		}
	}

	draw(ctx, x, y, w, h) {
		// maybe do some math to preserve aspect ratio
		ctx.drawImage(this.img, x - w / 2, y - h / 2, w, h);
	}
}

module.exports = Image;
