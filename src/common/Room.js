// Room where a GFY game is played
"use strict";

const PlayerInfo = require("../common/PlayerInfo");
const PRNG = require("../external/PRNG");
const random = new PRNG(Math.round(Math.random() * 1123123));


class Room {
	constructor(name) {
		this.name = name;
		this.player_list = [];
		this.played_cards = ["AC", "9H"];
		for(let i = 0; i < 10; i++)
			this.played_cards.push("AC");
		this.starting_angle = 0;
		this.seed = 12;
		const self = this;
		setInterval(() => {
			self.played_cards.shift();
			self.played_cards.push("TD");
			random._seed = self.seed;
			random.nextInt();
			self.seed = random._seed;
		} , 1000);
	}

	add_player(pid) {
		this.player_list.push(new PlayerInfo(pid));
	}

	rem_player(pid) {
		this.player_list = this.player_list.filter((p) => p.pid !== pid);
	}
}

module.exports = Room;
