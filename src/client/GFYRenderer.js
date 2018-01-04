"use strict";

const Renderer = require("lance-gg").render.Renderer;
const CardDrawer = require("../client/CardDrawer");

class GFYRenderer extends Renderer {

	constructor(gameEngine, clientEngine) {
		super(gameEngine, clientEngine);
	}


	draw() {
		super.draw();

		let canvas = document.getElementById("canvas");
		let ctx = canvas.getContext("2d");
		CardDrawer.drawCard(ctx, "TH", 10, 10);
	}
}

module.exports = GFYRenderer;
