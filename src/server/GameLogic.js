// Handles all server game logic for a single game
"use strict";

const Room = require("../common/Room");

const INITIAL_HAND_SIZE = 7;

class GameLogic {
	constructor(room_name) {
		this.room = new Room(room_name);
		this.room.played_cards.push(this.get_next_card());
	}

	add_player(pid) {
		let pi = this.room.add_player(pid);
		for(let i = 0; i < INITIAL_HAND_SIZE; i++)
			pi.hand.push(this.get_next_card());
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

	get_next_card() {
		// For now, assume the deck is infinite
		return "A23456789TJQK"[Math.floor(Math.random() * 13)]
		         + "CDHS"[Math.floor(Math.random() * 4)];
	}
}

module.exports = GameLogic;
