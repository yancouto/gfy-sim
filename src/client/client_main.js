"use strict";

const io = require("socket.io-client");

var socket = io();

socket.emit("heyo", "haha");

const Gamestate = require("../client/gamestates/GamestateManager");
const RoomMenu = require("../client/gamestates/RoomMenu");

window.addEventListener('load', function() {
	const GM = new Gamestate();

	let game_loop;
	let last_time = 0;
	game_loop = function(time) {
		window.requestAnimationFrame(game_loop);
		let dt = (time - last_time) / 1000;
		last_time = time;
		GM.process(dt);
	}
	window.requestAnimationFrame(game_loop);

	GM.switch_to(new RoomMenu());
})
