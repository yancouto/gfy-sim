class Client {
	constructor(socket) {
		this.socket = socket;
		this.game = null;
	}
	get id() { return this.socket.id; }
	get on_game() { return this.game !== null; }
}

module.exports = Client;
