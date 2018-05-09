// Stores hand and other necessary info
"use strict";

const now = require("performance-now");

const value = {};
for(let i = 0; i < 13; i++)
	value["23456789TJQKA"[i]] = i;

for(let i = 0; i < 4; i++)
	value["CDSH"[i]] = i;

class PlayerInfo {
	constructor(pid, name) {
		this.pid = pid;
		this.name = name;
		this.hand = [];
		this.last_timestamp = now();
		// true if player said he/she could have one card
		this.can_have_one = false;
	}

	sort_hand() {
		this.hand.sort((a, b) => {
			if(a[1] !== b[1])
				return value[a[1]] - value[b[1]];
			if(a[0] !== b[0])
				return value[a[0]] - value[b[0]];
			return 0;
		});
	}

	add_to_hand(...cards) {
		for(const c of cards)
			this.hand.push(c);
		// resets when you draw cards
		this.can_have_one = false;
		this.sort_hand();
	}
}

module.exports = PlayerInfo;
