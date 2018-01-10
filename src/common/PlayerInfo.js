// Stores hand and other necessary info
"use strict";

const now = require("performance-now");

const value = {};
for(let i = 0; i < 13; i++)
	value["23456789TJQKA"[i]] = i;

for(let i = 0; i < 4; i++)
	value["CDSH"[i]] = i;

class PlayerInfo {
	constructor(pid) {
		this.pid = pid;
		this.hand = [];
		this.last_timestamp = now();
	}

	sort_hand() {
		this.hand.sort(function(a, b) {
			if(a[1] !== b[1])
				return value[a[1]] - value[b[1]];
			if(a[0] !== b[0])
				return value[a[0]] - value[b[0]];
			return 0;
		});
	}

	add_to_hand(...cards) {
		for(let c of cards)
			this.hand.push(c);
		this.sort_hand();
	}
}

module.exports = PlayerInfo;
