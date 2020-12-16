// Image that can be clicked (and records last position)

import Drawable from "./Drawable";
import * as Util from "../../common/Utils";
import StickerList from "./StickerList";

class ClickableSticker extends Drawable {
	constructor(name) {
		super();
		this.img = StickerList[name];
		console.assert(this.img instanceof Image);
		this.name = name;
		[this.x, this.y, this.w, this.h] = [0, 0, 0, 0];
	}

	draw(ctx, x, y, w, h) {
		// maybe do some math to preserve aspect ratio
		ctx.drawImage(this.img, x, y, w, h);
		[this.x, this.y, this.w, this.h] = [x, y, w, h];
	}

	is_inside(x, y) {
		return Util.point_in_rect(x, y, this.x, this.y, this.w, this.h);
	}
}

export default ClickableSticker;
