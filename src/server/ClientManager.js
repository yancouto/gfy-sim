import Cookies from "cookies";
import Client from "../server/Client";
import { RM as RoomMenu } from "../server/RoomMenu";

export class ClientManager {
	constructor() {
		this.id_to_client = new Map();
	}

	add_client(socket) {
		const c = new Client(socket);
		console.log("client connected " + c.id);
		this.id_to_client.set(c.id, c);

		const self = this;
		socket.on("disconnect", () => self.rem_client(c));
		socket.on("request update", () => self.upd_client(c));
		socket.on("change room", (to, user_name) =>
			self.change_room(c, to, user_name)
		);
		socket.on("play card", (index) => self.play_card(c, index));
		socket.on("send sticker", (name) => self.send_sticker(c, name));
		socket.on("i will start", () => self.i_will_start(c));
		socket.on("i am ready", () => self.i_am_ready(c));
		socket.on("draw from stack", () => self.draw_from_stack(c));
	}

	rem_client(client) {
		console.log("client disconnected " + client.id);
		if (client.on_room) RoomMenu.quit_room(client);
		this.id_to_client.delete(client.id);
	}

	upd_client(client) {
		if (client.wait_room)
			client.socket.emit("update", client.wait_room.get_data(client));
		else RoomMenu.update_client(client);
	}

	change_room(client, new_room, user_name) {
		if (client.on_room) RoomMenu.quit_room(client);
		if (new_room) RoomMenu.change_to_room(client, new_room, user_name);
	}

	play_card(client, index) {
		if (!client.on_game) return;
		client.game.play_card(client.id, index);
	}

	send_sticker(client, name) {
		if (!client.on_game) return;
		client.game.send_sticker(client.id, name);
	}

	i_will_start(client) {
		if (!client.wait_room) return;
		client.wait_room.i_will_start(client);
	}

	i_am_ready(client) {
		if (!client.wait_room) return;
		client.wait_room.i_am_ready(client);
	}

	draw_from_stack(client) {
		if (!client.on_game) return;
		client.game.draw_from_stack(client.id);
	}
}

// Main client manager
export const CM = new ClientManager();
