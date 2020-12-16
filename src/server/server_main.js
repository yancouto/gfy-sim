import express from "express";
import socketIO from "socket.io";
import path from "path";
import * as Utils from "../common/Utils";
import { CM as ClientManager } from "../server/ClientManager";
import Cookies from "cookies";
import { v4 as uuid4 } from "uuid";

const PORT = process.env.PORT || 3000;

process.on("uncaughtException", (err) => {
	console.log("UNCAUGHT EXCEPTION - keeping process alive:", err);
});

const KEY = "player_id";

const server = express();
server.get("/", (req, res) => {
	const c = new Cookies(req, res);
	let id = c.get(KEY);
	if (id == null) {
		id = uuid4();
		c.set(KEY, id);
	}
	res.sendFile(path.join(__dirname, "../../index.html"));
});
server.use("/", express.static(path.join(__dirname, "../..")));
const requestHandler = server.listen(PORT, () =>
	console.log("Listening on " + PORT)
);
const io = socketIO(requestHandler);

console.log("Server started. (v" + Utils.game_version + ")");

io.sockets.on("connection", ClientManager.add_client.bind(ClientManager));

Utils.on_server = true;
