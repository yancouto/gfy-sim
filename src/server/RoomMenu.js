// Manages room list
"use strict";

const Room = require("../common/Room");

class RoomMenu {
	constructor() {
		this.room_list = [];
	}

	update_client(client) {
		let data;
		if(client.room == null) {
			data = {
				room_list: Array.from(this.room_list, (r) => r.name),
				name: "RoomMenu"
			};
		} else
			data = {
				room: client.room,
				name: "Room"
			};
		client.socket.emit("update", data);
	}

	get_room(room_name) {
		let room = this.room_list.find((r) => r.name === room_name);
		if(!room) {
			room = new Room(room_name);
			this.room_list.push(room);
		}
		return room;
	}

	quit_room(client) {
		console.log("Exiting room " + client.room.name);
		client.room.rem_player(client.id);
		client.room = null;
	}

	change_to_room(client, room_name) {
		console.log("Switching to room " + room_name);
		let room = this.get_room(room_name);
		room.add_player(client.id);
		client.room = room;
	}
}

// main RoomMenu
RoomMenu.RM = new RoomMenu();

module.exports = RoomMenu;
