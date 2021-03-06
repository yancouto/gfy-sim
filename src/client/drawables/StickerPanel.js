// Draws a bunch of square stickers

import Drawable from "./Drawable";
import Sticker from "./ClickableSticker";
import StickerList from "./StickerList";

class StickerPanel extends Drawable {
	constructor() {
		super();
		this.stickers = [];
		for (const name in StickerList) this.stickers.push(new Sticker(name));
		this.last_size = 10;
	}

	update(dt) {
		for (const s of this.stickers) s.update(dt);
	}

	can_draw(size, border, w, h) {
		if (size > w || size > h) return false;
		const row = 1 + Math.floor((w - size) / (size + border));
		const col = 1 + Math.floor((h - size) / (size + border));
		return row * col >= this.stickers.length;
	}

	draw(ctx, x, y, w, h) {
		const n = this.stickers.length;
		const border = 0;
		// this is faster if the width and height do not change much, otherwise it is better to do binary search
		while (this.can_draw(this.last_size + 1, border, w, h)) this.last_size++;
		while (!this.can_draw(this.last_size, border, w, h)) this.last_size--;
		const size = this.last_size;
		const row = 1 + Math.floor((w - size) / (size + border));
		const col = 1 + Math.floor((h - size) / (size + border));
		for (let i = 0; i < col; i++)
			for (let j = 0; j < row; j++) {
				const k = i * row + j;
				if (k >= n) return;
				this.stickers[k].draw(
					ctx,
					x + j * (size + border),
					y + i * (size + border),
					size,
					size
				);
			}
	}

	get_clicked_sticker(x, y) {
		// Do this using division and part of the code in draw, if efficiency is needed. It is probably not.
		const s = this.stickers.find((s) => s.is_inside(x, y));
		if (s) return s.name;
		return undefined;
	}
}

export default StickerPanel;
