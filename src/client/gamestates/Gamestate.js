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
	update(dt) {} // eslint-disable-line no-unused-vars
	// Draws on screen
	draw(ctx) {} // eslint-disable-line no-unused-vars
	// Syncs with data from server
	sync_to_server(data) {} // eslint-disable-line no-unused-vars
	// Received data for wrong gamestate
	wrong_data(data) {} // eslint-disable-line no-unused-vars
}

module.exports = Gamestate;
