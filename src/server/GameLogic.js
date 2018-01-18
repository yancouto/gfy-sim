// Handles all server game logic for a single game
"use strict";

const Room = require("../common/Room");
const Event = require("../common/Event");

const now = require("performance-now");

const INITIAL_HAND_SIZE = 7;

class GameLogic {
	constructor(room_name, last_winner, win_streak) {
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
		this.last_winner = last_winner;
		this.win_streak = win_streak || 0;
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
		this.check_game_end();
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

	// Sends you back to the wait room
	won(winner_pi) {
		console.log(winner_pi.pid + " won!");
		const RoomMenu = require("../server/RoomMenu").RM;
		RoomMenu.game_list = RoomMenu.game_list.filter(g => g !== this);
		const WaitRoom = require("../server/WaitRoom");
		const wait_room = new WaitRoom(this.room.name, winner_pi.pid, winner_pi.pid === this.last_winner? this.win_streak + 1 : 1);
		const ClientManager = require("../server/ClientManager").CM;
		for(const pi of this.room.player_list) {
			const client = ClientManager.id_to_client.get(pi.pid);
			client.game = null;
			client.wait_room = wait_room;
			wait_room.add_player(client);
			client.socket.emit("switch gamestate", "WaitRoom");
		}
		RoomMenu.wait_rooms.push(wait_room);
	}

	check_game_end() {
		// All other players left
		if(this.room.player_list.length === 1)
			this.won(this.room.player_list[0]);
		// No cards in hand
		for(const pi of this.room.player_list)
			if(pi.hand.length === 0) {
				this.won(pi);
				return;
			}
	}

	can_play(i, card) {
		const r = this.room;
		let top = r.played_cards[r.played_cards.length - 1];
		let nxt = r.played_cards.length > 1? r.played_cards[r.played_cards.length - 2] : null;
		// normal play
		if(r.this_turn_or_mixed(i) && (card[0] === top[0] || card[1] === (r.current_suit || top[1])))
			return true;
		// provolone
		if(this.effect[card[0]] !== "2" && card[0] === top[0] && card[1] === top[1])
			return true;
		// 10 rule
		if(this.effect[card[0]] === "T" && nxt !== null) {
			let sum = 0;
			for(let c of (top[0] + nxt[0])) {
				if(c === "5" && this.effect["5"] !== "5") sum = 1000;
				if(this.effect[c] === "5") sum += 5;
				else // parseInt will return NaN on non-number, and work
					sum += parseInt(c.replace("A", "1"), 10);
			}
			if(sum == 10)
				return true;
		}
		return false;
	}


	play_card(pid, index) {
		const r = this.room;
		const i = r.player_list.findIndex(p => p.pid === pid);
		const pi = r.player_list[i];
		const c = pi.hand[index];
		if(this.can_play(i, c)) {
			r.mixed_turn = false;
			r.turn_i = i; // becomes this players turn if it was not already
			pi.hand = pi.hand.filter((c, id) => id != index);
			r.played_cards.push(c);

			// Queen --- reverses order
			if(this.effect[c[0]] === "Q") r.dir = -r.dir;
			// 9 --- previous player draws one, does not stack
			if(this.effect[c[0]] === "9") {
				const prev = r.player_list[r.clamp_to_players(r.turn_i - r.dir)];
				this.player_draws(prev, 1, "9");
			}
			// 4 --- silence rule
			if(this.effect[c[0]] === "4")
				r.silent = !r.silent;
			// 7 --- next player draws two, stacks
			if(this.effect[c[0]] === "7")
				r.must_draw = r.must_draw + 2;
			else
				this.flush_7();
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

			// K --- if winner, everyone else draws according to win streak
			if(this.effect[c[0]] === "K" && pid === this.last_winner)
				for(const p of r.player_list)
					if(p.pid !== pid)
						this.player_draws(p, this.win_streak, "K");

			r.turn_i = r.clamp_to_players(r.turn_i + r.dir * (this.effect[c[0]] == "A"? 2 : 1));

			if(r.must_draw > 0)
				this.event_list.push(new Event(r.player_list[r.turn_i].pid, Event.EFF_7, {draw_count: r.must_draw}));

			this.check_game_end();

		} else {
			if(this.turn_i === i)
				this.flush_7();
			this.player_draws(pi, 2, "GFY");
		}
		while(r.played_cards.length > 10)
			r.remove_last_card_from_played();
	}

	flush_7() {
		const pi = this.room.player_list[this.room.turn_i];
		if(this.room.must_draw > 0) {
			this.player_draws(pi, this.room.must_draw, "7");
			this.room.must_draw = 0;
		}
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

	draw_from_stack(pid) {
		const i = this.room.player_list.findIndex(p => p.pid === pid);
		const pi = this.room.player_list[i];
		if(this.room.turn_i !== i) {
			this.player_draws(pi, 2, "GFY");
			return;
		}
		this.flush_7();
		for(const card of pi.hand)
			if(this.can_play(i, card)) {
				this.player_draws(pi, 2, "GFY");
				return;
			}
		this.player_draws(pi, 1, "stack");
		this.room.mixed_turn = true;
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
