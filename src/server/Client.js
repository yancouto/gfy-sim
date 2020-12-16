import cookie from "cookie";

class Client {
	constructor(socket) {
		this.socket = socket;
		// Should probably use this in the future as id
		this.cookie_id = cookie.parse(socket.handshake.headers.cookie)["player_id"];
		this.id = socket.id;
		this.game = null;
		this.wait_room = null;
	}
	get on_game() {
		return this.game !== null;
	}
	get on_room() {
		return this.game !== null || this.wait_room !== null;
	}
}

export default Client;
