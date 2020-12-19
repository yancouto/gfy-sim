// Manages room list

import GameLogic from "../server/GameLogic";
import WaitRoom from "../server/WaitRoom";

export class RoomMenu {
	constructor() {
		this.game_list = [];
		this.wait_rooms = [];
	}

	update_client(client) {
		let data;
		if (client.wait_room !== null) {
			data = client.wait_room.get_data(client.id); // shouldn't happen
		} else if (client.game !== null) {
			data = client.game.get_data(client.id);
		} else
			data = {
				room_list: Array.from(this.game_list, (r) => r.room.name).concat(
					Array.from(this.wait_rooms, (w) => w.name)
				),
				name: "RoomMenu",
			};
		client.socket.emit("update", data);
	}

	get_game(room_name) {
		const game = this.game_list.find((r) => r.room.name === room_name);
		if (game) return game;
		let room = this.wait_rooms.find((r) => r.name === room_name);
		if (!room) {
			room = new WaitRoom(room_name);
			this.wait_rooms.push(room);
		}
		return room;
	}

	quit_room(client) {
		if (client.game) {
			console.log("Exiting game room " + client.game.room.name);
			client.game.rem_player(client.id);
			this.game_list = this.game_list.filter(
				(w) => w.room.player_list.length > 0
			);
			client.game = null;
		} else if (client.wait_room) {
			console.log("Exiting wait room " + client.wait_room.name);
			client.wait_room.rem_player(client);
			this.wait_rooms = this.wait_rooms.filter((w) => w.player_list.length > 0);
			client.wait_room = null;
		} else console.warn("quit_room on client without room");
	}

	change_to_room(client, room_name, user_name) {
		console.log("Switching to room " + room_name + " with name " + user_name);
		const game = this.get_game(room_name);
		if (game instanceof GameLogic) {
			client.game = game;
			game.add_player(client.id, user_name);
		} else {
			client.wait_room = game;
			game.add_player(client, user_name);
		}
	}
}

// main RoomMenu
export const RM = new RoomMenu();
