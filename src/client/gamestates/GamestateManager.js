// Manages current gamestate and switching

import RenderUtils from "../../client/RenderUtils";

class GamestateManager {
	constructor() {
		this.cur_gs = null;
	}

	switch_to(gs) {
		console.log(
			"Switching from gamestate " +
				(this.cur_gs ? this.cur_gs.name : "null") +
				" to " +
				(gs ? gs.name : "null")
		);
		if (this.cur_gs) this.cur_gs.exit();
		this.cur_gs = gs; // improve this later, if necessary
		if (this.cur_gs) this.cur_gs.enter();
	}

	process(dt) {
		if (this.cur_gs !== null) {
			this.cur_gs.update(dt);
			RenderUtils.ctx.clearRect(0, 0, RenderUtils.W, RenderUtils.H);
			RenderUtils.ctx.save();
			this.cur_gs.draw(RenderUtils.ctx);
			RenderUtils.ctx.restore();
		}
	}

	sync_data(data) {
		if (this.cur_gs !== null) {
			if (data.name != this.cur_gs.name) {
				console.log(
					"Data for wrong gamestate (" +
						data.name +
						" vs " +
						this.cur_gs.name +
						")."
				);
				this.cur_gs.wrong_data(data);
			} else this.cur_gs.sync_to_server(data);
		} else console.log("Data on null gamestate.");
	}

	get current_gamestate() {
		return this.cur_gs;
	}
}

// main GamestateManager
export const GM = new GamestateManager();
