class Client {
	constructor(socket) {
		this.socket = socket;
		this.room = null;
	}
}

module.exports = Client;
