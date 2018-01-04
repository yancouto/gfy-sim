class Client {
	constructor(socket) {
		this.socket = socket;
		this.room = null;
	}
	get id() { return this.socket.id; }
}

module.exports = Client;
