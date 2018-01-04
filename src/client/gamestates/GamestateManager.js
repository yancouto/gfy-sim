const RenderUtils = require("../../client/RenderUtils");

class GamestateManager {
	constructor() {
		this.cur_gs = null;
	}

	switch_to(gs) {
		this.cur_gs = gs; // improve this later, if necessary
	}

	process(dt) {
		if(this.cur_gs !== null) {
			this.cur_gs.update(dt);
			this.cur_gs.draw(RenderUtils.ctx);
		}
	}
}

module.exports = GamestateManager;
