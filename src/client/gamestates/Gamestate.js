/* A gamestate is a client game state, it updates and draws, and should be self-contained, like a menu, or a credits screen. */
"use strict";

class Gamestate {
	constructor() {
		this.name = "unnamed";
	}
	// Called once when you enter the gamestate
	enter() {}
	// Called once when you exit the gamestate
	exit() {}
	// Updates the state
	update(dt) {}
	// Draws on screen
	draw(ctx) {}
	// Syncs with data from server
	sync_to_server(data) {}
}

module.exports = Gamestate;
