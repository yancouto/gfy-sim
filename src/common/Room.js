/* Room where a GFY game is played
 * Only stores data common to client and server */
"use strict";

const PlayerInfo = require("../common/PlayerInfo");
const PRNG = require("../external/PRNG");
const random = new PRNG(Math.round(Math.random() * 1123123));

class Room {
	constructor(name) {
		this.name = name;
		this.player_list = [];
		this.played_cards = [];
		this.starting_angle = 0;
		this.seed = 12;
	}

	add_player(pid) {
		let pi = new PlayerInfo(pid);
		this.player_list.push(pi);
		return pi;
	}

	rem_player(pid) {
		this.player_list = this.player_list.filter((p) => p.pid !== pid);
	}

	get_player_info(pid) {
		return this.player_list.find((p) => p.pid == pid);
	}

	remove_last_card_from_played() {
		this.played_cards.shift();
		random._seed = this.seed;
		random.nextInt();
		this.seed = random._seed;
	}
}

module.exports = Room;
