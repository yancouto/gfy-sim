"use strict";

const Utils = require("../common/Utils.js");

class Client {
	constructor(client, user_name) {
		this.client = client;
		this.confirmed = false;
		this.user_name = user_name;
	}
}

const GameLogic = require("../server/GameLogic");

class WaitRoom {
	constructor(name, last_winner, win_streak) {
		this.name = name;
		this.player_list = [];
		this.start_i = null;
		this.last_winner = last_winner;
		this.win_streak = win_streak;
	}

	add_player(client, user_name) {
		user_name = Utils.avoid_duplicate_name(
			user_name,
			this.player_list.map(p => p.user_name)
		);
		this.player_list.push(new Client(client, user_name));
	}

	rem_player(client) {
		let i = this.player_list.findIndex(p => p.client === client);
		if (i === -1) return;
		this.player_list = this.player_list.filter(p => p.client !== client);
		if (i === this.start_i) this.start_i = null;
		this.check_done();
	}

	get_data(client) {
		return {
			name: "WaitRoom",
			room_name: this.name,
			start_i: this.start_i,
			players: this.player_list.map(p => ({
				confirmed: p.confirmed,
				name: p.user_name,
			})),
			confirmed: this.player_list.find(p => p.client === client).confirmed,
			my_name: this.player_list.find(p => p.client === client).user_name,
			last_winner: this.last_winner,
			win_streak: this.win_streak,
		};
	}

	// Check if the game is ready to start
	check_done() {
		if (
			this.start_i !== null &&
			this.player_list.length > 1 &&
			this.player_list.findIndex(p => !p.confirmed) === -1
		) {
			const RoomMenu = require("../server/RoomMenu").RM;
			RoomMenu.wait_rooms = RoomMenu.wait_rooms.filter(w => w !== this);
			let game = new GameLogic(this.name, this.last_winner, this.win_streak);
			for (let p of this.player_list) {
				p.client.game = game;
				p.client.wait_room = null;
				game.add_player(p.client.id, p.user_name);
				p.client.socket.emit("switch gamestate", "Room");
			}
			game.room.turn_i = this.start_i;
			RoomMenu.game_list.push(game);
		}
	}

	// Client declared he will start first
	i_will_start(client) {
		if (this.start_i === null)
			this.start_i = this.player_list.findIndex(p => p.client === client);
		this.check_done();
	}

	// Client declared to be ready
	i_am_ready(client) {
		this.player_list.find(p => p.client === client).confirmed = true;
		this.check_done();
	}
}

module.exports = WaitRoom;
