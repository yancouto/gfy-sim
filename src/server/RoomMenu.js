class RoomMenu {
	constructor() {
		this.room_list = ["oi", "tchau"];
		let self = this;
		setInterval(function() {
			console.log("Adding name");
			self.room_list.push("haha");
		}, 3000);
	}

	update_client(client) {
		var data = {
			room_list: this.room_list,
			name: "RoomMenu"
		};
		client.socket.emit("update", data);
	}
}

// main RoomMenu
RoomMenu.RM = new RoomMenu();

module.exports = RoomMenu;
