"use strict";

const Room = require("../common/Room");

class GameLogic {
	constructor(room_name) {
		this.room = new Room(room_name);
	}

	add_player(pid) {
		this.room.add_player(pid);
	}

	rem_player(pid) {
		this.room.rem_player(pid);
	}

	play_card(pid, index) {
		let pi = this.room.get_player_info(pid);
		let c = pi.hand[index];
		pi.hand = pi.hand.filter((c, id) => id != index);
		this.room.played_cards.push(c);
	}
}

module.exports = GameLogic;
