/* A gamestate is a client game state, it updates and draws, and should be self-contained, like a menu, or a credits screen. */
"use strict";

class Gamestate {
	constructor() {
		this.name = "unnamed";
	}
	update(dt) {}
	draw(ctx) {}
}

module.exports = Gamestate;
