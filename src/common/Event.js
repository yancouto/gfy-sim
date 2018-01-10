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
	GFY: 1, // Player drawed 2 because made a mistake
	DRAW_7: 2, // Player drawed because of 7
	DRAW_9: 3, // Player drawed because of 9
});

module.exports = Event;
