// Simple image
"use strict";

const Drawable = require("./Drawable");

class CenteredImage extends Drawable {
	constructor(img, sz) {
		super();
		if (img instanceof Image) this.img = img;
		else {
			this.img = new Image();
			this.img.src = img;
		}
		this.sz = sz;
	}

	draw(ctx, x, y) {
		const sz = this.sz;
		ctx.drawImage(this.img, x - sz / 2, y - sz / 2, sz, sz);
	}
}

module.exports = CenteredImage;
