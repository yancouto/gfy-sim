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
			RenderUtils.ctx.clearRect(0, 0, RenderUtils.W, RenderUtils.H);
			this.cur_gs.draw(RenderUtils.ctx);
		}
	}

	sync_data(data) {
		console.log(JSON.stringify(data));
		if(this.cur_gs !== null) {
			if(data.name != this.cur_gs.name)
				console.log("Data for wrong gamestate (" + data.name  + " vs " + this.cur_gs.name + ").");
			else
				this.cur_gs.sync_to_server(data);
		} else
			console.log("Data on null gamestate.");

	}
}

// main GamestateManager
GamestateManager.GM = new GamestateManager();

module.exports = GamestateManager;
