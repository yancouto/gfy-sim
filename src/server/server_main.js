"use strict";

const express = require("express");
const socketIO = require("socket.io");
const path = require("path");
const Utils = require("../common/Utils");
const ClientManager = require("../server/ClientManager").CM;

const PORT = process.env.PORT || 3000;

const server = express();
server.get("/", (req, res) => res.sendFile(path.join(__dirname, "../../index.html")));
server.use("/", express.static(path.join(__dirname, "../..")));
let requestHandler = server.listen(PORT, () => console.log("Listening on " + PORT));
const io = socketIO(requestHandler);

console.log("Server started.");

io.sockets.on("connection", ClientManager.add_client.bind(ClientManager));

Utils.on_server = true;