const Gamestate = require("./Gamestate");
const CardDrawer = require("../../client/CardDrawer");

class RoomMenu extends Gamestate {

	update(dt) {
		super.update(dt);
	}

	draw(ctx) {
		super.draw(ctx);
		let card = "TH";
		if(performance.now() > 5000)
			card = "KC";
		CardDrawer.drawCard(ctx, card, 10, 10);
	}

}

module.exports = RoomMenu;
