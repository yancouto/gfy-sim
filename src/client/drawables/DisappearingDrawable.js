// Drawable that gradually disappears
"use strict";

const Drawable = require("./Drawable");

class DisappearingDrawable extends Drawable {
	constructor(drawable, color, timeout) {
		super();
		this.drawable = drawable;
		this.color = color;
		this.speed = 255 / timeout;
		this.can_delete = false;
		this.a = 255;
	}

	update(dt) {
		this.drawable.update(dt);
		this.a -= dt * this.speed;
		if(this.a < 0) {
			this.a = 0;
			this.can_delete = true;
		}
	}

	draw(ctx, x, y, w, h) {
		// Assumes it is filled
		const [r, g, b] = this.color;
		ctx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + Math.floor(this.a) + ")";
		this.drawable.draw(ctx, x, y, w, h);
	}
}

module.exports = DisappearingDrawable;
