"use strict";

const ClientManager = require("../server/RoomMenu")
class Client {
	constructor(pid) {
		this.pid = pid;
		this.confirmed = false;
	}
}

class WaitRoom {
	constructor(name) {
		this.name = name;
		this.player_list = [];
		this.start_i = null;
	}

	add_player(pid) {
		this.player_list.push(new Client(pid));
	}

	rem_player(pid) {
		let i = this.player_list.findIndex(p => p.pid === pid);
		if(i === -1) return;
		this.player_list = this.player_list.filter(p => p.pid !== pid);
		if(i === this.start_i)
			this.start_i = null;
	}

	get_data(pid) {
		return {
			name: "WaitRoom",
			room_name: this.name,
			start_i: this.start_i,
			total: this.player_list.length,
			confirmed_total: this.player_list.reduce((acc, cur) => acc + (cur.confirmed? 1 : 0), 0),
			confirmed: this.player_list.find(p => p.pid === pid).confirmed
		};
	}

	// Check if the game is ready to start
	check_done() {
		if(this.start_i !== null && this.player_list.all(p => p.confirmed)) {
			// TODO signal all players and start game
			for(let p of this.player_list) {
			}
		}
	}

	// Client declared he will start first
	i_will_start(pid) {
		if(this.start_i === null)
			this.start_i = this.player_list.findIndex(p => p.pid === pid);
		check_done();
	}

	// Client declared to be ready
	i_am_ready(pid) {
		this.player_list.find(p => p.pid === pid).confirmed = true;
		check_done();
	}

}

module.exports = WaitRoom;
