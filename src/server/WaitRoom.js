"use strict";

class Client {
	constructor(client) {
		this.client = client;
		this.confirmed = false;
	}
}

const GameLogic = require("../server/GameLogic");

class WaitRoom {
	constructor(name) {
		this.name = name;
		this.player_list = [];
		this.start_i = null;
	}

	add_player(client) {
		this.player_list.push(new Client(client));
	}

	rem_player(client) {
		let i = this.player_list.findIndex(p => p.client === client);
		if(i === -1) return;
		this.player_list = this.player_list.filter(p => p.client !== client);
		if(i === this.start_i)
			this.start_i = null;
		this.check_done();
	}

	get_data(client) {
		return {
			name: "WaitRoom",
			room_name: this.name,
			start_i: this.start_i,
			total: this.player_list.length,
			confirmed_total: this.player_list.reduce((acc, cur) => acc + (cur.confirmed? 1 : 0), 0),
			confirmed: this.player_list.find(p => p.client === client).confirmed
		};
	}

	// Check if the game is ready to start
	check_done() {
		if(this.start_i !== null && this.player_list.length > 1 && this.player_list.findIndex(p => !p.confirmed) === -1) {
			let RoomMenu = require("../server/RoomMenu").RM;
			RoomMenu.wait_rooms = RoomMenu.wait_rooms.filter(w => w === this);
			let game = new GameLogic(this.name);
			for(let p of this.player_list) {
				p.client.game = game;
				p.client.wait_room = null;
				game.add_player(p.client.id);
			}
			game.room.turn_i = this.start_i;
			RoomMenu.game_list.push(game);
		}
	}

	// Client declared he will start first
	i_will_start(client) {
		if(this.start_i === null)
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
