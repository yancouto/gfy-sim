// Manages room list
"use strict";

const GameLogic = require("../server/GameLogic");

class RoomMenu {
	constructor() {
		this.game_list = [];
	}

	update_client(client) {
		let data;
		if(client.game == null) {
			data = {
				room_list: Array.from(this.game_list, (r) => r.room.name),
				name: "RoomMenu"
			};
		} else
			data = {
				room: client.game.room,
				name: "Room"
			};
		client.socket.emit("update", data);
	}

	get_game(room_name) {
		let game = this.game_list.find((r) => r.room.name === room_name);
		if(!game) {
			game = new GameLogic(room_name);
			this.game_list.push(game);
		}
		return game;
	}

	quit_room(client) {
		console.log("Exiting room " + client.game.room.name);
		client.game.rem_player(client.id);
		client.game = null;
	}

	change_to_room(client, room_name) {
		console.log("Switching to room " + room_name);
		let game = this.get_game(room_name);
		game.add_player(client.id);
		client.game = game;
	}
}

// main RoomMenu
RoomMenu.RM = new RoomMenu();

module.exports = RoomMenu;
