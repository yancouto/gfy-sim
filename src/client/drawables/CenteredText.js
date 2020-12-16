// Simple text

import Drawable from "./Drawable";
import RU from "../../client/RenderUtils";

class CenteredText extends Drawable {
	constructor(text) {
		super();
		this.text = text;
		this.font = "24px serif";
	}

	draw(ctx, x, y) {
		ctx.font = this.font;
		RU.draw_text_align(this.text, x, y);
	}

	set sz(s) {
		this.font = s + "px serif";
	}
}

export default CenteredText;
