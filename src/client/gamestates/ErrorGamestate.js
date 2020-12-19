import Gamestate from "./Gamestate";
import RU from "../../client/RenderUtils";

export default class ErrorGamestate extends Gamestate {
	constructor(msg) {
		super();
		this.name = "error";
		this.msg = msg;
	}
	draw(ctx) {
		RU.set_font(15);
		ctx.fillStyle = "rgb(0, 0, 0)";
		RU.draw_text_align(`Error: ${this.msg}`, RU.W / 2, RU.H / 2);
	}
}
