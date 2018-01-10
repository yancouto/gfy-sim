// Simple text
"use strict";

const Drawable = require("./Drawable");
const RU = require("../../client/RenderUtils");

class Image extends Drawable {
	constructor(text, font, h_align, v_align) {
		super();
		this.text = text;
		this.font = font;
		this.h_align = h_align;
		this.v_align = v_align;
	}

	draw(ctx, x, y) {
		ctx.font = this.font;
		RU.draw_text_align(this.text, x, y, this.h_align, this.v_align);
	}
}

module.exports = Image;
