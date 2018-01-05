// Handles all server game logic for a single game
"use strict";

const Room = require("../common/Room");

const INITIAL_HAND_SIZE = 7;

class GameLogic {
	constructor(room_name) {
		this.room = new Room(room_name);
		this.room.played_cards.push(this.get_next_card());
		this.silent = false;
		this.turn_i = null;
		this.dir = +1;
		this.effect = {};
		for(let c of "A23456789TJQK")
			this.effect[c] = c;
	}

	add_player(pid) {
		let pi = this.room.add_player(pid);
		for(let i = 0; i < INITIAL_HAND_SIZE; i++)
			pi.hand.push(this.get_next_card());
		pi.sort_hand();
		if(this.turn_i === null)
			this.turn_i = 0;
	}

	rem_player(pid) {
		let i = this.room.player_list.findIndex(p => p.pid === pid);
		this.room.rem_player(pid);
		if(this.room.player_list.length === 0)
			this.turn_i = null;
		else if(this.turn_i === i)
			this.turn_i = (this.turn_i + 1) % this.room.player_list.length;
	}

	do_play(i, card) {
		let top = this.room.played_cards[this.room.played_cards.length - 1];
		let nxt = this.room.played_cards.length > 1? this.room.played_cards[this.room.played_cards.length - 2] : null;
		// normal play
		if(this.turn_i === i && (card[0] === top[0] || card[1] === top[1]))
			return true;
		// provolone
		if(this.effect[card[0]] !== "2" && card[0] === top[0] && card[1] === top[1]) {
			this.turn_i = i;
			return true;
		}
		// 10 rule
		if(nxt !== null && !["T", "J", "Q", "K"].find(c => (c == top[0] || c == nxt[0]))) {
			let sum = 0;
			for(let c of (top[0] + nxt[0])) {
				if(c === "5" && this.effect["5"] !== "5") sum = 1000;
				if(this.effect[c] === "5") sum += 5;
				else sum += parseInt(c.replace("A", "1"), 10);
			}
			if(sum == 10) return true;
		}
		return false;
	}

	clamp_to_players(i) {
		if(i < 0 || i >= this.room.player_list.length) i %= this.room.player_list.length;
		if(i < 0) i += this.room.player_list.length;
		return i;
	}

	play_card(pid, index) {
		let i = this.room.player_list.findIndex(p => p.pid === pid);
		let pi = this.room.player_list[i];
		let c = pi.hand[index];
		if(this.do_play(i, c)) {
			pi.hand = pi.hand.filter((c, id) => id != index);
			this.room.played_cards.push(c);

			// Queen --- reverses order
			if(this.effect[c[0]] === "Q") this.dir = -this.dir;
			// 9 --- previous buys one, does not stack
			if(this.effect[c[0]] === "9")
				this.room.player_list[this.clamp_to_players(this.turn_i - this.dir)].add_to_hand(this.get_next_card());
			this.turn_i = this.clamp_to_players(this.turn_i + this.dir * (this.effect[c[0]] == "A"? 2 : 1));
		} else {
			pi.add_to_hand(this.get_next_card(), this.get_next_card());
		}
	}

	get_next_card() {
		// For now, assume the deck is infinite
		return "A23456789TJQK"[Math.floor(Math.random() * 13)]
		         + "CDHS"[Math.floor(Math.random() * 4)];
	}
}

module.exports = GameLogic;
