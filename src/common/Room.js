// Room where a GFY game is played
"use strict";

const PlayerInfo = require("../common/PlayerInfo");

class Room {
	constructor(name) {
		this.name = name;
		this.player_list = [];
	}

	add_player(pid) {
		this.player_list.push(new PlayerInfo(pid));
	}

	rem_player(pid) {
		this.player_list = this.player_list.filter((p) => p.pid !== pid);
	}
}

module.exports = Room;
