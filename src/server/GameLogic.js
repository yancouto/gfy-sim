// Handles all server game logic for a single game
"use strict";

const Room = require("../common/Room");
const Event = require("../common/Event");

const now = require("performance-now");

const INITIAL_HAND_SIZE = 7;

class GameLogic {
	constructor(room_name) {
		this.room = new Room(room_name);
		this.room.played_cards.push(this.get_next_card());
		/* Is true while you can change the suit by sending a sticker,
		   that is, right after playing an 8 */
		this.can_change_suit = false; // used for 8
		this.can_swap_rules = false; // used for J
		this.first_card_to_swap = null; // used for J
		this.effect = {};
		for(let c of "23456789TJQKA")
			this.effect[c] = c;
		this.event_list = [];
	}

	add_player(pid) {
		let pi = this.room.add_player(pid);
		for(let i = 0; i < INITIAL_HAND_SIZE; i++)
			pi.hand.push(this.get_next_card());
		pi.sort_hand();
		if(this.room.turn_i === null)
			this.room.turn_i = 0;
	}

	rem_player(pid) {
		let i = this.room.player_list.findIndex(p => p.pid === pid);
		this.room.rem_player(pid);
		if(this.room.player_list.length === 0)
			this.room.turn_i = null;
		else if(this.room.turn_i === i)
			this.room.turn_i = (this.room.turn_i + 1) % this.room.player_list.length;
	}

	get_data(pid) {
		let pi = this.room.player_list.find(p => p.pid === pid);
		let new_events = [];
		for(let i = this.event_list.length - 1; i >= 0 && this.event_list[i].timestamp >= pi.last_timestamp; i--)
			new_events.push(this.event_list[i]);
		new_events.reverse();
		pi.last_timestamp = now();
		return {
			room: this.room,
			new_events,
			name: "Room"
		};
	}

	do_play(i, card) {
		const r = this.room;
		let top = r.played_cards[r.played_cards.length - 1];
		let nxt = r.played_cards.length > 1? r.played_cards[r.played_cards.length - 2] : null;
		// normal play
		if(r.turn_i === i && (card[0] === top[0] || card[1] === (r.current_suit || top[1])))
			return true;
		// provolone
		if(this.effect[card[0]] !== "2" && card[0] === top[0] && card[1] === top[1]) {
			r.turn_i = i;
			return true;
		}
		// 10 rule
		if(this.effect[card[0]] === "T" && nxt !== null) {
			let sum = 0;
			for(let c of (top[0] + nxt[0])) {
				if(c === "5" && this.effect["5"] !== "5") sum = 1000;
				if(this.effect[c] === "5") sum += 5;
				else // parseInt will return NaN on non-number, and work
					sum += parseInt(c.replace("A", "1"), 10);
			}
			if(sum == 10) {
				r.turn_i = i;
				return true;
			}
		}
		return false;
	}

	clamp_to_players(i) {
		if(i < 0 || i >= this.room.player_list.length) i %= this.room.player_list.length;
		if(i < 0) i += this.room.player_list.length;
		return i;
	}

	play_card(pid, index) {
		const r = this.room;
		const i = r.player_list.findIndex(p => p.pid === pid);
		const pi = r.player_list[i];
		const c = pi.hand[index];
		if(this.do_play(i, c)) {
			pi.hand = pi.hand.filter((c, id) => id != index);
			r.played_cards.push(c);

			// Queen --- reverses order
			if(this.effect[c[0]] === "Q") r.dir = -r.dir;
			// 9 --- previous player draws one, does not stack
			if(this.effect[c[0]] === "9") {
				const prev = r.player_list[this.clamp_to_players(r.turn_i - r.dir)];
				this.player_draws(prev, 1, "9");
			}
			// 4 --- silence rule
			if(this.effect[c[0]] === "4")
				r.silent = !r.silent;
			// 7 --- next player draws two, stacks
			if(this.effect[c[0]] === "7")
				r.must_draw = r.must_draw + 2;
			else if(r.must_draw > 0) {
				this.player_draws(pi, r.must_draw, "7");
				r.must_draw = 0;
			}
			r.current_suit = null;
			// 8 --- can change suit
			this.can_change_suit = (this.effect[c[0]] === "8"? pi.pid : false);

			// J --- can swap rules
			if(this.effect[c[0]] === "J") {
				// reset swap rules
				for(let c of "23456789TJQKA")
					this.effect[c] = c;
				this.can_swap_rules = pi.pid;
				this.first_card_to_swap = null;
			} else
				this.can_swap_rules = false;

			r.turn_i = this.clamp_to_players(r.turn_i + r.dir * (this.effect[c[0]] == "A"? 2 : 1));

			if(r.must_draw > 0)
				this.event_list.push(new Event(r.player_list[r.turn_i].pid, Event.EFF_7, {draw_count: r.must_draw}));
		} else {
			this.player_draws(pi, 2, "GFY");
		}
		while(r.played_cards.length > 10)
			r.remove_last_card_from_played();
	}

	send_sticker(pid, name) {
		console.log(pid + " sent sticker " + name);
		this.event_list.push(new Event(pid, Event.SENT_STICKER, {name}));

		if(this.room.silent) {
			this.room.silent = false;
			this.player_draws(this.room.player_list.find(p => p.pid === pid), 4, "4");
		}

		// changing the suit -- 8 RULE
		if(this.can_change_suit === pid && "CDHS".includes(name)) {
			this.room.current_suit = name;
			this.can_change_suit = false;
			this.event_list.push(new Event(pid, Event.EFF_8, {new_suit: name}));
		}

		// swaping rules -- J RULE
		if(this.can_swap_rules === pid && "23456789TJQKA".includes(name)) {
			if(!this.first_card_to_swap) {
				this.first_card_to_swap = name;
			} else {
				const [card_a, card_b] = [this.first_card_to_swap, name];
				this.effect[card_a] = card_b;
				this.effect[card_b] = card_a;
				this.event_list.push(new Event(pid, Event.EFF_J, {card_a, card_b}));
			}
		}
	}

	get_next_card() {
		// For now, assume the deck is infinite
		return "A23456789TJQK"[Math.floor(Math.random() * 13)]
		         + "CDHS"[Math.floor(Math.random() * 4)];
	}

	player_draws(pi, draw_count, reason) {
		for(let i = 0; i < draw_count; i++)
			pi.add_to_hand(this.get_next_card());
		this.event_list.push(new Event(pi.pid, Event.DRAW, {draw_count, reason}));
	}
}

module.exports = GameLogic;
