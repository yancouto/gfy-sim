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
		this.silent = false; // used for 4
		this.turn_i = null;
		this.mixed_turn = false; // whether the turn is currently mixed
		this.dir = +1;
		this.must_draw = 0; // used for 7
		this.current_suit = null; // used for 8
	}

	clamp_to_players(i) {
		if(i < 0 || i >= this.player_list.length) i %= this.player_list.length;
		if(i < 0) i += this.player_list.length;
		return i;
	}

	this_turn_or_mixed(i) {
		return this.turn_i === i || (this.mixed_turn && this.clamp_to_players(i - 1) === this.turn_i);
	}

	add_player(pid, name) {
		let pi = new PlayerInfo(pid, name);
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
