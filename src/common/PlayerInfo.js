// Stores hand and other necessary info

import now from "performance-now";

const value = {};
for (let i = 0; i < 13; i++) value["23456789TJQKA"[i]] = i;

for (let i = 0; i < 4; i++) value["CDSH"[i]] = i;

class PlayerInfo {
	constructor(pid, name) {
		this.pid = pid;
		this.name = name;
		this.hand = [];
		this.last_timestamp = now();
		// true if player said he/she could have one card
		this.can_have_one = false;
		// last time player played a 6. They can give a card from their hands for
		// 5 seconds after that
		this.last_play_6 = Number.NEGATIVE_INFINITY;
		// Since the direction may change until the player uses the 6, we need
		// to store its original value
		this.dir_when_played_6 = 1;
	}

	sort_hand() {
		this.hand.sort((a, b) => {
			if (a[1] !== b[1]) return value[a[1]] - value[b[1]];
			if (a[0] !== b[0]) return value[a[0]] - value[b[0]];
			return 0;
		});
	}

	add_to_hand(...cards) {
		for (const c of cards) this.hand.push(c);
		// resets when you draw cards
		this.can_have_one = false;
		this.sort_hand();
	}
}

export default PlayerInfo;
