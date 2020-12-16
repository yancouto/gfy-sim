import express from "express";
import socketIO from "socket.io";
import path from "path";
import * as Utils from "../common/Utils";
import { CM as ClientManager } from "../server/ClientManager";

const PORT = process.env.PORT || 3000;

const server = express();
server.get("/", (req, res) =>
	res.sendFile(path.join(__dirname, "../../index.html"))
);
server.use("/", express.static(path.join(__dirname, "../..")));
const requestHandler = server.listen(PORT, () =>
	console.log("Listening on " + PORT)
);
const io = socketIO(requestHandler);

console.log("Server started. (v" + Utils.game_version + ")");

io.sockets.on("connection", ClientManager.add_client.bind(ClientManager));

Utils.on_server = true;
