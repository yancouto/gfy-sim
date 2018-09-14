"use strict";

const io = require("socket.io-client");

const socket = io();

console.log("my socket is " + socket.sessionid);

const GamestateManager = require("../client/gamestates/GamestateManager").GM;
const RoomMenu = require("../client/gamestates/RoomMenu");
const RoomGS = require("../client/gamestates/RoomGamestate");
const WaitRoom = require("../client/gamestates/WaitRoom");

window.addEventListener("load", function() {
	let last_time = 0;
	const game_loop = function(time) {
		window.requestAnimationFrame(game_loop);
		const dt = (time - last_time) / 1000;
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
	if (!do_not_request_more) socket.emit("request update");
});

socket.on("switch gamestate", function(name) {
	let gs = null;
	if (name === "RoomMenu") gs = new RoomMenu();
	else if (name === "Room") gs = new RoomGS();
	else if (name === "WaitRoom") gs = new WaitRoom();
	else console.log("Unknown gamestate " + name);
	if (gs !== null) GamestateManager.switch_to(gs);
});

const Utils = require("../common/Utils");
Utils.client_socket = socket;
