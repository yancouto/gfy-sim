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
	}

	rem_client(client) {
		console.log("client disconnected " + client.socket.id);
		this.id_to_client.delete(client.socket.id);
	}

	upd_client(client) {
		if(client.room === null) {
			RoomMenu.update_client(client);
		} else {
			// TODO
		}
	}
}

// Main client manager
ClientManager.CM = new ClientManager;

module.exports = ClientManager;
