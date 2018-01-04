"use strict";

const Renderer = require("lance-gg").render.Renderer;
const CardDrawer = require("../client/CardDrawer");

var W, H;

function updateDimensions() {
	W = document.documentElement.clientWidth - 20;
	H = document.documentElement.clientHeight - 20;
	let canvas = document.getElementById("canvas");
	if(canvas) {
		canvas.width = W;
		canvas.height = H;
	}
	console.log("Now " + W + " x " + H);
}

updateDimensions();
window.addEventListener('resize', updateDimensions);
window.addEventListener('load', updateDimensions);

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
