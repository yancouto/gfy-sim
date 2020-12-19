// Manages current gamestate and switching

import RenderUtils from "../../client/RenderUtils";
import RoomMenu from "./RoomMenu";
import Room from "./RoomGamestate";
import WaitRoom from "./WaitRoom";

const GS = { RoomMenu: RoomMenu, Room: Room, WaitRoom: WaitRoom };

class GamestateManager {
	constructor() {
		this.cur_gs = null;
	}

	switch_to(gs) {
		console.log(`Switching from gamestate ${this.cur_gs?.name} to ${gs?.name}`);
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
		if (data.name !== this.cur_gs?.name) {
			const cls = GS[data.name];
			this.switch_to(new cls());
		}
		this.cur_gs.sync_to_server(data);
	}

	get current_gamestate() {
		return this.cur_gs;
	}
}

// main GamestateManager
export const GM = new GamestateManager();
