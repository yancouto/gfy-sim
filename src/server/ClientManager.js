const Client = require("../server/Client");
const RoomMenu = require("../server/RoomMenu").RM;

class ClientManager {
	constructor() {
		this.id_to_client = new Map();
	}

	add_client(socket) {
		console.log("client connected " + socket.id);
		let c = new Client(socket);
		this.id_to_client.set(socket.id, c);

		let self = this;
		socket.on("disconnect", () => self.rem_client(c));
		socket.on("request update", () => self.upd_client(c));
		socket.on("change room", (to) => self.change_room(c, to));
		socket.on("play card", (index) => self.play_card(c, index));
	}

	rem_client(client) {
		console.log("client disconnected " + client.socket.id);
		if(client.on_game)
			RoomMenu.quit_room(client);
		this.id_to_client.delete(client.socket.id);
	}

	upd_client(client) {
		RoomMenu.update_client(client);
	}

	change_room(client, new_room) {
		if(client.on_game)
			RoomMenu.quit_room(client);
		if(new_room)
			RoomMenu.change_to_room(client, new_room);
	}

	play_card(client, index) {
		if(!client.on_game) return;
		client.game.play_card(client.id, index);
	}
}

// Main client manager
ClientManager.CM = new ClientManager;

module.exports = ClientManager;
