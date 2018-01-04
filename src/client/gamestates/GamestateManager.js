// Manages current gamestate and switching
"use strict";
const RenderUtils = require("../../client/RenderUtils");

class GamestateManager {
	constructor() {
		this.cur_gs = null;
	}

	switch_to(gs) {
		console.log("Switching from gamestate " + (this.cur_gs? this.cur_gs.name : "null") + " to " + (gs? gs.name : "null"));
		this.cur_gs = gs; // improve this later, if necessary
	}

	process(dt) {
		if(this.cur_gs !== null) {
			this.cur_gs.update(dt);
			this.cur_gs.draw(RenderUtils.ctx);
		}
	}

	get current_gamestate() { return cur_gs; }
}

// main GamestateManager
GamestateManager.GM = new GamestateManager();

module.exports = GamestateManager;
