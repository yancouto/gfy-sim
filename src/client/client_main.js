"use strict";

const io = require("socket.io-client");

let socket = io();

console.log("my socket is " + socket.sessionid);

const GamestateManager = require("../client/gamestates/GamestateManager").GM;
const RoomMenu = require("../client/gamestates/RoomMenu");

window.addEventListener("load", function() {
	let game_loop;
	let last_time = 0;
	game_loop = function(time) {
		window.requestAnimationFrame(game_loop);
		let dt = (time - last_time) / 1000;
		last_time = time;
		GamestateManager.process(dt);
	};
	window.requestAnimationFrame(game_loop);

	GamestateManager.switch_to(new RoomMenu());
});

socket.emit("request update");

socket.on("update", function(data, do_not_request_more) {
	GamestateManager.sync_data(data);
	// is there reason to wait?
	if(!do_not_request_more)
		socket.emit("request update");
});

const Utils = require("../common/Utils");
Utils.client_socket = socket;
