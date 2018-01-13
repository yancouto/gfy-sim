"use strict";

const now = require("performance-now");

class Event {
	constructor(source, type, info) {
		this.source = source;
		this.type = type;
		this.info = info || {};
		this.timestamp = now();
	}
}

Object.assign(Event, {
	SENT_STICKER: 0, // Player sent sticker
	DRAW: 1, // Player drawed some cards for any reason
	EFF_7: 2, // Player will draw unless he/she plays a 7
	EFF_J: 3, // Player swapped two cards
	EFF_8: 4, // Player changed suit
});

module.exports = Event;
