// Manages room list
"use strict";

const GameLogic = require("../server/GameLogic");
const WaitRoom = require("../server/WaitRoom");

class RoomMenu {
	constructor() {
		this.game_list = [];
		this.wait_rooms = [];
	}

	update_client(client) {
		let data;
		if(client.wait_room !== null) {
			data = client.wait_room.get_data(client.id);
		} else if(client.game !== null) {
			data = {
				room: client.game.room,
				name: "Room"
			};
		} else
			data = {
				room_list: Array.from(this.game_list, (r) => r.room.name),
				name: "RoomMenu"
			};
		client.socket.emit("update", data);
	}

	get_game(room_name) {
		let game = this.game_list.find((r) => r.room.name === room_name);
		if(game) return game;
		let room = this.wait_rooms.find(r => r.name === room_name);
		if(!room) {
			room = new WaitRoom(room_name);
			this.wait_rooms.push(room);
		}
		return room;
	}

	quit_room(client) {
		if(client.game) {
			console.log("Exiting game room " + client.game.room.name);
			client.game.rem_player(client.id);
			client.game = null;
		} else if(client.wait_room) {
			console.log("Exiting wait room " + client.wait_room.name);
			client.wait_room.rem_player(client.id);
			client.wait_room = null;

		} else console.warn("quit_room on client without room");
	}

	change_to_room(client, room_name) {
		console.log("Switching to room " + room_name);
		let game = this.get_game(room_name);
		game.add_player(client.id);
		if(game instanceof GameLogic)
			client.game = game;
		else
			client.wait_room = game;
	}
}

// main RoomMenu
RoomMenu.RM = new RoomMenu();

module.exports = RoomMenu;
