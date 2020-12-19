import "core-js/stable";
import "regenerator-runtime/runtime";
import io from "socket.io-client";

const socket = io();

console.log("my socket is " + socket.id);

import { GM as GamestateManager } from "./gamestates/GamestateManager";
import ErrorGamestate from "../client/gamestates/ErrorGamestate";

window.addEventListener("load", function () {
	let last_time = 0;
	const game_loop = function (time) {
		window.requestAnimationFrame(game_loop);
		const dt = (time - last_time) / 1000;
		last_time = time;
		GamestateManager.process(dt);
	};
	window.requestAnimationFrame(game_loop);
});

socket.on("error", (msg) => {
	GamestateManager.switch_to(new ErrorGamestate(msg));
});

socket.emit("request update");

socket.on("update", function (data, do_not_request_more) {
	GamestateManager.sync_data(data);
	// is there reason to wait?
	if (!do_not_request_more) socket.emit("request update");
});

import * as Utils from "../common/Utils";
Utils.client_socket = socket;
